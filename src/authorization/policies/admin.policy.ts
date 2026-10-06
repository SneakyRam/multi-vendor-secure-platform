// @ts-nocheck
import { SecurityContext } from '../../types/auth.js';

export function canAccessAdminTools(actor: SecurityContext, resource?: any): boolean {
  return actor.role === 'ADMIN';
}
