import {
    Generated,
    Insertable,
    Selectable,
    Updateable
} from 'kysely'

export interface Database {
    people: PeopleTable
    events: EventsTable
    event_dates: EventDatesTable
    votes: VotesTable
}

export interface EventsTable {
    event_id: Generated<number>;
    name: string;
}

export interface EventDatesTable {
    event_id: number;
    date: Date;
}

export interface PeopleTable {
    name: string;
}

export interface VotesTable {
    event_date: Date;
    event_id: number;
    person_name: string;
}

export type Person = Selectable<PeopleTable>
export type Event = Selectable<EventsTable>
export type EventDate = Selectable<EventDatesTable>
export type Vote = Selectable<VotesTable>

export type InsertablePerson = Insertable<PeopleTable>
export type InsertableEvent = Insertable<EventsTable>
export type InsertableEventDate = Insertable<EventDatesTable>
export type InsertableVote = Insertable<VotesTable>

export type UpdateablePerson = Updateable<PeopleTable>
export type UpdateableEvent = Updateable<EventsTable>
export type UpdateableEventDate = Updateable<EventDatesTable>
export type UpdateableVote = Updateable<VotesTable>