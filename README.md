# 😎 FaceApp.js
[![NPM version](https://img.shields.io/npm/v/faceapp.svg?maxAge=3600)](https://www.npmjs.com/package/faceapp)
[![NPM downloads](https://img.shields.io/npm/dt/faceapp.svg?maxAge=3600)](https://www.npmjs.com/package/faceapp)
[![Build status](https://travis-ci.org/lolPants/faceapp.js.svg)](https://travis-ci.org/lolPants/faceapp.js)
[![Dependencies](https://img.shields.io/david/lolpants/faceapp.js.svg?maxAge=3600)](https://david-dm.org/lolpants/faceapp.js)

##### JavaScript API wrapper for the FaceApp tool for Android and iOS. Licensed under ISC License.

## 💾 Installation
The package is on the NPM registry as `faceapp`. Simply install it with your NPM client of choice.

## 🔧 Usage
First, import the module:
```js
const faceapp = require('faceapp')
```

The `process()` function takes two parameters:
* `path: string | file: Buffer` - Path to the image file you would like to process. Or a Buffer object representing an image.
* `filterID: string` - FaceApp Filter ID

### 📝 Example
```js
// Import the module
const faceapp = require('faceapp')

// Process the image (filepath)
let image = await faceapp.process('path/to/image.png', 'smile_2')

// Process the image (buffer)
// First we have to get a buffer
let { body } = await superagent.get('http://example.com/image.png')
let image = await faceapp.process(body, 'hot')
```

### 📜 Filter IDs
Known Filters: |  |  |  |  |
--- | --- | --- | --- | --- |
`no-filter` | `smile` | `smile_2` | `hot` | `old` |
`young` | `female_2` | `female` | `male` | `pan` |
`hitman` | `hollywood` | `heisenberg` | `impression` | `lion` |
`goatee` | `hipster` | `bangs` | `glasses` | `wave` |
`makeup` |

However, you can get an up-to-date list of all available filter IDs from the API directly using the `listFilters` function.

```js
let filters = await faceapp.listFilters()
// Returns an array of Filter objects

let filters = await faceapp.listFilters(true)
// Returns an array filter ID strings
```

## ❤ Thanks
* [FaceApp](https://www.faceapp.com/)
* [Superagent](https://visionmedia.github.io/superagent/)
