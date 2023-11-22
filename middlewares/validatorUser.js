const { body } = require("express-validator");
const validatorUser = () => {
  return [
    body("name")
      .notEmpty()
      .withMessage("Name Is Required")
      .isLength({ min: 3 })
      .withMessage("Name Should be more than or equal 3"),
    body("email")
      .notEmpty()
      .withMessage("Email Is Required")
      .isEmail()
      .withMessage("Email Is Not Valid")
      .isLength({ min: 8 })
      .withMessage("Password Should Be More Than 7 Character"),
    body("password")
      .notEmpty()
      .withMessage("Password Is Required")
      .isStrongPassword()
      .withMessage("Password Should Be Strong")
      .isLength({ min: 8 })
      .withMessage("Password Should Be Number"),
  ];
};

module.exports = { validatorUser };
