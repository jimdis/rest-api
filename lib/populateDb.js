'use strict'
require('dotenv').config({ path: '../.env' })
const fs = require('fs')
const db = require('../config/db')
const Area = require('../models/Area')
const Publisher = require('../models/Publisher')
const Ad = require('../models/Ad')

const populateAreas = async () => {
  try {
    await db.connect()
    let data = fs.readFileSync('./data/areas.json')
    data = JSON.parse(data)
    let promises = []
    for (let item of data) {
      const arr = Object.values(item)
      const _id = arr[1]
      const name = arr[0]
      const population = parseInt(arr[2].replace(/\s+/, ''))
      const area = new Area({ _id, name, population })
      promises.push(area.save())
    }
    const resolved = await Promise.all(promises)
    console.log(`Saved ${resolved.length} documents`)
  } catch (e) {
    console.error(e)
  }
}

const populatePublishers = async count => {
  try {
    await db.connect()
    const areas = await Area.find()
    let saveCount = 0
    for (let i = 1; i <= count; i++) {
      const name = `Publisher #${i}`
      const email = `publisher${i}@test.com`
      const password = 'Abc12345'
      const area = areas[Math.floor(Math.random() * areas.length)]._id
      const publisher = new Publisher({ name, email, password, area })
      await publisher.save()
      saveCount++
    }
    console.log(`Saved ${saveCount} new documents`)
  } catch (e) {
    console.error(e)
  }
}

const populateAds = async count => {
  try {
    await db.connect()
    const publishers = await Publisher.find().lean()
    const promises = []
    for (let i = 1; i <= count; i++) {
      const publisher =
        publishers[Math.floor(Math.random() * publishers.length)]
      const daysValid = Math.floor(Math.random() * 30)
      const ad = new Ad({
        publisher: publisher._id,
        area: publisher.area,
        title: `Ad title #${i}`,
        description: `Ad description from ${publisher.name}`,
        body: `Come buy some awesome stuff from ${publisher.name}. Low low bargain prices valid only for ${daysValid} days! `,
        validTo: `2020-03-${(1 + daysValid).toLocaleString('sv', {
          minimumIntegerDigits: 2,
        })}`,
        imageUrl: 'https://picsum.photos/200.jpg',
      })
      promises.push(ad.save())
    }
    const saved = await Promise.all(promises)
    console.log(`Saved ${saved.length} new documents`)
  } catch (e) {
    console.error(e)
  }
}

populateAds(10000).then(() => {
  console.log('done')
  process.exit(0)
})
