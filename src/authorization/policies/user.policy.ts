import { SecurityContext } from '../../types/auth.js';

export function canReadProfile(actor: SecurityContext, userResource: any): boolean {
  if (actor.role === 'ADMIN') return true;
  return actor.userId === userResource.id;
}

export function canUpdateProfile(actor: SecurityContext, userResource: any): boolean {
  if (actor.role === 'ADMIN') return true;
  return actor.userId === userResource.id;
}

export function canManageUser(actor: SecurityContext, userResource?: any): boolean {
  return actor.role === 'ADMIN';
}
