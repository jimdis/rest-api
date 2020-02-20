'use strict'
const axios = require('axios').default
const Hook = require('../models/Hook')

/**
 * Sends payload as JSON via POST all subscribers with
 * @param {String} action Type of action ['newAd' or 'newPublisher']
 * @param {Object} payload Payload to send
 */
module.exports = async (action, payload) => {
  const hooks = await Hook.find()
  const promises = []
  hooks
    .filter(hook => hook.action === action)
    .forEach(hook => promises.push(axios.post(hook.callback, payload)))
  await Promise.all(promises)
}
