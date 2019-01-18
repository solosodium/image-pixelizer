(function () {

	const Pixels = require('./pixels');
	const Options = require('./options');
	const Cluster = require('./cluster');
	const Palette = require('./palette');
	const Bitmap = require('./bitmap');

    /**
     * Pixelizer main class.
     * Responsible for: loading input image file, pixelizing input file,
     * and output to image files.
     */
	class Pixelizer {

		/**
		 * Default constructor.
		 * @param {Bitmap} bitmap 
		 * @param {Options} options
		 */
		constructor(bitmap, options) {
			// Save options.
			this.options = options;
			// Create old pixel representation with size 1.
			this.oldPixels = this.createPixels(bitmap, 1);
			// Create new pixel representation with option size.
			this.newPixels = this.createPixels(bitmap, options.pixelSize);
		}

		/**
		 * Update existing options.
		 * @param {options} options 
		 */
		updateOptions(options) {
			this.options = options;
			this.newPixels = this.createPixels(bitmap, options.pixelSize);
		}

		/**
		 * Pixelize.
		 * @return {Bitmap}
		 */
		pixelize() {
			// Pixel clustering.
			let cluster = new Cluster(this.oldPixels, this.newPixels, this.options);
			cluster.cluster();
			// Reduce color palette.
			let palette = new Palette(cluster.getPixels(), this.options);
			let reducedPixels = palette.reduce();
			// Return.
			return reducedPixels.toBitmap();
		}

        /**
         * Convert bitmap to pixels controlled by pixel size.
         * @param {Bitmap} bitmap
         * @param {number} size
         * @return {Pixels}
         */
		createPixels(bitmap, size) {
			let width = bitmap.width;
			let height = bitmap.height;
			let w = Math.floor(width / size);
			let h = Math.floor(height / size);
			return new Pixels(w, h, size, bitmap);
		}
	}

	Pixelizer.Options = Options;
	Pixelizer.Bitmap = Bitmap;
	module.exports = Pixelizer;

})();
