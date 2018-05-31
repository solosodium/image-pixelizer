(function() {

    const Jimp = require("jimp");

    class Options {

        constructor() {
            // Images will have to be resized before 
            this.resizeAlign = Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE;
            this.resizeFilter = Jimp.RESIZE_BEZIER;
            this.pixelSize = 1;
            this.jpgQuality = 90;
            this.pngFilter = Jimp.PNG_FILTER_AUTO;
            return this;
        }

        /**
         * Set resize align option(s).
         * @param {*} align e.g. Jimp.HORIZONTAL_ALIGN_*, or 
         *     Jimp.VERTICAL_ALIGN_*, options can be joined by |
         */
        setResizeAlign(align) {
            this.resizeAlign = align;
            return this;
        }

        /**
         * Set resize filter option.
         * @param {*} filter e.g. Jimp.RESIZE_*
         */
        setResizeFilter(filter) {
            this.resizeFilter = filter;
            return this;
        }

        /**
         * Set the pixel size option.
         * @param {number} size new pixel size, which means a block of
         *     pixels with area size * size in the old image will be fused
         *     into a single pixel in the new image 
         */
        setPixelSize(size) {
            this.pixelSize = size;
            return this;
        }

        /**
         * Set JPEG iamge quality option.
         * @param {number} quality a number from 0 to 100, higher the
         *     better quality 
         */
        setJpgQuality(quality) {
            this.jpgQuality = Math.max(0, Math.min(quality, 100));
            return this;
        }

        /**
         * Set PNG image filter option.
         * @param {*} filter e.g. Jimp.PNG_FILTER_*
         */
        setPngFilter(filter) {
            this.pngFilter = filter;
            return this;
        }
    }

    module.exports = Options;

})();