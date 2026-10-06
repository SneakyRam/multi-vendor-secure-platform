// @ts-nocheck
import { SecurityContext } from '../../types/auth.js';

export function canReadProduct(actor: SecurityContext, productResource: any): boolean {
  // Anyone can read products if no resource specified or it is published
  return true;
}

export function canCreateProduct(actor: SecurityContext, productResource?: any): boolean {
  return actor.role === 'VENDOR' || actor.role === 'ADMIN';
}

export function canUpdateProduct(actor: SecurityContext, productResource: any): boolean {
  if (actor.role === 'ADMIN') return true;
  if (actor.role === 'VENDOR') {
    return actor.userId === productResource.vendorId; // Assuming vendorId matches userId or similar logic, simplistic implementation
  }
  return false;
}

export function canDeleteProduct(actor: SecurityContext, productResource: any): boolean {
  if (actor.role === 'ADMIN') return true;
  if (actor.role === 'VENDOR') {
    return actor.userId === productResource.vendorId;
  }
  return false;
}
