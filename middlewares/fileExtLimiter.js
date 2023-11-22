const path = require("path");
const asyncWrapper = require("./asyncWrapper");
const { FAIL } = require("../utils/httpStatusText");

const fileExtLimiter = (allowedExtArray) => {
  return asyncWrapper(async (req, res, next) => {
    const files = req.files["photos"];
    const fileExtension = [];
    files.forEach((file) => {
      fileExtension.push(path.extname(file.name));
    });
    const allowed = fileExtension.every((ext) => allowedExtArray.includes(ext));
    if (!allowed) {
      const message =
        `Upload failed. Only ${allowedExtArray.toString()} files allowed.`.replace(
          ",",
          ", "
        );
      return res.status(422).json({ message, status: FAIL });
    }
    return next();
  });
};

module.exports = fileExtLimiter;
