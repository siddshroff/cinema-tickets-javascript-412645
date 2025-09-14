import InvalidPurchaseException from "../pairtest/lib/InvalidPurchaseException.js";
import TicketPaymentService from "../thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../thirdparty/seatbooking/SeatReservationService.js";
import logger from "../utils/Logger.js";
import {
  Defaults,
  TicketTypes,
  ErrorCodes,
  TicketPrices,
} from "../enum/Constants.js";
import {
  failedBusinessEventsCounter,
  failedEventsCounter,
} from "./lib/PromClient.js";

/**
 * This service class for cinema ticket booking application.
 * This exposes the prometheus metrics for the failure events in the methods
 * It also have the service interfaces to Payment and Seat reservation services
 * for methods to consume.
 *
 * @author Siddharth Shroff
 * @version 1.0
 * @since 09-09-2025
 */
export default class TicketService {
  /**
   * This is the implementation method which purchase ticket for an account.
   * It takes in two arguments. i.e account ID and object/s of TicketTypeRequest.
   * It makes payment and then reserves the seat according to the request.
   * It checks for basic business validations as mentioned in Readme.md.
   * If any validation fails then throw exception.
   *
   * @param accountId
   * @param {TicketTypeRequest}ticketTypeRequests
   * @throws InvalidPurchaseException
   */

  purchaseTickets(accountId, ...ticketTypeRequests) {
    let totalAmountToPay = 0,
      totalSeatsToAllocate = 0;
    const ticketPaymentService = new TicketPaymentService();
    const seatReservationService = new SeatReservationService();
    logger.info(`Ticket booking request for Account ID:: ${accountId}`);
    logger.debug(`Validating requests for Account ID:: ${accountId}`);
    /* eslint-disable-next-line*/
    this.#validateRequest(accountId, ticketTypeRequests);

    ticketTypeRequests.forEach((ticketRequest) => {
      totalAmountToPay +=
        TicketPrices[ticketRequest.getTicketType()] *
        ticketRequest.getNoOfTickets();

      totalSeatsToAllocate +=
        ticketRequest.getTicketType() !== TicketTypes.INFANT
          ? ticketRequest.getNoOfTickets()
          : 0;
    });
    try {
      logger.debug(
        "Proceeding for seat reservation for Account ID:: {}",
        accountId
      );
      seatReservationService.reserveSeat(accountId, totalSeatsToAllocate);
      logger.info("Seat reservation successful for Account ID:: {}", accountId);
    } catch (seatReservationException) {
      logger.error(
        "Seat reservation failed to reserve seat",
        seatReservationException
      );
      failedEventsCounter.inc();
      throw new InvalidPurchaseException(
        ErrorCodes.ERRORCT01,
        `Seat reservation failed for Account id:: ${accountId}`
      );
    }
    try {
      logger.debug("Proceeding for payment for Account ID:: {}", accountId);
      ticketPaymentService.makePayment(accountId, totalAmountToPay);
      logger.info("Payment successful for Account ID:: {}", accountId);
    } catch (paymentException) {
      logger.error(
        "Payment gateway failed to process payment",
        paymentException
      );
      failedEventsCounter.inc();
      throw new InvalidPurchaseException(
        ErrorCodes.ERRORCT01,
        `Payment failed for Account id:: ${accountId}`
      );
    }
  }

  /**
   * This method validates
   * 1. Is account id valid ?
   * 2. Is ticket request is valid ?
   * 3. If maximum number of tickets are exceeded.
   * 4. If atleast one adult is booking the tickets
   *
   * @param accountId
   * @param ticketTypeRequests
   */
  #validateRequest(accountId, ticketTypeRequests) {
    if (accountId == undefined || accountId <= 0) {
      logger.error(`Invalid Account ID:: ${accountId}`);
      failedBusinessEventsCounter.inc();
      throw new InvalidPurchaseException(
        ErrorCodes.ERRORCT02,
        `Account id = ${accountId} is not a valid data`
      );
    }
    if (ticketTypeRequests.length == 0) {
      logger.error(`Request for 0(zero) number of tickets.`);
      failedBusinessEventsCounter.inc();
      throw new InvalidPurchaseException(
        ErrorCodes.ERRORCT06,
        `Ticket purchase count is 0(zero). Retry again with valid tickets.`
      );
    }
    if (ticketTypeRequests.find((e) => e.getNoOfTickets() == 0) != undefined) {
      logger.error(`Request for 0(zero) number of tickets.`);
      failedBusinessEventsCounter.inc();
      throw new InvalidPurchaseException(
        ErrorCodes.ERRORCT06,
        `Ticket purchase count is 0(zero). Retry again with valid tickets.`
      );
    }
    if (this.#isMaxTicketCountExceeded(ticketTypeRequests)) {
      logger.error(`Request for maximum number of tickets exceeded.`);
      failedBusinessEventsCounter.inc();
      throw new InvalidPurchaseException(
        ErrorCodes.ERRORCT03,
        `Max ticket purchase count exceed the limit of = ${Defaults.MAX_TICKETS_ALLOWED}`
      );
    }
    if (!this.#isAdultTicketPresent(ticketTypeRequests)) {
      logger.error(`Request having no adults`);
      failedBusinessEventsCounter.inc();
      throw new InvalidPurchaseException(
        ErrorCodes.ERRORCT04,
        `No adult ticket is present for account id = ${accountId}`
      );
    }
    if (!this.#isInfantTicketEqualAdultTicket(ticketTypeRequests)) {
      logger.error(`Request having more infants than adults`);
      failedBusinessEventsCounter.inc();
      throw new InvalidPurchaseException(
        ErrorCodes.ERRORCT04,
        `Adult tickets less than infant tickets for Account ID:: ${accountId}`
      );
    }
  }

  /**
   * This method validates
   * 1. If maximum number of tickets are exceeded.
   *
   * @param ticketTypeRequests
   * @return boolean value of validation
   */
  #isMaxTicketCountExceeded(ticketTypeRequests) {
    return (
      ticketTypeRequests
        .filter((e) => e.getTicketType() !== TicketTypes.INFANT)
        .reduce((sum, i) => sum + i.getNoOfTickets(), 0) >
      Defaults.MAX_TICKETS_ALLOWED
    );
  }

  /**
   * This method validates
   * 1. If atleast one adult is booking the tickets
   *
   * @param ticketTypeRequests
   * @return boolean value of validation
   */
  #isAdultTicketPresent(ticketTypeRequests) {
    return ticketTypeRequests.find(
      (e) => e.getTicketType() === TicketTypes.ADULT
    );
  }

  /**
   * This method validates
   * 1. If there are atleast equal number of adult to infants.
   *
   * @param ticketTypeRequests
   * @return boolean value of validation
   */
  #isInfantTicketEqualAdultTicket(ticketTypeRequests) {
    let tickets = ticketTypeRequests;
    let adultTickets = tickets
      .filter((e) => e.getTicketType() === TicketTypes.ADULT)
      .reduce((sum, i) => sum + i.getNoOfTickets(), 0);
    let infantTickets = tickets
      .filter((e) => e.getTicketType() === TicketTypes.INFANT)
      .reduce((sum, i) => sum + i.getNoOfTickets(), 0);
    return adultTickets < infantTickets ? false : true;
  }
}

Object.freeze(TicketService); // This ensures that interface is not modified to add new properties
Object.freeze(TicketService.prototype); // This ensures that interface is not modified to add new methods
