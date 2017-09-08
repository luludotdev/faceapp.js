// Local Dependencies
const constants = require('./constants')

// Package Dependencies
const superagent = require('superagent')

/**
 * @typedef {Object} Filter
 * @property {string} id
 * @property {string} title
 * @property {boolean} cropped
 */

/**
 * @typedef {Object} AvailableFilters
 * @property {string} code
 * @property {string} deviceID
 * @property {Filter[]} filters
 */

/**
 * @param {string} path Input File
 * @returns {Promise.<AvailableFilters>}
 */
const getAvailableFilters = async path => {
  let deviceID = constants.generateDeviceID()
  try {
    let res = await superagent.post(`${constants.API_BASE_URL}/api/v2.6/photos`)
      .set('User-Agent', constants.API_USER_AGENT)
      .set('X-FaceApp-DeviceID', deviceID)
      .attach('file', path)

    let code = res.body.code
    let filters = res.body.filters
      .filter(o => o.is_paid === false && o.group === '0')
      .map(o => ({
        id: o.id,
        title: o.title,
        cropped: o.only_cropped,
      }))

    return { code, deviceID, filters }
  } catch (err) {
    throw err
  }
}

/**
 * 
 * @param {AvailableFilters} args Input Object
 * @param {string} filterID Filter ID
 * @returns {Promise.<Buffer>}
 */
const getFilterImage = async (args, filterID = 'no-filter') => {
  let filterArr = args.filters.filter(o => o.id === filterID)
  if (filterArr.length === 0) {
    let filters = args.filters.map(o => o.id).join(', ')
    throw new Error(`Invalid Filter ID\nAvailable Filters: '${filters}'`)
  }

  let filter = filterArr[0]
  let cropped = filter.cropped ? '1' : '0'
  let url = `${constants.API_BASE_URL}/api/v2.6/photos/${args.code}/filters/${filter.id}?cropped=${cropped}`

  try {
    let res = await superagent.get(url)
      .set('User-Agent', constants.API_USER_AGENT)
      .set('X-FaceApp-DeviceID', args.deviceID)

    return res.body
  } catch (err) {
    throw err
  }
}

/**
 * Runs an image through the [FaceApp](https://www.faceapp.com/) Algorithm
 * 
 * Known Filter IDs:
 * * no-filter
 * * smile
 * * smile_2
 * * hot
 * * old
 * * young
 * * female_2
 * * female
 * * male
 * * pan
 * * hitman
 * @param {string} path Image Path
 * @param {string} [filterID] Filter ID
 * @returns {Promise.<Buffer>}
 * @example
 * let image = await faceApp('./path/to/image.png', 'female_2')
 */
const faceapp = async (path, filterID) => {
  try {
    let arg = await getAvailableFilters(path)
    let img = await getFilterImage(arg, filterID)
    return img
  } catch (err) {
    if (err.status === 400) {
      /**
       * @type {string}
       */
      let code = err.response.body.err.code || ''
      // Known Error Codes
      if (code === 'photo_no_faces') throw new Error('No Faces found in Photo')
      else if (code === 'bad_filter_id') throw new Error('Invalid Filter ID')
      else throw err
    } else {
      throw err
    }
  }
}

module.exports = {
  process: faceapp,
}
