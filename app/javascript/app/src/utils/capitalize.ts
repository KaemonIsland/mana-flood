export const capitalize = (string: string): string =>
  string.length ? `${string[0].toUpperCase()}${string.slice(1)}` : string
