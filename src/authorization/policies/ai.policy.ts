// @ts-nocheck
import { SecurityContext } from '../../types/auth.js';

export function canUseAiTool(actor: SecurityContext, toolResource?: any): boolean {
  // Can be customized based on tool metadata if needed.
  // Example: Vendors and Admins might have access to different AI capabilities.
  return actor.role === 'VENDOR' || actor.role === 'ADMIN';
}
