import { loader, type BeforeMount } from "@monaco-editor/react";
import type * as MonacoNS from "monaco-editor";
import { getMonacoTheme } from "@/modules/code-theme/v0/code-theme";

export type ExplorerFile = { 
  path: string; 
  content: string; 
};

// Monaco loader configuration
loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs",
  },
});

export class MonacoService {
  private monaco: typeof MonacoNS | null = null;

  beforeMount: BeforeMount = (monaco) => {
    this.monaco = monaco as unknown as typeof MonacoNS;
    
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
  };

  getMonaco() {
    return this.monaco;
  }

  createModelsForFiles(files: ExplorerFile[]) {
    const monaco = this.monaco;
    if (!monaco) return;

    // ensure all initial models exist up front
    for (const f of files) {
      const uri = monaco.Uri.parse(f.path);
      const existing = monaco.editor.getModel(uri);
      if (!existing) monaco.editor.createModel(f.content, "typescript", uri);
    }
  }

  applyTheme(mode: "light" | "dark") {
    const monaco = this.monaco;
    if (!monaco) return;
    
    const monacoTheme = getMonacoTheme(mode);
    monaco.editor.setTheme(monacoTheme);
  }

  disposeProjectModels() {
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
    this.disposeProjectModels();
    this.monaco = null;
  }
}