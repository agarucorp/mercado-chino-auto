export interface FichaRow {
  label: string;
  value: string;
}

const VARIANT_SEP = " · ";

/** "Naftero: 147 CV · Híbrido: 120 CV" → partes. Si no es ese formato, null. */
export function parseVariantParts(value: string): { name: string; value: string }[] | null {
  const parts = value.split(VARIANT_SEP);
  if (parts.length < 2) return null;
  const parsed: { name: string; value: string }[] = [];
  for (const part of parts) {
    const splitAt = part.indexOf(": ");
    if (splitAt <= 0) return null;
    parsed.push({
      name: part.slice(0, splitAt).trim(),
      value: part.slice(splitAt + 2).trim(),
    });
  }
  return parsed;
}

export function fichaVariantNames(rows: FichaRow[]): string[] {
  const names: string[] = [];
  for (const row of rows) {
    const parts = parseVariantParts(row.value);
    if (!parts) continue;
    for (const part of parts) {
      if (!names.includes(part.name)) names.push(part.name);
    }
  }
  return names;
}

export function valueForVariant(raw: string, variant?: string): string {
  const parts = parseVariantParts(raw);
  if (!parts) return raw;
  if (!variant) return parts[0].value;
  return parts.find((part) => part.name === variant)?.value ?? parts[0].value;
}

export function fichaForVariant<T extends FichaRow>(rows: T[], variant: string): T[] {
  return rows.map((row) => ({ ...row, value: valueForVariant(row.value, variant) }));
}
