(function() {

  const Jimp = require('jimp');
  const RGBA = require('./color').RGBA;

  /** Custom pixels representation in RGBA color. */
  class Pixels {

    /**
     * Create RGBA pixels representation of an input image.
     * @param {number} width pixels width
     * @param {number} height pixels height
     * @param {number} size new pixel size
     * @param {Jimp} image an input Jimp image object
     */
    constructor(width, height, size, image) {
      this.width = width;
      this.height = height;
      this.size = size;
      // Check width, height, size and image dimensions.
      if (width * size > image.bitmap.width) {
        throw new Error('invalid width combination, width(' + width + '), '
          + 'size(' + size + '), image width(' + image.bitmap.width + ')');
      }
      if (height * size > image.bitmap.height) {
        throw new Error('invalid height combination, height(' + height + '), '
          + 'size(' + size + '), image height(' + image.bitmap.height + ')');
      }
      // Initialize pixels. Each pixel is the average of all the pixels in
      // size * size square in the input image.
      this.pixels = [];
      for (let x=0; x<this.width; x++) {
        for (let y=0; y<this.height; y++) {
          let r = 0, g = 0, b = 0, a = 0;
          // Iterate through square.
          for (let i=0; i<size; i++) {
            for (let j=0; j<size; j++) {
              let xx = x * size + i;
              let yy = y * size + j;
              let idx = image.getPixelIndex(xx, yy);
              r += image.bitmap.data[idx + 0] / size / size;
              g += image.bitmap.data[idx + 1] / size / size;
              b += image.bitmap.data[idx + 2] / size / size;
              a += image.bitmap.data[idx + 3] / size / size;
            }
          }
          this.pixels[y * width + x] = new RGBA(r, g, b, a);
        }
      }
    }

    /**
     * Get pixel at (x, y) as RGBA color.
     * @param {number} x pixel x position
     * @param {number} y pixel y position
     * @returns {RGBA} a RGBA color
     */
    getPixel(x, y) {
      if (x < 0 || x > this.width - 1) {
        throw new Error('x (' + x + ') is not in bound');
      }
      if (y < 0 || y > this.height - 1) {
        throw new Error('y (' + y + ') is not in bound');
      }
      return this.pixels[y * this.width + x];
    }

    /**
     * Set pixel RGBA color at (x, y).
     * @param {number} x pixel x position
     * @param {number} y pixel y position
     * @param {RGBA} rgba a RGBA color
     */
    setPixel(x, y, rgba) {
      if (x < 0 || x > this.width - 1) {
        throw new Error('x (' + x + ') is not in bound');
      }
      if (y < 0 || y > this.height - 1) {
        throw new Error('y (' + y + ') is not in bound');
      }
      this.pixels[y * this.width + x] = rgba;
    }

    /**
     * Convert pixels to an image object.
     * @returns {Jimp} a Jimp image
     */
    toImage() {
      var image = new Jimp(this.width, this.height);
      for (let x=0; x<this.width; x++) {
        for (let y=0; y<this.height; y++) {
          let idx = image.getPixelIndex(x, y);
          let rgba = this.getPixel(x, y);
          image.bitmap.data[idx + 0] = rgba.r;
          image.bitmap.data[idx + 1] = rgba.g;
          image.bitmap.data[idx + 2] = rgba.b;
          image.bitmap.data[idx + 3] = rgba.a;
        }
      }
      return image;
    }

  }

  module.exports = Pixels;

})();
