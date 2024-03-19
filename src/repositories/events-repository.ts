import { RepositoryError } from '../utils/errors';
import { db } from '../db/database'
import { EventDate } from '../db/types';

async function findAll() {
    return await db.selectFrom("events").selectAll().execute();
}

async function find(eventId: number) {
    const eventDates = await db.selectFrom("event_dates")
        .innerJoin("events", "events.event_id", "event_dates.event_id")
        .where("events.event_id", "=", eventId)
        .select(["events.event_id", "events.name", "event_dates.date"])
        .execute();

    if (eventDates.length === 0) {
        throw new RepositoryError(`Event dates not found for event ${eventId}`);
    }

    return {
        id: eventDates[0].event_id,
        name: eventDates[0].name,
        dates: eventDates.map((eventDate) => eventDate.date)
    }
}

async function create(name: string, dates: Date[]) {
    const result = await db.transaction().execute(async (tx) => {
        const event = await tx.insertInto("events")
            .values({ name })
            .returning("event_id")
            .executeTakeFirstOrThrow();

        const eventDates: EventDate[] = dates.map((date) => ({ event_id: event.event_id, date }));

        tx.insertInto("event_dates")
            .values(eventDates)
            .returningAll()
            .executeTakeFirst();

        return {
            id: event.event_id
        };
    });

    return result;
}

export default {
    findAll,
    find,
    create,
}
