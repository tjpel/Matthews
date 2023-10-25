export function classes(classes: Record<string, any>): string {
  return Object.keys(classes)
    .filter(key => !!classes[key])
    .join(' ');
}
