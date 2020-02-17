'use strict'
require('dotenv').config()
const express = require('express')
const compression = require('compression')
const cors = require('cors')
const morgan = require('morgan')
const db = require('./config/db')
const logger = require('./config/logger')
const errors = require('./middleware/errors')
const allow = require('./middleware/allow').handleAllow
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

app.use(cors({ methods: [], preflightContinue: true }))

// Routes
app.use('/auth', require('./routes/auth'))
app.use('/ads', require('./routes/ads'))
app.use('/publishers', require('./routes/publishers'))
app.use('/areas', require('./routes/areas'))

// Handle OPTIONS and 405 allow headers
app.use(allow)
// Handle errors
app.use(errors)
// Handle 404
app.use((req, res) => {
  return res.status(404).json({ error: { code: 404, message: 'Not found' } })
})

const port = process.env.PORT || 5000

app.listen(port, () => logger.info(`API Server started on port ${port}`))
