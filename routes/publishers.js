/**
 * API controllers for /publishers route
 */

'use strict'
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const allow = require('../middleware/allow')
const Publisher = require('../models/Publisher')

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
      const publishers = await Publisher.find({ ...match }, 'name').populate(
        'area',
        'name population'
      )
      return res.json({ items: publishers })
    } catch (e) {
      next(e)
    }
  })
  // Create new publisher
  .post(async (req, res, next) => {
    try {
      const { name, area, email, password } = req.body
      let publisher = new Publisher({ name, area, email, password })
      publisher = await publisher.save()
      const url = req.protocol + '://' + req.get('host') + req.originalUrl
      return res
        .status(201)
        .header('Location', `${url}/${publisher._id}`)
        .json({
          _id: publisher._id,
          name: publisher.name,
          email: publisher.email,
        })
    } catch (e) {
      next(e)
    }
  })

router
  .route('/:id')
  .all(allow('GET, PUT, DELETE, HEAD, OPTIONS'))
  // Get publisher with :id
  .get(async (req, res, next) => {
    try {
      const publisher = await Publisher.findById(
        req.params.id,
        'name'
      ).populate('area', 'name population')
      if (!publisher) {
        return next()
      }
      return res.json(publisher)
    } catch (e) {
      next(e)
    }
  })
  // Update publisher with :id
  .put(auth, async (req, res, next) => {
    try {
      const { name, area, email, password } = req.body
      let publisher = await Publisher.findById(req.token.id)
      if (!publisher) {
        return next()
      }
      publisher.name = name
      publisher.area = area
      publisher.email = email
      publisher.password = password
      publisher = await publisher.save()
      return res.json({
        _id: publisher._id,
        name: publisher.name,
        email: publisher.email,
        area: publisher.area,
      })
    } catch (e) {
      next(e)
    }
  })
  // Delete publisher with id
  .delete(auth, async (req, res, next) => {
    try {
      const doc = await Publisher.findByIdAndDelete(req.token.id)
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
      const publisher = await Publisher.findById(
        req.token.id,
        '-password -__v'
      ).populate('area', 'name population')
      if (!publisher) {
        next()
      }
      return res.json(publisher)
    } catch (e) {
      next(e)
    }
  })

module.exports = router
