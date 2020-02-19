const getBaseUrl = req => req.protocol + '://' + req.get('host')

module.exports = {
  /**
   * Create links object for self and ads
   * @param req Express Request object
   * @param id id of publisher
   */
  publisher: (req, id) => {
    const self = getBaseUrl(req) + '/publishers/' + id
    return {
      self,
      ads: self + '/ads',
    }
  },
  /**
   * Create links object for self and publisher
   * @param req Express Request object
   * @param ad ad Document instance or object
   */
  ad: (req, ad) => {
    const base = getBaseUrl(req)
    const self = base + '/ads/' + ad._id
    const publisher = base + '/publishers/' + (ad.publisher._id || ad.publisher)
    const area = base + '/areas/' + (ad.area._id || ad.area)
    return {
      self,
      publisher,
      area,
    }
  },
}
