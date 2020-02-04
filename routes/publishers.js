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
    const { name, email } = req.body
    const publisher = await Publisher.create({
      name,
      email,
    })
    return res.json(publisher)
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
