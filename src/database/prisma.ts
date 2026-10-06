// @ts-nocheck
import { PrismaClient } from '@prisma/client'
import logger from '../utils/logger.js'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({
  log: [
    { level: 'error', emit: 'event' },
    { level: 'warn', emit: 'event' },
  ]
})

prisma.$on('error' as never, (e: any) => {
  logger.error({ error: e }, 'Prisma error')
})

prisma.$on('warn' as never, (e: any) => {
  logger.warn({ warning: e }, 'Prisma warning')
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
