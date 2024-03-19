import * as path from 'path'
import { promises as fs } from 'fs'
import dotenv from 'dotenv'
import {
    Migrator,
    FileMigrationProvider,
    Kysely,
    PostgresDialect,
} from 'kysely'
import { Pool } from 'pg'
import { Database } from './types'
import { getEnvVariable } from '../utils/utils'

export async function migrateToLatest() {
    const db = new Kysely<Database>({
        dialect: new PostgresDialect({
            pool: new Pool({
                connectionString: getEnvVariable("DATABASE_URL"),
                max: 10,
                ssl: true
            })
        }),
    })

    const migrator = new Migrator({
        db,
        provider: new FileMigrationProvider({
            fs,
            path,
            migrationFolder: path.join(__dirname, '../migrations'),
        })
    })

    const { error, results } = await migrator.migrateToLatest()

    results?.forEach((it) => {
        if (it.status === 'Success') {
            console.log(`migration "${it.migrationName}" was executed successfully`)
        } else if (it.status === 'Error') {
            console.error(`failed to execute migration "${it.migrationName}"`)
        }
    })

    if (error) {
        console.error('failed to migrate')
        console.error(error)
        process.exit(1)
    }

    await db.destroy()
}

// migrateToLatest();
