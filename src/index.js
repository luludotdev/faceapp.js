// Local Dependencies
const { generateDeviceID, API_BASE_URL, API_USER_AGENT, TEST_IMAGE_URL } = require('./constants')

// Package Dependencies
const superagent = require('superagent')

/**
 * @typedef {Object} Filter
 * @property {string} id
 * @property {string} title
 * @property {boolean} cropped
 * @property {boolean} paid
 */

/**
 * @typedef {Object} AvailableFilters
 * @property {string} code
 * @property {string} deviceID
 * @property {Filter[]} filters
 */

/**
 * @param {string|Buffer} file Input File
 * @returns {Promise.<AvailableFilters>}
 */
const getAvailableFilters = async file => {
  const deviceID = generateDeviceID()

  const payload = {
    app_version: '3.2.1',
    device_id: deviceID,
    registration_id: deviceID,
    device_model: 'ZTE U950',
    lang_code: 'en-US',
    sandbox: 'False',
    system_version: '4.4.2',
    token_type: 'fcm',
  }

  await superagent.post('https://api.faceapp.io/api/v3.0/devices/register')
    .set('Content-Type', 'application/json')
    .set('User-Agent', API_USER_AGENT)
    .set('X-FaceApp-DeviceID', deviceID)
    .send(JSON.stringify(payload))

  const { body } = await superagent.post(`${API_BASE_URL}/api/v3.1/photos`)
    .set('User-Agent', API_USER_AGENT)
    .set('X-FaceApp-DeviceID', deviceID)
    .attach('file', file, 'image.png')

  const { code, objects } = body

  const mapFilters = x => {
    if (x.type === 'folder') return x.children.map(mapFilters)

    return {
      id: x.id,
      title: x.title,
      cropped: x.is_paid ? true : x.only_cropped || false,
      paid: x.is_paid,
    }
  }

  const flattenDeep = arr => arr.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), [])
  const filters = flattenDeep(objects.map(mapFilters))

  return { code, deviceID, filters }
}

/**
 * @param {AvailableFilters} args Input Object
 * @param {string} filterID Filter ID
 * @returns {Promise.<Buffer>}
 */
const getFilterImage = async (args, filterID = 'no-filter') => {
  const filterArr = args.filters.filter(o => o.id === filterID)

  if (filterArr.length === 0) {
    let filters = args.filters.map(o => o.id).join(', ')
    throw new Error(`Invalid Filter ID\nAvailable Filters: '${filters}'`)
  }

  const [filter] = filterArr
  const cropped = filter.cropped ? '1' : '0'
  const url = `${API_BASE_URL}/api/v3.1/photos/${args.code}/filters/${filter.id}?cropped=${cropped}`

  const { body } = await superagent.get(url)
    .set('User-Agent', API_USER_AGENT)
    .set('X-FaceApp-DeviceID', args.deviceID)

  return body
}

/**
 * Runs an image through the [FaceApp](https://www.faceapp.com/) Algorithm
 *
 * For a list of filters see `listFilters()`
 * @param {string|Buffer} path Path to Image OR Image Buffer
 * @param {string} [filterID] Filter ID
 * @returns {Promise.<Buffer>}
 * @example
 * let image = await faceApp('./path/to/image.png', 'female_2')
 */
const process = async (path, filterID) => {
  try {
    const arg = await getAvailableFilters(path)
    const img = await getFilterImage(arg, filterID)

    return img
  } catch (err) {
    if (err.status === 400) {
      /**
       * @type {string}
       */
      const code = err.response.body.err.code || ''

      // Known Error Codes
      if (code === 'photo_no_faces') throw new Error('No Faces found in Photo')
      else if (code === 'bad_filter_id') throw new Error('Invalid Filter ID')
      else throw err
    } else {
      throw err
    }
  }
}

/**
 * Lists all available filters
 * @param {boolean} [minimal=false] Whether to only return an array of filter IDs (no extra metadata)
 * @returns {Promise.<Filter[]>|Promise.<string[]>}
 */
const listFilters = async (minimal = false) => {
  const { body } = await superagent.get(TEST_IMAGE_URL)
  const allFilters = await getAvailableFilters(body)

  return minimal ?
    allFilters.filters.map(a => a.id) :
    allFilters.filters
}

module.exports = {
  process,
  listFilters,
}
