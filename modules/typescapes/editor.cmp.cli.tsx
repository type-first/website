"use client";

import React from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { getMonacoTheme } from "@/modules/code-theme/v0/code-theme";
import { Pencil, Trash } from "lucide-react";
import { useSyncExternalStore } from "react";

import { 
  TypeExplorerService, 
  type Snapshot, 
  type MarkerWithResource,
  type ExplorerFile
} from "./editor.svc.cli";
import { pathUtils } from "./editor.logic";
import { ScenarioMeta } from "./model.iso";

export type { ExplorerFile };

export type TypeExplorerProps = {
  initialFiles?: ExplorerFile[];
  slug?: ScenarioMeta['slug'];
};

// Utilities
const { toRelative } = pathUtils;

// Context and hooks
const ServiceContext = React.createContext<TypeExplorerService | null>(null);

function useTypeExplorerService() {
  const svc = React.useContext(ServiceContext);
  if (!svc) throw new Error("Missing <TypeExplorerServiceProvider />");
  return svc;
}

function useServiceSelector<T>(selector: (s: Snapshot) => T): T {
  const svc = useTypeExplorerService();
  const getSelected = React.useCallback(() => selector(svc.getSnapshot()), [svc, selector]);
  return useSyncExternalStore(svc.subscribe, getSelected, getSelected);
}

export default function TypeExplorer({ initialFiles, slug }: TypeExplorerProps) {
  // service instance is stable for the "scenario"; new scenario => new instance
  const svc = React.useMemo(() => new TypeExplorerService(initialFiles), [slug]); // scenarioId gates the lifecycle
  React.useEffect(() => () => svc.dispose(), [svc]);

  return (
    <ServiceContext.Provider value={svc}>
      <TypeExplorerView />
    </ServiceContext.Provider>
  );
}

function TypeExplorerView() {
  const svc = useTypeExplorerService();

  const files = useServiceSelector((s) => s.files);
  const activePath = useServiceSelector((s) => s.activePath);
  const markers = useServiceSelector((s) => s.markers);
  const markersByResource = useServiceSelector((s) => s.markersByResource);
  const typeInfo = useServiceSelector((s) => s.typeInfo);
  const hoverTip = useServiceSelector((s) => s.hoverTip);
  const editorHeight = useServiceSelector((s) => s.editorHeight);

  // UI-only rename state: ephemeral input state, not domain state
  const [renaming, setRenaming] = React.useState<{ oldPath: string; value: string } | null>(null);

  const mode: "light" | "dark" = "light";

  const beforeMount = React.useCallback((monaco: any) => {
    svc.beforeMount(monaco);
  }, [svc]);

  const onMount: OnMount = React.useCallback(async (editor, monaco) => {
    await svc.onMount(editor as any, monaco as any);
  }, [svc]);

  const onChangeContent = (next: string | undefined) => {
    const content = next ?? "";
    svc.setFileContent(activePath, content);
  };

  // Handle Cmd+S / Ctrl+S to prevent browser save dialog
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 's' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        // Optionally show a brief toast or indication that save is not needed
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left sidebar: Files + Type + Errors */}
      <div className="lg:order-1 space-y-6">
        {/* Files */}
        <aside className="rounded-lg overflow-hidden border border-gray-200 bg-white">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50">
            <div className="text-sm font-medium text-gray-900">Files</div>
            <button
              onClick={() => {
                svc.addNewFile();
                // rename UX: set after add; pick newest file
                const newest = svc.getSnapshot().files.at(-1);
                if (newest) setRenaming({ oldPath: newest.path, value: toRelative(newest.path) });
              }}
              title="Create new file"
              className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              +
            </button>
          </div>

          <ul className="overflow-auto divide-y divide-gray-100">
            {files.map((f) => {
              const isActive = activePath === f.path;
              const rel = toRelative(f.path);
              const fileMarkers = markersByResource[f.path] || [];
              const hasError = fileMarkers.some((m) => m.severity >= 8);
              const hasAny = fileMarkers.length > 0;

              return (
                <li
                  key={f.path}
                  className={`group flex items-center gap-2 px-3 py-2 ${
                    isActive ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      hasError
                        ? "bg-red-500"
                        : hasAny
                        ? "bg-amber-500"
                        : "bg-transparent border border-transparent"
                    }`}
                  />

                  {renaming && renaming.oldPath === f.path ? (
                    <input
                      autoFocus
                      className="flex-1 text-sm border border-blue-300 rounded px-1 py-0.5 outline-none"
                      value={renaming.value}
                      onChange={(e) =>
                        setRenaming({ oldPath: renaming.oldPath, value: e.target.value })
                      }
                      onBlur={() => {
                        void svc.renameFile(renaming.oldPath, renaming.value);
                        setRenaming(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          void svc.renameFile(renaming.oldPath, renaming.value);
                          setRenaming(null);
                        }
                        if (e.key === "Escape") setRenaming(null);
                      }}
                    />
                  ) : (
                    <button
                      onClick={() => svc.setActivePath(f.path)}
                      className={`flex-1 text-left text-sm ${
                        isActive ? "text-blue-700" : "text-gray-900"
                      }`}
                      title={rel}
                    >
                      {rel}
                    </button>
                  )}

                  {!renaming || renaming.oldPath !== f.path ? (
                    <>
                      <button
                        className="opacity-70 hover:opacity-100"
                        title="Rename"
                        onClick={() => setRenaming({ oldPath: f.path, value: rel })}
                      >
                        <Pencil className="w-4 h-4 text-gray-600" strokeWidth={2} />
                      </button>
                      <button
                        className="opacity-70 hover:opacity-100"
                        title="Delete"
                        onClick={() => svc.deleteFile(f.path)}
                        disabled={files.length <= 1}
                      >
                        <Trash className="w-4 h-4 text-gray-600" strokeWidth={2} />
                      </button>
                    </>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Type panel */}
        <section className="border border-gray-200 rounded-lg p-4">
          <h2 className="font-medium text-gray-900 mb-2">Type</h2>
          {typeInfo.text ? (
            <div className="text-sm">
              {typeInfo.html ? (
                <pre className="font-mono text-gray-900 text-sm whitespace-pre-wrap break-words">
                  <code dangerouslySetInnerHTML={{ __html: typeInfo.html }} />
                </pre>
              ) : (
                <div className="font-mono text-gray-900 break-words">{typeInfo.text}</div>
              )}
              {typeInfo.documentation && (
                <p className="text-gray-600 mt-2 whitespace-pre-wrap">{typeInfo.documentation}</p>
              )}
              {typeInfo.range && (
                <button
                  className="mt-3 text-blue-600 hover:underline text-xs"
                  onClick={() => {
                    // Use the service's jumpTo with a mock marker to reveal the range
                    const mockMarker: MarkerWithResource = {
                      resource: activePath,
                      startLineNumber: typeInfo.range!.startLineNumber,
                      startColumn: typeInfo.range!.startColumn,
                      endLineNumber: typeInfo.range!.endLineNumber,
                      endColumn: typeInfo.range!.endColumn,
                      message: "",
                      severity: 0,
                    };
                    svc.jumpTo(mockMarker);
                  }}
                >
                  Reveal selection in editor
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-600">Select an identifier to see type info.</p>
          )}
        </section>

        {/* Errors panel */}
        <section className="border border-gray-200 rounded-lg p-4">
          <h2 className="font-medium text-gray-900 mb-2">
            Errors {markers.length ? <span className="text-gray-500">({markers.length})</span> : null}
          </h2>
          {markers.length === 0 ? (
            <p className="text-sm text-gray-600">No diagnostics.</p>
          ) : (
            <ul className="space-y-2">
              {markers.map((m, idx) => (
                <li key={idx} className="text-sm">
                  <div className="hover:bg-gray-50 rounded p-2 border border-gray-100">
                    <div className="flex items-start gap-2">
                      <span
                        className={`mt-1 h-2 w-2 rounded-full ${
                          m.severity >= 8 ? "bg-red-500" : "bg-amber-500"
                        }`}
                      />
                      <div className="flex-1">
                        <button
                          onClick={() => svc.jumpTo(m)}
                          className="text-gray-900 flex items-center gap-2 hover:text-blue-600 transition-colors"
                        >
                          <span className="px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700">
                            {m.resource?.split("/").pop?.() ?? "file"}
                          </span>
                          L{m.startLineNumber}:{m.startColumn}
                        </button>
                        <div className="text-gray-700 break-words select-text cursor-text">
                          {m.message}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Editor */}
      <div className="lg:col-span-2 lg:order-2 min-h-[520px] rounded-lg overflow-hidden border border-gray-200">
        <Editor
          height={editorHeight}
          defaultLanguage="typescript"
          path={activePath}
          beforeMount={beforeMount}
          theme={getMonacoTheme(mode)}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            scrollbar: {
              vertical: "hidden",
              horizontal: "auto",
              handleMouseWheel: false,
              alwaysConsumeMouseWheel: false,
            },
            automaticLayout: true,
            tabSize: 2,
            hover: { enabled: true, delay: 200, sticky: true },
            renderValidationDecorations: "on",
            wordWrap: "on",
          }}
          onChange={onChangeContent}
          onMount={onMount}
          onValidate={() => {}}
        />

        {/* Hover tooltip (fallback) */}
        {hoverTip.visible && (
          <div
            className="pointer-events-none fixed z-50 rounded border border-gray-300 bg-white shadow px-2 py-1 text-xs text-gray-900 max-w-[360px]"
            style={{ left: hoverTip.x, top: hoverTip.y }}
          >
            <div className="whitespace-pre-wrap break-words">{hoverTip.message}</div>
            {hoverTip.code ? (
              <div className="text-gray-600 mt-1">Code: {String(hoverTip.code)}</div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}