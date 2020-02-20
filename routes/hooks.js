/**
 * API controllers for /publishers route
 */

'use strict'
const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const allow = require('../middleware/allow').addAllow
const Hook = require('../models/Publisher')
const ForbiddenError = require('../errors/ForbiddenError')
const createLinks = require('../lib/createLinks')

router
  .route('/')
  .all(allow('GET, POST, HEAD, OPTIONS'))
  // Get all hooks
  .get(auth, async (req, res, next) => {
    try {
      const { id } = req.token

      const hooks = await Hook.find({ publisher: id }, '-__v')
        .lean()
        .cache(60)
      return res.json({
        items: hooks.map(h => {
          return {
            ...h,
            _links: createLinks.hook(req, h),
          }
        }),
      })
    } catch (e) {
      next(e)
    }
  })
  // Create new hook
  .post(auth, async (req, res, next) => {
    try {
      const { id } = req.token
      const { action, callback } = req.body
      let hook = new Hook({ action, callback, publisher: id })
      hook = await hook.save()
      const links = createLinks(req, id)
      hook = hook.toObject()
      return res
        .status(201)
        .header('Location', links.self)
        .json({
          ...hook,
          _links: links,
        })
    } catch (e) {
      next(e)
    }
  })

router
  .route('/:id')
  .all(allow('GET, PATCH, DELETE, HEAD, OPTIONS'))
  // Get hook with :id
  .get(auth, async (req, res, next) => {
    try {
      const publisherId = req.token.id
      const hook = await Hook.findById(req.params.id, '-__v')
        .lean()
        .cache(60)
      if (!hook) {
        return next()
      }
      if (hook.publisher !== publisherId) {
        throw new ForbiddenError()
      }
      return res.json({
        ...hook,
        _links: createLinks.hook(req, hook),
      })
    } catch (e) {
      next(e)
    }
  })
  // Edit hook with :id
  .patch(auth, async (req, res, next) => {
    try {
      const publisherId = req.token.id

      let hook = await Hook.findById(req.params.id, '-__v')
      if (!hook) {
        return next()
      }
      if (hook.publisher !== publisherId) {
        throw new ForbiddenError()
      }
      const ignoreKeys = ['_id publisher']
      Object.keys(req.body).forEach(key => {
        if (ignoreKeys.includes(key)) {
          return
        }
        hook[key] = req.body[key]
      })
      await hook.save()
      hook = hook.toObject()
      return res.json({
        ...hook,
        _links: createLinks.hook(req, hook),
      })
    } catch (e) {
      next(e)
    }
  })
  // Delete hook with id
  .delete(auth, async (req, res, next) => {
    try {
      const publisherId = req.token.id
      const hook = await Hook.findById(req.params.id)
      if (!hook) {
        return next()
      }
      if (hook.publisher !== publisherId) {
        throw new ForbiddenError()
      }
      await hook.remove()
      return res.status(204).send()
    } catch (e) {
      next(e)
    }
  })

module.exports = router
