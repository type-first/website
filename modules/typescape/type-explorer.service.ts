import type * as MonacoNS from "monaco-editor";
import { type ExplorerFile } from "./monaco.service";

export type Marker = {
  message: string;
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  severity: number;
  code?: string | { value: string };
};

export type MarkerWithResource = Marker & { resource: string };

export type TypeInfo = {
  text?: string;
  html?: string;
  documentation?: string;
  range?: MonacoNS.IRange;
};

export type HoverTip = {
  visible: boolean;
  message: string;
  code?: string | number;
  x: number;
  y: number;
  key?: string;
};

export type Snapshot = {
  files: ExplorerFile[];
  activePath: string;
  markers: MarkerWithResource[];
  markersByResource: Record<string, MarkerWithResource[]>;
  typeInfo: TypeInfo;
  hoverTip: HoverTip;
  editorHeight: number;
};

const PROJECT_OWNER = "ts-project";

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

// Utilities
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

interface ExternalStore<S> {
  getSnapshot(): S;
  subscribe(listener: () => void): () => void;
}

export class TypeExplorerService implements ExternalStore<Snapshot> {
  private snapshot: Snapshot;
  private listeners = new Set<() => void>();
  private editor: MonacoNS.editor.IStandaloneCodeEditor | null = null;
  private monaco: typeof MonacoNS | null = null;
  private quickInfoTimer: number | null = null;
  private recomputeTimer: number | null = null;

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

  // External store implementation
  getSnapshot = () => this.snapshot;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  private emit() {
    for (const l of this.listeners) l();
  }

  private setSnapshot(patch: Partial<Snapshot>) {
    const next: Snapshot = { ...this.snapshot, ...patch };
    if (Object.is(next, this.snapshot)) return;
    this.snapshot = next;
    this.emit();
  }

  setHoverTip(hoverTip: HoverTip) {
    this.setSnapshot({ hoverTip });
  }

  private setMarkers(markers: MarkerWithResource[]) {
    const markersByResource = groupByResource(markers);
    this.setSnapshot({ markers, markersByResource });
  }

  setEditorAndMonaco(editor: MonacoNS.editor.IStandaloneCodeEditor, monaco: typeof MonacoNS) {
    this.editor = editor;
    this.monaco = monaco;
    this.setupEditorListeners();
  }

  private setupEditorListeners() {
    const editor = this.editor;
    const monaco = this.monaco;
    if (!editor || !monaco) return;

    // auto-resize height
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
  }

  // File operations
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
    const nextFiles = this.snapshot.files.map((f) =>
      f.path === path ? { ...f, content } : f
    );
    this.setSnapshot({ files: nextFiles, activePath: path });

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

  // TypeScript diagnostics and type info
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

  async kickDiagnostics() {
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

  dispose() {
    try {
      if (this.quickInfoTimer) window.clearTimeout(this.quickInfoTimer);
      if (this.recomputeTimer) window.clearTimeout(this.recomputeTimer);
    } catch {}

    this.editor = null;
    this.monaco = null;
  }
}