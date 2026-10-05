import { Role } from './roles.js';

export const PERMISSIONS = {
  CUSTOMER: [
    'product:read',
    'category:read',
    'vendor:read',
    'cart:read:self',
    'cart:write:self',
    'order:create',
    'order:read:self',
    'profile:read:self',
    'profile:update:self'
  ],
  VENDOR: [
    'product:create',
    'product:read:self',
    'product:update:self',
    'product:delete:self',
    'inventory:read:self',
    'inventory:update:self',
    'order:read:self',
    'order:update:self',
    'analytics:read:self',
    'vendor:profile:read:self',
    'vendor:profile:update:self'
  ],
  ADMIN: [
    'user:read',
    'user:update',
    'vendor:read',
    'vendor:update',
    'product:read',
    'product:update',
    'order:read',
    'security:read',
    'security:investigate',
    'risk:read',
    'risk:investigate',
    'graph:read',
    'audit:read'
  ]
};

export function hasPermission(role: string, permission: string): boolean {
  if (role === 'ADMIN') return PERMISSIONS.ADMIN.includes(permission);
  if (role === 'VENDOR') return PERMISSIONS.VENDOR.includes(permission);
  if (role === 'CUSTOMER') return PERMISSIONS.CUSTOMER.includes(permission);
  return false;
}
