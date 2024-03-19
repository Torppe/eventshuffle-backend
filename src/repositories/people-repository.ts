import { db } from '../db/database'

async function findAll() {
    return await db.selectFrom("people")
        .selectAll()
        .execute();
}

export default {
    findAll
}