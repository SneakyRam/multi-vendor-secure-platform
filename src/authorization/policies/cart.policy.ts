import { SecurityContext } from '../../types/auth.js';

export function canReadCart(actor: SecurityContext, cartResource: any): boolean {
  if (actor.role === 'ADMIN') return true;
  return actor.userId === cartResource.userId;
}

export function canWriteCart(actor: SecurityContext, cartResource: any): boolean {
  return actor.userId === cartResource.userId;
}
