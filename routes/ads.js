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
const createLinks = require('../lib/createLinks')

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
      let limit = parseInt(req.query.$limit)
      if (!limit || limit > 200) {
        limit = 200
      }
      const skip = parseInt(req.query.$skip) || null
      const count = await Ad.count({ ...match })
      const ads = await Ad.find({ ...match }, '-__v -createdAt -updatedAt')
        .sort('updatedAt desc')
        .skip(skip)
        .limit(limit)
        .lean()
        .cache(60)

      let newUrl
      newUrl = req.originalUrl.replace(
        `$limit=${req.query.$limit}`,
        `$limit=${limit}`
      )
      const skipExists = req.originalUrl.indexOf('$skip') !== -1
      if (skipExists) {
        console.log(newUrl)
        newUrl = newUrl.replace(
          `$skip=${req.query.$skip}`,
          `$skip=${skip + limit}`
        )
      } else {
        const separator = newUrl.indexOf('?') !== -1 ? '&' : '?'
        newUrl = `${newUrl}${separator}$skip=${skip + limit}`
      }
      console.log(newUrl)

      return res.json({
        totalCount: count,
        itemCount: count > limit ? limit : count,
        next:
          count > limit
            ? `${req.protocol}://${req.get('host')}${newUrl}`
            : undefined,
        items: ads.map(ad => ({
          ...ad,
          _links: createLinks.ad(req, ad),
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
      ad = ad.toObject()
      const links = createLinks.ad(req, ad)
      return res
        .status(201)
        .header('Location', links.self)
        .json({ ...ad, _links: links })
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
        _links: createLinks.ad(req, ad),
      })
    } catch (e) {
      next(e)
    }
  })
  // Edit ad with :id
  .patch(auth, async (req, res, next) => {
    try {
      const publisherId = req.token.id
      let ad = await Ad.findById(req.params.id)
      if (!ad) {
        return next()
      }
      if (ad.publisher !== publisherId) {
        throw new ForbiddenError()
      }
      const ignoreKeys = ['_id', 'publisher', 'area']
      Object.keys(req.body).forEach(key => {
        if (ignoreKeys.includes(key)) {
          return
        }
        ad[key] = req.body[key]
      })
      ad = await ad.save()
      ad = ad.toObject()
      return res.json({ ...ad, _links: createLinks.ad(req, ad) })
    } catch (e) {
      next(e)
    }
  })
  // Delete ad with id
  .delete(auth, async (req, res, next) => {
    try {
      const publisherId = req.token.id
      const ad = await Ad.findById(req.params.id)
      if (!ad) {
        return next()
      }
      if (ad.publisher !== publisherId) {
        throw new ForbiddenError()
      }
      await ad.remove()
      return res.status(204).send()
    } catch (e) {
      next(e)
    }
  })

module.exports = router
