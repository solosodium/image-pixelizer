(function () {

	const Bitmap = require('./bitmap');
	const RGBA = require('./color');

	/** 
	 * Custom pixels representation in RGBA color.
	 */
	class Pixels {

		/**
		 * Create RGBA pixels representation of an input bitmap.
		 * @param {number} width pixels width
		 * @param {number} height pixels height
		 * @param {number} size new pixel size
		 * @param {Bitmap} bitmap a bitmap object
		 */
		constructor(width, height, size, bitmap) {
			this.width = width;
			this.height = height;
			this.size = size;
			// Check width, height, size and bitmap dimensions.
			if (width * size > bitmap.width) {
				throw new Error('invalid width combination, width(' + width + '), '
					+ 'size(' + size + '), bitmap width(' + bitmap.width + ')');
			}
			if (height * size > bitmap.height) {
				throw new Error('invalid height combination, height(' + height + '), '
					+ 'size(' + size + '), bitmap height(' + bitmap.height + ')');
			}
			// Initialize pixels. Each pixel is the average of all the pixels in
			// size * size square in the input bitmap.
			this.pixels = [];
			for (let x = 0; x < this.width; x++) {
				for (let y = 0; y < this.height; y++) {
					let r = 0, g = 0, b = 0, a = 0;
					// Iterate through square.
					for (let i = 0; i < size; i++) {
						for (let j = 0; j < size; j++) {
							let xx = x * size + i;
							let yy = y * size + j;
							let idx = bitmap.getPixelIndex(xx, yy);
							r += bitmap.data[idx + 0] / size / size;
							g += bitmap.data[idx + 1] / size / size;
							b += bitmap.data[idx + 2] / size / size;
							a += bitmap.data[idx + 3] / size / size;
						}
					}
					this.pixels[y * width + x] = new RGBA(r, g, b, a);
				}
			}
		}

		/**
		 * Get pixel at (x, y) as RGBA color.
		 * @param {number} x pixel x position
		 * @param {number} y pixel y position
		 * @returns {RGBA} a RGBA color
		 */
		getPixel(x, y) {
			if (x < 0 || x > this.width - 1) {
				throw new Error('x (' + x + ') is not in bound');
			}
			if (y < 0 || y > this.height - 1) {
				throw new Error('y (' + y + ') is not in bound');
			}
			return this.pixels[y * this.width + x];
		}

		/**
		 * Set pixel RGBA color at (x, y).
		 * @param {number} x pixel x position
		 * @param {number} y pixel y position
		 * @param {RGBA} rgba a RGBA color
		 */
		setPixel(x, y, rgba) {
			if (x < 0 || x > this.width - 1) {
				throw new Error('x (' + x + ') is not in bound');
			}
			if (y < 0 || y > this.height - 1) {
				throw new Error('y (' + y + ') is not in bound');
			}
			this.pixels[y * this.width + x] = rgba;
		}

		/**
		 * Convert pixels to a bitmap object.
		 * @returns {Bitmap} a bitmap object
		 */
		toBitmap() {
			let data = [];
			for (let y = 0; y < this.height; y++) {
				for (let x = 0; x < this.width; x++) {
					let rgba = this.getPixel(x, y);
					data.push(rgba.r);
					data.push(rgba.g);
					data.push(rgba.b);
					data.push(rgba.a);
				}
			}
			return new Bitmap(this.width, this.height, data);
		}

	}

	module.exports = Pixels;

})();
