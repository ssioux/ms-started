export function toStringDeep(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toStringDeep);
  }
  if (obj && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [k, toStringDeep(v)])
    );
  }
  if (typeof obj === 'number') {
    return String(obj);
  }
  return obj;
}