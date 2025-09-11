"use client";

import React from "react";
import Editor, { loader, OnMount, BeforeMount } from "@monaco-editor/react";
import type * as MonacoNS from "monaco-editor";
import { getMonacoTheme } from "@/lib/codeTheme";
import { Pencil, Trash } from 'lucide-react';

loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs",
  },
});

export type ExplorerFile = { path: string; content: string };

// Default multi-file sample (used if no initialFiles provided)
const DEFAULT_MULTI_FILES: ExplorerFile[] = [
  {
    path: "file:///src/index.ts",
    content: `// Welcome to Type Explorer 🧪\n//\n// Now supports multiple files like real modules.\n// - Create files in the sidebar\n// - Import with relative paths (e.g. './utils/math')\n// - See diagnostics across all files\n// - Hover or select to see types\n\nimport { toTitleCase } from './utils/strings';\nimport { sum } from './utils/math';\n\nexport type User = {\n  id: string;\n  name: string;\n  email?: string;\n};\n\nexport function greet(user: User) {\n  const who = user.name ?? 'friend';\n  const greeting = 'Hello, ' + toTitleCase(who) + '!';\n  const s = sum(20, 22);\n  return greeting + ' (sum=' + s + ')';\n}\n\nconst u: User = { id: '42', name: 'sarah' };\nconsole.log(greet(u));\n`,
  },
  {
    path: "file:///src/utils/math.ts",
    content: `export function sum(a: number, b: number) {\n  return a + b;\n}\n`,
  },
  {
    path: "file:///src/utils/strings.ts",
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
  const hoverProviderRef = React.useRef<{ dispose: () => void } | null>(null);

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
  const [hoverTip, setHoverTip] = React.useState<{
    visible: boolean;
    message: string;
    code?: string | number;
    x: number;
    y: number;
    key?: string; // marker identity
  }>({ visible: false, message: '', x: 0, y: 0, key: undefined });

  const quickInfoTimer = React.useRef<number | null>(null);
  const recomputeTimer = React.useRef<number | null>(null);
  const hoverHideTimer = React.useRef<number | null>(null);
  const [editorHeight, setEditorHeight] = React.useState<number>(420);
  // Static theme (light) for simplicity
  const mode: 'light' | 'dark' = 'light';

  // Inline rename state for sidepane
  const [renaming, setRenaming] = React.useState<{
    oldPath: string;
    value: string; // relative to /src
  } | null>(null);

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
      baseUrl: "file:///src",
      rootDir: "file:///src",
    });
    if (typeof (monaco.languages.typescript.typescriptDefaults as any).setEagerModelSync === 'function') {
      (monaco.languages.typescript.typescriptDefaults as any).setEagerModelSync(true);
    }
    // We'll manage diagnostics manually to ensure dependent files update immediately
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
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

    // Auto-resize editor height to fit content and avoid internal scroll
    const resizeToContent = () => {
      try {
        const h = Math.max(180, editor.getContentHeight());
        setEditorHeight(h);
        editor.layout({ width: editor.getLayoutInfo().width, height: h });
      } catch {}
    };

    resizeToContent();
    editor.onDidContentSizeChange(() => resizeToContent());
    editor.onDidChangeModel(() => resizeToContent());

    // Ensure the active model is loaded in the editor
    const activeModel = monaco.editor.getModel(monaco.Uri.parse(activePath));
    if (activeModel) {
      editor.setModel(activeModel);
    }

    // Prime diagnostics across all current models
    await kickDiagnostics();
    const initialMarkers = monaco.editor.getModelMarkers({ owner: 'ts-project' }) as any[];
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
      const all = monaco.editor.getModelMarkers({ owner: 'ts-project' }) as any[];
      setMarkers(all.map((m) => ({ ...m, resource: (m.resource as any)?.toString?.() ?? "" })));
    });

    // Attach change listeners to all current and future TS models to recompute diagnostics
    const scheduleKick = () => {
      if (recomputeTimer.current) window.clearTimeout(recomputeTimer.current);
      recomputeTimer.current = window.setTimeout(() => void kickDiagnostics(), 150);
    };

    const attachToModel = (m: MonacoNS.editor.ITextModel) => {
      try {
        if (m.getLanguageId() !== 'typescript') return;
        m.onDidChangeContent(() => scheduleKick());
      } catch {}
    };

    monaco.editor.getModels().forEach(attachToModel);
    monaco.editor.onDidCreateModel((m) => attachToModel(m));

    // Show a lightweight custom tooltip when hovering markers (fallback if provider is ignored)
    editor.onMouseMove((e) => {
      const pos = e.target.position;
      if (!pos) return;
      const model = editor.getModel();
      if (!model) return;
      const all = monaco.editor.getModelMarkers({ resource: model.uri });
      const hit = all.find((mk) => (
        pos.lineNumber > mk.startLineNumber && pos.lineNumber < mk.endLineNumber
      ) || (
        pos.lineNumber === mk.startLineNumber && pos.column >= mk.startColumn &&
        (pos.lineNumber < mk.endLineNumber || pos.column <= mk.endColumn)
      ) || (
        pos.lineNumber === mk.endLineNumber && pos.column <= mk.endColumn &&
        (pos.lineNumber > mk.startLineNumber || pos.column >= mk.startColumn)
      ));
      if (hit) {
        if (hoverHideTimer.current) {
          window.clearTimeout(hoverHideTimer.current);
          hoverHideTimer.current = null;
        }
        const newKey = `${hit.startLineNumber}:${hit.startColumn}-${hit.endLineNumber}:${hit.endColumn}`;
        // Only reposition when first showing or when hovering a different marker
        if (!hoverTip.visible || hoverTip.key !== newKey) {
          // Anchor tooltip to the start of the marker range inside the editor
          const anchorPos = new (monaco as any).Position(hit.startLineNumber, hit.startColumn);
          const svp = (editor as any).getScrolledVisiblePosition(anchorPos);
          const dom = editor.getDomNode();
          const rect = dom?.getBoundingClientRect();
          const pageX = (rect?.left ?? 0) + window.scrollX + (svp?.left ?? 0) + 12;
          const pageY = (rect?.top ?? 0) + window.scrollY + ((svp?.top ?? 0) + (svp?.height ?? 0) + 8);
          setHoverTip({
            visible: true,
            message: hit.message,
            code: typeof hit.code === 'object' ? (hit.code as any).value : (hit.code as any),
            x: pageX,
            y: pageY,
            key: newKey,
          });
        }
      } else {
        if (hoverHideTimer.current) window.clearTimeout(hoverHideTimer.current);
        // Hide after a brief delay to feel natural
        hoverHideTimer.current = window.setTimeout(() => {
          setHoverTip((h) => ({ ...h, visible: false }));
          hoverHideTimer.current = null;
        }, 200);
      }
    });

    editor.onMouseLeave(() => {
      if (hoverHideTimer.current) window.clearTimeout(hoverHideTimer.current);
      hoverHideTimer.current = window.setTimeout(() => {
        setHoverTip((h) => ({ ...h, visible: false }));
        hoverHideTimer.current = null;
      }, 600);
    });

    // Register a hover provider that shows our marker messages on hover
    try {
      // Clean up any previous provider
      hoverProviderRef.current?.dispose?.();
      const register = (lang: string) => monaco.languages.registerHoverProvider(lang, {
        provideHover(model, position) {
          // Look up any markers at this position (any owner)
          const all = monaco.editor.getModelMarkers({ resource: model.uri });
          const hit = all.find((mk) => (
            position.lineNumber > mk.startLineNumber && position.lineNumber < mk.endLineNumber
          ) || (
            position.lineNumber === mk.startLineNumber && position.column >= mk.startColumn &&
            (position.lineNumber < mk.endLineNumber || position.column <= mk.endColumn)
          ) || (
            position.lineNumber === mk.endLineNumber && position.column <= mk.endColumn &&
            (position.lineNumber > mk.startLineNumber || position.column >= mk.startColumn)
          ));
          if (!hit) return undefined as any;
          const code = (typeof hit.code === 'object' ? (hit.code as any).value : hit.code) as string | undefined;
          const contents: any[] = [];
          contents.push({ value: hit.message || 'Error' });
          if (code) contents.push({ value: `Code: ${code}` });
          return {
            contents,
            range: {
              startLineNumber: hit.startLineNumber,
              startColumn: hit.startColumn,
              endLineNumber: hit.endLineNumber,
              endColumn: hit.endColumn,
            },
          } as any;
        },
      });
      // Register for both TS and TSX
      const d1 = register('typescript');
      const d2 = register('tsx');
      hoverProviderRef.current = { dispose: () => { try { d1.dispose(); } catch {}; try { d2.dispose(); } catch {}; } };
    } catch {}

    // Final refresh to ensure markers after mount
    await kickDiagnostics();
  };

  React.useEffect(() => {
    return () => {
      try { hoverProviderRef.current?.dispose?.(); } catch {}
    };
  }, []);

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

  const toRel = (p: string) => p.replace(/^file:\/\/\/src\/?/, '');
  const toAbs = (rel: string) => {
    const cleaned = rel.replace(/^\/?/, '');
    return `file:///src/${cleaned}`;
  };

  const uniqueRel = (baseRel: string) => {
    const base = baseRel.trim() || 'new-file.ts';
    const hasExt = /\.[a-zA-Z]+$/.test(base);
    const stem = hasExt ? base.replace(/\.[^.]+$/, '') : base;
    const ext = hasExt ? base.slice(base.lastIndexOf('.')) : '.ts';
    let i = 1;
    let rel = `${stem}${ext}`;
    const existing = new Set(files.map((f) => toRel(f.path)));
    while (existing.has(rel)) rel = `${stem}-${i++}${ext}`;
    return rel;
  };

  const PROJECT_OWNER = 'ts-project';
  const flattenMessage = (msg: any): string => {
    if (!msg) return '';
    if (typeof msg === 'string') return msg;
    const parts: string[] = [];
    let cur: any = msg;
    while (cur) {
      parts.push(String(cur.messageText ?? ''));
      cur = cur.next && cur.next[0];
    }
    return parts.filter(Boolean).join('\n');
  };

  const kickDiagnostics = async () => {
    const monaco = monacoRef.current as typeof MonacoNS | null;
    if (!monaco) return;
    try {
      const getter = await (monaco.languages as any).typescript.getTypeScriptWorker();
      const tsModels = monaco.editor
        .getModels()
        .filter((m) => m.getLanguageId() === 'typescript');
      const byUri = new Map<string, MonacoNS.editor.IMarkerData[]>();
      for (const m of tsModels) {
        const worker = await getter(m.uri);
        const file = m.uri.toString();
        const [syn, sem] = await Promise.all([
          worker.getSyntacticDiagnostics(file),
          worker.getSemanticDiagnostics(file),
        ]);
        const diags = [...(syn || []), ...(sem || [])];
        const markers: MonacoNS.editor.IMarkerData[] = diags.map((d: any) => {
          const start = Math.max(0, d.start ?? 0);
          const len = Math.max(0, d.length ?? 0);
          const startPos = m.getPositionAt(start);
          const endPos = m.getPositionAt(start + len);
          const severity = d.category === 1
            ? monaco.MarkerSeverity.Error
            : d.category === 0
            ? monaco.MarkerSeverity.Warning
            : monaco.MarkerSeverity.Info;
          const code = d.code ? String(d.code) : undefined;
          return {
            startLineNumber: startPos.lineNumber,
            startColumn: startPos.column,
            endLineNumber: endPos.lineNumber,
            endColumn: endPos.column,
            message: flattenMessage(d.messageText ?? d.message ?? ''),
            severity,
            code,
          };
        });
        byUri.set(file, markers);
      }
      for (const m of tsModels) {
        const list = byUri.get(m.uri.toString()) || [];
        monaco.editor.setModelMarkers(m, PROJECT_OWNER, list);
      }
    } catch {}
  };

  const addNewFile = () => {
    const monaco = monacoRef.current as typeof MonacoNS | null;
    const rel = uniqueRel('new-file.ts');
    const path = toAbs(rel);
    const content = 'export {}\n';
    setFiles((prev) => [...prev, { path, content }]);
    if (monaco) {
      const uri = monaco.Uri.parse(path);
      const model = monaco.editor.createModel(content, 'typescript', uri);
      if (editorRef.current) editorRef.current.setModel(model);
      setActivePath(path);
      setRenaming({ oldPath: path, value: rel });
      void kickDiagnostics();
    }
  };

  const renameFile = async (oldPath: string, nextRelInput: string) => {
    const monaco = monacoRef.current as typeof MonacoNS | null;
    if (!monaco) return;
    const cleanedRel = nextRelInput.trim().replace(/^\/?/, '');
    if (!cleanedRel) return setRenaming(null);
    let targetRel = cleanedRel.endsWith('.ts') || cleanedRel.endsWith('.tsx') ? cleanedRel : `${cleanedRel}.ts`;
    const existingRel = new Set(files.map((f) => toRel(f.path)).filter((r) => toAbs(r) !== oldPath));
    if (existingRel.has(targetRel)) targetRel = uniqueRel(targetRel);
    const newPath = toAbs(targetRel);

    const oldUri = monaco.Uri.parse(oldPath);
    const oldModel = monaco.editor.getModel(oldUri);
    const content = oldModel?.getValue() ?? files.find((f) => f.path === oldPath)?.content ?? '';

    // create new model
    const newUri = monaco.Uri.parse(newPath);
    const newModel = monaco.editor.createModel(content, 'typescript', newUri);

    // dispose old model
    if (oldModel) oldModel.dispose();

    // update state
    setFiles((prev) => prev.map((f) => (f.path === oldPath ? { path: newPath, content } : f)));
    if (activePath === oldPath) {
      setActivePath(newPath);
      if (editorRef.current) editorRef.current.setModel(newModel);
    }
    setRenaming(null);
    await kickDiagnostics();
  };

  const deleteFile = (path: string) => {
    const monaco = monacoRef.current as typeof MonacoNS | null;
    if (files.length <= 1) return;
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
      void kickDiagnostics();
    }
  };

  // (old add/remove helpers removed in favor of addNewFile/deleteFile)

  const switchTo = (path: string) => {
    const monaco = monacoRef.current as typeof MonacoNS | null;
    if (!monaco) return;
    setActivePath(path);
    const model = monaco.editor.getModel(monaco.Uri.parse(path));
    if (model && editorRef.current) editorRef.current.setModel(model);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidepane: files */}
      <aside className="rounded-lg overflow-hidden border border-gray-200 bg-white">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 bg-gray-50">
          <div className="text-sm font-medium text-gray-900">Files</div>
          <button
            onClick={addNewFile}
            title="Create new file"
            className="px-2 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            +
          </button>
        </div>
        <ul className="max-h-[70vh] overflow-auto divide-y divide-gray-100">
          {files.map((f) => {
            const isActive = (editorRef.current?.getModel()?.uri.toString() ?? activePath) === f.path;
            const rel = toRel(f.path);
            const fileMarkers = markers.filter((m) => m.resource === f.path);
            const hasError = fileMarkers.some((m) => m.severity >= 8);
            const hasAny = fileMarkers.length > 0;
            return (
              <li key={f.path} className={`group flex items-center gap-2 px-3 py-2 ${isActive ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                {/* Error dot */}
                <span
                  className={`inline-block h-2 w-2 rounded-full ${hasError ? 'bg-red-500' : hasAny ? 'bg-amber-500' : 'bg-transparent border border-transparent'}`}
                />
                {/* Name or input */}
                {renaming && renaming.oldPath === f.path ? (
                  <input
                    autoFocus
                    className="flex-1 text-sm border border-blue-300 rounded px-1 py-0.5 outline-none"
                    value={renaming.value}
                    onChange={(e) => setRenaming({ oldPath: renaming.oldPath, value: e.target.value })}
                    onBlur={() => renameFile(renaming.oldPath, renaming.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') renameFile(renaming.oldPath, renaming.value);
                      if (e.key === 'Escape') setRenaming(null);
                    }}
                  />
                ) : (
                  <button
                    onClick={() => switchTo(f.path)}
                    className={`flex-1 text-left text-sm ${isActive ? 'text-blue-700' : 'text-gray-900'}`}
                    title={rel}
                  >
                    {rel}
                  </button>
                )}
                {/* Actions */}
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
                      onClick={() => deleteFile(f.path)}
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

      {/* Editor */}
      <div className="lg:col-span-2 min-h-[520px] rounded-lg overflow-hidden border border-gray-200">
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
            // Let the page handle scrolling; no internal vertical scroll
            scrollbar: { vertical: 'hidden', horizontal: 'auto', handleMouseWheel: false, alwaysConsumeMouseWheel: false },
            automaticLayout: true,
            tabSize: 2,
            hover: { enabled: true, delay: 200, sticky: true },
            renderValidationDecorations: 'on',
          }}
          onChange={onChangeContent}
          onMount={onMount}
          onValidate={handleValidate}
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

      {/* Right panel: type + errors */}
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
