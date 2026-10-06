// @ts-nocheck
export function sanitizeInput(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (typeof obj === 'string') {
    // Strip basic HTML tags
    return obj.replace(/<[^>]*>?/gm, '');
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeInput(item));
  }

  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        // Strip potentially dangerous properties
        if (key === '__proto__' || key === '$where' || key === 'constructor') {
          continue;
        }
        sanitized[key] = sanitizeInput(obj[key]);
      }
    }
    return sanitized;
  }

  return obj;
}
