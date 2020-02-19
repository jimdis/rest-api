'use strict'
const bcrypt = require('bcryptjs')
const passwordValidator = require('password-validator')
const ValidationError = require('../errors/ValidationError')

const passwordSchema = new passwordValidator()
passwordSchema.is().min(8)
passwordSchema.is().max(100)
passwordSchema.has().uppercase()
passwordSchema.has().lowercase()
passwordSchema.has().digits()

/**
 * Middlware to validate password strength and hash password.
 */
module.exports = async (req, res, next) => {
  try {
    const password = req.body.password
    if (!password) {
      return next()
    }

    if (!passwordSchema.validate(password)) {
      throw new ValidationError(
        'Password must be at least 8 chars, max 100 chars, one lowercase, one uppercase, one digit.'
      )
    }
    req.body.password = await bcrypt.hash(password, 12)
    next()
  } catch (e) {
    next(e)
  }
}
