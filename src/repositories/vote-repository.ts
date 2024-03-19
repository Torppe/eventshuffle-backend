import { db } from '../db/database'

async function findById(eventId: number) {
    return await db.selectFrom("votes")
        .where("votes.event_id", "=", eventId)
        .select(["votes.event_date", "votes.person_name"])
        .execute();
}

async function create(eventId: number, personName: string, dates: Date[]) {
    await db.transaction().execute(async (tx) => {
        const people = await tx.selectFrom("people")
            .where("name", "=", personName)
            .select(["name"])
            .executeTakeFirst();

        if (!people) {
            await tx.insertInto("people")
                .values({ name: personName })
                .execute();
        }

        await tx.insertInto("votes")
            .values(
                dates.map((date) => (
                    {
                        event_date: date,
                        event_id: eventId,
                        person_name: personName
                    }
                )))
            .execute();
    });
}

export default {
    findById,
    create
}