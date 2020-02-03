'use strict'
const express = require('express')
const compression = require('compression')
const cors = require('cors')
const morgan = require('morgan')

const app = express()

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

// Error handler. Catches errors and sends 500 Internal Server Error.
// Needs 4 arguments to work as middleware with error handling, even though last arg is not used...
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _) => {
  console.error(err)
  res.status(500).json({
    msg: err.clientMsg || 'Något gick fel...',
  })
})

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`API Server started on port ${port}`))
