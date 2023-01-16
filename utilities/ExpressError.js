//An error handling function exported to be used/applied in app.js file and the route paths.
module.exports = class ExpressError extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }
};
