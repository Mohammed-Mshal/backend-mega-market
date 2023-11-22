const appError = require("../utils/appError");
const asyncWrapper = require("./asyncWrapper");
const MB = 4;
const FILE_SIZE_LIMIT = MB * 1024 * 1024;
const fileSizeLimiter = asyncWrapper(async (req, res, next) => {
  const fileOverLimit = [];
  req.files['photos'].forEach((photo) => {
    if (photo.size > FILE_SIZE_LIMIT) {
      fileOverLimit.push(photo.name);
    }
  });
  if (fileOverLimit.length) {
    const properVerb = fileOverLimit.length > 1 ? "are" : "is";
    const sentence =
      `Upload Failed ${fileOverLimit.toString()} ${properVerb} over the file size limit of ${MB} MB`.replace(
        ",",
        ", "
      );
    const message =
      fileOverLimit.length < 3
        ? sentence.replace(",", "and")
        : sentence.replace(/,(?=[^,]*$)/, " and");
    return res.status(413).json({ status: "error", message });
  }
  return next();
});
module.exports = fileSizeLimiter;
