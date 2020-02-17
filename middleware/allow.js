'use strict'
/**
 * Middleware to add allow property to response object
 * @param {String} allow String containing allowed methods.
 */
const addAllow = allow => (req, res, next) => {
  req.allow = allow
  next()
}

/**
 * Middleware to handle allow headers.
 */
const handleAllow = (req, res, next) => {
  try {
    if (req.method === 'OPTIONS') {
      return res
        .status(204)
        .header('Access-Control-Allow-Methods', req.allow)
        .send()
    }
    if (!req.allow.includes(req.method)) {
      return res
        .status(405)
        .header('Allow', req.allow)
        .send()
    }
    next()
  } catch (e) {
    next(e)
  }
}

module.exports = { addAllow, handleAllow }
