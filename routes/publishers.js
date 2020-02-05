/**
 * API controllers for /publishers route
 */

'use strict'
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passwordValidator = require('password-validator')
const logger = require('../config/logger')
const Publisher = require('../models/Publisher')

const passwordSchema = new passwordValidator()
passwordSchema.is().min(8)
passwordSchema.is().max(100)
passwordSchema.has().uppercase()
passwordSchema.has().lowercase()
passwordSchema.has().digits()

const DUMMY = { message: 'ok' }

// @route   GET /publishers
// @desc    Get all publishers, possibly filtered with query string param area
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const area = req.query.area
    console.log(typeof area)
    if (typeof area === 'object' && area.length) {
      console.log('ARRAY!', area)
    } else {
      console.log('STRING or undefined', area)
    }
    const publishers = await Publisher.find()
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
    const publisher = await Publisher.findById(req.params.id, '_id name')
    if (!publisher) {
      next()
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
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(422).json({
        msg: 'Missing one or several required fields',
      })
    }
    if (!passwordSchema.validate(password)) {
      return res.status(422).json({
        msg:
          'Password must be at least 8 chars, max 100 chars, one lowercase, one uppercase, one digit.',
      })
    }
    let publisher = new Publisher({ name, email, password })
    publisher = await publisher.save()

    return res.status(201).json({
      msg: 'Successfully created new publisher',
      fields: {
        _id: publisher._id,
        name: publisher.name,
        email: publisher.email,
      },
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
    console.log('DELETE ID', req.params.id)
    return res.json(DUMMY)
  } catch (e) {
    next(e)
  }
})

// @route   PATCH /publishers/:id
// @desc    Patches publishers with id
// @access  Private
router.patch('/:id', async (req, res, next) => {
  try {
    console.log('PATCH ID', req.params.id)
    return res.json(DUMMY)
  } catch (e) {
    next(e)
  }
})

module.exports = router
