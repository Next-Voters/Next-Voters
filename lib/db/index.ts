import { Kysely } from 'kysely'
import { NeonDialect } from 'kysely-neon'
import { neon } from '@neondatabase/serverless'
import { Database } from '@/types/database'

export const db = new Kysely<Database>({
  dialect: new NeonDialect({
    neon: neon(process.env.DATABASE_URL as string),
  }),
})
