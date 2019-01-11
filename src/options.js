(function () {

	const Jimp = require("jimp");

	/**
	 * Pixelizer configurable options.
	 */
	class Options {

		constructor() {
			// Processing parameters.
			this.pixelSize = 1;
			this.colorDistRatio = 0.75;
			this.maxIteration = 10;
			this.clusterThreshold = 0.01;
			this.numberOfColors = 128;
			// Return.
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
         * Set the threshold for clustering stop.
         * @param {number} threshold during each clustering iteration, if
         *     the number of candidates change their cluster assignment
         *     divided by the total number of candidates is smaller than
         *     this threshold, hard stop on clustering iteration
         */
		setClusterThreshold(threshold) {
			this.clusterThreshold = Math.max(0, Math.min(threshold, 1));
			return this;
		}

		/**
		 * Set the number of colors in output image.
		 * @param {number} number after clustering is done, another round
		 * 	   of processing on colors will be carried out, this number
		 *     can be any integer (non-positive means do not reduce)
		 */
		setNumberOfColors(number) {
			this.numberOfColors = parseInt(number);
			return this;
		}
	}

	module.exports = Options;

})();
