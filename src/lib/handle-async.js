module.exports = function handelAsync(handler) {
  console.log('handleAsync loaded'  );
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (exc) {
      console.error(exc);
      next(exc);
    }
  };
};
