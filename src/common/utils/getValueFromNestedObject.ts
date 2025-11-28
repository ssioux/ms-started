// * returns first item of the array if ever is an array.
export function getValueFromNestedObject(obj: object, key: string): any {
  if (!obj || typeof obj !== 'object') return undefined;

  for (const currKey in obj) {
    if (currKey === key) {
      const value = obj[key];
      return Array.isArray(value) ? value[0] : value; // if array, return first element
    }

    if (typeof obj[currKey] === 'object') {
      const nestedResult = getValueFromNestedObject(obj[currKey], key);
      if (nestedResult !== undefined) return nestedResult;
    }
  }

  return undefined; // if key not found
}

// * Returns the full array if found, or wraps a single object into an array
export function getValueFromNestedObjectIncludingHoleArray(obj: object, key: string): any {
  if (!obj || typeof obj !== 'object') return undefined;

  for (const currKey in obj) {
    if (currKey === key) {
      const value = obj[currKey];

      // ✅ Normalize: return as array if already an array, or wrap in array if it's a single object
      if (Array.isArray(value)) return value;
      if (typeof value === 'object' && value !== null) return [value];
      return undefined;
    }

    // 🔁 Search recursively inside nested objects
    if (typeof obj[currKey] === 'object' && obj[currKey] !== null) {
      const nestedResult = getValueFromNestedObjectIncludingHoleArray(obj[currKey], key);
      if (nestedResult !== undefined) return nestedResult;
    }
  }

  return undefined; // Key not found
}
