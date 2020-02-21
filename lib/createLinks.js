'use strict'

const BASE_URL = require('../config/url')

module.exports = {
  /**
   * Create links object for publisher
   * @param publisher publisher Document instance or object
   */
  publisher: publisher => {
    const self = BASE_URL + '/publishers/' + publisher._id
    const ads = self + '/ads'
    const area = BASE_URL + '/areas/' + (publisher.area._id || publisher.area)
    return {
      self,
      ads,
      area,
    }
  },
  /**
   * Create links object for ad
   * @param ad ad Document instance or object
   */
  ad: ad => {
    const self = BASE_URL + '/ads/' + ad._id
    const publisher =
      BASE_URL + '/publishers/' + (ad.publisher._id || ad.publisher)
    const area = BASE_URL + '/areas/' + (ad.area._id || ad.area)
    return {
      self,
      publisher,
      area,
    }
  },
  /**
   * Create links object for area
   * @param area area Document instance or object
   */
  area: area => {
    const self = BASE_URL + '/areas/' + area._id
    const publishers = self + '/publishers'
    const ads = self + '/ads'
    return {
      self,
      publishers,
      ads,
    }
  },
  /**
   * Create links object for hook
   * @param hook hook Document instance or object
   */
  hook: hook => {
    const self = BASE_URL + '/hooks/' + hook._id
    const publisher = BASE_URL + '/publishers/' + hook.publisher
    return {
      self,
      publisher,
    }
  },
}
