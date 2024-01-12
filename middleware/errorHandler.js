const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
   const statusCode = res.statusCode ? res.statusCode : 500;

   switch (statusCode) {
      case constants.VALIDATION_ERROR:
         res.json({
            title: "Not found",
            message: err.message,
            stackTrace: err.stack,
         });

         break;
      case constants.NOT_FOUND:
         res.json({
            title: "Validation error",
            message: err.message,
            stackTrace: err.stack,
         });
         break;

      default:
         break;
   }
};

module.exports = errorHandler;
