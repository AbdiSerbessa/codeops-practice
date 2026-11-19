export function parseCsv(value?: string): string[] | undefined {
  if (!value) return undefined;
  const parts = value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return parts.length > 0 ? parts : undefined;
}

export function sortByField<T extends object>(
  items: T[],
  sort: string,
  allowedFields: readonly (keyof T)[],
): T[] {
  const desc = sort.startsWith('-');
  const rawField = (desc ? sort.slice(1) : sort) as keyof T;
  const field = allowedFields.includes(rawField) ? rawField : allowedFields[0];

  return [...items].sort((a, b) => {
    const valA = a[field];
    const valB = b[field];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return desc ? valB - valA : valA - valB;
    }
    const strA = String(valA);
    const strB = String(valB);
    return desc ? strB.localeCompare(strA) : strA.localeCompare(strB);
  });
}

export function selectFields<T extends object>(
  items: T[],
  fieldsCsv?: string,
  allowedFields?: readonly (keyof T)[],
): Partial<T>[] {
  const requested = parseCsv(fieldsCsv);
  if (!requested) return items;

  const validKeys = requested.filter((k): k is keyof T & string =>
    allowedFields ? allowedFields.includes(k as keyof T) : true,
  );
  if (validKeys.length === 0) return items;

  return items.map((item) => {
    const picked: Partial<T> = {};
    for (const key of validKeys) {
      picked[key] = item[key];
    }
    return picked;
  });
}