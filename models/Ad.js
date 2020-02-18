'use strict'
const mongoose = require('mongoose')
const cachegoose = require('cachegoose')
const shortid = require('shortid')
const validator = require('validator').default

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
    area: {
      type: String,
      required: true,
      ref: 'Area',
    },
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 30,
    },
    description: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100,
    },
    body: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 2000,
    },
    validFrom: {
      type: Date,
      default: Date.now(),
    },
    validTo: {
      type: Date,
      required: true,
      min: Date.now(),
    },
    imageUrl: {
      type: String,
      validate: {
        validator: v =>
          validator.isURL(v) && v.match(/\.(jpeg|jpg|gif|png|svg)$/),
        message:
          'imageUrl must be a valid url to an image (jpg, gif, png, svg)',
      },
    },
  },
  { timestamps: true }
)

//TODO: ADD pre save hook to sanitize data

schema.post('save', function(doc, next) {
  cachegoose.clearCache()
  next()
})

const Ad = mongoose.model('Ad', schema)

module.exports = Ad
