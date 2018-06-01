(function() {

    const Jimp = require("jimp");

    class Options {

        constructor() {
            // Pre-processing parameters.
            this.resizeAlign = Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE;
            this.resizeFilter = Jimp.RESIZE_BEZIER;
            this.blurSize = 0.5;
            // Processing parameters.
            this.pixelSize = 1;
            this.colorDistRatio = 0.8;
            this.maxIteration = 10;
            this.pixelThreshold = 0.01;
            // Post-processing parameters.
            this.jpgQuality = 90;
            this.pngFilter = Jimp.PNG_FILTER_AUTO;
            // Return.
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
         * Set blur size option.
         * @param {number} size size of the blur radius before
         *     pixelization, this is expressed as a fraction of the pixel
         *     size, it has to be larger than 0
         */
        setBlurSize(size) {
            this.blurSize = Math.max(0, size);
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
         * Set color / distantance cost mixing ratio option.
         * @param {number} ratio the ratio between color and distance
         *     components of the cost calculation for old pixels (0 means
         *     all distance contribution, 1 means all color contribution)
         */
        setColorDistRatio(ratio) {
            this.colorDistRatio = Math.max(0, Math.min(ratio, 1));
            return this;
        }

        /**
         * Set the maximum number of cluster iteration option.
         * @param {number} iteration maximum number of iteration to
         *     perform before a hard stop on clustering
         */
        setMaxIteration(iteration) {
            this.maxIteration = iteration;
            return this;
        }

        /**
         * Set the threshold pixel clustering fraction option.
         * @param {number} threshold the minimum threshold fraction of old
         *     pixels changed cluster labels during the last clustering
         *     iteration 
         */
        setPixelThreshold(threshold) {
            this.pixelThreshold = Math.max(0, Math.min(threshold, 1));
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