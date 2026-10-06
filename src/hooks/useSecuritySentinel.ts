import { useState, useCallback } from 'react';
import { adminService } from '../services/adminService';
import { securityService, type AttackVectorType, type SecurityViolationResult } from '../services/securityService';
import type { ThreatEvent, GraphNode, GraphEdge } from '../types';

export function useSecuritySentinel() {
  const [events, setEvents] = useState<readonly ThreatEvent[]>([]);
  const [activeIncident, setActiveIncident] = useState<SecurityViolationResult | null>(null);
  const [graphNodes, setGraphNodes] = useState<readonly GraphNode[]>([]);
  const [graphEdges, setGraphEdges] = useState<readonly GraphEdge[]>([]);

  const loadTelemetry = useCallback(async () => {
    const [fetchedEvents, graph] = await Promise.all([
      adminService.getSecurityEvents(),
      adminService.getGraphData()
    ]);
    setEvents(fetchedEvents);
    setGraphNodes(graph.nodes);
    setGraphEdges(graph.edges);
  }, []);

  const triggerSimulation = useCallback((vector: AttackVectorType) => {
    const result = securityService.simulateAttack(vector);
    setActiveIncident(result);
    return result;
  }, []);

  const dismissIncident = useCallback(() => {
    setActiveIncident(null);
  }, []);

  return {
    events,
    graphNodes,
    graphEdges,
    activeIncident,
    loadTelemetry,
    triggerSimulation,
    dismissIncident
  };
}
