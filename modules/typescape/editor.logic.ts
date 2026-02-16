import type * as MonacoNS from "monaco-editor";

/**
 * Checks if a position intersects with a marker's range
 */
export function isPositionInMarker(
  position: { lineNumber: number; column: number },
  marker: { 
    startLineNumber: number; 
    startColumn: number; 
    endLineNumber: number; 
    endColumn: number; 
  }
): boolean {
  const { lineNumber, column } = position;
  const { startLineNumber, startColumn, endLineNumber, endColumn } = marker;

  return (
    (lineNumber > startLineNumber && lineNumber < endLineNumber) ||
    (lineNumber === startLineNumber &&
      column >= startColumn &&
      (lineNumber < endLineNumber || column <= endColumn)) ||
    (lineNumber === endLineNumber &&
      column <= endColumn &&
      (lineNumber > startLineNumber || column >= startColumn))
  );
}

/**
 * Finds the first marker that intersects with the given position
 */
export function findMarkerAtPosition(
  markers: readonly any[], 
  position: { lineNumber: number; column: number }
) {
  return markers.find(marker => isPositionInMarker(position, marker));
}

/**
 * Flattens Monaco diagnostic message objects into readable strings
 */
export function flattenDiagnosticMessage(msg: any): string {
  if (!msg) return "";
  if (typeof msg === "string") return msg;
  const parts: string[] = [];
  let cur: any = msg;
  while (cur) {
    parts.push(String(cur.messageText ?? ""));
    cur = cur.next && cur.next[0];
  }
  return parts.filter(Boolean).join("\n");
}

/**
 * Groups markers by their resource URI
 */
export function groupMarkersByResource<T extends { resource: string }>(markers: T[]) {
  const out: Record<string, T[]> = Object.create(null);
  for (const m of markers) {
    (out[m.resource] ||= []).push(m);
  }
  return out;
}

/**
 * Generates a unique relative file path that doesn't conflict with existing ones
 */
export function generateUniqueFileName(existingNames: Set<string>, baseName: string): string {
  const base = baseName.trim() || "new-file.ts";
  const hasExt = /\.[a-zA-Z]+$/.test(base);
  const stem = hasExt ? base.replace(/\.[^.]+$/, "") : base;
  const ext = hasExt ? base.slice(base.lastIndexOf(".")) : ".ts";
  let i = 1;
  let name = `${stem}${ext}`;
  while (existingNames.has(name)) name = `${stem}-${i++}${ext}`;
  return name;
}

/**
 * Path conversion utilities
 */
export const pathUtils = {
  toRelative: (p: string) => p.replace(/^file:\/\/\/src\/?/, ""),
  toAbsolute: (rel: string) => {
    const cleaned = rel.replace(/^\/?/, "");
    return `file:///src/${cleaned}`;
  }
};

/**
 * Calculates tooltip position based on editor position and viewport
 */
export function calculateTooltipPosition(
  editor: MonacoNS.editor.IStandaloneCodeEditor,
  monaco: typeof MonacoNS,
  lineNumber: number,
  column: number
): { x: number; y: number } {
  const anchorPos = new (monaco as any).Position(lineNumber, column);
  const svp = (editor as any).getScrolledVisiblePosition(anchorPos);
  const dom = editor.getDomNode();
  const rect = dom?.getBoundingClientRect();

  const x = (rect?.left ?? 0) + window.scrollX + (svp?.left ?? 0) + 12;
  const y = (rect?.top ?? 0) + window.scrollY + ((svp?.top ?? 0) + (svp?.height ?? 0) + 8);

  return { x, y };
}