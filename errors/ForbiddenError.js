class ForbiddenError extends Error {
  constructor(message) {
    super()
    this.message = message || 'Your token does not match the requested resource'
    this.statusCode = 403
  }
}

module.exports = ForbiddenError
