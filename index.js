'use strict'
require('dotenv').config()
const express = require('express')
const compression = require('compression')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const db = require('./config/db')
const logger = require('./config/logger')
const validationError = require('./config/constants').VALIDATION_ERROR
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
app.use(cors())

// Routes
app.use('/ads', require('./routes/ads'))
app.use('/publishers', require('./routes/publishers'))
app.use('/areas', require('./routes/areas'))

// Error handler. Catches errors and sends 500 Internal Server Error for non-specific errors.
// Needs 4 arguments to work as middleware with error handling, even though last arg is not used...
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _) => {
  if (err.statusCode) {
    return res.status(err.statusCode).json({ msg: err.message })
  }
  if (
    err instanceof mongoose.Error.ValidationError ||
    err.name === validationError
  ) {
    res.status(422).json({ msg: err.message })
  }
  logger.error(err)
  res.status(500).json({
    msg: err.clientMsg || 'Oops, something went wrong..',
  })
})

// Custom 404 in JSON
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

const port = process.env.PORT || 5000

app.listen(port, () => logger.info(`API Server started on port ${port}`))
