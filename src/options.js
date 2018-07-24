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
            this.colorDistRatio = 0.75;
            this.maxIteration = 10;
            this.clusterThreshold = 0.01;
            // Post-processing parameters.
            this.jpgQuality = 90;
            this.pngFilter = Jimp.PNG_FILTER_AUTO;
            // Return.
            return this;
        }

        /**
         * Set resize align.
         * @param {*} align e.g. Jimp.HORIZONTAL_ALIGN_*, or
         *     Jimp.VERTICAL_ALIGN_*, options can be joined by |
         */
        setResizeAlign(align) {
            this.resizeAlign = align;
            return this;
        }

        /**
         * Set resize filter.
         * @param {*} filter e.g. Jimp.RESIZE_*
         */
        setResizeFilter(filter) {
            this.resizeFilter = filter;
            return this;
        }

        /**
         * Set blur size.
         * @param {number} size size of the blur radius before
         *     pixelization, this is expressed as a fraction of the pixel
         *     size, it has to be larger than 0, but not limit to 1
         */
        setBlurSize(size) {
            this.blurSize = Math.max(0, size);
            return this;
        }

        /**
         * Set the pixel size.
         * @param {number} size a unit to measure the number of old pixels
         *     represented in a new pixel, which should be size * size
         */
        setPixelSize(size) {
            this.pixelSize = size;
            return this;
        }

        /**
         * Set color / distantance cost mixing ratio.
         * @param {number} ratio when calculating the cost for an old
         *     pixel to be clustered to a specific new pixel, the cost is
         *     evaluated by both color and distance cost, this ratio
         *     controls the mixing of the two costs (0 means all distance
         *     contribution, 1 means all color contribution)
         */
        setColorDistRatio(ratio) {
            this.colorDistRatio = Math.max(0, Math.min(ratio, 1));
            return this;
        }

        /**
         * Set the maximum number of clustering iterations.
         * @param {number} iteration maximum number of iterations to
         *     perform before a hard stop during pixelization
         */
        setMaxIteration(iteration) {
            this.maxIteration = iteration;
            return this;
        }

        /**
         * Set the threshold for pixel clustering stop.
         * @param {number} threshold during each clustering iteration, if
         *     the number of old pixels that change their cluster label
         *     divided by the total number of old pixels is smaller than
         *     this threshold, hard stop on clustering iteration
         */
        setClusterThreshold(threshold) {
            this.clusterThreshold = Math.max(0, Math.min(threshold, 1));
            return this;
        }

        /**
         * Set JPEG iamge quality.
         * @param {number} quality a number from 0 to 100, higher the
         *     better quality
         */
        setJpgQuality(quality) {
            this.jpgQuality = Math.max(0, Math.min(quality, 100));
            return this;
        }

        /**
         * Set PNG image filter.
         * @param {*} filter e.g. Jimp.PNG_FILTER_*
         */
        setPngFilter(filter) {
            this.pngFilter = filter;
            return this;
        }
    }

    module.exports = Options;

})();
