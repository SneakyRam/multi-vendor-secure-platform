// @ts-nocheck
import { RiskAssessment, RiskLevel, RiskSignal } from '../types/security.js';

export function evaluateRisk(context: any, action: string, data: any): RiskAssessment {
  let score = 0;
  const signals: RiskSignal[] = [];

  const addSignal = (signal: string, points: number, details?: string) => {
    score += points;
    signals.push({
      signal,
      score: points,
      timestamp: new Date(),
      details,
    });
  };

  // Heuristic 1: Checkout amount
  if (action === 'checkout' && data?.totalAmount > 10000) {
    addSignal('HIGH_VALUE_TRANSACTION', 40, `Amount: ${data.totalAmount}`);
  }

  // Heuristic 2: IP address changes
  if (context?.ipAddress && context?.lastIpAddress && context.ipAddress !== context.lastIpAddress) {
    addSignal('IP_ADDRESS_MISMATCH', 30, `Changed from ${context.lastIpAddress} to ${context.ipAddress}`);
  }

  // Heuristic 3: Action type based
  if (action === 'password_reset' || action === 'email_change') {
    addSignal('SENSITIVE_ACCOUNT_ACTION', 20, `Action: ${action}`);
  }

  // Determine Level
  let level: RiskLevel = 'LOW';
  if (score >= 91) {
    level = 'CRITICAL';
  } else if (score >= 61) {
    level = 'HIGH';
  } else if (score >= 30) {
    level = 'MEDIUM';
  }

  return {
    entityId: context?.userId || context?.sessionId || 'unknown',
    entityType: context?.userId ? 'USER' : 'SESSION',
    score,
    level,
    signals,
  };
}
