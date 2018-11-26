(function() {

  const Pixels = require('./pixels');
  const RGBA = require('./color').RGBA;
  const Options = require('./options');
  const Labels = require('./labels');
  const Log = require('./log');

  class Cluster {

    /**
     * Default constructor.
     * @param {Pixels} oldPixels pixels of the old image
     * @param {Pixels} newPixels pixels of the new image
     * @param {Options} options pixelization options
     */
    constructor(oldPixels, newPixels, options) {
      // Cache parameters.
      this.oldPixels = oldPixels;
      this.newPixels = newPixels;
      this.options = options;
      // Create labels.
      this.labels = new Labels(
        oldPixels.width, oldPixels.height, options.pixelSize);
      // Create permutations for 9 neighboring pixels.
      this.permutations = [
        {x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1},
        {x: -1, y:  0}, {x: 0, y:  0}, {x: 1, y:  0},
        {x: -1, y:  1}, {x: 0, y:  1}, {x: 1, y:  1}
      ];
    }

    /** Map old pixels to new pixels, and update new pixels. */
    cluster() {
      Log.info("Clustering started.");
      for (let i=0; i<this.options.maxIteration; i++) {
        let pixelChangeCount = this.map();
        this.reduce();
        let percentage =
          pixelChangeCount / this.oldPixels.width / this.oldPixels.height;
        Log.info("Cluster iteration " + i + ", change % is "+ percentage);
        if (percentage < this.options.clusterThreshold) {
          break;
        }
      }
      Log.info("Clustering done.");
      return this;
    }

    /** Assgin old pixels with new pixel labels. */
    map() {
      // Set an accumulator for number of changed old pixels.
      let acc = 0;
      for (let x=0; x<this.oldPixels.width; x++) {
        for (let y=0; y<this.oldPixels.height; y++) {
          // Iterate through all neighbors.
          let position;
          let cost = Number.MAX_VALUE;
          for (let n=0; n<this.permutations.length; n++) {
            // Get new pixel position.
            let xx = Math.floor(x / this.options.pixelSize)
              + this.permutations[n].x;
            let yy = Math.floor(y / this.options.pixelSize)
              + this.permutations[n].y;
            // Calculate cost if in bound.
            if (xx >= 0 && xx < this.newPixels.width
              && yy >= 0 && yy < this.newPixels.height) {
              let c = this.pixelDifference(x, y, xx, yy);
              if (c < cost) {
                cost = c;
                position = { x: xx, y: yy };
              }
            }
          }
          // Update label.
          this.labels.setLabel(x, y, position.x, position.y);
          acc += this.labels.getLabel(x, y).changed ? 1 : 0;
        }
      }
      return acc;
    }

    /** Based on assgined labels, calculate new pixel values. */
    reduce() {
      // Go through new pixels and get the list of old pixels.
      for (let xx=0; xx<this.newPixels.width; xx++) {
        for (let yy=0; yy<this.newPixels.height; yy++) {
          // Get the list of old pixels.
          let list = this.labels.getList(xx, yy);
          // Aggregate pixels.
          let r = 0, g = 0, b = 0, a = 0;
          for (let i=0; i<list.length; i++) {
            let pos = list[i];
            let pixel = this.oldPixels.getPixel(pos.x, pos.y);
            r += pixel.r / list.length;
            g += pixel.g / list.length;
            b += pixel.b / list.length;
            a += pixel.a / list.length;
          }
          // Set new pixel value.
          this.newPixels.setPixel(xx, yy, new RGBA(r, g, b, a));
        }
      }
    }

    /**
     * Get clustered new pixels.
     * @returns {Pixels} new pixels
     */
    getResult() {
      return this.newPixels;
    }

    /**
     * Calculate the difference between old pixel and new pixel.
     * The difference is calculated for both color difference and
     * distance difference (evaluated as minimum 1D Manhattan). The
     * old and new pixels should be neighbors, which means once new
     * pixel is transformed to an equivalent old pixel, their 1D
     * Manhattan distance should be less than new pixel size.
     * @param {number} x old pixel x index
     * @param {number} y old pixel y index
     * @param {number} xx new pixel x index
     * @param {number} yy new pixel y index
     * @returns pixel difference which is within [0, 1]
     */
    pixelDifference(x, y, xx, yy) {
      // Cache local paramaters.
      let pixelSize = this.options.pixelSize;
      let colorDistRatio = this.options.colorDistRatio;
      // Bound pixel positions.
      x = Math.max(0, Math.min(x, this.oldPixels.width - 1));
      y = Math.max(0, Math.min(y, this.oldPixels.height - 1));
      xx = Math.max(0, Math.min(xx, this.newPixels.width - 1));
      yy = Math.max(0, Math.min(yy, this.newPixels.height - 1));
      // Calculate color difference.
      let oldPixel = this.oldPixels.getPixel(x, y);
      let newPixel = this.newPixels.getPixel(xx, yy);
      let colorDiff = RGBA.difference(oldPixel, newPixel);
      // New pixel is transformed to old pixel equivalent.
      let xxt = xx * pixelSize + (pixelSize - 1) / 2;
      let yyt = yy * pixelSize + (pixelSize - 1) / 2;
      // Calculate distance difference.
      let dx = Math.abs(x - xxt);
      let dy = Math.abs(y - yyt);
      //let distDiff = Math.max(dx, dy) / (pixelSize + 1);
      let dxy = dx * dx + dy * dy;
      let distDiff = Math.sqrt(dxy / (pixelSize + 1) / (pixelSize + 1));
      // Return weighted result.
      return colorDistRatio * colorDiff + (1 - colorDistRatio) * distDiff;
    }

  }

  module.exports = Cluster;

})();
