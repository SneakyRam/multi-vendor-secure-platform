import { SecurityContext } from '../../types/auth.js';

export function canReadSecurity(actor: SecurityContext, resource?: any): boolean {
  return actor.role === 'ADMIN';
}

export function canInvestigateSecurity(actor: SecurityContext, resource?: any): boolean {
  return actor.role === 'ADMIN';
}
