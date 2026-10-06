// @ts-nocheck
import { createHmac } from 'crypto';
import { env } from '../config/env.js';

/**
 * Generate a CSRF token for a given session ID.
 */
export function generateCsrfToken(sessionId: string): string {
  const hmac = createHmac('sha256', env.CSRF_SECRET);
  hmac.update(sessionId);
  return hmac.digest('hex');
}

/**
 * Verify a CSRF token against a session ID.
 */
export function verifyCsrfToken(sessionId: string, token: string): boolean {
  if (!token || !sessionId) return false;
  
  const expectedToken = generateCsrfToken(sessionId);
  
  if (expectedToken.length !== token.length) return false;
  
  let result = 0;
  for (let i = 0; i < expectedToken.length; i++) {
    result |= expectedToken.charCodeAt(i) ^ token.charCodeAt(i);
  }
  
  return result === 0;
}
