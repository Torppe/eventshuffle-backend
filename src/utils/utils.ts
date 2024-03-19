import dotenv from "dotenv";

dotenv.config();

export function getEnvVariable(name: string): string {
    const value = process.env[name]
    if (value === undefined) {
        throw new Error(`Environment variable ${name} is missing`)
    }

    return value
}