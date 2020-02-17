'use strict'
/**
 * Middleware to add allow property to response object
 * @param {String} allow String containing allowed methods.
 */
module.exports = allow => (req, res, next) => {
  res.allow = allow
  next()
}
