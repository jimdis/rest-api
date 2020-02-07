/**
 * API controllers for /publishers route
 */

'use strict'
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')
const Publisher = require('../models/Publisher')
const ValidationError = require('../errors/ValidationError')
const jwt = require('../lib/jwt')

// @route   GET /publishers
// @desc    Get all publishers, possibly filtered with query params area & id
// @access  Public
router.get('/', async (req, res, next) => {
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

// @route   GET /publishers/:id
// @desc    Get publisher based on ID
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const publisher = await Publisher.findById(req.params.id, 'name').populate(
      'area',
      'name population'
    )
    if (!publisher) {
      return next()
    }
    return res.json(publisher)
  } catch (e) {
    next(e)
  }
})

// @route   POST /publishers
// @desc    Post new publisher
// @access  Public
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

// @route   POST /publishers/login
// @desc    Post login credentials
// @access  Public
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      next(new ValidationError('email and password fields must be provided'))
    }
    const publisher = await Publisher.findOne({ email })
    console.log(publisher)
    const passwordMatch =
      publisher && (await bcrypt.compare(password, publisher.password))
    if (!passwordMatch) {
      return res
        .status(403)
        .json({ msg: 'Email/password combination is incorrect' })
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
        access_token: token,
        token_type: 'bearer',
        expires_in: 3600,
      })
  } catch (e) {
    next(e)
  }
})

// @route   GET /publishers/:id/details
// @desc    Get Protected publisher details based on ID
// @access  Protected
router.get('/:id/details', auth, async (req, res, next) => {
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

// @route   DELETE /publisher/:id
// @desc    Deletes publisher with id
// @access  Protected
router.delete('/:id', auth, async (req, res, next) => {
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

// @route   PATCH /publishers/:id
// @desc    Patches publishers with id
// @access  Protected
router.patch('/:id', auth, async (req, res, next) => {
  try {
    const { name, area, email, password } = req.body
    let publisher = await Publisher.findById(req.token.id)
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
