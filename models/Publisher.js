'use strict'
const mongoose = require('mongoose')
const shortid = require('shortid')
const bcrypt = require('bcryptjs')
const passwordValidator = require('password-validator')
const validationError = require('../config/constants').VALIDATION_ERROR

const passwordSchema = new passwordValidator()
passwordSchema.is().min(8)
passwordSchema.is().max(100)
passwordSchema.has().uppercase()
passwordSchema.has().lowercase()
passwordSchema.has().digits()

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: shortid.generate,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: { type: String, unique: true, required: true },
    password: {
      type: String,
      required: true,
      validate: {
        validator: pass => passwordSchema.validate(pass),
        message:
          'Password must be at least 8 chars, max 100 chars, one lowercase, one uppercase, one digit.',
      },
    },
  },
  { timestamps: true }
)

// Password hashing middleware
schema.pre('save', async function() {
  const passwordHash = await bcrypt.hash(this.password, 12)
  this.password = passwordHash
})

// Custom error handling middleware for duplicate keys
schema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    const key = Object.keys(error.keyValue)[0]
    const value = error.keyValue[key]
    const customError = new Error(`${key} ${value} is already in use`)
    customError.name = validationError
    next(customError)
  } else {
    next()
  }
})

const Publisher = mongoose.model('Publisher', schema)

module.exports = Publisher
