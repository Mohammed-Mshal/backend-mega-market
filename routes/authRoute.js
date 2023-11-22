const express = require("express");
const { signIn, signUp } = require("../controllers/authController");
const { validatorUser } = require("../middlewares/validatorUser");

const router = express.Router();

router.route("/signin").post(signIn);
router.route("/signup").post(signUp);

module.exports = router;
