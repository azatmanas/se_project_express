const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../utils/config");

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(200).send({ message: "Authorization header is missing" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    res.status(401).send({ message: "Invalid or expired token" });
  }
};

module.exports = { authMiddleware };
