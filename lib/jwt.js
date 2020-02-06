/**
 * Module for promisifying jsonwebtoken sign and verify methods.
 */

'use strict'

const jwt = require('jsonwebtoken')

/**
 * Signs a token with the provided payload.
 *
 * @param {Object} payload Object containing the payload to sign the token with
 * @param {String} secret String containing Secret
 * @param {Object} options Options object for jwt.
 * @returns {Promise<String>} Promise resolving to the token.
 */
const signToken = async (payload, secret, options) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) reject(err)
      resolve(token)
    })
  })
}

/**
 * Verifiess and decodes a provided token and secret
 *
 * @param {String} token The token
 * @param {String} secret String containing Secret
 * @returns {Promise<Object>} Promise resolving to an Object containing the token.
 */
const verifyToken = async (token, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) reject(err)
      resolve(decoded)
    })
  })
}

module.exports = {
  signToken,
  verifyToken,
}
