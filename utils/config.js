const { JWT_SECRET = "super-strong-secret" } = process.env;

module.exports = {
  JWT_SECRET,
};
// const JWT_SECRET = "your-secret-key";

// module.exports = { JWT_SECRET };
