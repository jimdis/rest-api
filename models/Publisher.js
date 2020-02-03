const Sequelize = require('sequelize')
const db = require('../config/db')

const Publisher = db.define('publisher', {
  name: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
})

module.exports = Publisher
