'use strict'
require('dotenv').config()
const express = require('express')
const compression = require('compression')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const db = require('./config/db')
const logger = require('./config/logger')
const ValidationError = require('./errors/ValidationError')
const app = express()

// connect to the database
db.connect().catch(error => {
  logger.error(error)
  process.exit(1)
})

// Middle-ware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}
app.use(express.json())
app.use(
  express.urlencoded({
    extended: false,
  })
)
app.use(compression())

app.use(cors({ preflightContinue: true }))

// Routes
app.use('/auth', require('./routes/auth'))
app.use('/ads', require('./routes/ads'))
app.use('/publishers', require('./routes/publishers'))
app.use('/areas', require('./routes/areas'))

// Handle OPTIONS and 405
app.use((req, res, next) => {
  try {
    if (req.method === 'OPTIONS') {
      return res.status(204).send()
    }
    if (!res.get('Allow').includes(req.method)) {
      return res.status(405).send()
    }
    next()
  } catch (e) {
    next(e)
  }
})

// Error handler. Catches errors and sends 500 Internal Server Error for non-specific errors.
// Needs 4 arguments to work as middleware with error handling, even though last arg is not used...
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _) => {
  if (err.statusCode) {
    return res
      .status(err.statusCode)
      .json({ error: { code: err.statusCode, message: err.message } })
  }
  if (
    err instanceof mongoose.Error.ValidationError ||
    err instanceof ValidationError
  ) {
    res.status(422).json({
      error: {
        code: 'ValidationError',
        message: err.message,
      },
    })
  }
  logger.error(err)
  res.status(500).json({
    error: {
      code: 500,
      message: err.message,
    },
  })
})

// Handle 404
app.use((req, res) => {
  return res.status(404).json({ error: { code: 404, message: 'Not found' } })
})

const port = process.env.PORT || 5000

app.listen(port, () => logger.info(`API Server started on port ${port}`))
