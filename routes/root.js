/**
 * API controller for / route
 */

'use strict'
const express = require('express')
const router = express.Router()
const allow = require('../middleware/allow').addAllow

router
  .route('/')
  .all(allow('GET, HEAD, OPTIONS'))
  // Get Links
  .get(async (req, res, next) => {
    try {
      const baseUrl = req.protocol + '://' + req.get('host')
      return res.json({
        _links: {
          publishers: baseUrl + '/publishers',
          ads: baseUrl + '/ads',
          areas: baseUrl + '/areas',
        },
      })
    } catch (e) {
      next(e)
    }
  })

module.exports = router
