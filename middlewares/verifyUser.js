const asyncWrapper = require("./asyncWrapper");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const verify = asyncWrapper(async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).json({
      message: "No Authorization Header",
    });
  }
  try {
    const token = authorization.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json({
        message: "Invalid Token Format",
      });
    }
    const decode = jwt.verify(token, process.env.SECRET_KEY_TOKEN);
    const user = await userModel.findOne({ _id: decode.id });
    if (!user) {
      return res.status(401).json({
        message: "Invalid Token ",
      });
    }
    req.user = decode;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: "Session Expired",
        error: error.message,
      });
    }
    if (error instanceof jwt.JsonWebTokenError || error instanceof TokenError) {
      return res.status(401).json({
        message: "Invalid Token",
        error: error.message,
      });
    }
    res.status(500).json({
      message: "Internal server Error",
      error: error.message,
      stack: error.stack,
    });
  }
});
module.exports = verify;
