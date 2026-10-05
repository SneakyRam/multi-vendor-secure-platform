import { SecurityContext } from '../../types/auth.js';

export function canCreateOrder(actor: SecurityContext, orderResource?: any): boolean {
  return actor.role === 'CUSTOMER';
}

export function canReadOrder(actor: SecurityContext, orderResource: any): boolean {
  if (actor.role === 'ADMIN') return true;
  if (actor.role === 'CUSTOMER') {
    return actor.userId === orderResource.customerId;
  }
  if (actor.role === 'VENDOR') {
    return actor.userId === orderResource.vendorId;
  }
  return false;
}

export function canUpdateOrder(actor: SecurityContext, orderResource: any): boolean {
  if (actor.role === 'ADMIN') return true;
  if (actor.role === 'VENDOR') {
    return actor.userId === orderResource.vendorId;
  }
  return false;
}
