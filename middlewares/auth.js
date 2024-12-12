const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { OK, UNAUTHORIZED } = require("../utils/errors");

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(OK).send({ message: "Authorization header is missing" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    console.error(err);
    return res
      .status(UNAUTHORIZED)
      .send({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
