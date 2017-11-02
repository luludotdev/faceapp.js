<h1 align='center'>FaceApp</h1>
<div align="center">
  <p>
    <a href="https://www.npmjs.com/package/faceapp"><img src="https://img.shields.io/npm/v/faceapp.svg?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/faceapp"><img src="https://img.shields.io/npm/dt/faceapp.svg?maxAge=3600" alt="NPM downloads" /></a>
    <a href="https://travis-ci.org/lolPants/faceapp.js"><img src="https://travis-ci.org/lolPants/faceapp.js.svg" alt="Build status" /></a>
    <a href="https://david-dm.org/lolpants/faceapp.js"><img src="https://img.shields.io/david/lolpants/faceapp.js.svg?maxAge=3600" alt="Dependencies" /></a>
  </p>
</div>

<h5 align='center'>JavaScript API wrapper for the FaceApp tool for Android and iOS. Licensed under ISC License.</h5>

<h2 align='center'><i>NOTE: Node.js 8 or higher is REQUIRED</i></h2>

## Installation
Using NPM: `npm install faceapp`  
Using Yarn: `yarn add faceapp`

## Usage
First, import the module
```js
const faceapp = require('faceapp')
```

The function takes two parameters:
* `path: string | file: Buffer` - Path to the image file you would like to process. Or a Buffer object representing an image.
* `filterID: string` - FaceApp Filter ID

### Example
```js
// Import the module
const faceapp = require('faceapp')

// Process the image (filepath)
let image = await faceapp.process('path/to/image.png', 'smile_2')

// Process the image (buffer)
// First we have to get a buffer
let res = await superagent.get('http://example.com/image.png')
let image = await faceapp.process(res.body, 'hot')
```

### Filter IDs
There are some known Filter IDs:
* `no-filter`
* `smile`
* `smile_2`
* `hot`
* `old`
* `young`
* `female_2`
* `female`
* `male`
* `pan`
* `hitman`
* `hollywood`
* `heisenberg`
* `impression`
* `lion`
* `goatee`
* `hipster`
* `bangs`
* `glasses`
* `wave`
* `makeup`

However, you can get an up-to-date list of all available filter IDs from the API directly using the `listFilters` function.

```js
let filters = await faceapp.listFilters()
// Returns an array of Filter objects

let filters = await faceapp.listFilters(true)
// Returns an array filter ID strings
```

## Thanks
* [FaceApp](https://www.faceapp.com/)
* [Superagent](https://visionmedia.github.io/superagent/)
