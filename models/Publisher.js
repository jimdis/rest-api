'use strict'
const mongoose = require('mongoose')
const cachegoose = require('cachegoose')
const shortid = require('shortid')
const validator = require('validator').default
const ValidationError = require('../errors/ValidationError')
const Area = require('./Area')

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
    },
  },
  {
    timestamps: true,
    toObject: { transform: (doc, ret) => ({ ...ret, password: undefined }) },
  }
)

// Area exists validation
schema.pre('save', async function(next) {
  this.name = validator.escape(this.name)
  const area = await Area.findById(this.area)
  if (!area) {
    next(new ValidationError(`Invalid area ${this.area}`))
  }
})

schema.post('save', function(doc, next) {
  cachegoose.clearCache()
  next()
})

// Custom error handling middleware for duplicate keys
schema.post('save', function(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    const key = Object.keys(error.keyValue)[0]
    const value = error.keyValue[key]
    next(new ValidationError(`${key} ${value} is already in use`))
  } else {
    next()
  }
})

const Publisher = mongoose.model('Publisher', schema)

module.exports = Publisher
