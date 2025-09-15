import winston from "winston";
import { Defaults } from "../enum/Constants.js";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || Defaults.LOG_LEVEL,
  format: winston.format.json(),
  transports: [new winston.transports.Console()],  // Console printing is recommended for containerised applications
});

export default logger;
