import Sinon from "sinon";
import { assert, expect } from "chai";
import TicketService from "../../src/pairtest/TicketService.js";
import TicketTypeRequest from "../../src/pairtest/lib/TicketTypeRequest.js";
import TicketPaymentService from "../../src/thirdparty/paymentgateway/TicketPaymentService.js";
import SeatReservationService from "../../src/thirdparty/seatbooking/SeatReservationService.js";
import {
  failedBusinessEventsCounter,
  failedEventsCounter,
} from "../../src/pairtest/lib/PromClient.js";
import InvalidPurchaseException from "../../src/pairtest/lib/InvalidPurchaseException.js";
import { TicketTypes } from "../../src/enum/Constants.js";

describe("Cinema Ticket Service Testing", async () => {
  describe("Cinema Ticket Service interface contract testing", async () => {
    //   Expect TicketService to expose only one public method i.e purchaseTickets
    it("should expose exactly one public method: purchaseTickets", () => {
      const publicMethods = Object.getOwnPropertyNames(
        TicketService.prototype
      ).filter((name) => name !== "constructor");
      expect(publicMethods).to.deep.equal(["purchaseTickets"]);
    });
    //   Expect TicketService to be immutable to not add new public methods
    it("should not allow adding new properties", () => {
      assert.throws(() => {
        TicketService.prototype.newPublicMethod = () => {};
      }, TypeError);
    });
    //   Expect TicketService to be immutable to not override existing public methods
    it("should not allow overriding existing methods in TicketSerrvice", () => {
      assert.throws(() => {
        TicketService.prototype.purchaseTickets = () => {};
      }, TypeError);
    });
    //   Expect TicketService to be immutable to not delete existing public methods
    it("should not allow deleting methods", () => {
      assert.throws(() => {
        delete TicketService.prototype.purchaseTickets;
      }, TypeError);
    });
  });
  describe("Cinema Ticket Request testing for business rules defined", async () => {
    beforeEach(() => {
      Sinon.restore();
    });
    // Throw error if non-defined type of ticket is passed
    it("Invalid payload of tickets with wrong type", () => {
      assert.throws(() => {
        [
          new TicketTypeRequest("TEEN", 8),
          new TicketTypeRequest("CHILD", 8),
          new TicketTypeRequest("CHILD", 8),
        ];
      }, TypeError);
    });
    // Throw error if string number of tickets is passed
    it("Invalid payload of tickets with NaN tickets", () => {
      assert.throws(() => {
        [
          new TicketTypeRequest("ADULT", "8"),
          new TicketTypeRequest("CHILD", 8),
          new TicketTypeRequest("CHILD", 8),
        ];
      }, TypeError);
    });
    // Throw error if TicketTypeRequest is attempted to mutated
    it("Test case to check immutable tickets request", () => {
      const request = new TicketTypeRequest(TicketTypes.ADULT, 2);

      expect(request.getTicketType()).equals(TicketTypes.ADULT);
      expect(request.getNoOfTickets()).equals(2);

      // Attempt to mutate exposed methods or properties
      assert.throws(() => {
        request.getNoOfTickets = () => 999;
      }, TypeError);

      assert.throws(() => {
        request.newField = "dummyValue";
      }, TypeError);

      // Verify original values remain unchanged
      expect(request.getNoOfTickets()).equals(2);
      expect(request.getTicketType()).equals(TicketTypes.ADULT);
    });
  });
  describe("Cinema Ticket Requests various scenarios of InvalidPurchaseException", async () => {
    beforeEach(async () => {
      await failedBusinessEventsCounter.reset();
      Sinon.restore();
    });
    // Try to book 0(zero) tickets
    it("Invalid payload of 0(zero) number of tickets", async () => {
      const objTicket = new TicketService();
      assert.throws(() => {
        objTicket.purchaseTickets(1);
      }, InvalidPurchaseException);
      assert.equal(
        (await failedBusinessEventsCounter.get()).values[0].value,
        1
      );
    });
    // Try to book 0(zero) tickets
    it("Invalid payload of 0(zero) number of tickets", async () => {
      const objTicket = new TicketService();
      assert.throws(() => {
        objTicket.purchaseTickets(
          1,
          new TicketTypeRequest(TicketTypes.ADULT, 0)
        );
      }, InvalidPurchaseException);
      assert.equal(
        (await failedBusinessEventsCounter.get()).values[0].value,
        1
      );
    });
    // Try to book tickets with 0 zero ticket in array
    it("Invalid payload of tickets 0 zero number of tickets", async () => {
      const objTicket = new TicketService();
      assert.throws(() => {
        objTicket.purchaseTickets(
          1,
          new TicketTypeRequest(TicketTypes.ADULT, 8),
          new TicketTypeRequest(TicketTypes.CHILD, 0),
          new TicketTypeRequest(TicketTypes.CHILD, 10)
        );
      }, InvalidPurchaseException);
      assert.equal(
        (await failedBusinessEventsCounter.get()).values[0].value,
        1
      );
    });
    // Try to book tickets more than maximum allowed
    // Business Rule: Only a maximum of 25 tickets that can be purchased at a time.
    it("Invalid payload of tickets exceeding maximum number of tickets", async () => {
      const objTicket = new TicketService();
      assert.throws(() => {
        objTicket.purchaseTickets(
          1,
          new TicketTypeRequest(TicketTypes.ADULT, 8),
          new TicketTypeRequest(TicketTypes.CHILD, 8),
          new TicketTypeRequest(TicketTypes.CHILD, 10)
        );
      }, InvalidPurchaseException);
      assert.equal(
        (await failedBusinessEventsCounter.get()).values[0].value,
        1
      );
    });
    // Try to book tickets more than maximum allowed
    // Business Rule: Only a maximum of 25 tickets that can be purchased at a time.
    it("Invalid payload of tickets exceeding maximum number of tickets with infant tickets", async () => {
      const objTicket = new TicketService();
      assert.throws(() => {
        objTicket.purchaseTickets(
          1,
          new TicketTypeRequest(TicketTypes.ADULT, 8),
          new TicketTypeRequest(TicketTypes.CHILD, 10),
          new TicketTypeRequest(TicketTypes.INFANT, 8)
        );
      }, InvalidPurchaseException);
      assert.equal(
        (await failedBusinessEventsCounter.get()).values[0].value,
        1
      );
    });
    // Testing business rule where adult should be present when infants or childs are booked
    // Business Rule: Child and Infant tickets cannot be purchased without purchasing an Adult ticket.
    it("Invalid payload of tickets for no adult ticket present when infants are booked", async () => {
      const objTicket = new TicketService();
      assert.throws(() => {
        objTicket.purchaseTickets(
          1,
          new TicketTypeRequest(TicketTypes.INFANT, 8)
        );
      }, InvalidPurchaseException);
      assert.equal(
        (await failedBusinessEventsCounter.get()).values[0].value,
        1
      );
    });
    // Testing business rule where adult should be present when infants or childs are booked
    // Business Rule: Child and Infant tickets cannot be purchased without purchasing an Adult ticket.
    it("Invalid payload of tickets for no adult ticket present when childs are booked", async () => {
      const objTicket = new TicketService();
      assert.throws(() => {
        objTicket.purchaseTickets(
          1,
          new TicketTypeRequest(TicketTypes.CHILD, 8)
        );
      }, InvalidPurchaseException);
      assert.equal(
        (await failedBusinessEventsCounter.get()).values[0].value,
        1
      );
    });
    // Testing business rule where adult can only sit 1 infant on his/her lap
    // Business Rule: Infants do not pay for a ticket and are not allocated a seat. They will be sitting on an Adult's lap.
    it("Invalid payload of tickets for less adult ticket than infant present", async () => {
      const objTicket = new TicketService();
      assert.equal(
        (await failedBusinessEventsCounter.get()).values[0].value,
        0
      );
      assert.throws(() => {
        objTicket.purchaseTickets(
          1,
          new TicketTypeRequest(TicketTypes.ADULT, 8),
          new TicketTypeRequest(TicketTypes.INFANT, 10)
        );
      }, InvalidPurchaseException);
      assert.equal(
        (await failedBusinessEventsCounter.get()).values[0].value,
        1
      );
    });
  });
  describe("Cinema Ticket Requests various successfull scenarios with edge cases of valid purchase", async () => {
    beforeEach(() => {
      Sinon.restore();
    });
    // Testing valid scenarios complying to all business rules and feasibility
    it("Valid payload of tickets with success payment and seat reservation", () => {
      Sinon.spy(TicketPaymentService.prototype, "makePayment");
      Sinon.spy(SeatReservationService.prototype, "reserveSeat");
      const objTicket = new TicketService();
      expect(
        objTicket.purchaseTickets(
          1,
          new TicketTypeRequest(TicketTypes.ADULT, 8),
          new TicketTypeRequest(TicketTypes.CHILD, 8)
        )
      ).to.not.throw;
      assert.equal(320, TicketPaymentService.prototype.makePayment.args[0][1]);
      assert.equal(16, SeatReservationService.prototype.reserveSeat.args[0][1]);
    });
    // Testing valid scenarios complying to all business rules and feasibility with exact number of allowed seats
    it("Valid payload of tickets with exact number of seats for success payment and seat reservation", () => {
      Sinon.spy(TicketPaymentService.prototype, "makePayment");
      Sinon.spy(SeatReservationService.prototype, "reserveSeat");
      const objTicket = new TicketService();
      expect(
        objTicket.purchaseTickets(
          1,
          new TicketTypeRequest(TicketTypes.ADULT, 8),
          new TicketTypeRequest(TicketTypes.CHILD, 8),
          new TicketTypeRequest(TicketTypes.CHILD, 9)
        )
      ).to.not.throw;
      assert.equal(455, TicketPaymentService.prototype.makePayment.args[0][1]);
      assert.equal(25, SeatReservationService.prototype.reserveSeat.args[0][1]);
    });
    // Testing valid scenarios complying to all business rules and feasibility with infants having no seats
    it("Valid payload of tickets with success payment and seat reservation with infants", () => {
      Sinon.spy(TicketPaymentService.prototype, "makePayment");
      Sinon.spy(SeatReservationService.prototype, "reserveSeat");
      const objTicket = new TicketService();
      expect(
        objTicket.purchaseTickets(
          1,
          new TicketTypeRequest(TicketTypes.ADULT, 8),
          new TicketTypeRequest(TicketTypes.INFANT, 8)
        )
      ).to.not.throw;
      assert.equal(200, TicketPaymentService.prototype.makePayment.args[0][1]);
      assert.equal(8, SeatReservationService.prototype.reserveSeat.args[0][1]);
    });
  });
});
describe("Cinema Ticket Requests assumptions scenarios failing for valid ticket request", async () => {
  beforeEach(async () => {
    Sinon.restore();
    await failedEventsCounter.reset();
  });
  // Testing assumptions where account ID greater than zero are valid but should also cover undefined
  // Assumption: All accounts with an id greater than zero are valid.
  it("Invalid payload of tickets for undefined account ID", () => {
    const objTicket = new TicketService();
    assert.throws(() => {
      objTicket.purchaseTickets(
        undefined,
        new TicketTypeRequest(TicketTypes.ADULT, 8)
      );
    }, InvalidPurchaseException);
  });
  // Testing assumptions where account ID greater than zero are valid
  // Assumption: All accounts with an id greater than zero are valid.
  it("Invalid payload of tickets for a negitive account ID", () => {
    const objTicket = new TicketService();
    assert.throws(() => {
      objTicket.purchaseTickets(
        -1,
        new TicketTypeRequest(TicketTypes.ADULT, 8)
      );
    }, InvalidPurchaseException);
  });
  // Testing assumptions scenarios complying to all business rules and feasibility
  // Assumptions: The `TicketPaymentService` implementation is an external provider
  // with no defects. You do not need to worry about how the actual payment happens.
  // - The payment will always go through once a payment request has been made to the `TicketPaymentService`.
  it("Valid payload of tickets fails for making payment", async () => {
    Sinon.stub(TicketPaymentService.prototype, "makePayment").throwsException(
      new InvalidPurchaseException()
    );
    Sinon.stub(SeatReservationService.prototype, "reserveSeat").returns(true);
    const objTicket = new TicketService();
    assert.equal((await failedEventsCounter.get()).values[0].value, 0);
    assert.throws(() => {
      objTicket.purchaseTickets(
        1,
        new TicketTypeRequest(TicketTypes.ADULT, 8),
        new TicketTypeRequest(TicketTypes.INFANT, 8),
        new TicketTypeRequest(TicketTypes.CHILD, 8)
      );
    }, InvalidPurchaseException);
    assert.equal((await failedEventsCounter.get()).values[0].value, 1);
  });
  // Testing assumptions scenarios complying to all business rules and feasibility
  //- The `SeatReservationService` implementation is an external provider with no defects.
  // You do not need to worry about how the seat reservation algorithm works.
  // - The seat will always be reserved once a reservation request has been made to the `SeatReservationService`.
  it("Valid payload of tickets fails for reserving seat", async () => {
    Sinon.stub(TicketPaymentService.prototype, "makePayment").returns(true);
    Sinon.stub(SeatReservationService.prototype, "reserveSeat").throwsException(
      new InvalidPurchaseException()
    );
    const objTicket = new TicketService();
    assert.equal((await failedEventsCounter.get()).values[0].value, 0);
    assert.throws(() => {
      objTicket.purchaseTickets(
        1,
        new TicketTypeRequest(TicketTypes.ADULT, 8),
        new TicketTypeRequest(TicketTypes.INFANT, 8),
        new TicketTypeRequest(TicketTypes.CHILD, 8)
      );
    }, InvalidPurchaseException);
    assert.equal((await failedEventsCounter.get()).values[0].value, 1);
  });
});
