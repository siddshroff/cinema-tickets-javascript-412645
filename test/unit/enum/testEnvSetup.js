const setupEnvironment = () => {
  process.env.MAX_TICKETS_ALLOWED = 30;
  process.env.LOG_LEVEL = "off";
  process.env.ADULT_PRICE = 20;
  process.env.CHILD_PRICE = 10;
  process.env.INFANT_PRICE = 20;
};

const resetEnvironment = () => {
  delete process.env.MAX_TICKETS_ALLOWED;
  delete process.env.LOG_LEVEL;
  delete process.env.ADULT_PRICE;
  delete process.env.CHILD_PRICE;
  delete process.env.INFANT_PRICE;
};

export { setupEnvironment, resetEnvironment };
