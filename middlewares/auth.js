const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UnAuthorized } = require("../utils/unAuthorized");

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnAuthorized("Authorization header is missing"));
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return next(new UnAuthorized("Authorization required"));
  }
};
module.exports = authMiddleware;
