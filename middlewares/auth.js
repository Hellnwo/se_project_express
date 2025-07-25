const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const UnauthorizedError = require("../utils/error/UnauthorizedError");

const auth = (req, res, next) => {
  let token;

  const authorization = req.headers && req.headers.authorization;

  if (authorization && authorization.startsWith("Bearer ")) {
    token = authorization.replace("Bearer ", "");
  }

  if (!token && req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token && req.body && req.body.token) {
    token = req.body.token;
  }

  console.log("Token:", token);

  if (!token) {
    return next(new UnauthorizedError("Authorization required"));
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return next(
      new UnauthorizedError("Authorization token is invalid or expired")
    );
  }
};

module.exports = auth;