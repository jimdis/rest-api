/**
 * API controllers for /ads route
 */

'use strict'
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const allow = require('../middleware/allow').addAllow
const Ad = require('../models/Ad')
const Publisher = require('../models/Publisher')
const ForbiddenError = require('../errors/ForbiddenError')

const getUrl = req => req.protocol + '://' + req.get('host')

router
  .route('/')
  .all(allow('GET, POST, HEAD, OPTIONS'))
  // Get all ads
  .get(async (req, res, next) => {
    try {
      const match = {}
      if (req.query.area) {
        match.area = { $in: req.query.area }
      }
      if (req.query.publisher) {
        match.publisher = { $in: req.query.publisher }
      }
      const ads = await Ad.find({ ...match }, '-__v')
        .populate('area', 'name population')
        .populate('publisher', 'name')
        .lean()
        .cache(60)
      return res.json({
        items: ads.map(ad => ({
          ...ad,
          _links: {
            self: `${getUrl(req)}/ads/${ad._id}`,
            publisher: `${getUrl(req)}/publishers/${ad.publisher._id}`,
          },
        })),
      })
    } catch (e) {
      next(e)
    }
  })
  // Create new ad
  .post(auth, async (req, res, next) => {
    try {
      const { id } = req.token
      const publisher = await Publisher.findById(id)
      let ad = new Ad({
        ...req.body,
        publisher: publisher._id,
        area: publisher.area,
      })
      ad = await ad.save()
      return res
        .status(201)
        .header('Location', `${getUrl(req)}/ads/${ad._id}`)
        .json(ad)
    } catch (e) {
      next(e)
    }
  })

router
  .route('/:id')
  .all(allow('GET, PATCH, DELETE, HEAD, OPTIONS'))
  // Get ad with :id
  .get(async (req, res, next) => {
    try {
      const ad = await Ad.findById(req.params.id, '-__v')
        .populate('area', 'name population')
        .populate('publisher', 'name')
        .lean()
        .cache(60)
      if (!ad) {
        return next()
      }
      return res.json({
        ...ad,
        _links: {
          self: `${getUrl(req)}/ads/${ad._id}`,
          publisher: `${getUrl(req)}/publishers/${ad.publisher._id}`,
          area: `${getUrl(req)}/areas/${ad.area._id}`,
        },
      })
      //TODO: Add link to ads
    } catch (e) {
      next(e)
    }
  })
  // Edit ad with :id
  .patch(auth, async (req, res, next) => {
    try {
      const { id } = req.token
      let ad = await Ad.findById(req.params.id)
      if (!ad) {
        return next()
      }
      if (ad.publisher !== id) {
        return next(new ForbiddenError())
      }
      const ignoreKeys = ['_id', 'publisher', 'area']
      Object.keys(req.body).forEach(key => {
        if (ignoreKeys.includes(key)) {
          return
        }
        ad[key] = req.body[key]
      })
      ad = await ad.save()
      return res.json(ad)
    } catch (e) {
      next(e)
    }
  })
  // Delete ad with id
  //TODO: Add check 403
  .delete(auth, async (req, res, next) => {
    try {
      const doc = await Ad.findByIdAndDelete(req.token.id)
      if (!doc) {
        return next()
      }
      return res.status(204).send()
    } catch (e) {
      next(e)
    }
  })

router
  .route('/:id/details')
  .all(allow('GET, HEAD, OPTIONS'))
  // Get Private ad details based on ID
  .get(auth, async (req, res, next) => {
    try {
      const ad = await Ad.findById(req.token.id, '-password -__v')
        .populate('area', 'name population')
        .cache(60)
      if (!ad) {
        next()
      }
      return res.json(ad)
      //TODO: Add link to ads
    } catch (e) {
      next(e)
    }
  })

module.exports = router
