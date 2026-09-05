# @pkboom/opencv-nodejs

[![NPM Version](https://img.shields.io/npm/v/@pkboom/opencv-nodejs.svg?style=flat)](https://www.npmjs.org/package/@pkboom/opencv-nodejs)

## Getting started

opencv-nodejs is zero-configuration: install OpenCV from your platform's package manager, then install this module — that's it. There is no source build of OpenCV, no Docker image, and nothing to configure in `package.json`.

```bash
# macOS (OpenCV 5)
brew install opencv

# macOS (OpenCV 4)
brew install opencv@4

# Debian / Ubuntu (OpenCV 4.x)
sudo apt install libopencv-dev

# Windows (OpenCV 4.x)
choco install opencv
```

```bash
npm install --save @pkboom/opencv-nodejs
```

`npm install` builds the native addon automatically against whichever OpenCV it finds. See [How to install](#how-to-install) for the full details, requirements, and troubleshooting.

![opencv-nodejs](https://user-images.githubusercontent.com/31125521/37272906-67187fdc-25d8-11e8-9704-40e9e94c1e80.jpg)

[![npm download](https://img.shields.io/npm/dm/@pkboom/opencv-nodejs.svg?style=flat)](https://www.npmjs.com/package/@pkboom/opencv-nodejs)
[![node version](https://img.shields.io/badge/node.js-%3E=_24-green.svg?style=flat)](http://nodejs.org/download/)

**opencv-nodejs allows you to use the native OpenCV library in nodejs. Besides a synchronous API the package provides an asynchronous API, which allows you to build non-blocking and multithreaded computer vision tasks. opencv-nodejs supports OpenCV 4 and OpenCV 5.**

**The ultimate goal of this project is to provide a comprehensive collection of nodejs bindings to the API of OpenCV and the OpenCV-contrib modules. To get an overview of the currently implemented bindings, have a look at the [type declarations](https://github.com/urielch/opencv4nodejs/tree/master/typings) of this package. Furthermore, contribution is highly appreciated. If you want to add missing bindings check out the [contribution guide](https://github.com/urielch/opencv4nodejs/tree/master/CONTRIBUTING.md).**

- **[Examples](#examples)**
- **[How to install](#how-to-install)**
- **[Usage with Electron](#usage-with-electron)**
- **[Usage with NW.js](#usage-with-nwjs)**
- **[Quick Start](#quick-start)**
- **[Async API](#async-api)**
- **[With TypeScript](#with-typescript)**
- **[External Memory Tracking (v4.0.0)](#external-mem-tracking)**
<a name="examples"></a>

## Examples

See [examples](https://github.com/UrielCh/opencv4nodejs/tree/master/examples) for implementation.

### Face Detection

![face0](https://user-images.githubusercontent.com/31125521/29702727-c796acc4-8972-11e7-8043-117dd2761833.jpg)
![face1](https://user-images.githubusercontent.com/31125521/29702730-c79d3904-8972-11e7-8ccb-e8c467244ad8.jpg)

### Face Recognition with the OpenCV face module

Check out [Node.js + OpenCV for Face Recognition](https://medium.com/@muehler.v/node-js-opencv-for-face-recognition-37fa7cb860e8)</b></a>.

![facerec](https://user-images.githubusercontent.com/31125521/35453007-eac9d516-02c8-11e8-9c4d-a77c01ae1f77.jpg)

### Face Landmarks with the OpenCV face module

![facelandmarks](https://user-images.githubusercontent.com/31125521/39297394-af14ae26-4943-11e8-845a-a06cbfa28d5a.jpg)

### Face Recognition with [face-recognition.js](https://github.com/justadudewhohacks/face-recognition.js)

Check out [Node.js + face-recognition.js : Simple and Robust Face Recognition using Deep Learning](https://medium.com/@muehler.v/node-js-face-recognition-js-simple-and-robust-face-recognition-using-deep-learning-ea5ba8e852).

[![IMAGE ALT TEXT](https://user-images.githubusercontent.com/31125521/35453884-055f3bde-02cc-11e8-8fa6-945f320652c3.jpg)](https://www.youtube.com/watch?v=ArcFHpX-usQ "Nodejs Face Recognition using face-recognition.js and opencv-nodejs")

### Hand Gesture Recognition

Check out [Simple Hand Gesture Recognition using OpenCV and JavaScript](https://medium.com/@muehler.v/simple-hand-gesture-recognition-using-opencv-and-javascript-eb3d6ced28a0).

![gesture-rec_sm](https://user-images.githubusercontent.com/31125521/30052864-41bd5680-9227-11e7-8a62-6205f3d99d5c.gif)

### Object Recognition with Deep Neural Networks

Check out [Node.js meets OpenCV’s Deep Neural Networks — Fun with Tensorflow and Caffe](https://medium.com/@muehler.v/node-js-meets-opencvs-deep-neural-networks-fun-with-tensorflow-and-caffe-ff8d52a0f072).

#### Tensorflow Inception

![husky](https://user-images.githubusercontent.com/31125521/32703295-f6b0e7ee-c7f3-11e7-8039-b3ada21810a0.jpg)
![car](https://user-images.githubusercontent.com/31125521/32703296-f6cea892-c7f3-11e7-8aaa-9fe48b88fe05.jpeg)
![banana](https://user-images.githubusercontent.com/31125521/32703297-f6e932ca-c7f3-11e7-9a66-bbc826ebf007.jpg)

#### Single Shot Multibox Detector with COCO

![dishes-detection](https://user-images.githubusercontent.com/31125521/32703228-eae787d4-c7f2-11e7-8323-ea0265deccb3.jpg)
![car-detection](https://user-images.githubusercontent.com/31125521/32703229-eb081e36-c7f2-11e7-8b26-4d253b4702b4.jpg)

### Machine Learning

Check out [Machine Learning with OpenCV and JavaScript: Recognizing Handwritten Letters using HOG and SVM](https://medium.com/@muehler.v/machine-learning-with-opencv-and-javascript-part-1-recognizing-handwritten-letters-using-hog-and-88719b70efaa).

![resulttable](https://user-images.githubusercontent.com/31125521/30635645-5a466ea8-9df3-11e7-8498-527e1293c4fa.png)

### Object Tracking

![trackbgsubtract](https://user-images.githubusercontent.com/31125521/29702733-c7b59864-8972-11e7-996b-d28cb508f3b8.gif)
![trackbycolor](https://user-images.githubusercontent.com/31125521/29702735-c8057686-8972-11e7-9c8d-13e30ab74628.gif)

### Feature Matching

![matchsift](https://user-images.githubusercontent.com/31125521/29702731-c79e3142-8972-11e7-947e-db109d415469.jpg)

### Image Histogram

![plotbgr](https://user-images.githubusercontent.com/31125521/29995016-1b847970-8fdf-11e7-9316-4eb0fd550adc.jpg)
![plotgray](https://user-images.githubusercontent.com/31125521/29995015-1b83e06e-8fdf-11e7-8fa8-5d18326b9cd3.jpg)

### Boiler plate for combination of opencv-nodejs, express and websockets

[opencv4nodejs-express-websockets](https://github.com/Mudassir-23/opencv4nodejs-express-websockets) - Boilerplate express app for getting started on opencv with nodejs and to live stream the video through websockets.

### Automating lights by people detection through classifier

Check out [Automating lights with Computer Vision & NodeJS](https://medium.com/softway-blog/automating-lights-with-computer-vision-nodejs-fb9b614b75b2).

![user-presence](https://user-images.githubusercontent.com/34403479/70385871-8d62e680-19b7-11ea-855c-3b2febfdbd72.png)

<a name="how-to-install"></a>

## How to install

```bash
npm install --save @pkboom/opencv-nodejs
```

The module's `install` lifecycle script runs `node bin/install.js rebuild`, which detects your OpenCV install (via Homebrew, pkg-config, or the usual distro locations) and compiles the native addon against it with node-gyp. There is no source build of OpenCV and nothing to configure — just install OpenCV first, from your package manager.

Native node modules are built via node-gyp, which already comes with npm by default. However, node-gyp requires you to have python installed. If you are running into node-gyp specific issues have a look at known issues with [node-gyp](https://github.com/nodejs/node-gyp) first.

**Important note:** node-gyp won't handle whitespaces properly, thus make sure, that the path to your project directory does **not contain any whitespaces**. Installing opencv-nodejs under "C:\Program Files\some_dir" or similar will not work and will fail with: "fatal error C1083: Cannot open include file: 'opencv2/core.hpp'"!**

On Windows, you will furthermore need Visual Studio Build Tools to compile opencv-nodejs.

### Requirements

- Node.js 24 or 26 (`engines.node` requires `>=24.0.0`)
- OpenCV 4.x or OpenCV 5.x, installed from your platform's package manager

### macOS

```bash
brew update
# OpenCV 5
brew install opencv
# OpenCV 4 (keg-only formula)
brew install opencv@4
```

Both are detected automatically, no `brew link` step required.

### Debian / Ubuntu

```bash
sudo apt install libopencv-dev
```

Installs OpenCV 4.x.

### Windows

```bash
choco install opencv
```

Installs OpenCV 4.x via the [Chocolatey](https://chocolatey.org/) package manager.

### OpenCV installed somewhere unusual

If OpenCV isn't found automatically (not installed via Homebrew, pkg-config, or a standard distro/Windows location), point opencv-nodejs at it directly:

```bash
export OPENCV_INCLUDE_DIR=/path/to/opencv/include
export OPENCV_LIB_DIR=/path/to/opencv/lib
npm install --save @pkboom/opencv-nodejs
```

### The CLI

The module ships a small CLI for driving the build directly, also available via npm scripts (`npm run info`, `npm run rebuild`, `npm run clean`) and as the `build-opencv` bin once installed/linked:

```bash
node bin/install.js info      # print the detected OpenCV install
node bin/install.js rebuild   # build the native addon
node bin/install.js clean     # remove build output
```

### Debugging module loading

Set `OPENCVNODEJS_DEBUG_REQUIRE=1` before requiring the module for verbose diagnostics about how it locates and loads the native addon.

<a name="usage-with-electron"></a>

## Usage with Electron

### [opencv-electron](https://github.com/urielch/opencv-electron) - example for opencv-nodejs with electron

Add the following script to your package.json:

```json
"electron-rebuild": "build-opencv --electron rebuild"
```

Run the script:

```bash
npm run electron-rebuild
```

Require it in the application:

``` javascript
const cv = require('@pkboom/opencv-nodejs');
```

<a name="usage-with-nwjs"></a>

## Usage with NW.js

Any native modules, including opencv-nodejs, must be recompiled to be used with [NW.js](https://nwjs.io/). Instructions on how to do this are available in the **[Use Native Modules](http://docs.nwjs.io/en/latest/For%20Users/Advanced/Use%20Native%20Node%20Modules/)** section of the NW.js documentation.

Once recompiled, the module can be installed and required as usual:

``` javascript
const cv = require('@pkboom/opencv-nodejs');
```

<a name="quick-start"></a>

## Quick Start

``` javascript
const cv = require('@pkboom/opencv-nodejs');
```

### Initializing Mat (image matrix), Vec, Point

``` javascript
const rows = 100; // height
const cols = 100; // width

// empty Mat
const emptyMat = new cv.Mat(rows, cols, cv.CV_8UC3);

// fill the Mat with default value
const whiteMat = new cv.Mat(rows, cols, cv.CV_8UC1, 255);
const blueMat = new cv.Mat(rows, cols, cv.CV_8UC3, [255, 0, 0]);

// from array (3x3 Matrix, 3 channels)
const matData = [
  [[255, 0, 0], [255, 0, 0], [255, 0, 0]],
  [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
  [[255, 0, 0], [255, 0, 0], [255, 0, 0]]
];
const matFromArray = new cv.Mat(matData, cv.CV_8UC3);

// from node buffer
const charData = [255, 0, ...];
const matFromArray = new cv.Mat(Buffer.from(charData), rows, cols, cv.CV_8UC3);

// Point
const pt2 = new cv.Point(100, 100);
const pt3 = new cv.Point(100, 100, 0.5);

// Vector
const vec2 = new cv.Vec(100, 100);
const vec3 = new cv.Vec(100, 100, 0.5);
const vec4 = new cv.Vec(100, 100, 0.5, 0.5);
```

### Mat and Vec operations

``` javascript
const mat0 = new cv.Mat(...);
const mat1 = new cv.Mat(...);

// arithmetic operations for Mats and Vecs
const matMultipliedByScalar = mat0.mul(0.5);  // scalar multiplication
const matDividedByScalar = mat0.div(2);       // scalar division
const mat0PlusMat1 = mat0.add(mat1);          // addition
const mat0MinusMat1 = mat0.sub(mat1);         // subtraction
const mat0MulMat1 = mat0.hMul(mat1);          // elementwise multiplication
const mat0DivMat1 = mat0.hDiv(mat1);          // elementwise division

// logical operations Mat only
const mat0AndMat1 = mat0.and(mat1);
const mat0OrMat1 = mat0.or(mat1);
const mat0bwAndMat1 = mat0.bitwiseAnd(mat1);
const mat0bwOrMat1 = mat0.bitwiseOr(mat1);
const mat0bwXorMat1 = mat0.bitwiseXor(mat1);
const mat0bwNot = mat0.bitwiseNot();
```

### Accessing Mat data

``` javascript
const matBGR = new cv.Mat(..., cv.CV_8UC3);
const matGray = new cv.Mat(..., cv.CV_8UC1);

// get pixel value as vector or number value
const vec3 = matBGR.at(200, 100);
const grayVal = matGray.at(200, 100);

// get raw pixel value as array
const [b, g, r] = matBGR.atRaw(200, 100);

// set single pixel values
matBGR.set(50, 50, [255, 0, 0]);
matBGR.set(50, 50, new Vec(255, 0, 0));
matGray.set(50, 50, 255);

// get a 25x25 sub region of the Mat at offset (50, 50)
const width = 25;
const height = 25;
const region = matBGR.getRegion(new cv.Rect(50, 50, width, height));

// get a node buffer with raw Mat data
const matAsBuffer = matBGR.getData();

// get entire Mat data as JS array
const matAsArray = matBGR.getDataAsArray();
```

### IO

``` javascript
// load image from file
const mat = cv.imread('./path/img.jpg');
cv.imreadAsync('./path/img.jpg', (err, mat) => {
  ...
})

// save image
cv.imwrite('./path/img.png', mat);
cv.imwriteAsync('./path/img.jpg', mat, (err) => {
  ...
})

// show image
cv.imshow('a window name', mat);
cv.waitKey();

// load base64 encoded image
const base64text='data:image/png;base64,R0lGO..';//Base64 encoded string
const base64data =base64text.replace('data:image/jpeg;base64','')
                            .replace('data:image/png;base64','');//Strip image type prefix
const buffer = Buffer.from(base64data,'base64');
const image = cv.imdecode(buffer); //Image is now represented as Mat

// convert Mat to base64 encoded jpg image
const outBase64 =  cv.imencode('.jpg', croppedImage).toString('base64'); // Perform base64 encoding
const htmlImg='<img src=data:image/jpeg;base64,'+outBase64 + '>'; //Create insert into HTML compatible <img> tag

// open capture from webcam
const devicePort = 0;
const wCap = new cv.VideoCapture(devicePort);

// open video capture
const vCap = new cv.VideoCapture('./path/video.mp4');

// read frames from capture
const frame = vCap.read();
vCap.readAsync((err, frame) => {
  ...
});

// loop through the capture
const delay = 10;
let done = false;
while (!done) {
  let frame = vCap.read();
  // loop back to start on end of stream reached
  if (frame.empty) {
    vCap.reset();
    frame = vCap.read();
  }

  // ...

  const key = cv.waitKey(delay);
  done = key !== 255;
}
```

### Useful Mat methods

``` javascript
const matBGR = new cv.Mat(..., cv.CV_8UC3);

// convert types
const matSignedInt = matBGR.convertTo(cv.CV_32SC3);
const matDoublePrecision = matBGR.convertTo(cv.CV_64FC3);

// convert color space
const matGray = matBGR.bgrToGray();
const matHSV = matBGR.cvtColor(cv.COLOR_BGR2HSV);
const matLab = matBGR.cvtColor(cv.COLOR_BGR2Lab);

// resize
const matHalfSize = matBGR.rescale(0.5);
const mat100x100 = matBGR.resize(100, 100);
const matMaxDimIs100 = matBGR.resizeToMax(100);

// extract channels and create Mat from channels
const [matB, matG, matR] = matBGR.splitChannels();
const matRGB = new cv.Mat([matR, matB, matG]);
```

### Drawing a Mat into HTML Canvas

``` javascript
const img = ...

// convert your image to rgba color space
const matRGBA = img.channels === 1
  ? img.cvtColor(cv.COLOR_GRAY2RGBA)
  : img.cvtColor(cv.COLOR_BGR2RGBA);

// create new ImageData from raw mat data
const imgData = new ImageData(
  new Uint8ClampedArray(matRGBA.getData()),
  img.cols,
  img.rows
);

// set canvas dimensions
const canvas = document.getElementById('myCanvas');
canvas.height = img.rows;
canvas.width = img.cols;

// set image data
const ctx = canvas.getContext('2d');
ctx.putImageData(imgData, 0, 0);
```

### Method Interface

OpenCV method interface from official docs or src:

``` c++
void GaussianBlur(InputArray src, OutputArray dst, Size ksize, double sigmaX, double sigmaY = 0, int borderType = BORDER_DEFAULT);
```

translates to:

``` javascript
const src = new cv.Mat(...);
// invoke with required arguments
const dst0 = src.gaussianBlur(new cv.Size(5, 5), 1.2);
// with optional paramaters
const dst2 = src.gaussianBlur(new cv.Size(5, 5), 1.2, 0.8, cv.BORDER_REFLECT);
// or pass specific optional parameters
const optionalArgs = {
  borderType: cv.BORDER_CONSTANT
};
const dst2 = src.gaussianBlur(new cv.Size(5, 5), 1.2, optionalArgs);
```

<a name="async-api"></a>

## Async API

The async API can be consumed by passing a callback as the last argument of the function call. By default, if an async method is called without passing a callback, the function call will yield a Promise.

### Async Face Detection

``` javascript
const classifier = new cv.CascadeClassifier(cv.HAAR_FRONTALFACE_ALT2);

// by nesting callbacks
cv.imreadAsync('./faceimg.jpg', (err, img) => {
  if (err) { return console.error(err); }

  const grayImg = img.bgrToGray();
  classifier.detectMultiScaleAsync(grayImg, (err, res) => {
    if (err) { return console.error(err); }

    const { objects, numDetections } = res;
    ...
  });
});

// via Promise
cv.imreadAsync('./faceimg.jpg')
  .then(img =>
    img.bgrToGrayAsync()
      .then(grayImg => classifier.detectMultiScaleAsync(grayImg))
      .then((res) => {
        const { objects, numDetections } = res;
        ...
      })
  )
  .catch(err => console.error(err));

// using async await
try {
  const img = await cv.imreadAsync('./faceimg.jpg');
  const grayImg = await img.bgrToGrayAsync();
  const { objects, numDetections } = await classifier.detectMultiScaleAsync(grayImg);
  ...
} catch (err) {
  console.error(err);
}
```

<a name="with-typescript"></a>

## With TypeScript

``` javascript
import cv from '@pkboom/opencv-nodejs'
```

Check out the TypeScript [examples](https://github.com/urielch/opencv4nodejs/tree/master/examples).

<a name="external-mem-tracking"></a>

## External Memory Tracking (v4.0.0)

Since version 4.0.0 was released, external memory tracking has been enabled by default. Simply put, the memory allocated for Matrices (cv.Mat) will be manually reported to the node process. This solves the issue of inconsistent Garbage Collection, which could have resulted in spiking memory usage of the node process eventually leading to overflowing the RAM of your system, prior to version 4.0.0.

Note, that in doubt this feature can be **disabled** by setting an environment variable `OPENCVNODEJS_DISABLE_EXTERNAL_MEM_TRACKING` before requiring the module:

``` bash
export OPENCVNODEJS_DISABLE_EXTERNAL_MEM_TRACKING=1 // linux
set OPENCVNODEJS_DISABLE_EXTERNAL_MEM_TRACKING=1 // windows
```

Or directly in your code:

``` javascript
process.env.OPENCVNODEJS_DISABLE_EXTERNAL_MEM_TRACKING = 1
const cv = require('@pkboom/opencv-nodejs')
```
