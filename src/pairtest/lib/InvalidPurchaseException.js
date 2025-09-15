export default class InvalidPurchaseException extends Error {
  constructor(error = "Invalid Purchase Error", originaError = null) {
    super("Bad Request");
    this.error = error;
    this.message = originaError;
  }

  get name() {
    return this.constructor.name;
  }
}
