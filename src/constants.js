// Package Dependencies
const randomstring = require('randomstring')

/**
 * Generate a random Device ID
 * @returns {string}
 */
const generateDeviceID = () => randomstring.generate(16)

module.exports = {
  TEST_IMAGE_URL: 'https://i.imgur.com/nVsxMNp.jpg',
  API_BASE_URL: 'https://node-03.faceapp.io',
  API_USER_AGENT: 'FaceApp/3.2.2 (Linux; Android 8.1)',
  generateDeviceID,
}
