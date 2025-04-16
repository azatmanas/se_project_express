const OK = 200;
const CREATED = 201;
const UNAUTHORIZED = 401;
const BAD_REQUEST = 400;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const CONFLICT = 409;
const DEFAULT = 500;

module.exports = {
  OK,
  CREATED,
  UNAUTHORIZED,
  BAD_REQUEST,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT,
  DEFAULT,
};
class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;

class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

// module.exports = BadRequest;

// class UnAuthorized extends Error {
//   constructor(message) {
//     super(message);
//     this.statusCode = 400;
//   }
// }

module.exports = UnAuthorized;
