import { Role, SecurityContext } from './auth.js';

export type AiToolName = string;

export interface AiTool {
  name: AiToolName;
  description: string;
  requiredRole: Role | Role[];
  handler: (context: SecurityContext, params: any) => Promise<any>;
}

export interface AiChatRequest {
  message: string;
  conversationId?: string;
}

export interface AiChatResponse {
  message: string;
  toolsUsed?: string[];
  data?: any;
}
