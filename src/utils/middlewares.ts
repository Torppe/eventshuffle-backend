import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RepositoryError } from "./errors";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(err);
    if (err instanceof RepositoryError) {
        return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: "Unexpected error" });
}

export function requestValidator(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array()[0].msg });
    }

    next()
}
