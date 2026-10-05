import { SecurityContext } from '../types/auth.js';
import { hasPermission } from './permissions.js';
import { Role } from './roles.js';

import { canReadProfile, canUpdateProfile, canManageUser } from './policies/user.policy.js';
import { canReadVendorProfile, canUpdateVendorProfile, canManageVendor } from './policies/vendor.policy.js';
import { canReadProduct, canCreateProduct, canUpdateProduct, canDeleteProduct } from './policies/product.policy.js';
import { canReadCart, canWriteCart } from './policies/cart.policy.js';
import { canCreateOrder, canReadOrder, canUpdateOrder } from './policies/order.policy.js';
import { canAccessAdminTools } from './policies/admin.policy.js';
import { canReadSecurity, canInvestigateSecurity } from './policies/security.policy.js';
import { canReadRisk, canInvestigateRisk } from './policies/risk.policy.js';
import { canUseAiTool } from './policies/ai.policy.js';

export interface AuthorizationResult {
  decision: 'ALLOW' | 'DENY';
  reason?: string;
}

export function authorize(
  actor: SecurityContext,
  action: string,
  resource: any,
  context?: any
): AuthorizationResult {
  // 1. Check baseline RBAC permissions
  if (!hasPermission(actor.role, action)) {
    return { decision: 'DENY', reason: `Role ${actor.role} does not have permission ${action}` };
  }

  // 2. Resource-level logic
  let allowed = false;

  switch (action) {
    case 'profile:read:self':
      allowed = canReadProfile(actor, resource);
      break;
    case 'profile:update:self':
      allowed = canUpdateProfile(actor, resource);
      break;
    case 'user:read':
    case 'user:update':
      allowed = canManageUser(actor, resource);
      break;

    case 'vendor:profile:read:self':
      allowed = canReadVendorProfile(actor, resource);
      break;
    case 'vendor:profile:update:self':
      allowed = canUpdateVendorProfile(actor, resource);
      break;
    case 'vendor:read':
    case 'vendor:update':
      allowed = canManageVendor(actor, resource);
      break;

    case 'product:read':
    case 'product:read:self':
      allowed = canReadProduct(actor, resource);
      break;
    case 'product:create':
      allowed = canCreateProduct(actor, resource);
      break;
    case 'product:update':
    case 'product:update:self':
      allowed = canUpdateProduct(actor, resource);
      break;
    case 'product:delete:self':
      allowed = canDeleteProduct(actor, resource);
      break;

    case 'cart:read:self':
      allowed = canReadCart(actor, resource);
      break;
    case 'cart:write:self':
      allowed = canWriteCart(actor, resource);
      break;

    case 'order:create':
      allowed = canCreateOrder(actor, resource);
      break;
    case 'order:read:self':
    case 'order:read':
      allowed = canReadOrder(actor, resource);
      break;
    case 'order:update:self':
      allowed = canUpdateOrder(actor, resource);
      break;

    case 'audit:read':
    case 'graph:read':
      allowed = canAccessAdminTools(actor, resource);
      break;

    case 'security:read':
      allowed = canReadSecurity(actor, resource);
      break;
    case 'security:investigate':
      allowed = canInvestigateSecurity(actor, resource);
      break;

    case 'risk:read':
      allowed = canReadRisk(actor, resource);
      break;
    case 'risk:investigate':
      allowed = canInvestigateRisk(actor, resource);
      break;

    case 'ai:tool':
      allowed = canUseAiTool(actor, resource);
      break;

    default:
      // If there's no resource specific policy but the permission exists, we might allow it.
      // E.g. 'category:read' without specific resource ownership.
      allowed = true;
      break;
  }

  if (allowed) {
    return { decision: 'ALLOW' };
  } else {
    return { decision: 'DENY', reason: `Resource ownership or business rule denied action ${action}` };
  }
}
