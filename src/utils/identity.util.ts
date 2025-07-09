/**
 * Normalises arrays to unique, non-null strings.
 */
export const uniq = (arr: (string | null)[]): string[] =>
    Array.from(new Set(arr.filter(Boolean) as string[]));