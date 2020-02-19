'use strict'
const cachegoose = require('cachegoose')
const mongoose = require('mongoose')
const logger = require('./logger')
require('../models/Publisher')
require('../models/Area')

cachegoose(mongoose)

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
  mongoose.set('debug', true)

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

  const dbConnectionString = process.env.DB_TEST

  // if (process.env.NODE_ENV === 'production') {
  //   dbConnectionString = process.env.DB_PROD
  // } else {
  //   dbConnectionString = process.env.DB_TEST
  // }

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
