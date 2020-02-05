'use strict'
const mongoose = require('mongoose')

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    population: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)

const Area = mongoose.model('Area', schema)

module.exports = Area
