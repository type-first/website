import type * as MonacoNS from "monaco-editor";

type Disposable = { dispose: () => void };

type HoverTip = {
  visible: boolean;
  message: string;
  code?: string | number;
  x: number;
  y: number;
  key?: string;
};

type MarkerWithResource = {
  message: string;
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  severity: number;
  code?: string | { value: string };
  resource: string;
};

export class HoverService {
  private editor: MonacoNS.editor.IStandaloneCodeEditor | null = null;
  private monaco: typeof MonacoNS | null = null;
  private hoverProvider: Disposable | null = null;
  private hoverHideTimer: number | null = null;

  private onHoverTipUpdate?: (hoverTip: HoverTip) => void;

  constructor(onHoverTipUpdate?: (hoverTip: HoverTip) => void) {
    this.onHoverTipUpdate = onHoverTipUpdate;
  }

  setEditorAndMonaco(editor: MonacoNS.editor.IStandaloneCodeEditor, monaco: typeof MonacoNS) {
    this.editor = editor;
    this.monaco = monaco;
    this.registerHoverProvider();
    this.attachMouseListeners();
  }

  private attachMouseListeners() {
    const editor = this.editor;
    if (!editor) return;

    editor.onMouseMove((e) => this.onMouseMove(e));
    editor.onMouseLeave(() => this.onMouseLeave());
  }

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
        this.onHoverTipUpdate?.({
          visible: false,
          message: "",
          x: 0,
          y: 0,
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
    
    const anchorPos = new (monaco as any).Position(hit.startLineNumber, hit.startColumn);
    const svp = (editor as any).getScrolledVisiblePosition(anchorPos);
    const dom = editor.getDomNode();
    const rect = dom?.getBoundingClientRect();

    const pageX = (rect?.left ?? 0) + window.scrollX + (svp?.left ?? 0) + 12;
    const pageY =
      (rect?.top ?? 0) +
      window.scrollY +
      ((svp?.top ?? 0) + (svp?.height ?? 0) + 8);

    this.onHoverTipUpdate?.({
      visible: true,
      message: hit.message,
      code: typeof hit.code === "object" ? (hit.code as any).value : (hit.code as any),
      x: pageX,
      y: pageY,
      key: newKey,
    });
  }

  private onMouseLeave() {
    if (this.hoverHideTimer) window.clearTimeout(this.hoverHideTimer);
    this.hoverHideTimer = window.setTimeout(() => {
      this.onHoverTipUpdate?.({
        visible: false,
        message: "",
        x: 0,
        y: 0,
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

  dispose() {
    try {
      if (this.hoverHideTimer) window.clearTimeout(this.hoverHideTimer);
    } catch {}

    try {
      this.hoverProvider?.dispose?.();
    } catch {}
    this.hoverProvider = null;
    this.editor = null;
    this.monaco = null;
  }
}