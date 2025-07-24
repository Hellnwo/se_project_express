const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../utils/error/UnauthorizedError");

const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if(!authorization || !authorization.startsWith("Bearer ", "")) {
      throw new UnauthorizedError("Authorization required");
    }
    const token = authorization.replace("Bearer ", "");
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError' || err instanceof UnauthorizedError) {
      return next(new UnauthorizedError("Authorization required"));
    }
    return next(err);
  }
};

module.exports = auth;