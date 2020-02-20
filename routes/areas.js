/**
 * API controllers for /areas route
 */

'use strict'
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const allow = require('../middleware/allow').addAllow
const Area = require('../models/Area')
const Ad = require('../models/Ad')
const Publisher = require('../models/Publisher')
const ForbiddenError = require('../errors/ForbiddenError')
const createLinks = require('../lib/createLinks')

router
  .route('/')
  .all(allow('GET, HEAD, OPTIONS'))
  // Get all areas
  .get(async (req, res, next) => {
    try {
      const areas = await Area.find({}, '-__v -createdAt -modifiedAt')
        .lean()
        .cache(60)
      return res.json(
        areas.map(a => ({
          ...a,
          _links: createLinks.area(req, a),
        }))
      )
    } catch (e) {
      next(e)
    }
  })

router
  .route('/:id')
  .all(allow('GET, HEAD, OPTIONS'))
  // Get area with :id
  .get(async (req, res, next) => {
    try {
      const area = await Area.findById(req.params.id, '-__v')
        .lean()
        .cache(60)
      if (!area) {
        return next()
      }
      return res.json({
        ...area,
        _links: createLinks.area(req, area),
      })
    } catch (e) {
      next(e)
    }
  })

router
  .route('/:id/publishers')
  .all(allow('GET, HEAD, OPTIONS'))
  // Get all publishers for area with :id
  .get(async (req, res, next) => {
    try {
      const publishers = await Publisher.find(
        { area: req.params.id },
        'name area'
      )
        .lean()
        .cache(60)
      return res.json({
        items: publishers.map(p => {
          return {
            ...p,
            _links: createLinks.publisher(req, p),
          }
        }),
      })
    } catch (e) {
      next(e)
    }
  })

router
  .route('/:id/ads')
  .all(allow('GET, HEAD, OPTIONS'))
  // Get all ads for area with :id
  .get(async (req, res, next) => {
    try {
      const ads = await Ad.find(
        { area: req.params.id },
        '-__v -createdAt -updatedAt'
      )
        .lean()
        .cache(60)
      return res.json({
        items: ads.map(ad => {
          return {
            ...ad,
            _links: createLinks.ad(req, ad),
          }
        }),
      })
    } catch (e) {
      next(e)
    }
  })

module.exports = router
