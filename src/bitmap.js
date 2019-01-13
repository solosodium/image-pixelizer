(function() {

    /**
     * A light weight wrapper class encapsulating bitmap data.
     * Compatible with Jimp.bitmap (only width, height, data).
     */
    class Bitmap {

        /**
         * Default constructor.
         * @param {number} width 
         * @param {number} height 
         * @param {Array} data one dimention array of pixel r, g, b, a values (0 to 255)
         * 
         */
        constructor(width, height, data) {
            // Check data dimension.
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
            x = clamp(x, 0, this.width - 1);
            y = clamp(y, 0, this.height - 1);
            return (this.width * y + x) * 4;
        }
    }

    /** Clamp value between min and max values. */
	function clamp(val, min, max) {
		return Math.min(Math.max(min, val), max);
	}

    module.exports = Bitmap;
    
})();
