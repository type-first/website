import type * as MonacoNS from "monaco-editor";
import { loader, type BeforeMount } from "@monaco-editor/react";
import { getMonacoTheme } from "@/modules/typescapes/code-theme";
import { 
  findMarkerAtPosition,
  flattenDiagnosticMessage, 
  groupMarkersByResource, 
  generateUniqueFileName, 
  pathUtils,
  calculateTooltipPosition 
} from "./editor.logic";

export type ExplorerFile = { 
  path: string; 
  content: string; 
};

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

// Monaco loader configuration
loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs",
  },
});

interface ExternalStore<S> {
  getSnapshot(): S;
  subscribe(listener: () => void): () => void;
}

type Disposable = { dispose: () => void };

export class TypeExplorerService implements ExternalStore<Snapshot> {
  private snapshot: Snapshot;
  private listeners = new Set<() => void>();
  private editor: MonacoNS.editor.IStandaloneCodeEditor | null = null;
  private monaco: typeof MonacoNS | null = null;
  private quickInfoTimer: number | null = null;
  private recomputeTimer: number | null = null;
  private hoverProvider: Disposable | null = null;
  private hoverHideTimer: number | null = null;

  constructor(initialFiles?: ExplorerFile[]) {
    const files = initialFiles && initialFiles.length ? initialFiles : DEFAULT_MULTI_FILES;
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

  private setMarkers(markers: MarkerWithResource[]) {
    const markersByResource = groupMarkersByResource(markers);
    this.setSnapshot({ markers, markersByResource });
  }

  // Monaco setup methods
  beforeMount: BeforeMount = (monaco) => {
    this.monaco = monaco as unknown as typeof MonacoNS;
    this.configureMonaco(monaco);
    this.createModelsForFiles(this.snapshot.files);
  };

  private configureMonaco(monaco: any) {
    // compiler options
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      moduleResolution: (monaco.languages.typescript as any).ModuleResolutionKind?.NodeJs ?? 2,
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

    if (typeof (monaco.languages.typescript.typescriptDefaults as any).setEagerModelSync === "function") {
      (monaco.languages.typescript.typescriptDefaults as any).setEagerModelSync(true);
    }

    // manage diagnostics manually
    monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
    });
  }

  private createModelsForFiles(files: ExplorerFile[]) {
    const monaco = this.monaco;
    if (!monaco) return;

    for (const f of files) {
      const uri = monaco.Uri.parse(f.path);
      const existing = monaco.editor.getModel(uri);
      if (!existing) monaco.editor.createModel(f.content, "typescript", uri);
    }
  }

  onMount = async (editor: MonacoNS.editor.IStandaloneCodeEditor, monaco: typeof MonacoNS) => {
    this.editor = editor;
    this.monaco = monaco;
    
    this.applyTheme("light");
    this.setupEditorListeners();
    this.setupHoverHandling();
    
    // ensure active model in editor
    const activeModel = monaco.editor.getModel(monaco.Uri.parse(this.snapshot.activePath));
    if (activeModel) editor.setModel(activeModel);

    // initial diagnostics
    await this.kickDiagnostics();
    await this.kickDiagnostics();
  };

  private applyTheme(mode: "light" | "dark") {
    const monaco = this.monaco;
    if (!monaco) return;
    
    const monacoTheme = getMonacoTheme(mode);
    monaco.editor.setTheme(monacoTheme);
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

  // Hover handling methods
  private setupHoverHandling() {
    const editor = this.editor;
    if (!editor) return;

    editor.onMouseMove((e) => this.onMouseMove(e));
    editor.onMouseLeave(() => this.onMouseLeave());
    this.registerHoverProvider();
  }

  private onMouseMove(e: any) {
    const editor = this.editor;
    const monaco = this.monaco;
    if (!editor || !monaco) return;

    const pos = e.target.position;
    if (!pos) return;

    const model = editor.getModel();
    if (!model) return;

    const markers = monaco.editor.getModelMarkers({ resource: model.uri });
    const hit = findMarkerAtPosition(markers, pos);

    if (!hit) {
      if (this.hoverHideTimer) window.clearTimeout(this.hoverHideTimer);
      this.hoverHideTimer = window.setTimeout(() => {
        this.setSnapshot({
          hoverTip: { visible: false, message: "", x: 0, y: 0 },
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

    const { x, y } = calculateTooltipPosition(editor, monaco, hit.startLineNumber, hit.startColumn);

    this.setSnapshot({
      hoverTip: {
        visible: true,
        message: hit.message,
        code: typeof hit.code === "object" ? (hit.code as any).value : (hit.code as any),
        x,
        y,
        key: newKey,
      },
    });
  }

  private onMouseLeave() {
    if (this.hoverHideTimer) window.clearTimeout(this.hoverHideTimer);
    this.hoverHideTimer = window.setTimeout(() => {
      this.setSnapshot({
        hoverTip: { visible: false, message: "", x: 0, y: 0 },
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
            const markers = monaco.editor.getModelMarkers({ resource: model.uri });
            const hit = findMarkerAtPosition(markers, position);
            if (!hit) return undefined as any;
            
            const code = (typeof hit.code === "object" ? (hit.code as any).value : hit.code) as string | undefined;

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

    const existing = new Set(this.snapshot.files.map((f) => pathUtils.toRelative(f.path)));
    const rel = generateUniqueFileName(existing, "new-file.ts");
    const path = pathUtils.toAbsolute(rel);
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

    let targetRel = cleanedRel.endsWith(".ts") || cleanedRel.endsWith(".tsx")
      ? cleanedRel
      : `${cleanedRel}.ts`;

    const existingRel = new Set(
      this.snapshot.files
        .map((f) => pathUtils.toRelative(f.path))
        .filter((r) => pathUtils.toAbsolute(r) !== oldPath)
    );
    if (existingRel.has(targetRel)) targetRel = generateUniqueFileName(existingRel, targetRel);

    const newPath = pathUtils.toAbsolute(targetRel);

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

    const nextActive = this.snapshot.activePath === oldPath ? newPath : this.snapshot.activePath;

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
    const monaco = this.monaco;
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
    const monaco = this.monaco;
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
              message: flattenDiagnosticMessage(d.messageText ?? d.message ?? ""),
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

  private disposeProjectModels() {
    const monaco = this.monaco;
    if (!monaco) return;

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

    this.disposeProjectModels();
    this.editor = null;
    this.monaco = null;
  }
}