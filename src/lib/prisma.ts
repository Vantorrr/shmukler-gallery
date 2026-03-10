import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const fallbackDbUrl = 'postgresql://postgres:postgres@localhost:5432/postgres'
  const connectionString = process.env.DATABASE_URL || fallbackDbUrl
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter } as any)
}

function createFailSafePrisma() {
  const thrower = () => {
    throw new Error('Database is not configured or unavailable')
  }

  const level2 = new Proxy({}, { get: () => thrower })
  const level1 = new Proxy({}, { get: () => level2 })
  return level1
}

const prismaInstance = (() => {
  if (globalForPrisma.prisma) return globalForPrisma.prisma
  try {
    return createPrismaClient()
  } catch (error) {
    console.error('Prisma initialization failed:', error)
    return createFailSafePrisma() as unknown as PrismaClient
  }
})()

export const prisma = prismaInstance

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
