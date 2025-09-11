export function toTitleCase(input: string) {
  return input
    .split(/\s+/)
    .map(p => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ');
}

