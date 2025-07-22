const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED } = require("../utils/errors");

const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if(!authorization || !authorization.startsWith("Bearer ", "")) {
      throw new UNAUTHORIZED("Authorization required");
    }
    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError' || err instanceof UNAUTHORIZED) {
      return next(new UNAUTHORIZED("Authorization required"));
    }
    return next(err);
  }
};

module.exports = auth;