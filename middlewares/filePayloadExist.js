const appError = require("../utils/appError");
const { FAIL } = require("../utils/httpStatusText");
const asyncWrapper = require("./asyncWrapper");

const filePayloadExist = asyncWrapper(async (req, res, next) => {
  if (!req.files["photos"]) {
    const error = appError.create("Missing Files!", 400, FAIL);
    return next(error);
  }
  if (
    req.files["photos"].length > 7 ||
    req.files["photos"].length < 2 ||
    !Array.isArray(req.files["photos"])
  ) {
    const error = appError.create(
      "Photos Should be between 2 And 7",
      400,
      FAIL
    );
    return next(error);
  }
  return next();
});

module.exports = filePayloadExist;
