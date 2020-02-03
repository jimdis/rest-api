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
    return res.json(DUMMY)
  } catch (e) {
    console.error(e)
    next()
  }
})

// @route   GET /ads/:id
// @desc    Get ad based on ID
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    return res.json(DUMMY)
  } catch (e) {
    console.error(e)
    next()
  }
})

// @route   POST /ads
// @desc    Post new ad
// @access  Private
router.post('/', async (req, res, next) => {
  try {
    return res.json(DUMMY)
  } catch (e) {
    console.error(e)
    next()
  }
})

// @route   DELETE /ads/:id
// @desc    Deletes ad with id
// @access  Private
router.delete('/:id', async (req, res, next) => {
  try {
    return res.json(DUMMY)
  } catch (e) {
    console.error(e)
    next()
  }
})

// @route   PATCH /ads/:id
// @desc    Patches ad with id
// @access  Private
router.patch('/:id', async (req, res, next) => {
  try {
    return res.json(DUMMY)
  } catch (e) {
    console.error(e)
    next()
  }
})

module.exports = router
