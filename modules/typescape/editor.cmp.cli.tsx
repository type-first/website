"use client";

import React from "react";
import Editor, { loader, type OnMount, type BeforeMount } from "@monaco-editor/react";
import type * as MonacoNS from "monaco-editor";
import { getMonacoTheme } from "@/modules/code-theme/v0/code-theme";
import { Pencil, Trash } from "lucide-react";
import { useSyncExternalStore } from "react";

/* -------------------------------------------------------------------------------------------------
 * Monaco loader
 * ------------------------------------------------------------------------------------------------- */

loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs",
  },
});

/* -------------------------------------------------------------------------------------------------
 * Types
 * ------------------------------------------------------------------------------------------------- */

export type ExplorerFile = { path: string; content: string };

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

type MarkerWithResource = Marker & { resource: string };

type TypeInfo = {
  text?: string;
  html?: string;
  documentation?: string;
  range?: MonacoNS.IRange;
};

type HoverTip = {
  visible: boolean;
  message: string;
  code?: string | number;
  x: number;
  y: number;
  key?: string;
};

type Snapshot = {
  files: ExplorerFile[];
  activePath: string;

  markers: MarkerWithResource[];
  markersByResource: Record<string, MarkerWithResource[]>;

  typeInfo: TypeInfo;
  hoverTip: HoverTip;

  editorHeight: number;
};

export type TypeExplorerProps = {
  initialFiles?: ExplorerFile[];
  scenarioId?: string;
};

/* -------------------------------------------------------------------------------------------------
 * Utilities
 * ------------------------------------------------------------------------------------------------- */

const PROJECT_OWNER = "ts-project";

const toRel = (p: string) => p.replace(/^file:\/\/\/src\/?/, "");
const toAbs = (rel: string) => {
  const cleaned = rel.replace(/^\/?/, "");
  return `file:///src/${cleaned}`;
};

const flattenMessage = (msg: any): string => {
  if (!msg) return "";
  if (typeof msg === "string") return msg;
  const parts: string[] = [];
  let cur: any = msg;
  while (cur) {
    parts.push(String(cur.messageText ?? ""));
    cur = cur.next && cur.next[0];
  }
  return parts.filter(Boolean).join("\n");
};

const groupByResource = (markers: MarkerWithResource[]) => {
  const out: Record<string, MarkerWithResource[]> = Object.create(null);
  for (const m of markers) {
    (out[m.resource] ||= []).push(m);
  }
  return out;
};

const uniqueRel = (existingRels: Set<string>, baseRel: string) => {
  const base = baseRel.trim() || "new-file.ts";
  const hasExt = /\.[a-zA-Z]+$/.test(base);
  const stem = hasExt ? base.replace(/\.[^.]+$/, "") : base;
  const ext = hasExt ? base.slice(base.lastIndexOf(".")) : ".ts";
  let i = 1;
  let rel = `${stem}${ext}`;
  while (existingRels.has(rel)) rel = `${stem}-${i++}${ext}`;
  return rel;
};

/* -------------------------------------------------------------------------------------------------
 * External Store + Service (Monaco/TS runtime orchestrator)
 * ------------------------------------------------------------------------------------------------- */

interface ExternalStore<S> {
  getSnapshot(): S;
  subscribe(listener: () => void): () => void;
}

type Disposable = { dispose: () => void };

class TypeExplorerService implements ExternalStore<Snapshot> {
  private snapshot: Snapshot;
  private listeners = new Set<() => void>();

  private editor: MonacoNS.editor.IStandaloneCodeEditor | null = null;
  private monaco: typeof MonacoNS | null = null;

  private hoverProvider: Disposable | null = null;

  private quickInfoTimer: number | null = null;
  private recomputeTimer: number | null = null;
  private hoverHideTimer: number | null = null;

  private readonly mode: "light" | "dark" = "light";

  constructor(initialFiles?: ExplorerFile[]) {
    const files =
      initialFiles && initialFiles.length ? initialFiles : DEFAULT_MULTI_FILES;
    const activePath = (initialFiles && initialFiles[0]?.path) || files[0]!.path;

    this.snapshot = {
      files,
      activePath,
      markers: [],
      markersByResource: Object.create(null),
      typeInfo: {},
      hoverTip: { visible: false, message: "", x: 0, y: 0, key: undefined },
      editorHeight: 420,
    };
  }

  /* ------------------------------ external store ------------------------------ */

  getSnapshot = () => this.snapshot;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private emit() {
    for (const l of this.listeners) l();
  }

  private setSnapshot(patch: Partial<Snapshot>) {
    // structural sharing: only replace what changed
    const next: Snapshot = { ...this.snapshot, ...patch };
    if (Object.is(next, this.snapshot)) return;
    this.snapshot = next;
    this.emit();
  }

  private setMarkers(markers: MarkerWithResource[]) {
    const markersByResource = groupByResource(markers);
    this.setSnapshot({ markers, markersByResource });
  }

  /* ------------------------------ lifecycle ------------------------------ */

  dispose() {
    try {
      if (this.quickInfoTimer) window.clearTimeout(this.quickInfoTimer);
      if (this.recomputeTimer) window.clearTimeout(this.recomputeTimer);
      if (this.hoverHideTimer) window.clearTimeout(this.hoverHideTimer);
    } catch {}

    try {
      this.hoverProvider?.dispose?.();
    } catch {}
    this.hoverProvider = null;

    // Dispose our models (scoped by URI prefix)
    const monaco = this.monaco;
    if (monaco) {
      const allModels = monaco.editor.getModels();
      for (const model of allModels) {
        const uri = model.uri.toString();
        if (uri.startsWith("file:///src/")) {
          try {
            model.dispose();
          } catch {}
        }
      }
    }

    this.editor = null;
    this.monaco = null;
  }

  beforeMount: BeforeMount = (monaco) => {
    // compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      moduleResolution:
        (monaco.languages.typescript as any).ModuleResolutionKind?.NodeJs ?? 2,
      strict: false,
      noImplicitAny: true,
      noImplicitThis: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
      noUncheckedIndexedAccess: false,
      strictNullChecks: true,
      strictFunctionTypes: true,
      strictPropertyInitialization: false,
      useDefineForClassFields: false,
      noEmit: true,
      allowNonTsExtensions: true,
      lib: ["es2020", "dom"],
      baseUrl: "file:///src",
      rootDir: "file:///src",
    });

    if (
      typeof (monaco.languages.typescript.typescriptDefaults as any)
        .setEagerModelSync === "function"
    ) {
      (monaco.languages.typescript.typescriptDefaults as any).setEagerModelSync(
        true
      );
    }

    // manage diagnostics manually
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });

    // ensure all initial models exist up front
    for (const f of this.snapshot.files) {
      const uri = monaco.Uri.parse(f.path);
      const existing = monaco.editor.getModel(uri);
      if (!existing) monaco.editor.createModel(f.content, "typescript", uri);
    }
  };

  onMount: OnMount = async (editor, monaco) => {
    this.editor = editor;
    this.monaco = monaco as unknown as typeof MonacoNS;

    // theme
    const monacoTheme = getMonacoTheme(this.mode);
    monaco.editor.setTheme(monacoTheme);

    // auto-resize height (store-driven)
    const resizeToContent = () => {
      try {
        const h = Math.max(180, editor.getContentHeight());
        this.setSnapshot({ editorHeight: h });
        editor.layout({ width: editor.getLayoutInfo().width, height: h });
      } catch {}
    };

    resizeToContent();
    editor.onDidContentSizeChange(() => resizeToContent());
    editor.onDidChangeModel(() => resizeToContent());

    // ensure active model in editor
    const activeModel = monaco.editor.getModel(monaco.Uri.parse(this.snapshot.activePath));
    if (activeModel) editor.setModel(activeModel);

    // markers listener
    monaco.editor.onDidChangeMarkers(() => {
      const all = monaco.editor.getModelMarkers({ owner: PROJECT_OWNER }) as any[];
      const mapped = all.map((m) => ({
        ...m,
        resource: (m.resource as any)?.toString?.() ?? "",
      })) as MarkerWithResource[];
      this.setMarkers(mapped);
    });

    // content change listeners -> schedule diagnostics
    const scheduleKick = () => {
      if (this.recomputeTimer) window.clearTimeout(this.recomputeTimer);
      this.recomputeTimer = window.setTimeout(() => void this.kickDiagnostics(), 150);
    };

    const attachToModel = (m: MonacoNS.editor.ITextModel) => {
      try {
        if (m.getLanguageId() !== "typescript") return;
        m.onDidChangeContent(() => scheduleKick());
      } catch {}
    };

    monaco.editor.getModels().forEach(attachToModel);
    monaco.editor.onDidCreateModel((m) => attachToModel(m));

    // quick info on selection changes
    editor.onDidChangeCursorSelection(() => {
      if (this.quickInfoTimer) window.clearTimeout(this.quickInfoTimer);
      this.quickInfoTimer = window.setTimeout(() => void this.updateQuickInfo(), 120);
    });

    // hover tooltip on markers (fallback)
    editor.onMouseMove((e) => this.onMouseMove(e));
    editor.onMouseLeave(() => this.onMouseLeave());

    // hover provider
    this.registerHoverProvider();

    // initial diagnostics
    await this.kickDiagnostics();
    await this.kickDiagnostics();
  };

  /* ------------------------------ commands ------------------------------ */

  setActivePath(path: string) {
    const monaco = this.monaco;
    const editor = this.editor;
    if (!monaco || !editor) {
      this.setSnapshot({ activePath: path });
      return;
    }
    this.setSnapshot({ activePath: path });
    const model = monaco.editor.getModel(monaco.Uri.parse(path));
    if (model) editor.setModel(model);
  }

  setFileContent(path: string, content: string) {
    // update snapshot files
    const nextFiles = this.snapshot.files.map((f) =>
      f.path === path ? { ...f, content } : f
    );
    this.setSnapshot({ files: nextFiles, activePath: path });

    // keep monaco model consistent
    const monaco = this.monaco;
    if (monaco) {
      const uri = monaco.Uri.parse(path);
      const model = monaco.editor.getModel(uri);
      if (model && model.getValue() !== content) {
        try {
          model.setValue(content);
        } catch {}
      }
    }
  }

  addNewFile() {
    const monaco = this.monaco;
    const editor = this.editor;

    const existing = new Set(this.snapshot.files.map((f) => toRel(f.path)));
    const rel = uniqueRel(existing, "new-file.ts");
    const path = toAbs(rel);
    const content = "export {}\n";

    const nextFiles = [...this.snapshot.files, { path, content }];
    this.setSnapshot({ files: nextFiles, activePath: path });

    if (monaco) {
      const uri = monaco.Uri.parse(path);
      const model = monaco.editor.createModel(content, "typescript", uri);
      if (editor) editor.setModel(model);
      void this.kickDiagnostics();
    }
  }

  async renameFile(oldPath: string, nextRelInput: string) {
    const monaco = this.monaco;
    const editor = this.editor;
    if (!monaco) return;

    const cleanedRel = nextRelInput.trim().replace(/^\/?/, "");
    if (!cleanedRel) return;

    let targetRel =
      cleanedRel.endsWith(".ts") || cleanedRel.endsWith(".tsx")
        ? cleanedRel
        : `${cleanedRel}.ts`;

    const existingRel = new Set(
      this.snapshot.files
        .map((f) => toRel(f.path))
        .filter((r) => toAbs(r) !== oldPath)
    );
    if (existingRel.has(targetRel)) targetRel = uniqueRel(existingRel, targetRel);

    const newPath = toAbs(targetRel);

    const oldUri = monaco.Uri.parse(oldPath);
    const oldModel = monaco.editor.getModel(oldUri);
    const content =
      oldModel?.getValue() ??
      this.snapshot.files.find((f) => f.path === oldPath)?.content ??
      "";

    const newUri = monaco.Uri.parse(newPath);
    const newModel = monaco.editor.createModel(content, "typescript", newUri);

    if (oldModel) {
      try {
        oldModel.dispose();
      } catch {}
    }

    const nextFiles = this.snapshot.files.map((f) =>
      f.path === oldPath ? { path: newPath, content } : f
    );

    const nextActive =
      this.snapshot.activePath === oldPath ? newPath : this.snapshot.activePath;

    this.setSnapshot({ files: nextFiles, activePath: nextActive });

    if (this.snapshot.activePath === newPath && editor) editor.setModel(newModel);
    await this.kickDiagnostics();
  }

  deleteFile(path: string) {
    const monaco = this.monaco;
    const editor = this.editor;

    if (this.snapshot.files.length <= 1) return;

    const nextFiles = this.snapshot.files.filter((f) => f.path !== path);

    let nextActive = this.snapshot.activePath;
    if (nextActive === path) nextActive = nextFiles[0]!.path;

    this.setSnapshot({ files: nextFiles, activePath: nextActive });

    if (monaco) {
      const uri = monaco.Uri.parse(path);
      const model = monaco.editor.getModel(uri);
      if (model) {
        try {
          model.dispose();
        } catch {}
      }

      const nextModel = monaco.editor.getModel(monaco.Uri.parse(nextActive));
      if (nextModel && editor) editor.setModel(nextModel);

      void this.kickDiagnostics();
    }
  }

  jumpTo(m: MarkerWithResource) {
    const editor = this.editor;
    const monaco = this.monaco;
    if (!editor || !monaco) return;

    if (m.resource) {
      const target = monaco.Uri.parse(m.resource);
      const model = monaco.editor.getModel(target);
      if (model) {
        editor.setModel(model);
        this.setSnapshot({ activePath: target.toString() });
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
  }

  /* ------------------------------ diagnostics + quick info ------------------------------ */

  private async updateQuickInfo() {
    const editor = this.editor;
    const monaco = this.monaco as typeof MonacoNS | null;
    if (!editor || !monaco) return;

    const model = editor.getModel();
    const sel = editor.getSelection();
    if (!model || !sel) return;

    try {
      const workerGetter = await (monaco.languages as any).typescript.getTypeScriptWorker();
      const worker = await workerGetter(model.uri);
      const pos = model.getOffsetAt({
        lineNumber: sel.positionLineNumber,
        column: sel.positionColumn,
      });
      const info = await worker.getQuickInfoAtPosition(model.uri.toString(), pos);

      if (!info) {
        this.setSnapshot({ typeInfo: {} });
        return;
      }

      const text = (info.displayParts ?? []).map((p: any) => p.text).join("");
      const documentation = (info.documentation ?? [])
        .map((p: any) => p.text)
        .join("\n");

      const start = model.getPositionAt(info.textSpan.start);
      const end = model.getPositionAt(info.textSpan.start + info.textSpan.length);

      let html: string | undefined;
      try {
        html = await monaco.editor.colorize(text, "typescript", {} as any);
      } catch {
        html = undefined;
      }

      this.setSnapshot({
        typeInfo: {
          text,
          html,
          documentation,
          range: {
            startLineNumber: start.lineNumber,
            startColumn: start.column,
            endLineNumber: end.lineNumber,
            endColumn: end.column,
          },
        },
      });
    } catch {
      this.setSnapshot({ typeInfo: {} });
    }
  }

  private async kickDiagnostics() {
    const monaco = this.monaco as typeof MonacoNS | null;
    if (!monaco) return;

    try {
      const getter = await (monaco.languages as any).typescript.getTypeScriptWorker();
      const tsModels = monaco.editor.getModels().filter((m) => m.getLanguageId() === "typescript");
      const byUri = new Map<string, MonacoNS.editor.IMarkerData[]>();

      for (const m of tsModels) {
        try {
          const worker = await getter(m.uri);
          const file = m.uri.toString();

          let retries = 0;
          let diags: any[] = [];

          while (retries < 3) {
            try {
              const [syn, sem] = await Promise.all([
                worker.getSyntacticDiagnostics(file),
                worker.getSemanticDiagnostics(file),
              ]);
              diags = [...(syn || []), ...(sem || [])];
              break;
            } catch {
              retries++;
              if (retries >= 3) diags = [];
              else await new Promise((r) => setTimeout(r, 100));
            }
          }

          const markers: MonacoNS.editor.IMarkerData[] = diags.map((d: any) => {
            const start = Math.max(0, d.start ?? 0);
            const len = Math.max(0, d.length ?? 0);
            const startPos = m.getPositionAt(start);
            const endPos = m.getPositionAt(start + len);
            const severity =
              d.category === 1
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
              message: flattenMessage(d.messageText ?? d.message ?? ""),
              severity,
              code,
            };
          });

          byUri.set(file, markers);
        } catch {
          byUri.set(m.uri.toString(), []);
        }
      }

      for (const m of tsModels) {
        const list = byUri.get(m.uri.toString()) || [];
        monaco.editor.setModelMarkers(m, PROJECT_OWNER, list);
      }

      const all = monaco.editor.getModelMarkers({ owner: PROJECT_OWNER }) as any[];
      const mapped = all.map((mm) => ({
        ...mm,
        resource: (mm.resource as any)?.toString?.() ?? "",
      })) as MarkerWithResource[];
      this.setMarkers(mapped);
    } catch {}
  }

  /* ------------------------------ hover UX ------------------------------ */

  private onMouseMove(e: any) {
    const editor = this.editor;
    const monaco = this.monaco;
    if (!editor || !monaco) return;

    const pos = e.target.position;
    if (!pos) return;

    const model = editor.getModel();
    if (!model) return;

    const all = monaco.editor.getModelMarkers({ resource: model.uri });
    const hit = all.find(
      (mk) =>
        (pos.lineNumber > mk.startLineNumber && pos.lineNumber < mk.endLineNumber) ||
        (pos.lineNumber === mk.startLineNumber &&
          pos.column >= mk.startColumn &&
          (pos.lineNumber < mk.endLineNumber || pos.column <= mk.endColumn)) ||
        (pos.lineNumber === mk.endLineNumber &&
          pos.column <= mk.endColumn &&
          (pos.lineNumber > mk.startLineNumber || pos.column >= mk.startColumn))
    );

    if (!hit) {
      if (this.hoverHideTimer) window.clearTimeout(this.hoverHideTimer);
      this.hoverHideTimer = window.setTimeout(() => {
        this.setSnapshot({
          hoverTip: { ...this.snapshot.hoverTip, visible: false },
        });
        this.hoverHideTimer = null;
      }, 200);
      return;
    }

    if (this.hoverHideTimer) {
      window.clearTimeout(this.hoverHideTimer);
      this.hoverHideTimer = null;
    }

    const newKey = `${hit.startLineNumber}:${hit.startColumn}-${hit.endLineNumber}:${hit.endColumn}`;
    if (this.snapshot.hoverTip.visible && this.snapshot.hoverTip.key === newKey) return;

    const anchorPos = new (monaco as any).Position(hit.startLineNumber, hit.startColumn);
    const svp = (editor as any).getScrolledVisiblePosition(anchorPos);
    const dom = editor.getDomNode();
    const rect = dom?.getBoundingClientRect();

    const pageX = (rect?.left ?? 0) + window.scrollX + (svp?.left ?? 0) + 12;
    const pageY =
      (rect?.top ?? 0) +
      window.scrollY +
      ((svp?.top ?? 0) + (svp?.height ?? 0) + 8);

    this.setSnapshot({
      hoverTip: {
        visible: true,
        message: hit.message,
        code: typeof hit.code === "object" ? (hit.code as any).value : (hit.code as any),
        x: pageX,
        y: pageY,
        key: newKey,
      },
    });
  }

  private onMouseLeave() {
    if (this.hoverHideTimer) window.clearTimeout(this.hoverHideTimer);
    this.hoverHideTimer = window.setTimeout(() => {
      this.setSnapshot({
        hoverTip: { ...this.snapshot.hoverTip, visible: false },
      });
      this.hoverHideTimer = null;
    }, 600);
  }

  private registerHoverProvider() {
    const monaco = this.monaco;
    if (!monaco) return;

    try {
      this.hoverProvider?.dispose?.();
    } catch {}
    this.hoverProvider = null;

    try {
      const register = (lang: string) =>
        monaco.languages.registerHoverProvider(lang, {
          provideHover(model, position) {
            const all = monaco.editor.getModelMarkers({ resource: model.uri });
            const hit = all.find(
              (mk) =>
                (position.lineNumber > mk.startLineNumber &&
                  position.lineNumber < mk.endLineNumber) ||
                (position.lineNumber === mk.startLineNumber &&
                  position.column >= mk.startColumn &&
                  (position.lineNumber < mk.endLineNumber ||
                    position.column <= mk.endColumn)) ||
                (position.lineNumber === mk.endLineNumber &&
                  position.column <= mk.endColumn &&
                  (position.lineNumber > mk.startLineNumber ||
                    position.column >= mk.startColumn))
            );
            if (!hit) return undefined as any;
            const code =
              (typeof hit.code === "object" ? (hit.code as any).value : hit.code) as
                | string
                | undefined;

            const contents: any[] = [];
            contents.push({ value: hit.message || "Error" });
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

      const d1 = register("typescript");
      const d2 = register("tsx");

      this.hoverProvider = {
        dispose: () => {
          try {
            d1.dispose();
          } catch {}
          try {
            d2.dispose();
          } catch {}
        },
      };
    } catch {}
  }
}

/* -------------------------------------------------------------------------------------------------
 * Context (store locator), selector hook (subscription)
 * ------------------------------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------------------------------
 * Component
 * ------------------------------------------------------------------------------------------------- */

export default function TypeExplorer({ initialFiles, scenarioId }: TypeExplorerProps) {
  // service instance is stable for the “scenario”; new scenario => new instance
  const svc = React.useMemo(() => new TypeExplorerService(initialFiles), [scenarioId]); // scenarioId gates the lifecycle
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

  const beforeMount: BeforeMount = (monaco) => svc.beforeMount(monaco);
  const onMount: OnMount = (editor, monaco) => svc.onMount(editor, monaco);

  const onChangeContent = (next: string | undefined) => {
    // model path is authoritative; fall back to activePath
    // (service keeps monaco model in sync anyway)
    const content = next ?? "";
    svc.setFileContent(activePath, content);
  };

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
                if (newest) setRenaming({ oldPath: newest.path, value: toRel(newest.path) });
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
              const rel = toRel(f.path);
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
                    // jump via service is possible, but typeInfo range is already local
                    // in practice you'd add svc.revealRange(range) if you want purity.
                    // leaving it view-local because it’s read-only and requires editor instance.
                    const editor = (svc as any).editor as MonacoNS.editor.IStandaloneCodeEditor | null;
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
