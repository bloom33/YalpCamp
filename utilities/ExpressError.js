//An error handling function exported to be used/applied in app.js file and the route paths.
// module.exports = class ExpressError extends Error {
//   constructor(status, message) {
//     super();
//     this.status = status;
//     this.message = message;
//   }
// };

class ExpressError extends Error {
  constructor(message, statusCode) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = ExpressError;
