const getBaseUrl = req => req.protocol + '://' + req.get('host')

module.exports = {
  /**
   * Create links object for publisher
   * @param req Express Request object
   * @param publisher publisher Document instance or object
   */
  publisher: (req, publisher) => {
    const base = getBaseUrl(req)
    const self = base + '/publishers/' + publisher._id
    const ads = self + '/ads'
    const area = base + '/areas/' + (publisher.area._id || publisher.area)
    return {
      self,
      ads,
      area,
    }
  },
  /**
   * Create links object for ad
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
  /**
   * Create links object for area
   * @param req Express Request object
   * @param area area Document instance or object
   */
  area: (req, area) => {
    const base = getBaseUrl(req)
    const self = base + '/areas/' + area._id
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
   * @param req Express Request object
   * @param hook hook Document instance or object
   */
  hook: (req, hook) => {
    const base = getBaseUrl(req)
    const self = base + '/hooks/' + hook._id
    const publisher = base + '/publishers/' + hook.publisher
    return {
      self,
      publisher,
    }
  },
}
