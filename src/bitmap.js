  /**
   * A light weight wrapper class encapsulating bitmap data.
   * Compatible with Jimp.bitmap (only contains width, height, data).
   */
   class Bitmap {
    /**
     * Default constructor.
     * @param {number} width 
     * @param {number} height 
     * @param {Array} data one dimention array of pixel r, g, b, a values (0 to 255)
     */
    constructor(width, height, data) {
      // Check data dimension, each pixel has 4 values.
      if (width * height * 4 !== data.length) {
        throw new Error("Length of data doesn't match width and height");
      }
      this.width = width;
      this.height = height;
      this.data = data;
    }

    /**
     * Get index in data array for pixel at position (x, y).
     * @param {number} x
     * @param {number} y 
     */
    getPixelIndex(x, y) {
      x = Math.min(Math.max(0, x), this.width - 1);
      y = Math.min(Math.max(0, y), this.height - 1);
      return (this.width * y + x) * 4;
    }
  }
  
  module.exports = Bitmap;
  