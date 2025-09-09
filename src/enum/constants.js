const Defaults = Object.freeze({
  MAX_TICKETS_ALLOWED: 25,
  LOG_LEVEL: "info",
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
});
const TicketPrices = Object.freeze({
  ADULT: 25,
  CHILD: 15,
  INFANT: 0
});
const Metrics = Object.freeze({
  METRICS_PREFIX: 'cinema_ticket_',
});
export { Defaults, TicketTypes, ErrorCodes, TicketPrices, Metrics };
