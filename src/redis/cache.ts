// @ts-nocheck
import { redis } from './redis.js'
import logger from '../utils/logger.js'

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key)
    return data ? JSON.parse(data) : null
  } catch (err) {
    logger.warn({ err, key }, 'Cache get failed')
    return null
  }
}

export async function cacheSet(key: string, value: any, ttlSeconds?: number): Promise<void> {
  try {
    const json = JSON.stringify(value)
    if (ttlSeconds) {
      await redis.setex(key, ttlSeconds, json)
    } else {
      await redis.set(key, json)
    }
  } catch (err) {
    logger.warn({ err, key }, 'Cache set failed')
  }
}

export async function cacheDel(key: string): Promise<void> {
  try {
    await redis.del(key)
  } catch (err) {
    logger.warn({ err, key }, 'Cache del failed')
  }
}

export async function cacheIncr(key: string, ttlSeconds?: number): Promise<number> {
  try {
    const val = await redis.incr(key)
    if (val === 1 && ttlSeconds) {
      await redis.expire(key, ttlSeconds)
    }
    return val
  } catch (err) {
    logger.warn({ err, key }, 'Cache incr failed')
    return 0
  }
}
