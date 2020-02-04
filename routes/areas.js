/**
 * API controllers for /areas route
 */

'use strict'
const express = require('express')
const router = express.Router()

const DUMMY = { message: 'ok' }

// @route   GET /areas
// @desc    Get all areas
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    return res.json(DUMMY)
  } catch (e) {
    next(e)
  }
})

module.exports = router
