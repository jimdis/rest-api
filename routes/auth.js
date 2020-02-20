/**
 * API controllers for /publishers route
 */

'use strict'
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const allow = require('../middleware/allow').addAllow
const Publisher = require('../models/Publisher')
const ValidationError = require('../errors/ValidationError')
const ForbiddenError = require('../errors/ForbiddenError')
const jwt = require('../lib/jwt')
const createLinks = require('../lib/createLinks')

router
  .route('/')
  .all(allow('GET, HEAD, OPTIONS'))
  // Login to get access token
  .post(async (req, res, next) => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        throw new ValidationError('email and password fields must be provided')
      }
      const publisher = await Publisher.findOne({ email })
      const passwordMatch =
        publisher && (await bcrypt.compare(password, publisher.password))
      if (!passwordMatch) {
        throw new ForbiddenError('Email/password combination is incorrect')
      }
      const token = await jwt.signToken(
        { id: publisher.id },
        process.env.JWT_SECRET,
        { expiresIn: 600 }
      )
      return res
        .header('Cache-Control', 'no-store')
        .header('Pragma', 'no-cache')
        .json({
          accessToken: token,
          tokenType: 'bearer',
          expiresIn: 600,
          _links: createLinks.publisher(req, publisher),
        })
    } catch (e) {
      next(e)
    }
  })

module.exports = router
