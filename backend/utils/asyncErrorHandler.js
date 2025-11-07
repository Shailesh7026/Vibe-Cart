export default (func) => {
  return (req, res, next) => {
    // ensure returned value is a promise and catch errors
    Promise.resolve(func(req, res, next)).catch((err) => next(err));
  };
};
