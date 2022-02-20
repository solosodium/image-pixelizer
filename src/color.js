	/**
	 * Color in XYZ color space with alpha channel.
	 */
	 class XYZA {
		/**
		 * XYZA constructor.
		 * @param {RGBA} rgba
		 */
		 constructor(rgba) {
			// Convert sRGB to XYZ with D65 as reference white: 
			// http://www.brucelindbloom.com/index.html?Eqn_RGB_to_XYZ.html
			let r = rgba.r / 255;
			let g = rgba.g / 255;
			let b = rgba.b / 255;
			let a = rgba.a / 255;
			this.x = 0.4124564 * r + 0.3575761 * g + 0.1804375 * b;
			this.y = 0.2126729 * r + 0.7151522 * g + 0.0721750 * b;
			this.z = 0.0193339 * r + 0.1191920 * g + 0.9503041 * b;
			this.a = a;
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
			// Convert XYZ to LAB with D65 as reference white:
			// http://www.brucelindbloom.com/index.html?Eqn_XYZ_to_Lab.html
			const e = 0.008856;
			const k = 903.3;
			// XYZ D65 values: https://en.wikipedia.org/wiki/Illuminant_D65
			let x = xyza.x / 0.31271;
			let y = xyza.y / 0.32902;
			let z = xyza.z / 0.35827;
			let a = xyza.a * 255;
			let fx = x > e ? Math.cbrt(x) : (k * x + 16) / 116;
			let fy = y > e ? Math.cbrt(y) : (k * y + 16) / 116;
			let fz = z > e ? Math.cbrt(z) : (k * z + 16) / 116;
			this.l = 116 * fy - 16;
			this.a = 500 * (fx - fy);
			this.b = 200 * (fy - fz);
			this.alpha = a;
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
		 * Compare two color difference.
		 * @param {RGBA} c1
		 * @param {RGBA} c2
		 * @returns {number} difference is a scaled value larger than 0
		 */
		static difference(c1, c2) {
			let labaplha1 = new LABAlpha(new XYZA(c1));
			let labaplha2 = new LABAlpha(new XYZA(c2));
			let dl = Math.abs(labaplha1.l - labaplha2.l) / 100;
			let da = Math.abs(labaplha1.a - labaplha2.a) / 220;
			let db = Math.abs(labaplha1.b - labaplha2.b) / 220;
			let dalpha = Math.abs(labaplha1.alpha - labaplha2.alpha) / 255;
			return (dl + da + db + dalpha) / 4;
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
