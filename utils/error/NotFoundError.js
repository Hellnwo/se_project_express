class NotFoundError extends Error {
  constructor(message = "Not Found") {
    super(message);
    this.statusCode = 404;
    this.name = "NotFoundError"
  }
}

module.exports = NotFoundError;