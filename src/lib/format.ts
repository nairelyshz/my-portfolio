/**
 * Resuelve plantillas de los diccionarios: fmt("Ir a {panel}", { panel: "Stack" }).
 * Un placeholder sin valor se deja tal cual para que el error sea visible.
 */
export function fmt(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}

/** 1 → "01" */
export const pad2 = (n: number): string => String(n).padStart(2, "0");
