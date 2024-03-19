import { Database } from './types' // this is the Database interface we defined earlier
import { Pool } from 'pg'
import { Kysely, PostgresDialect } from 'kysely'
import { getEnvVariable } from '../utils/utils';

const dialect = new PostgresDialect({
    pool: new Pool({
        connectionString: getEnvVariable("DATABASE_URL"),
        max: 10,
        ssl: true,
    })
})

export const db = new Kysely<Database>({
    dialect,
})