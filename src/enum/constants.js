const Defaults = Object.freeze({
  MAX_TICKETS_ALLOWED: process.env.MAX_TICKETS_ALLOWED || 25,
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
});

const TicketTypes = Object.freeze({
  ADULT: "ADULT",
  CHILD: "CHILD",
  INFANT: "INFANT",
});
const ErrorCodes = Object.freeze({
  ERRORCT01: "Unknown application error",
  ERRORCT02: "Account Id Invalid",
  ERRORCT03: "Max ticket count purchase exceeded",
  ERRORCT04: "Adult ticket is not present",
  ERRORCT05: "Purchase data is null",
  ERRORCT06: "Invalid ticket request",
});
const TicketPrices = Object.freeze({
  [TicketTypes.ADULT]: process.env.ADULT_PRICE || 25,
  [TicketTypes.CHILD]: process.env.CHILD_PRICE || 15,
  [TicketTypes.INFANT]: process.env.INFANT_PRICE || 0,
});
const Metrics = Object.freeze({
  METRICS_PREFIX: "cinema_ticket_",
});
export { Defaults, TicketTypes, ErrorCodes, TicketPrices, Metrics };
