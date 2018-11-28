(function () {

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
			this.r = clamp(r, 0, 255);
			this.g = clamp(g, 0, 255);
			this.b = clamp(b, 0, 255);
			this.a = clamp(a, 0, 255);
		}

		/**
		 * Compare two color difference.
		 * @param {RGBA} c1
		 * @param {RGBA} c2
		 * @returns {number} difference is a scaled value less than 1 but greater than 0
		 */
		static difference(c1, c2) {
			let dr = Math.abs(c1.r - c2.r);
			let dg = Math.abs(c1.g - c2.g);
			let db = Math.abs(c1.b - c2.b);
			let da = Math.abs(c1.a - c2.a);
			return (dr + dg + db + da) / 4 / 255;
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
	}

	/**
	 * A color palette utility class.
	 * It can reduce a list of colors to a fixed number of colors.
	 * This is done by comparing color difference.
	 */
	class Palette {

		/**
		 * Default constructor.
		 * @param {Array{RGBA}} colors a list of RGBA colors
		 */
		constructor(colors) {
			this.colors = colors;
		}

		/**
		 * 
		 * @param {number} number final number of colors
		 */
		reduce(number) {
			
		}
	}

	/** Clamp value between min and max values. */
	function clamp(val, min, max) {
		return Math.min(Math.max(min, val), max);
	}

	/** Color module for color related classes. */
	module.exports = {
		RGBA: RGBA,
		Palette: Palette
	};

})();
