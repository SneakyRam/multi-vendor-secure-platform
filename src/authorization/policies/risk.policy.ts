// @ts-nocheck
import { SecurityContext } from '../../types/auth.js';

export function canReadRisk(actor: SecurityContext, resource?: any): boolean {
  return actor.role === 'ADMIN';
}

export function canInvestigateRisk(actor: SecurityContext, resource?: any): boolean {
  return actor.role === 'ADMIN';
}
