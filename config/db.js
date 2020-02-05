'use strict'
const mongoose = require('mongoose')
const logger = require('./logger')
require('../models/Publisher')
require('../models/Area')

/**
 * Establishes a connection to a database.
 *
 * @returns {Promise}
 */
module.exports.connect = async () => {
  // Bind connection to events (to get notifications).
  mongoose.connection.on('connected', () =>
    console.log('Mongoose connection is open.')
  )
  // Removed below because it prevented error from being thrown on connect.
  // mongoose.connection.on('error', err =>
  //   console.error(`Mongoose connection error has occurred: ${err}`)
  // )
  mongoose.connection.on('disconnected', () =>
    logger.info('Mongoose connection is disconnected.')
  )

  // If the Node process ends, close the Mongoose connection.
  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      logger.info(
        'Mongoose connection is disconnected due to application termination.'
      )
      process.exit(0)
    })
  })

  let dbConnectionString

  if (process.env.NODE_ENV === 'production') {
    dbConnectionString = process.env.DB_PROD
  } else {
    dbConnectionString = process.env.DB_TEST
  }

  // Check that .env file with key exists.
  if (!dbConnectionString)
    throw new Error('You need an .env file with the database connection string')

  // Connect to the server.
  return mongoose.connect(dbConnectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
}
