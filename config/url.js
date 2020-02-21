'use strict'

let BASE_URL

if (process.env.NODE_ENV !== 'production') {
  BASE_URL = 'http://localhost:5000'
} else {
  BASE_URL = 'https://api.weo.se'
}

module.exports = BASE_URL
