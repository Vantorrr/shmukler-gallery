import 'dotenv/config'
import { defineConfig } from 'prisma/config'

const fallbackDbUrl = 'postgresql://postgres:postgres@localhost:5432/postgres'
const datasourceUrl = process.env.DATABASE_URL || fallbackDbUrl

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: datasourceUrl,
  },
})
