import { SecurityContext } from '../../types/auth.js';
import { prisma } from '../../database/prisma/index.js';

export type AiToolHandler = (context: SecurityContext, args: any) => Promise<any>;

export interface AiTool {
  name: string;
  description: string;
  requiredRole?: string[];
  handler: AiToolHandler;
}

export const getProductDetails: AiTool = {
  name: 'getProductDetails',
  description: 'Fetches details of a product by ID',
  handler: async (context: SecurityContext, args: { productId: string }) => {
    const product = await prisma.product.findUnique({
      where: { id: args.productId },
    });
    if (!product) {
      return { success: false, message: 'Product not found' };
    }
    return { success: true, data: product };
  },
};

export const checkOrderStatus: AiTool = {
  name: 'checkOrderStatus',
  description: 'Fetches the status of an order by ID',
  requiredRole: ['CUSTOMER', 'VENDOR', 'ADMIN'],
  handler: async (context: SecurityContext, args: { orderId: string }) => {
    const order = await prisma.order.findUnique({
      where: { id: args.orderId },
    });
    if (!order) {
      return { success: false, message: 'Order not found' };
    }
    
    // Simple authorization check
    if (context.role === 'CUSTOMER' && order.customerId !== context.userId) {
      return { success: false, message: 'Not authorized to view this order' };
    }
    
    return { success: true, data: { status: order.status, total: order.total } };
  },
};

export const evaluateVendorRisk: AiTool = {
  name: 'evaluateVendorRisk',
  description: 'Evaluates the risk associated with a vendor',
  requiredRole: ['ADMIN'],
  handler: async (context: SecurityContext, args: { vendorId: string }) => {
    if (context.role !== 'ADMIN') {
      return { success: false, message: 'Only admins can evaluate vendor risk' };
    }
    
    const vendor = await prisma.user.findUnique({
      where: { id: args.vendorId },
    });
    
    if (!vendor || vendor.role !== 'VENDOR') {
      return { success: false, message: 'Vendor not found' };
    }
    
    // Mock risk assessment
    const riskScore = Math.floor(Math.random() * 100);
    const riskLevel = riskScore > 75 ? 'HIGH' : riskScore > 40 ? 'MEDIUM' : 'LOW';
    
    return { 
      success: true, 
      data: { 
        vendorId: args.vendorId, 
        riskScore, 
        riskLevel,
        assessmentDate: new Date().toISOString()
      } 
    };
  },
};

export const aiTools: Record<string, AiTool> = {
  getProductDetails,
  checkOrderStatus,
  evaluateVendorRisk,
};
