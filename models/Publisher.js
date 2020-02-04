const Sequelize = require('sequelize')
const db = require('../config/db')

const Publisher = db.define('publisher', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [1, 255],
        msg: 'Name must be between 1 and 255 characters',
      },
    },
  },
  email: {
    type: Sequelize.STRING,
    unique: { msg: 'Email must be unique' },
    allowNull: false,
    validate: {
      isEmail: { msg: 'Incorrect email format' },
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
})

module.exports = Publisher
