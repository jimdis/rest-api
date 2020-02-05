/**
 * API controllers for /publishers route
 */

'use strict'
const express = require('express')
const router = express.Router()
const Publisher = require('../models/Publisher')

const DUMMY = { message: 'ok' }

// @route   GET /publishers
// @desc    Get all publishers, possibly filtered with query string param area
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const match = {}
    if (req.query.area) {
      match.area = { $in: req.query.area }
    }
    if (req.query.publisher) {
      match._id = { $in: req.query.publisher }
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

// @route   GET /publishers/:id
// @desc    Get publisher based on ID
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const publisher = await Publisher.findById(req.params.id, 'name')
    if (!publisher) {
      return next()
    }
    return res.json(publisher)
  } catch (e) {
    next(e)
  }
})

// @route   GET /publishers/:id/details
// @desc    Get private publisher details based on ID
// @access  Private
router.get('/:id/details', async (req, res, next) => {
  try {
    console.log('ID!', req.params.id)
    return res.json(DUMMY)
  } catch (e) {
    next(e)
  }
})

// @route   POST /publishers
// @desc    Post new publisher
// @access  Private
router.post('/', async (req, res, next) => {
  try {
    const { name, area, email, password } = req.body
    let publisher = new Publisher({ name, area, email, password })
    publisher = await publisher.save()
    return res.status(201).json({
      _id: publisher._id,
      name: publisher.name,
      email: publisher.email,
    })
  } catch (e) {
    next(e)
  }
})

// @route   DELETE /publisher/:id
// @desc    Deletes publisher with id
// @access  Private
router.delete('/:id', async (req, res, next) => {
  try {
    const doc = await Publisher.findByIdAndDelete(req.params.id)
    if (!doc) {
      return next()
    }
    return res.status(204).send()
  } catch (e) {
    next(e)
  }
})

// @route   PATCH /publishers/:id
// @desc    Patches publishers with id
// @access  Private
router.patch('/:id', async (req, res, next) => {
  try {
    const { name, area, email, password } = req.body
    let publisher = await Publisher.findById(req.params.id)
    if (!publisher) {
      return next()
    }
    publisher.name = name || publisher.name
    publisher.area = area || publisher.area
    publisher.email = email || publisher.email
    publisher.password = password || publisher.password
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

module.exports = router
