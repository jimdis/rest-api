const Sequelize = require('sequelize')
const db = require('../config/db')

const Publisher = db.define('publisher', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    unique: { msg: 'Email must be unique' },
    allowNull: false,
  },
})

module.exports = Publisher
