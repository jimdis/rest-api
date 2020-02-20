/**
 * API controllers for /publishers route
 */

'use strict'
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const allow = require('../middleware/allow').addAllow
const hashPassword = require('../middleware/hashPassword')
const Publisher = require('../models/Publisher')
const Ad = require('../models/Ad')
const ForbiddenError = require('../errors/ForbiddenError')
const createLinks = require('../lib/createLinks')

router
  .route('/')
  .all(allow('GET, POST, HEAD, OPTIONS'))
  // Get all publishers
  .get(async (req, res, next) => {
    try {
      const match = {}
      if (req.query.area) {
        match.area = { $in: req.query.area }
      }
      if (req.query.id) {
        match._id = { $in: req.query.id }
      }
      const publishers = await Publisher.find({ ...match }, 'name area')
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
  // Create new publisher
  //TODO: Add hook execution
  .post(hashPassword, async (req, res, next) => {
    try {
      let publisher = new Publisher({ ...req.body, _id: undefined })
      publisher = await publisher.save()
      const links = createLinks.publisher(req, publisher)
      publisher = publisher.toObject()
      return res
        .status(201)
        .header('Location', links.self)
        .json({
          ...publisher,
          _links: links,
        })
    } catch (e) {
      next(e)
    }
  })

router
  .route('/:id')
  .all(allow('GET, PATCH, DELETE, HEAD, OPTIONS'))
  // Get publisher with :id
  .get(async (req, res, next) => {
    try {
      const publisher = await Publisher.findById(req.params.id, 'name')
        .populate('area', 'name population')
        .lean()
        .cache(60)
      if (!publisher) {
        return next()
      }
      return res.json({
        ...publisher,
        _links: createLinks.publisher(req, publisher),
      })
    } catch (e) {
      next(e)
    }
  })
  // Edit publisher with :id
  .patch(auth, hashPassword, async (req, res, next) => {
    try {
      const { id } = req.token
      if (req.params.id !== id) {
        throw new ForbiddenError()
      }
      let publisher = await Publisher.findById(req.params.id)
      if (!publisher) {
        return next()
      }
      const ignoreKeys = ['_id']
      Object.keys(req.body).forEach(key => {
        if (ignoreKeys.includes(key)) {
          return
        }
        publisher[key] = req.body[key]
      })
      await publisher.save()
      publisher = publisher.toObject()
      return res.json({
        ...publisher,
        _links: createLinks.publisher(req, publisher),
      })
    } catch (e) {
      next(e)
    }
  })
  // Delete publisher with id
  //TODO: Add check 403
  .delete(auth, async (req, res, next) => {
    try {
      const { id } = req.token
      if (req.params.id !== id) {
        throw new ForbiddenError()
      }
      const doc = await Publisher.findByIdAndDelete(id)
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
  // Get Private publisher details based on ID
  .get(auth, async (req, res, next) => {
    try {
      const { id } = req.token
      if (req.params.id !== id) {
        throw new ForbiddenError()
      }
      const publisher = await Publisher.findById(id, '-password -__v')
        .populate('area', 'name population')
        .lean()
        .cache(60)
      if (!publisher) {
        next()
      }
      return res.json({
        ...publisher,
        _links: createLinks.publisher(req, publisher),
      })
    } catch (e) {
      next(e)
    }
  })

router
  .route('/:id/ads')
  .all(allow('GET, HEAD, OPTIONS'))
  // Get all publishers
  .get(async (req, res, next) => {
    try {
      const ads = await Ad.find({ publisher: req.params.id })
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
