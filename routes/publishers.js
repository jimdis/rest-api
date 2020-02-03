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
    console.log(publishers)
    return res.json(DUMMY)
  } catch (e) {
    console.error(e)
    next()
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
    console.error(e)
    next()
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
    console.error(e)
    next()
  }
})

// @route   POST /publishers
// @desc    Post new publisher
// @access  Private
router.post('/', async (req, res, next) => {
  try {
    console.log('POST BODY', req.body)
    return res.json(DUMMY)
  } catch (e) {
    console.error(e)
    next()
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
    console.error(e)
    next()
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
    console.error(e)
    next()
  }
})

module.exports = router
