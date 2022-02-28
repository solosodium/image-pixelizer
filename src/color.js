	/**
	 * Color in XYZ color space with alpha channel.
	 */
	 class XYZA {
		/**
		 * XYZA constructor.
		 * @param {RGBA} rgba
		 */
		constructor(rgba) {
			let r = Math.min(Math.max(0, rgba.r / 255), 1);
			let g = Math.min(Math.max(0, rgba.g / 255), 1);
			let b = Math.min(Math.max(0, rgba.b / 255), 1);
			// First inverse companding sRGB:
			// http://www.brucelindbloom.com/index.html?Eqn_RGB_to_XYZ.html
			r = r < 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
			g = g < 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
			b = b < 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
			// Convert sRGB to XYZ with D65 2 degrees as reference white.
			// http://www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
			this.x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
			this.y = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
			this.z = 0.0193339 * r + 0.1191920 * g + 0.9503041 * b;
			this.a = rgba.a / 255;
		}
	}

	/**
	 * Color in Lab color space.
	 */
	class LABAlpha {
		/**
		 * Default constructor.
		 * @param {XYZA} xyza 
		 */
		constructor(xyza) {
			// Convert XYZ to LAB with D65 2 degress as reference white:
			// http://www.brucelindbloom.com/index.html?Eqn_XYZ_to_Lab.html
			const e = 0.008856;
			const k = 903.3;
			// D65 2 degress: https://en.wikipedia.org/wiki/Illuminant_D65
			let x = xyza.x / 0.95047;
			let y = xyza.y / 1.00000;
			let z = xyza.z / 1.08883;
			let fx = x > e ? Math.pow(x, 1 / 3) : (k * x + 16) / 116;
			let fy = y > e ? Math.pow(y, 1 / 3) : (k * y + 16) / 116;
			let fz = z > e ? Math.pow(z, 1 / 3) : (k * z + 16) / 116;
			this.l = 116 * fy - 16;
			this.a = 500 * (fx - fy);
			this.b = 200 * (fy - fz);
			this.alpha = xyza.a * 255;
		}
	}

	/** RGB color with alpha channel. */
	class RGBA {
		/**
		 * RGBA constructor.
		 * @param {number} r red 0~255
		 * @param {number} g green 0~255
		 * @param {number} b blue 0~255
		 * @param {number} a alpha 0~255
		 */
		constructor(r, g, b, a) {
			this.r = Math.min(Math.max(0, r), 255);
			this.g = Math.min(Math.max(0, g), 255);
			this.b = Math.min(Math.max(0, b), 255);
			this.a = Math.min(Math.max(0, a), 255);
		}

		/**
		 * Copy constructor.
		 * @return {RGBA} copy of color
		 */
		copy() {
			return new RGBA(this.r, this.g, this.b, this.a);
		}

		/**
		 * Convert to a Javascript rgba color string.
		 * @returns a Javascript rgba color string
		 */
		toString() {
			return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
		}

		/**
		 * Convert to XYZA color.
		 * @returns {XYZA} color
		 */
		toXYZA() {
			return new XYZA(this);
		}

		/**
		 * Convert to LABAlpha color.
		 * @returns {LABAlpha} color
		 */
		toLABAlpha() {
			return new LABAlpha(new XYZA(this));
		}

		/**
		 * Compare two color difference.
		 * @param {RGBA} c1
		 * @param {RGBA} c2
		 * @returns {number} difference is a scaled value larger than 0
		 */
		static difference(c1, c2) {
			let labaplha1 = new LABAlpha(new XYZA(c1));
			let labaplha2 = new LABAlpha(new XYZA(c2));
			let dl = Math.abs(labaplha1.l - labaplha2.l);
			let da = Math.abs(labaplha1.a - labaplha2.a);
			let db = Math.abs(labaplha1.b - labaplha2.b);
			let dalpha = Math.abs(labaplha1.alpha - labaplha2.alpha);
			return Math.sqrt(dl * dl + da * da + db * db + dalpha * dalpha) / 355;
		}

		/**
		 * Add two colors.
		 * @param {RGBA} c1
		 * @param {RGBA} c2
		 * @returns {RGBA} summary of two colors
		 */
		static add(c1, c2) {
			let r = c1.r + c2.r;
			let g = c1.g + c2.g;
			let b = c1.b + c2.b;
			let a = c1.a + c2.a;
			return new RGBA(r, g, b, a);
		}

		/**
		 * Subtract c2 from c1.
		 * @param {RGBA} c1
		 * @param {RGBA} c2
		 * @returns {RGBA} c1 subtracted by c2
		 */
		static subtract(c1, c2) {
			let r = c1.r - c2.r;
			let g = c1.g - c2.g;
			let b = c1.b - c2.b;
			let a = c1.a - c2.a;
			return new RGBA(r, g, b, a);
		}

		/**
		 * Scale r, g, b, a uniformly by a value.
		 * @param {RGBA} c
		 * @param {number} val
		 * @return {RGBA} scaled color c
		 */
		static scale(c, val) {
			let r = c.r * val;
			let g = c.g * val;
			let b = c.b * val;
			let a = c.a * val;
			return new RGBA(r, g, b, a);
		}

		/** Returns zero valued RGBA color. */
		static zero() {
			return new RGBA(0, 0, 0, 0);
		}

		/** 
		 * Return the length of RGBA vector.  
		 * @param {RGBA} c
		 */
		static length(c) {
			return Math.sqrt(
				c.r * c.r + 
				c.g * c.g + 
				c.b * c.b + 
				c.a * c.a
			);
		}
	}

	module.exports = RGBA;
