const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
// const { UNAUTHORIZED } = require("../utils/errors");
const { UnAuthorized } = require("../utils/unAuthorized");

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(UnAuthorized)
      .send({ message: "Authorization header is missing" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    payload = jwt.verify(token, "some-secret-key");
  } catch (e) {
    const err = new Error("Authorization required");
    err.statusCode = 401;

    next(err);
  }
};

module.exports = authMiddleware;
