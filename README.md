<h1 align='center'>FaceApp</h1>
<div align="center">
  <p>
    <a href="https://www.npmjs.com/package/faceapp"><img src="https://img.shields.io/npm/v/faceapp.svg?maxAge=3600" alt="NPM version" /></a>
    <a href="https://www.npmjs.com/package/faceapp"><img src="https://img.shields.io/npm/dt/faceapp.svg?maxAge=3600" alt="NPM downloads" /></a>
    <a href="https://travis-ci.org/lolPants/faceapp"><img src="https://travis-ci.org/lolPants/faceapp.svg" alt="Build status" /></a>
    <a href="https://david-dm.org/lolpants/faceapp"><img src="https://img.shields.io/david/lolpants/faceapp.svg?maxAge=3600" alt="Dependencies" /></a>
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
const faceApp = require('faceapp')
```

The function takes two parameters:
* `path: string` - Path to the image file you would like to process
* `filterID: string` - FaceApp Filter ID

### Known Filter IDs
* `no-filter`
* `smile`
* `smile_2`
* `hot`
* `old`
* `young`
* `female_2`
* `female`
* `male`

### Example
```js
// Import the module
const faceApp = require('faceapp')

// Fun
let image = await faceApp('path/to/image.png', 'smile_2')
```

## Thanks
* [FaceApp](https://www.faceapp.com/)
* [Superagent](https://visionmedia.github.io/superagent/)