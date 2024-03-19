import { NextFunction, Request, Response, Router } from "express";
import eventRepository from "../../repositories/events-repository";
import voteRepository from "../../repositories/vote-repository";
import peopleRepository from "../../repositories/people-repository";
import { body, param } from "express-validator";
import { requestValidator } from "../../utils/middlewares";

const router = Router();

router.get("/list", async (req: Request, res: Response) => {
    const events = await eventRepository.findAll();
    res.json(events);
});

router.get("/:id",
    param("id").isInt().withMessage("Invalid event ID"),
    requestValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id);
            const event = await eventRepository.find(id);
            const votes = await voteRepository.findById(id);

            const result = {
                id: event.id,
                name: event.name,
                votes: groupVotesByDates(votes)
            }

            res.json(result);
        } catch (error: any) {
            next(error);
        }
    });

router.post("/",
    body("name").notEmpty().withMessage("Name is required"),
    body("dates").isArray({ min: 1, max: 20 }).withMessage("At least one date is required"),
    requestValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body;
            const event = await eventRepository.create(body.name, body.dates);

            res.status(201).json(event);
        } catch (error: any) {
            next(error);
        }
    });

router.post("/:id/vote",
    param("id").isInt().withMessage("Invalid event ID"),
    body("name").notEmpty().withMessage("Name is required"),
    body("votes").isDate().isArray({ min: 1, max: 20 }).withMessage("At least one vote is required"),
    requestValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const eventId = parseInt(req.params.id);
            const body = req.body;

            let votes = await voteRepository.findById(eventId);

            if (votes.some((vote) => vote.person_name === body.name)) {
                res.status(400).json({ error: "Person has already voted for this event" });
                return;
            }

            const event = await eventRepository.find(eventId);
            //TODO check if vote dates exists in event dates

            await voteRepository.create(eventId, body.name, body.votes);

            votes = votes.concat(body.votes.map((vote: any) => ({ person_name: body.name, event_date: new Date(vote) })));

            const result = {
                id: event.id,
                name: event.name,
                votes: groupVotesByDates(votes)
            }

            res.status(201).json(result);

        } catch (error: any) {
            next(error);
        }
    });

router.get("/:id/results",
    param("id").isInt().withMessage("Invalid event ID"),
    requestValidator,
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id);
            const event = await eventRepository.find(id);
            if (!event) {
                res.status(404).json({ error: "Event not found" });
                return;
            }

            const votes = await voteRepository.findById(id);

            if (votes.length > 0) {
                const people = await peopleRepository.findAll();

                const groupedVotes = Object.entries(groupVotesByDates(votes))
                    .map((group) => ({ date: group[0], people: group[1] }));

                const suitableDates = groupedVotes.filter((vote) => vote.people.length === people.length);

                const results = {
                    id: event.id,
                    name: event.name,
                    suitableDates: suitableDates
                }

                res.json(results);
            } else {
                const results = {
                    id: event.id,
                    name: event.name,
                    suitableDates: []
                }

                res.json(results);
            }
        } catch (error: any) {
            next(error);
        }
    });

function groupVotesByDates(votes: any[]) {
    return votes.reduce((acc: Record<string, string[]>, vote: any) => {
        const dateString = vote.event_date.toISOString();

        if (acc[dateString]) {
            acc[dateString].push(vote.person_name);
        } else {
            acc[dateString] = [vote.person_name];
        }

        return acc;
    }, {});
}

export default router;