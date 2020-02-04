/**
 * API controllers for /ads route
 */

'use strict'
const express = require('express')
const router = express.Router()

const DUMMY = { message: 'ok' }

// @route   GET /ads
// @desc    Get all ads, possibly filtered with query string params publisher & area
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const publisher = req.query.publisher
    const area = req.query.area
    if (typeof publisher === 'object' && publisher.length) {
      console.log('ARRAY!', publisher)
    } else {
      console.log('STRING! or undefined', publisher)
    }
    return res.json(DUMMY)
  } catch (e) {
    next(e)
  }
})

// @route   GET /ads/:id
// @desc    Get ad based on ID
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    console.log('ID!', req.params.id)
    return res.json(DUMMY)
  } catch (e) {
    next(e)
  }
})

// @route   POST /ads
// @desc    Post new ad
// @access  Private
router.post('/', async (req, res, next) => {
  try {
    console.log('POST BODY', req.body)
    return res.json(DUMMY)
  } catch (e) {
    next(e)
  }
})

// @route   DELETE /ads/:id
// @desc    Deletes ad with id
// @access  Private
router.delete('/:id', async (req, res, next) => {
  try {
    console.log('DELETE ID', req.params.id)
    return res.json(DUMMY)
  } catch (e) {
    next(e)
  }
})

// @route   PATCH /ads/:id
// @desc    Patches ad with id
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
