import { Kysely } from "kysely"

export async function up(db: Kysely<any>): Promise<void> {
    await db.schema
        .createTable("events")
        .addColumn("event_id", "integer", (col) => col.primaryKey().generatedAlwaysAsIdentity())
        .addColumn("name", "varchar")
        .execute();

    await db.schema
        .createTable("event_dates")
        .addColumn("event_id", "integer", (col) =>
            col.references("events.event_id").onDelete("cascade").notNull()
        )
        .addColumn("date", "date", (col) => col.notNull())
        .addPrimaryKeyConstraint("event_dates_primary_key", ["event_id", "date"])
        .execute();

    await db.schema
        .createTable("people")
        .addColumn("name", "varchar", (col) => col.primaryKey().notNull())
        .execute();

    await db.schema
        .createTable("votes")
        .addColumn("event_date", "date")
        .addColumn("event_id", "integer")
        .addColumn("person_name", "varchar", (col) => col.references("people.name").onDelete("cascade").notNull())
        .addForeignKeyConstraint("votes_event_date_event_id_fkey", ["event_date", "event_id"], "event_dates", ["date", "event_id"], (cb) => cb.onDelete("cascade"))
        .addPrimaryKeyConstraint("votes_primary_key", ["event_date", "event_id", "person_name"])
        .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
    await db.schema.dropTable("event_dates").execute();
    await db.schema.dropTable("votes").execute();
    await db.schema.dropTable("people").execute();
    await db.schema.dropTable("events").execute();
}
