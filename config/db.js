'use strict'

const Sequelize = require('sequelize')

const db = new Sequelize('postgres://postgres:postgres@localhost:5432/ads')

module.exports = db
