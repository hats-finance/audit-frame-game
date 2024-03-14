import { config } from "@/config/config";

// const OPEN_VOTINGS_DEV = 60 * 30; // 30 minutes
const OPEN_VOTINGS_DEV = 60 * 60 * 24 * 10; // 10 days
const OPEN_VOTINGS_PROD = 60 * 60 * 24; // 24 hours

export const OPEN_VOTINGS_TIME_BEFORE_START = config.env === "dev" ? OPEN_VOTINGS_DEV : OPEN_VOTINGS_PROD;
