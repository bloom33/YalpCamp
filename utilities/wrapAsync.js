//Error handling function made specifically for/to wrap around the async functions/route paths in app.js
module.exports = (func) => {
  return (req, res, next) => {
    // func(req, res, next).catch((e) => next(e));
    func(req, res, next).catch(next);
  };
};
