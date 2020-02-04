/**
 * API controllers for /publishers route
 */

'use strict'
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passwordValidator = require('password-validator')
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
    const publishers = await Publisher.findAll()
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
    console.log('ID!', req.params.id)
    return res.json(DUMMY)
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
    const passwordHash = await bcrypt.hash(password, 12)

    const publisher = await Publisher.create({
      name,
      email,
      password: passwordHash,
    })
    return res.json({
      msg: 'Successfully created new publisher',
      fields: {
        id: publisher.id,
        name: publisher.name,
        email: publisher.email,
      },
    })
  } catch (e) {
    console.log('STATUSCODE!', e.statusCode)
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
