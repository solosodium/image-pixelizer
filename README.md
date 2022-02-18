# image-pixelizer

A tool to generate pixel arts from images.

## Release Notes

Version 1.0.7
* Fixed a minor bug in distribution version of the vanila Javascript libraies.

Version 1.0.6
* Added RGBA to LAB (through XYZ) color conversion for more accurate color comparison.
* Added support for vanila Javascript use case: [image-pixelizer.min.js](dist/image-pixelizer.min.js).

## Algorithm

This tool uses a simple two-stage algorithm to create pixel arts from images.

1. **Pixel clustering**: Cluster pixels based on their similarity in color and relative distance.
1. **Color Reduction**: Reduce the number of colors of the clustered image to maximize color diversity.

## Install

```shell
npm install image-pixelizer --save
```

## Usage

```javascript
// Import Pixelizer.
const Pixelizer = require('image-pixelizer');

// Create Options for Pixelizer.
let options = new Pixelizer.Options()
    .setPixelSize(1)
    .setColorDistRatio(0.5)
    .setClusterThreshold(0.01)
    .setMaxIteration(10)
    .setNumberOfColors(128);

// Create compatible input Bitmap.
let inputBitmap = new Pixelizer.Bitmap(
    1920,   // width in pixels
    1080,   // height in pixels
    [...]   // one dimension data array for RGBA bitmap
);

// Pixelize!
let outputBitmap = 
    new Pixelizer(inputBitmap, options).pixelize();
```
## Options

There are in total 5 options for the Pixelizer.

1. **Pixel Size**: This is size of output bitmap pixel in terms of the input bitmap pixels. For example, if this number is 10, each output bitmap pixel represents a 10x10 square (100 pixels) in the input bitmap.
1. **Color Distance Ratio**: This is a 0 to 1 factor which tunes the weights assigned to pixel color difference and distance difference during clustering. 0 means only using distance difference when deciding which cluster a pixel goes to, while 1 means only use the color difference.
1. **Cluster Threshold**: This is the ratio between number of pixels that changed cluster and number of total pixels, which is used as the primary condition to stop clustering. For example, if this number is 0.01, it means algorithm will stop clustering if less than 1% of pixels changed cluster assignment during the last iteration. 
1. **Maximum Iteration**: This is the maximum number of iterations allowed during pixel clustering stage. This is set as a hard stop condition to avoid clustering that does not converge.
1. **Number of Colors**: This is the intended number of colors in the output bitmap.

Default values:

* *pixelSize = 1*
* *colorDistRatio = 0.5*
* *clusterThreshold = 0.01*
* *maxIteration = 10*
* *numberOfColors = 128*

## Bitmap

Bitmap is a light-weight wrapper class to represent a RGBA bitmap image. It's created with width, height (both in pixels) and a one dimensional data array containing RGBA values for all pixels. Each RGBA value should be a number between 0 to 255.

An extremely simple example which has 4 pixels:

```
|------------------------|-----------------------|
| black (0, 0, 0, 255)   | red (255, 0, 0, 255)  |
|------------------------|-----------------------|
| green (0, 255, 0, 255) | blue (0, 0, 255, 255) |
|------------------------|-----------------------|
```

To create this bitmap:

```javascript
let bitmap = new Pixelizer.Bitmap(
    2, 
    2,
    [
        0,   0,   0,   255,     // black
        255, 0,   0,   255,     // red
        0,   255, 0,   255,     // green
        0,   0,   255, 255      // blue
    ]
);
```

If you use [jimp](https://www.npmjs.com/package/jimp), you might notice this shares similarity with its bitmap. This is by design, which means you can create Pixelizer Bitmap directly from jimp, and use jimp to output image file by overriding its bitmap:

```javascript
Jimp.read('lenna.png')
  .then(lenna => {
      // Create Pixelizer bitmap from jimp.
      let inputBitmap = new Pixelizer.Bitmap(
          lenna.bitmap.width,
          lenna.bitmap.height,
          lenna.bitmap.data
      );
      // Pixelizer processing code...
      let outputBitmap = ...
      // Override jimp bitmap and output image.
      lenna.bitmap.width = outputBitmap.width;
      lenna.bitmap.height = outputBitmap.height;
      lenna.bitmap.data = outputBitmap.data;
      lenna.write('lenna-pixel.png');
  })
  .catch(err => {
    console.error(err);
  });
```

As you can see, there is no deep integration with jimp for the Bitmap class, so this package can be used in more use cases (of course, with the help of more adapter code for Bitmap).
 
