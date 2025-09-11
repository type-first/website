"use client";

import React from "react";
import Editor, { loader, OnMount, BeforeMount } from "@monaco-editor/react";
import type * as MonacoNS from "monaco-editor";
import { getMonacoTheme } from "@/lib/codeTheme";

loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs",
  },
});

export type ExplorerFile = { path: string; content: string };

// Default multi-file sample (used if no initialFiles provided)
const DEFAULT_MULTI_FILES: ExplorerFile[] = [
  {
    path: "file:///index.ts",
    content: `// Welcome to Type Explorer 🧪\n//\n// Now supports multiple files like real modules.\n// - Create files in the sidebar\n// - Import with relative paths (e.g. './utils/math')\n// - See diagnostics across all files\n// - Hover or select to see types\n\nimport { toTitleCase } from './utils/strings';\nimport { sum } from './utils/math';\n\nexport type User = {\n  id: string;\n  name: string;\n  email?: string;\n};\n\nexport function greet(user: User) {\n  const who = user.name ?? 'friend';\n  const greeting = 'Hello, ' + toTitleCase(who) + '!';\n  const s = sum(20, 22);\n  return greeting + ' (sum=' + s + ')';\n}\n\nconst u: User = { id: '42', name: 'sarah' };\nconsole.log(greet(u));\n`,
  },
  {
    path: "file:///utils/math.ts",
    content: `export function sum(a: number, b: number) {\n  return a + b;\n}\n`,
  },
  {
    path: "file:///utils/strings.ts",
    content: `export function toTitleCase(input: string) {\n  return input\n    .split(/\\s+/)\n    .map(p => p.charAt(0).toUpperCase() + p.slice(1))\n    .join(' ');\n}\n`,
  },
];

type Marker = {
  message: string;
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  severity: number;
  code?: string | { value: string };
};

export type TypeExplorerProps = {
  initialFiles?: ExplorerFile[];
};

export default function TypeExplorer({ initialFiles }: TypeExplorerProps) {
  const editorRef = React.useRef<MonacoNS.editor.IStandaloneCodeEditor | null>(
    null
  );
  const monacoRef = React.useRef<typeof MonacoNS | null>(null);

  // Multi-file state
  const [files, setFiles] = React.useState<ExplorerFile[]>(
    () => initialFiles && initialFiles.length ? initialFiles : DEFAULT_MULTI_FILES
  );
  const [activePath, setActivePath] = React.useState<string>((initialFiles && initialFiles[0]?.path) || DEFAULT_MULTI_FILES[0].path);

  // Diagnostics across all models
  const [markers, setMarkers] = React.useState<(Marker & { resource: string })[]>([]);
  const [typeInfo, setTypeInfo] = React.useState<{
    text?: string;
    html?: string;
    documentation?: string;
    range?: MonacoNS.IRange;
  }>({});

  const quickInfoTimer = React.useRef<number | null>(null);
  // Static theme (light) for simplicity
  const mode: 'light' | 'dark' = 'light';

  const beforeMount: BeforeMount = (monaco) => {
    // Configure TS before any model is created or the editor mounts
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      moduleResolution: (monaco.languages.typescript as any).ModuleResolutionKind?.NodeJs ?? 2,
      strict: true,
      noEmit: true,
      allowNonTsExtensions: true,
      lib: ["es2020", "dom"],
      baseUrl: "file:///",
      rootDir: "file:///",
    });
    if (typeof (monaco.languages.typescript.typescriptDefaults as any).setEagerModelSync === 'function') {
      (monaco.languages.typescript.typescriptDefaults as any).setEagerModelSync(true);
    }
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    // Create models for all initial files so the worker sees them up front
    for (const f of files) {
      const uri = monaco.Uri.parse(f.path);
      const existing = monaco.editor.getModel(uri);
      if (!existing) {
        monaco.editor.createModel(f.content, "typescript", uri);
      }
    }
  };

  const onMount: OnMount = async (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco as unknown as typeof MonacoNS;

    // Apply theme per current mode
    const monacoTheme = getMonacoTheme(mode);
    monaco.editor.setTheme(monacoTheme);

    // Ensure the active model is loaded in the editor
    const activeModel = monaco.editor.getModel(monaco.Uri.parse(activePath));
    if (activeModel) {
      editor.setModel(activeModel);
    }

    // Prime diagnostics across all current models
    const initialMarkers = monaco.editor.getModelMarkers({ owner: "typescript" }) as any[];
    setMarkers(
      initialMarkers.map((m) => ({ ...m, resource: (m.resource as any)?.toString?.() ?? "" }))
    );

    // React to selection changes for quick info
    editor.onDidChangeCursorSelection(() => {
      if (!editorRef.current || !monacoRef.current) return;
      if (quickInfoTimer.current) window.clearTimeout(quickInfoTimer.current);
      quickInfoTimer.current = window.setTimeout(() => void updateQuickInfo(), 120);
    });

    // Listen for marker changes across all models
    monaco.editor.onDidChangeMarkers(() => {
      const all = monaco.editor.getModelMarkers({ owner: "typescript" }) as any[];
      setMarkers(all.map((m) => ({ ...m, resource: (m.resource as any)?.toString?.() ?? "" })));
    });

    // Kick the TS worker to recompute diagnostics after models are created
    try {
      const getter = await (monaco.languages as any).typescript.getTypeScriptWorker();
      const tsModels = monaco.editor
        .getModels()
        .filter((m) => m.getLanguageId() === "typescript");
      for (const m of tsModels) {
        const worker = await getter(m.uri);
        // Trigger semantic analysis; ignore results
        await worker.getSemanticDiagnostics(m.uri.toString());
      }
    } catch {}
  };

  // No dynamic theme changes

  const updateQuickInfo = async () => {
    const editor = editorRef.current;
    const monaco = monacoRef.current as typeof MonacoNS | null;
    if (!editor || !monaco) return;

    const model = editor.getModel();
    const sel = editor.getSelection();
    if (!model || !sel) return;

    try {
      const workerGetter = await (monaco.languages as any).typescript.getTypeScriptWorker();
      const worker = await workerGetter(model.uri);
      const pos = model.getOffsetAt({ lineNumber: sel.positionLineNumber, column: sel.positionColumn });
      const info = await worker.getQuickInfoAtPosition(model.uri.toString(), pos);

      if (info) {
        const text = (info.displayParts ?? []).map((p: any) => p.text).join("");
        const documentation = (info.documentation ?? []).map((p: any) => p.text).join("\n");
        const start = model.getPositionAt(info.textSpan.start);
        const end = model.getPositionAt(info.textSpan.start + info.textSpan.length);
        let html: string | undefined;
        try {
          html = await monaco.editor.colorize(text, "typescript", {} as any);
        } catch {
          html = undefined;
        }
        setTypeInfo({
          text,
          html,
          documentation,
          range: {
            startLineNumber: start.lineNumber,
            startColumn: start.column,
            endLineNumber: end.lineNumber,
            endColumn: end.column,
          },
        });
      } else {
        setTypeInfo({});
      }
    } catch (e) {
      setTypeInfo({});
    }
  };

  // Not used now (we listen globally), but keep for reference
  const handleValidate = (_ms: any[]) => {};

  const jumpTo = (m: Marker & { resource?: string }) => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    if (!editor || !monaco) return;
    // If marker belongs to a different file, switch the model first
    const res = m as any;
    if (res.resource) {
      const target = monaco.Uri.parse(res.resource);
      const model = monaco.editor.getModel(target);
      if (model) {
        editor.setModel(model);
        setActivePath(target.toString());
      }
    }
    const range = {
      startLineNumber: m.startLineNumber,
      startColumn: m.startColumn,
      endLineNumber: m.endLineNumber,
      endColumn: m.endColumn,
    };
    editor.revealRangeInCenter(range, 1);
    editor.setSelection(range);
    editor.focus();
  };

  const onChangeContent = (next: string | undefined) => {
    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const content = next ?? "";
    const path = editor?.getModel()?.uri.toString() ?? activePath;
    setFiles((prev) => prev.map((f) => (f.path === path ? { ...f, content } : f)));
    setActivePath(path);
  };

  const addFile = (template?: "ts" | "dts") => {
    const monaco = monacoRef.current as typeof MonacoNS | null;
    const base = template === "dts" ? "new-lib.d.ts" : "new-file.ts";
    const dir = "file:///";
    let name = base;
    let i = 1;
    const exists = (p: string) => files.some((f) => f.path === p);
    while (exists(dir + name)) {
      const parts = base.split(".");
      const ext = parts.pop();
      const stem = parts.join(".");
      name = `${stem}-${i++}.${ext}`;
    }
    const newPath = dir + name;
    const newContent = template === "dts" ? "declare module 'my-lib' {}\n" : "export {};\n";
    setFiles((prev) => [...prev, { path: newPath, content: newContent }]);
    if (monaco) {
      const uri = monaco.Uri.parse(newPath);
      const model = monaco.editor.createModel(newContent, "typescript", uri);
      if (editorRef.current) editorRef.current.setModel(model);
      setActivePath(newPath);
    }
  };

  const removeFile = (path: string) => {
    const monaco = monacoRef.current as typeof MonacoNS | null;
    if (files.length <= 1) return; // keep at least one
    setFiles((prev) => prev.filter((f) => f.path !== path));
    if (monaco) {
      const uri = monaco.Uri.parse(path);
      const model = monaco.editor.getModel(uri);
      if (model) model.dispose();
      if (activePath === path) {
        const next = files.find((f) => f.path !== path) ?? files[0];
        setActivePath(next.path);
        const nextModel = monaco.editor.getModel(monaco.Uri.parse(next.path));
        if (nextModel && editorRef.current) editorRef.current.setModel(nextModel);
      }
    }
  };

  const switchTo = (path: string) => {
    const monaco = monacoRef.current as typeof MonacoNS | null;
    if (!monaco) return;
    setActivePath(path);
    const model = monaco.editor.getModel(monaco.Uri.parse(path));
    if (model && editorRef.current) editorRef.current.setModel(model);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 min-h-[520px] rounded-lg overflow-hidden border border-gray-200">
        <div className="flex border-b border-gray-200 bg-gray-50 items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2 overflow-x-auto">
            {files.map((f) => {
              const isActive = (editorRef.current?.getModel()?.uri.toString() ?? activePath) === f.path;
              const filename = f.path.split("/").pop() ?? f.path;
              return (
                <button
                  key={f.path}
                  onClick={() => switchTo(f.path)}
                  title={f.path}
                  className={`px-3 py-1.5 rounded text-sm border ${
                    isActive ? "bg-white text-gray-900 border-gray-300" : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
                  }`}
                >
                  {filename}
                </button>
              );
            })}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => addFile("ts")}
              className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
              title="Add .ts file"
            >
              + TS
            </button>
            <button
              onClick={() => addFile("dts")}
              className="px-2 py-1 text-xs rounded bg-indigo-600 text-white hover:bg-indigo-700"
              title="Add .d.ts declaration"
            >
              + d.ts
            </button>
            {files.length > 1 && (
              <button
                onClick={() => removeFile(editorRef.current?.getModel()?.uri.toString() ?? activePath)}
                className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                title="Close current file"
              >
                Close
              </button>
            )}
          </div>
        </div>
        <Editor
          height="70vh"
          defaultLanguage="typescript"
          // We manage models ourselves; still pass a path for initial mount
          path={activePath}
          beforeMount={beforeMount}
          theme={getMonacoTheme(mode)}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
          }}
          onChange={onChangeContent}
          onMount={onMount}
          onValidate={handleValidate}
        />
      </div>

      <div className="space-y-6">
        <section className="border border-gray-200 rounded-lg p-4">
          <h2 className="font-medium text-gray-900 mb-2">Type</h2>
          {typeInfo.text ? (
            <div className="text-sm">
              {typeInfo.html ? (
                <pre className="font-mono text-gray-900 text-sm whitespace-pre-wrap break-words">
                  <code dangerouslySetInnerHTML={{ __html: typeInfo.html }} />
                </pre>
              ) : (
                <div className="font-mono text-gray-900 break-words">
                  {typeInfo.text}
                </div>
              )}
              {typeInfo.documentation && (
                <p className="text-gray-600 mt-2 whitespace-pre-wrap">
                  {typeInfo.documentation}
                </p>
              )}
              {typeInfo.range && (
                <button
                  className="mt-3 text-blue-600 hover:underline text-xs"
                  onClick={() => {
                    const editor = editorRef.current;
                    if (!editor) return;
                    editor.revealRangeInCenter(typeInfo.range!, 1);
                    editor.setSelection(typeInfo.range!);
                    editor.focus();
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
                  <button
                    onClick={() => jumpTo(m)}
                    className="text-left w-full hover:bg-gray-50 rounded p-2 border border-gray-100"
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={`mt-1 h-2 w-2 rounded-full ${
                          m.severity >= 8 ? "bg-red-500" : "bg-amber-500"
                        }`}
                      />
                      <div>
                        <div className="text-gray-900 flex items-center gap-2">
                          <span className="px-1.5 py-0.5 text-xs rounded bg-gray-100 text-gray-700">
                            {(m as any).resource?.split('/').pop?.() ?? 'file'}
                          </span>
                          L{m.startLineNumber}:{m.startColumn}
                        </div>
                        <div className="text-gray-700 break-words">
                          {m.message}
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
