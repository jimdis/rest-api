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
   * @param adId id of ad
   * @param publisherId id of publisher
   */
  ad: (req, adId, publisherId) => {
    const base = getBaseUrl(req)
    const self = base + '/ads/' + adId
    const publisher = base + '/publishers/' + publisherId
    return {
      self,
      publisher,
    }
  },
}
