import { SecurityContext } from '../../types/auth.js';

export function canReadVendorProfile(actor: SecurityContext, vendorResource: any): boolean {
  if (actor.role === 'ADMIN') return true;
  return actor.userId === vendorResource.userId;
}

export function canUpdateVendorProfile(actor: SecurityContext, vendorResource: any): boolean {
  if (actor.role === 'ADMIN') return true;
  return actor.userId === vendorResource.userId;
}

export function canManageVendor(actor: SecurityContext, vendorResource?: any): boolean {
  return actor.role === 'ADMIN';
}
