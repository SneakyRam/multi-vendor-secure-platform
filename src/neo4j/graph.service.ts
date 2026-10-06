// @ts-nocheck
import { GraphNode, GraphEdge, GraphData } from '../types/graph.js'
import { getNeo4jSession } from './neo4j.js'
import logger from '../utils/logger.js'

export class GraphService {
  async syncUserNode(user: { id: string, email: string, name: string, role: string, status: string }): Promise<void> {
    const session = getNeo4jSession('WRITE')
    try {
      await session.run(
        `MERGE (u:User {id: $id})
         SET u.email = $email,
             u.name = $name,
             u.role = $role,
             u.status = $status`,
        user
      )
    } catch (err) {
      logger.warn({ err, userId: user.id }, 'Failed to sync user node to graph')
    } finally {
      await session.close()
    }
  }

  async syncVendorNode(vendor: { id: string, businessName: string, userId: string, status: string }): Promise<void> {
    const session = getNeo4jSession('WRITE')
    try {
      await session.run(
        `MERGE (v:Vendor {id: $id})
         SET v.businessName = $businessName,
             v.status = $status
         WITH v
         MATCH (u:User {id: $userId})
         MERGE (u)-[:OWNS_VENDOR]->(v)`,
        vendor
      )
    } catch (err) {
      logger.warn({ err, vendorId: vendor.id }, 'Failed to sync vendor node to graph')
    } finally {
      await session.close()
    }
  }

  async syncOrderRelationship(params: { customerId: string, orderId: string, vendorId: string }): Promise<void> {
    const session = getNeo4jSession('WRITE')
    try {
      await session.run(
        `MATCH (c:User {id: $customerId})
         MATCH (v:Vendor {id: $vendorId})
         MERGE (c)-[:PLACED_ORDER {id: $orderId}]->(v)`,
        params
      )
    } catch (err) {
      logger.warn({ err, orderId: params.orderId }, 'Failed to sync order relationship to graph')
    } finally {
      await session.close()
    }
  }

  async syncSecurityEvent(event: { id: string, actorId: string | null, action: string, decision: string, resourceType: string | null, resourceId: string | null, timestamp: Date }): Promise<void> {
    const session = getNeo4jSession('WRITE')
    try {
      if (event.actorId) {
        await session.run(
          `MATCH (u:User {id: $actorId})
           MERGE (e:SecurityEvent {id: $id})
           SET e.action = $action,
               e.decision = $decision,
               e.resourceType = $resourceType,
               e.resourceId = $resourceId,
               e.timestamp = $timestamp
           MERGE (u)-[:TRIGGERED]->(e)`,
           {
             ...event,
             timestamp: event.timestamp.toISOString()
           }
        )
      }
    } catch (err) {
      logger.warn({ err, eventId: event.id }, 'Failed to sync security event to graph')
    } finally {
      await session.close()
    }
  }

  async syncDeviceRelationship(params: { userId: string, ipAddress: string | null, userAgent: string | null }): Promise<void> {
    const session = getNeo4jSession('WRITE')
    try {
      if (params.ipAddress) {
        await session.run(
          `MATCH (u:User {id: $userId})
           MERGE (d:Device {ipAddress: $ipAddress})
           SET d.userAgent = COALESCE($userAgent, d.userAgent)
           MERGE (u)-[:USED_DEVICE]->(d)`,
          params
        )
      }
    } catch (err) {
      logger.warn({ err, userId: params.userId }, 'Failed to sync device relationship to graph')
    } finally {
      await session.close()
    }
  }

  async getEntityGraph(entityId: string, entityType: string, depth: number = 2): Promise<GraphData> {
    const session = getNeo4jSession('READ')
    try {
      const actualDepth = Math.min(depth, 4)
      const result = await session.run(
        `MATCH path = (n)-[*1..${actualDepth}]-(m)
         WHERE n.id = $entityId AND $entityType IN labels(n)
         RETURN path`,
        { entityId, entityType }
      )
      
      const nodesMap = new Map<string, GraphNode>()
      const edgesMap = new Map<string, GraphEdge>()

      for (const record of result.records) {
        const path = record.get('path')
        for (const segment of path.segments) {
          const start = segment.start
          const end = segment.end
          const rel = segment.relationship

          nodesMap.set(start.identity.toString(), {
            id: start.identity.toString(),
            label: start.labels[0] || 'Unknown',
            properties: start.properties
          })
          
          nodesMap.set(end.identity.toString(), {
            id: end.identity.toString(),
            label: end.labels[0] || 'Unknown',
            properties: end.properties
          })

          edgesMap.set(rel.identity.toString(), {
            id: rel.identity.toString(),
            label: rel.type,
            startNodeId: rel.start.toString(),
            endNodeId: rel.end.toString(),
            properties: rel.properties
          })
        }
      }

      return {
        nodes: Array.from(nodesMap.values()),
        edges: Array.from(edgesMap.values())
      }
    } catch (err) {
      logger.warn({ err, entityId, entityType }, 'Failed to fetch entity graph')
      return { nodes: [], edges: [] }
    } finally {
      await session.close()
    }
  }

  async getUserRelationships(userId: string): Promise<GraphData> {
    return this.getEntityGraph(userId, 'User', 2)
  }
}

export const graphService = new GraphService()
