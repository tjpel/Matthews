export function classes(classes: string[] | Record<string, any>): string {
  if (Array.isArray(classes))
    return classes.filter(Boolean).join(' ')

  return Object.keys(classes)
    .filter(key => !!classes[key])
    .join(' ');
}
