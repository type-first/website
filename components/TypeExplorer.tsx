"use client";

import React from "react";
import Editor, { loader, OnMount } from "@monaco-editor/react";
import type * as MonacoNS from "monaco-editor";
import { getMonacoTheme } from "@/lib/codeTheme";

loader.config({
  paths: {
    vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs",
  },
});

const INITIAL_CODE = `// Welcome to Type Explorer 🧪
//
// This is a single-file TypeScript playground with:
// - Autocomplete (type-driven, no AI)
// - Errors underlined in the editor
// - Live errors list on the right
// - Type info for the current selection
//
// Try hovering, selecting different identifiers, or introducing an error.

type User = {
  id: string;
  name: string;
  email?: string;
};

function toTitleCase(input: string) {
  return input
    .split(/\s+/)
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function greet(user: User) {
  const who = user.name ?? "friend";
  return 'Hello, ' + toTitleCase(who) + '!';
}

const u: User = { id: "42", name: "sarah" };
console.log(greet(u));
`;

type Marker = {
  message: string;
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  severity: number;
  code?: string | { value: string };
};

export default function TypeExplorer() {
  const editorRef = React.useRef<MonacoNS.editor.IStandaloneCodeEditor | null>(
    null
  );
  const monacoRef = React.useRef<typeof MonacoNS | null>(null);

  const [value, setValue] = React.useState(INITIAL_CODE);
  const [markers, setMarkers] = React.useState<Marker[]>([]);
  const [typeInfo, setTypeInfo] = React.useState<{
    text?: string;
    html?: string;
    documentation?: string;
    range?: MonacoNS.IRange;
  }>({});

  const quickInfoTimer = React.useRef<number | null>(null);
  // Static theme (light) for simplicity
  const mode: 'light' | 'dark' = 'light';

  const onMount: OnMount = async (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco as unknown as typeof MonacoNS;

    // Use the model created by <Editor path="file:///main.ts" />
    const model = editor.getModel();
    if (!model) return;

    // Apply theme per current mode
    const monacoTheme = getMonacoTheme(mode);
    monaco.editor.setTheme(monacoTheme);

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ESNext,
      module: monaco.languages.typescript.ModuleKind.ESNext,
      strict: true,
      noEmit: true,
      allowNonTsExtensions: true,
      lib: ["es2020", "dom"],
    });

    setMarkers(
      monaco.editor.getModelMarkers({ owner: "typescript", resource: model.uri }) as any
    );

    editor.onDidChangeCursorSelection(() => {
      if (!editorRef.current || !monacoRef.current) return;
      if (quickInfoTimer.current) window.clearTimeout(quickInfoTimer.current);
      quickInfoTimer.current = window.setTimeout(() => void updateQuickInfo(), 120);
    });
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

  const handleValidate = (ms: any[]) => {
    const sorted = [...ms].sort((a, b) =>
      a.startLineNumber - b.startLineNumber || a.startColumn - b.startColumn
    );
    setMarkers(sorted as Marker[]);
  };

  const jumpTo = (m: Marker) => {
    const editor = editorRef.current;
    if (!editor) return;
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 min-h-[520px] rounded-lg overflow-hidden border border-gray-200">
        <Editor
          height="70vh"
          defaultLanguage="typescript"
          defaultValue={INITIAL_CODE}
          path="file:///main.ts"
          theme={getMonacoTheme(mode)}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
          }}
          onChange={(v) => setValue(v ?? "")}
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
                        <div className="text-gray-900">
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
