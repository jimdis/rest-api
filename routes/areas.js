/**
 * API controllers for /areas route
 */

'use strict'
const express = require('express')
const router = express.Router()
const Area = require('../models/Area')

// @route   GET /areas
// @desc    Get all areas
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const areas = await Area.find({}, 'name population')
    return res.json({ items: areas })
  } catch (e) {
    next(e)
  }
})

module.exports = router
