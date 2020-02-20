'use strict'
/**
 * Auth Middleware for JWT.
 * Adapted from https://github.com/bradtraversy/mern_shopping_list
 */

const jwt = require('../lib/jwt')

/**
 * Checks header for 'Authorization' and verifies Bearer token.
 * In case token is vefified, adds token to request object.
 * Else sends 401 response.
 */
const auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error('Authorization needed')
    }
    const parts = req.headers.authorization.split(' ')
    if (!(parts.length === 2 && parts[0] === 'Bearer' && parts[1].length)) {
      throw new Error('Bearer token missing.')
    }
    const token = parts[1]
    const decoded = await jwt.verifyToken(token, process.env.JWT_SECRET)
    req.token = decoded
    next()
  } catch (e) {
    const authUrl = req.protocol + '://' + req.get('host') + '/auth'
    return res
      .status(401)
      .header('WWW-Authenticate', 'Bearer')
      .json({
        error: { code: 401, message: e.message },
        auth: {
          link: authUrl,
          method: 'POST',
          body: {
            email: 'registered email',
            password: 'registered password',
          },
        },
      })
  }
}

module.exports = auth
