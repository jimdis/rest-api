'use strict'
require('dotenv').config({ path: '../.env' })
const fs = require('fs')
const db = require('../config/db')
const Area = require('../models/Area')
const Publisher = require('../models/Publisher')

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

populatePublishers(1000).then(() => {
  console.log('done')
  process.exit(0)
})
