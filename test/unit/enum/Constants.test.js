import { expect } from "chai";
import {
  Defaults,
  TicketTypes,
  ErrorCodes,
  TicketPrices,
  Metrics,
} from "../../../src/enum/Constants.js";

describe("Constants enum", () => {
  it("should contain exactly Default members and values", () => {
    expect(Object.keys(Defaults)).to.have.members([
      "MAX_TICKETS_ALLOWED",
      "LOG_LEVEL",
    ]);
    expect(Object.values(Defaults)).to.have.members([25, "info"]);
    expect(Defaults.MAX_TICKETS_ALLOWED).to.equal(25);
    expect(Defaults.LOG_LEVEL).to.equal("info");
});
it('Default enum should be immutable', () => {
    expect(Object.isFrozen(Defaults)).to.be.true;
    expect(() => {
        Defaults.MAX_TICKETS_ALLOWED = 100;
    }).to.throw(TypeError);
    
    expect(() => {
        Defaults.LOG_LEVEL = 'debug';
    }).to.throw(TypeError);
    
    expect(() => {
        delete Defaults.MAX_TICKETS_ALLOWED;
    }).to.throw(TypeError);
});
it("should contain exactly TicketTypes members and values", () => {
    expect(Object.keys(TicketTypes)).to.have.members([
        "ADULT",
        "CHILD",
        "INFANT",
    ]);
    expect(Object.values(TicketTypes)).to.have.members([
        "ADULT",
        "CHILD",
        "INFANT",
    ]);
    expect(TicketTypes.ADULT).to.equal('ADULT');
    expect(TicketTypes.CHILD).to.equal('CHILD');
    expect(TicketTypes.INFANT).to.equal('INFANT');
});
it('TicketTypes enum should be immutable', () => {
    expect(Object.isFrozen(TicketTypes)).to.be.true;
    expect(() => {
        TicketTypes.ADULT = 'GROWN UPS';
    }).to.throw(TypeError);
    
    expect(() => {
        TicketTypes.TEEN = 'TEEN';
    }).to.throw(TypeError);
    
    expect(() => {
        delete TicketTypes.ADULT;
    }).to.throw(TypeError);
});
it("should contain exactly ErrorCodes members and values", () => {
    expect(Object.keys(ErrorCodes)).to.have.members([
        "ERRORCT01",
        "ERRORCT02",
        "ERRORCT03",
        "ERRORCT04",
        "ERRORCT05",
        "ERRORCT06",
    ]);
    expect(Object.values(ErrorCodes)).to.have.members([
        "Unknown application error",
        "Account Id Invalid",
        "Max ticket count purchase exceeded",
        "Adult ticket is not present",
        "Purchase data is null",
        "Invalid ticket request",
    ]);
    expect(ErrorCodes.ERRORCT01).to.equal('Unknown application error');
    expect(ErrorCodes.ERRORCT02).to.equal('Account Id Invalid');
    expect(ErrorCodes.ERRORCT03).to.equal('Max ticket count purchase exceeded');
    expect(ErrorCodes.ERRORCT04).to.equal('Adult ticket is not present');
    expect(ErrorCodes.ERRORCT05).to.equal('Purchase data is null');
    expect(ErrorCodes.ERRORCT06).to.equal('Invalid ticket request');
});
it('ErrorCodes enum should be immutable', () => {
    expect(Object.isFrozen(ErrorCodes)).to.be.true;
    expect(() => {
        ErrorCodes.ERRORCT01 = 'Some other description';
    }).to.throw(TypeError);
    
    expect(() => {
        ErrorCodes.ERRORCT02 = 'Dummy error';
    }).to.throw(TypeError);
    
    expect(() => {
        delete ErrorCodes.ERRORCT03;
    }).to.throw(TypeError);
});
it("should contain exactly TicketPrices members and values", () => {
    expect(Object.keys(TicketPrices)).to.have.members([
        TicketTypes.ADULT,
        TicketTypes.CHILD,
        TicketTypes.INFANT,
    ]);
    expect(Object.values(TicketPrices)).to.have.members([25, 15, 0]);
    expect(TicketPrices.ADULT).to.equal(25);
    expect(TicketPrices.CHILD).to.equal(15);
    expect(TicketPrices.INFANT).to.equal(0);
  });
  it('TicketPrices enum should be immutable', () => {
    expect(Object.isFrozen(TicketPrices)).to.be.true;
    expect(() => {
        TicketPrices.ADULT = 10;
    }).to.throw(TypeError);

    expect(() => {
        TicketPrices.TEEN = 20;
    }).to.throw(TypeError);

    expect(() => {
      delete TicketPrices.INFANT;
    }).to.throw(TypeError);
  });
  it("should contain exactly Metrics members and values", () => {
    expect(Object.keys(Metrics)).to.have.members(["METRICS_PREFIX"]);
    expect(Object.values(Metrics)).to.have.members(["cinema_ticket_"]);
  });
  it('Metrics enum should be immutable', () => {
    expect(Object.isFrozen(Metrics)).to.be.true;
    expect(() => {
        Metrics.METRICS_PREFIX = 'dummy_metric_';
    }).to.throw(TypeError);

    expect(() => {
        Metrics.NEW_METRIC = 'new_dummy_metric';
    }).to.throw(TypeError);

    expect(() => {
      delete Metrics.METRICS_PREFIX;
    }).to.throw(TypeError);
  });
});
