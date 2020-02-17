/**
 * API controllers for /publishers route
 */

'use strict'
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const Publisher = require('../models/Publisher')
const ValidationError = require('../errors/ValidationError')
const jwt = require('../lib/jwt')

router
  .route('/')
  .all((req, res, next) => {
    res.header('Allow', 'POST, OPTIONS')
    next()
  })
  // Login to get access token
  .post(async (req, res, next) => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        next(new ValidationError('email and password fields must be provided'))
      }
      console.log(email, password)
      const publisher = await Publisher.findOne({ email })
      console.log(publisher)
      const passwordMatch =
        publisher && (await bcrypt.compare(password, publisher.password))
      if (!passwordMatch) {
        return res.status(403).json({
          error: {
            code: 403,
            message: 'Email/password combination is incorrect',
          },
        })
      }
      const token = await jwt.signToken(
        { id: publisher.id },
        process.env.JWT_SECRET,
        { expiresIn: 3600 }
      )
      return res
        .header('Cache-Control', 'no-store')
        .header('Pragma', 'no-cache')
        .json({
          accessToken: token,
          tokenType: 'bearer',
          expiresIn: 3600,
        })
    } catch (e) {
      next(e)
    }
  })
  .all((req, res) => res.status(405).send())

module.exports = router
