class ForbiddenError extends Error {
  constructor() {
    super()
    this.message = 'Your token does not match the requested resource'
    this.statusCode = 403
  }
}

module.exports = ForbiddenError
