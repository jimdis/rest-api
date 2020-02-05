'use strict'
require('dotenv').config({ path: '../.env' })
const fs = require('fs')
const db = require('../config/db')
const Area = require('../models/Area')

const populateAreas = async () => {
  // connect to the database
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

populateAreas().then(() => {})
