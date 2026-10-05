import neo4j, { Driver } from 'neo4j-driver'
import { env } from '../config/env.js'
import logger from '../utils/logger.js'

export const neo4jDriver: Driver = neo4j.driver(
  env.NEO4J_URI,
  neo4j.auth.basic(env.NEO4J_USERNAME, env.NEO4J_PASSWORD),
  {
    maxConnectionPoolSize: 50,
    connectionAcquisitionTimeout: 5000,
  }
)

export async function verifyNeo4jConnection(): Promise<boolean> {
  try {
    await neo4jDriver.verifyConnectivity()
    logger.info('Neo4j connected')
    return true
  } catch (err) {
    logger.warn({ err }, 'Neo4j connection failed — graph features will be degraded')
    return false
  }
}

export function getNeo4jSession(mode: 'READ' | 'WRITE' = 'WRITE') {
  return neo4jDriver.session({
    defaultAccessMode: mode === 'READ' ? neo4j.session.READ : neo4j.session.WRITE,
  })
}
