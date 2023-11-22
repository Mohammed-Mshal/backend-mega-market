const asyncWrapper = require("../middlewares/asyncWrapper");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");
const Users = require("../models/userModel");
const bcrypt = require("bcryptjs");
const createJWT = require("../lib/JWT");
const { validationResult } = require("express-validator");

const signIn = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!validationResult(req).isEmpty()) {
    const error = appError.create(
      validationResult(req).array(),
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  const user = await Users.findOne({ email });
  if (!user) {
    const error = appError.create(
      "Email Is not valid",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  const verify = await bcrypt.compare(password, user.password);
  if (!verify) {
    const error = appError.create(
      "Password is't valid",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  const token = createJWT(user._id);
  return res.status(200).json({
    data: {
      token,
    },
    status: httpStatusText.SUCCESS,
  });
});
const signUp = asyncWrapper(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!validationResult(req).isEmpty()) {
    const error = appError.create(
      validationResult(req).array(),
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  const isExistUser = await Users.findOne({ email });
  if (isExistUser) {
    const error = appError.create(
      "Email User Is Already Exist",
      400,
      httpStatusText.FAIL
    );
    return next(error);
  }
  const newUser = await Users.create({
    name,
    email,
    password,
  });
  const token = createJWT(newUser._id);
  return res.status(200).json({
    data: {
      token,
    },
    status: httpStatusText.SUCCESS,
  });
});

module.exports = { signIn, signUp };
