// Package Dependencies
const randomstring = require('randomstring')

/**
 * Generate a random Device ID
 * @returns {string}
 */
const generateDeviceID = () => randomstring.generate(16)

module.exports = {
  TEST_IMAGE_URL: 'https://i.imgur.com/nVsxMNp.jpg',
  API_BASE_URL: 'https://phv3f.faceapp.io:443',
  API_USER_AGENT: 'FaceApp/3.2.1 (Linux; Android 4.4)',
  generateDeviceID,
}
