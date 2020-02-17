'use strict'

const mongoose = require('mongoose')
const ValidationError = require('../errors/ValidationError')
const logger = require('../config/logger')

/**
 * Error handler. Catches errors and sends 500 Internal Server Error for non-specific errors.
 * Needs 4 arguments to work as middleware with error handling, even though last arg is not used...
 */
// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, _) => {
  if (err.statusCode) {
    return res
      .status(err.statusCode)
      .json({ error: { code: err.statusCode, message: err.message } })
  }
  if (
    err instanceof mongoose.Error.ValidationError ||
    err instanceof ValidationError
  ) {
    res.status(422).json({
      error: {
        code: 'ValidationError',
        message: err.message,
      },
    })
  }
  logger.error(err)
  return res.status(500).json({
    error: {
      code: 500,
      message: err.message,
    },
  })
}
