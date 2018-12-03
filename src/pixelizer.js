(function () {

	const Jimp = require('jimp');
	const Log = require('./log');
	const Pixels = require('./pixels');
	const Options = require('./options');
	const Cluster = require('./cluster');
	const Palette = require('./palette');

    /**
     * Pixelizer main class.
     * Responsible for: loading input image file, pixelizing input file,
     * and output to image files.
     */
	class Pixelizer {

		/** Default constructor. */
		constructor() {
			// Do nothing.
		}

        /**
         * Read an input image file.
         * @param {string} input file path to input image file
         */
		static read(input) {
			return new Promise((resolve) => {
				Jimp.read(input).then((image) => {
					Log.info('Reading input image file from: ' + input);
					resolve(image);
				});
			});
		}

        /**
         * Pixelize image with options.
         * @param {Jimp} image input image to be pixelized
         * @param {Options} options pixeliation options
         */
		static process(image, options) {
			// Step 1: resize input image.
			let resizedImage = this.resizeImage(image, options);
			// Step 2: convert resized image to pixels.
			let oldPixels = this.createPixels(resizedImage, 1);
			// Step 3: blur resized image.
			let blurSize = options.pixelSize * options.blurSize;
			if (blurSize > 0) {
				resizedImage.blur(blurSize);
			}
			// Step 4: create pixels with new pixel size.
			let newPixels =
				this.createPixels(resizedImage, options.pixelSize);
			// Step 5: clustering pixels.
			let cluster = new Cluster(oldPixels, newPixels, options);
			cluster.cluster();
			// Step 6: reduce color palette.
			let palette = new Palette(cluster.getResult(), options);
			let result = palette.reduce(options.numberOfColors);
			return new Promise((resolve) => {
				resolve(result.toImage());
			});
		}


        /**
         * Resize input image width and height to be multiple of new pixel
         * size, so there will be no artifact lines after pixelization.
         * @param {Jimp} image
         * @param {Options} options
         * @returns {Jimp}
         */
		static resizeImage(image, options) {
			// Gather parameters.
			let size = options.pixelSize;
			let width = image.bitmap.width;
			let height = image.bitmap.height;
			let resizeAlign = options.resizeAlign;
			let resizeFilter = options.resizeFilter;
			// New width and height should be quantized by new pixel size.
			let fixedWidth = Math.floor(width / size) * size;
			let fixedHeight = Math.floor(height / size) * size;
			// Use cover mode for resize.
			return image.cover(fixedWidth, fixedHeight, resizeAlign, resizeFilter);
		}

        /**
         * Convert image to pixels controlled by pixel size.
         * @param {Jimp} image
         * @param {number} size
         * @return {Pixels}
         */
		static createPixels(image, size) {
			let width = image.bitmap.width;
			let height = image.bitmap.height;
			let w = Math.floor(width / size);
			let h = Math.floor(height / size);
			return new Pixels(w, h, size, image);
		}

        /**
         * Save image to file.
         * @param {Jimp} image image to output
         * @param {string} output complete file path of output image
         */
		static saveImage(image, output) {
			Log.info('Saving output image file to: ' + output);
			return image.write(output);
		}
	}

	Pixelizer.Options = Options;
	module.exports = Pixelizer;

})();
