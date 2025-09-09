import winston from "winston";
import { Defaults } from "../enum/constants.js";

const logger = winston.createLogger({
  level: Defaults.LOG_LEVEL,
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export { logger };
