'use strict'
const mongoose = require('mongoose')
const shortid = require('shortid')
const bcrypt = require('bcryptjs')

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: shortid.generate,
    },
    name: String,
    email: String,
    password: String,
  },
  { timestamps: true }
)

schema.pre('save', async function() {
  const passwordHash = await bcrypt.hash(this.password, 12)
  this.password = passwordHash
})

const Publisher = mongoose.model('Publisher', schema)

module.exports = Publisher
