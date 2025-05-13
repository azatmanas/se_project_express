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
  } catch {
    next(new UnAuthorized("Authorization required"));
  }
};

module.exports = authMiddleware;
