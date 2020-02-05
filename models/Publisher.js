'use strict'
const mongoose = require('mongoose')
const shortid = require('shortid')
const bcrypt = require('bcryptjs')
const validator = require('validator').default
const passwordValidator = require('password-validator')
const { VALIDATION_ERROR } = require('../config/constants')
const Area = require('./Area')

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
    area: {
      type: String,
      required: true,
      ref: 'Area',
    },
    name: {
      type: String,
      required: true,
      unique: true,
      minlength: 1,
      maxlength: 100,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: {
        validator: v => validator.isEmail(v),
        message: 'Invalid email',
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: v => passwordSchema.validate(v),
        message:
          'Password must be at least 8 chars, max 100 chars, one lowercase, one uppercase, one digit.',
      },
    },
  },
  { timestamps: true }
)

// Password hashing middleware
schema.pre('save', async function(next) {
  const passwordHash = await bcrypt.hash(this.password, 12)
  this.password = passwordHash
  this.name = validator.escape(this.name)
  const area = await Area.findById(this.area)
  if (!area) {
    const customError = new Error(`Invalid area ${this.area}`)
    customError.name = VALIDATION_ERROR
    next(customError)
  }
})

// Custom error handling middleware for duplicate keys
schema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    const key = Object.keys(error.keyValue)[0]
    const value = error.keyValue[key]
    const customError = new Error(`${key} ${value} is already in use`)
    customError.name = VALIDATION_ERROR
    next(customError)
  } else {
    next()
  }
})

const Publisher = mongoose.model('Publisher', schema)

module.exports = Publisher
