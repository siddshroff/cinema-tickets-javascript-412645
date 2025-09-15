import { expect } from "chai";
import { resetEnvironment, setupEnvironment } from "./testEnvSetup.js";
describe("Constants enum updated via environment variables", () => {
  let constants;
  before(async () => {
    setupEnvironment();
    constants = await import(
      `../../../src/enum/Constants.js?cacheBust=${Date.now()}`
    );
  });
  after(() => {
    resetEnvironment();
  });
  it("should contain exactly Default members and values", () => {
    expect(Object.keys(constants.Defaults)).to.have.members([
      "MAX_TICKETS_ALLOWED",
      "LOG_LEVEL",
    ]);
    expect(Object.values(constants.Defaults)).to.have.members([
      process.env.MAX_TICKETS_ALLOWED,
      process.env.LOG_LEVEL,
    ]);
    expect(constants.Defaults.MAX_TICKETS_ALLOWED).to.equal(
      process.env.MAX_TICKETS_ALLOWED
    );
    expect(constants.Defaults.LOG_LEVEL).to.equal(process.env.LOG_LEVEL);
  });
  it("Default enum should be immutable", () => {
    expect(Object.isFrozen(constants.Defaults)).to.be.true;
    expect(() => {
      constants.Defaults.MAX_TICKETS_ALLOWED = 100;
    }).to.throw(TypeError);

    expect(() => {
      constants.Defaults.LOG_LEVEL = "debug";
    }).to.throw(TypeError);

    expect(() => {
      delete constants.Defaults.MAX_TICKETS_ALLOWED;
    }).to.throw(TypeError);
  });
  it("should contain exactly TicketTypes members and values", () => {
    expect(Object.keys(constants.TicketTypes)).to.have.members([
      "ADULT",
      "CHILD",
      "INFANT",
    ]);
    expect(Object.values(constants.TicketTypes)).to.have.members([
      "ADULT",
      "CHILD",
      "INFANT",
    ]);
    expect(constants.TicketTypes.ADULT).to.equal("ADULT");
    expect(constants.TicketTypes.CHILD).to.equal("CHILD");
    expect(constants.TicketTypes.INFANT).to.equal("INFANT");
  });
  it("TicketTypes enum should be immutable", () => {
    expect(Object.isFrozen(constants.TicketTypes)).to.be.true;
    expect(() => {
      constants.TicketTypes.ADULT = "GROWN UPS";
    }).to.throw(TypeError);

    expect(() => {
      constants.TicketTypes.TEEN = "TEEN";
    }).to.throw(TypeError);

    expect(() => {
      delete constants.TicketTypes.ADULT;
    }).to.throw(TypeError);
  });
  it("should contain exactly ErrorCodes members and values", () => {
    expect(Object.keys(constants.ErrorCodes)).to.have.members([
      "ERRORCT01",
      "ERRORCT02",
      "ERRORCT03",
      "ERRORCT04",
      "ERRORCT05",
      "ERRORCT06",
    ]);
    expect(Object.values(constants.ErrorCodes)).to.have.members([
      "Unknown application error",
      "Account Id Invalid",
      "Max ticket count purchase exceeded",
      "Adult ticket is not present",
      "Purchase data is null",
      "Invalid ticket request",
    ]);
    expect(constants.ErrorCodes.ERRORCT01).to.equal(
      "Unknown application error"
    );
    expect(constants.ErrorCodes.ERRORCT02).to.equal("Account Id Invalid");
    expect(constants.ErrorCodes.ERRORCT03).to.equal(
      "Max ticket count purchase exceeded"
    );
    expect(constants.ErrorCodes.ERRORCT04).to.equal(
      "Adult ticket is not present"
    );
    expect(constants.ErrorCodes.ERRORCT05).to.equal("Purchase data is null");
    expect(constants.ErrorCodes.ERRORCT06).to.equal("Invalid ticket request");
  });
  it("ErrorCodes enum should be immutable", () => {
    expect(Object.isFrozen(constants.ErrorCodes)).to.be.true;
    expect(() => {
      constants.ErrorCodes.ERRORCT01 = "Some other description";
    }).to.throw(TypeError);

    expect(() => {
      constants.ErrorCodes.ERRORCT02 = "Dummy error";
    }).to.throw(TypeError);

    expect(() => {
      delete constants.ErrorCodes.ERRORCT03;
    }).to.throw(TypeError);
  });
  it("should contain exactly TicketPrices members and values", () => {
    expect(Object.keys(constants.TicketPrices)).to.have.members([
      constants.TicketTypes.ADULT,
      constants.TicketTypes.CHILD,
      constants.TicketTypes.INFANT,
    ]);
    expect(Object.values(constants.TicketPrices)).to.have.members([
      process.env.ADULT_PRICE,
      process.env.CHILD_PRICE,
      process.env.INFANT_PRICE,
    ]);
    expect(constants.TicketPrices.ADULT).to.equal(process.env.ADULT_PRICE);
    expect(constants.TicketPrices.CHILD).to.equal(process.env.CHILD_PRICE);
    expect(constants.TicketPrices.INFANT).to.equal(process.env.INFANT_PRICE);
  });
  it("TicketPrices enum should be immutable", () => {
    expect(Object.isFrozen(constants.TicketPrices)).to.be.true;
    expect(() => {
      constants.TicketPrices.ADULT = 10;
    }).to.throw(TypeError);

    expect(() => {
      constants.TicketPrices.TEEN = 20;
    }).to.throw(TypeError);

    expect(() => {
      delete constants.TicketPrices.INFANT;
    }).to.throw(TypeError);
  });
  it("should contain exactly Metrics members and values", () => {
    expect(Object.keys(constants.Metrics)).to.have.members(["METRICS_PREFIX"]);
    expect(Object.values(constants.Metrics)).to.have.members([
      "cinema_ticket_",
    ]);
  });
  it("Metrics enum should be immutable", () => {
    expect(Object.isFrozen(constants.Metrics)).to.be.true;
    expect(() => {
      constants.Metrics.METRICS_PREFIX = "dummy_metric_";
    }).to.throw(TypeError);

    expect(() => {
      constants.Metrics.NEW_METRIC = "new_dummy_metric";
    }).to.throw(TypeError);

    expect(() => {
      delete constants.Metrics.METRICS_PREFIX;
    }).to.throw(TypeError);
  });
});
