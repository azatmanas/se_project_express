const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnAuthorized } = require("../utils/unAuthorized");

const authMiddleware = (req, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new UnAuthorized("Authorization header is missing"));
  }

  const token = authorization.replace("Bearer ", "");

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    const err = new Error("Authorization required");
    err.statusCode = 401;

    next(new UnAuthorized("Authorization required"));
  }
};

module.exports = authMiddleware;
