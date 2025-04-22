class Ok extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 200;
  }
}

module.exports = Ok;
