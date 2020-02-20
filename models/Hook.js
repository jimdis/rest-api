'use strict'
const mongoose = require('mongoose')
const cachegoose = require('cachegoose')
const shortid = require('shortid')
const validator = require('validator').default
const actions = require('../lib/types').webhookActions

const actionValues = Object.keys(actions).map(key => actions[key])

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: shortid.generate,
    },
    publisher: {
      type: String,
      required: true,
      ref: 'Publisher',
    },
    action: {
      type: String,
      required: true,
      validate: {
        validator: v => actionValues.includes(v),
        message: `action needs to be one of [${actionValues.join()}]`,
      },
    },
    callback: {
      type: String,
      required: true,
      validate: {
        validator: v => validator.isURL(v),
        message: 'callback needs to be a valid URL',
      },
    },
  },
  { timestamps: true }
)

schema.post('save', function(doc, next) {
  cachegoose.clearCache()
  next()
})

schema.post('remove', function(doc, next) {
  cachegoose.clearCache()
  next()
})

const Hook = mongoose.model('Hook', schema)

module.exports = Hook
