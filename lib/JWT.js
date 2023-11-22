const jwt = require("jsonwebtoken");
const createJWT = (id) => {
  const token = jwt.sign({ id }, process.env.SECRET_KEY_TOKEN, {
    expiresIn: 60 * 60 * 24 * 330,
  });
  return token;
};
module.exports = createJWT;
