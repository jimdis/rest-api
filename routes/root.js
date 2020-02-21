/**
 * API controller for / route
 */

'use strict'
const express = require('express')
const router = express.Router()
const allow = require('../middleware/allow').addAllow
const BASE_URL = require('../config/url')

router
  .route('/')
  .all(allow('GET, HEAD, OPTIONS'))
  // Get Links
  .get(async (req, res, next) => {
    try {
      return res.json({
        _links: {
          publishers: BASE_URL + '/publishers',
          ads: BASE_URL + '/ads',
          areas: BASE_URL + '/areas',
          auth: BASE_URL + '/auth',
        },
      })
    } catch (e) {
      next(e)
    }
  })

module.exports = router
