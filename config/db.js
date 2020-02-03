'use strict'

const Sequelize = require('sequelize').Sequelize

const db = new Sequelize('postgres://postgres:postgres@localhost:5432/ads')

module.exports = db
