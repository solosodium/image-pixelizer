(function() {

    let RGBA = require('./color').RGBA;

    /**
     * Image encapsulating class.
     */
    class Image {
        /**
         * Convert Jimp image to custom image format.
         * @param {Jimp.Image} image a Jimp image object
         */
        constructor(image) {
            this.width = image.bitmap.width;
            this.height = image.bitmap.height;
            this.pixels = [];
            for (var x=0; x<this.width; x++) {
                for (var y=0; y<this.height; y++) {
                    let idx = image.getPixelIndex(x, y);
                    this.pixels[x + y*this.width] = new RGBA(
                        image.bitmap.data[idx + 0],
                        image.bitmap.data[idx + 1],
                        image.bitmap.data[idx + 2],
                        image.bitmap.data[idx + 3]
                    );
                }
            }
        }

        /**
         * Get pixel as Color.
         * @param {number} x pixel x position
         * @param {number} y pixel y position
         */
        getPixel(x, y) {
            if (x < 0 || x > this.width - 1) {
                throw new RangeError('x (' + x + ') is not in bound');
            }
            if (y < 0 || y > this.height - 1) {
                throw new RangeError('y (' + y + ') is not in bound');
            }
            return this.pixels[x + y * this.width];
        }
    }

    /** Export Image class. */
    module.exports = Image;

})();
