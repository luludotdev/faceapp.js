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
 * @property {Filter[]} filters
 */

/**
 * @param {string} path Input File
 * @returns {AvailableFilters}
 */
const getAvailableFilters = async path => {
  let DEVICE_ID = constants.generateDeviceID()
  try {
    let res = await superagent.post(`${constants.API_BASE_URL}/api/v2.6/photos`)
      .set('User-Agent', constants.API_USER_AGENT)
      .set('X-FaceApp-DeviceID', DEVICE_ID)
      .attach('file', path)

    let code = res.body.code
    let filters = res.body.filters
      .filter(o => o.is_paid === false)
      .map(o => ({
        id: o.id,
        title: o.title,
        cropped: o.only_cropped,
      }))

    return { code, filters }
  } catch (err) {
    throw err
  }
}

module.exports = { getAvailableFilters }
