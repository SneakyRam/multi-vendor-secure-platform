// @ts-nocheck
export interface GraphNode {
  id: string;
  type: string;
  label: string;
  riskScore?: number;
  metadata?: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship: string;
  timestamp?: Date;
  metadata?: Record<string, any>;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
