(function() {

    const Pixels = require('./pixels');
    const RGBA = require('./color');
    const Log = require('./log');

    /**
	 * A color palette utility class.
	 * It can reduce the number of colors of a given pixels to a fixed number.
	 * This is done by comparing color difference.
	 */
	class Palette {

		/**
		 * Default constructor.
		 * @param {Pixels} pixels 
		 */
		constructor(pixels) {
			this.pixels = pixels;
		}

		/**
		 * Reduce the number of colors in pixels.
		 * @param {number} number final number of reduced colors
		 * @return {Array{RGBA}} an array of reduced colors
		 */
		reduce(number) {
            Log.info('Reducing number of colors to ' + number);
			this.eliminate(number);
            this.map();
            return this.pixels;
        }
        
        /** Eliminate the colors in pixels to a fixed number. */
        eliminate(number) {
            // Transform pixels to weighted colors.
			let weightedColors = this.pixels.pixels.map((pixel) => {
				return { weight: 1, color: pixel };
			});
			// Weighted colors length has to be at least 2.
			while (weightedColors.length > Math.max(1, number)) {
				// Find the colors that are closest.
				let minDiff = 1;
				let closestColors = [];
				for (let i=0; i<weightedColors.length; i++) {
					for (let j=i+1; j<weightedColors.length; j++) {
						let diff = RGBA.difference(
							weightedColors[i].color,
							weightedColors[j].color
						);
						if (diff <= minDiff) {
							minDiff = diff;
							closestColors = [
								weightedColors[i],
								weightedColors[j]
							];
						}
					}
				}
				// Compute the reduced weighted color.
				let reducedWeight = closestColors[0].weight + closestColors[1].weight;
				let reducedColor = RGBA.add(
					RGBA.scale(closestColors[0].color, closestColors[0].weight / reducedWeight),
					RGBA.scale(closestColors[1].color, closestColors[1].weight / reducedWeight)
				);
				// Remove closest colors and add the reduced color.
				weightedColors.splice(weightedColors.indexOf(closestColors[0]), 1);
				weightedColors.splice(weightedColors.indexOf(closestColors[1]), 1);
				weightedColors.push(
					{ weight: reducedWeight, color: reducedColor }
                );
                Log.info('Number of colors is reduced to ' + weightedColors.length);
            }
            // Transform weighted colors to reduced colors.
            this.reducedColors = weightedColors.map((weightedColor) => {
                return weightedColor.color;
            });
        }

        /** Map pixels to colors after elimination. */
        map() {
            for (let x=0; x<this.pixels.width; x++) {
                for (let y=0; y<this.pixels.height; y++) {
                    let minDiff = 1;
                    let closestColor = this.pixels.getPixel(x, y).copy();
                    for (let i=0; i<this.reducedColors.length; i++) {
                        let diff = RGBA.difference(
                            this.pixels.getPixel(x, y), 
                            this.reducedColors[i]);
                        if (diff <= minDiff) {
                            minDiff = diff;
                            closestColor = this.reducedColors[i];
                        }
                    }
                    this.pixels.setPixel(x, y, closestColor);
                }
            }
        }
    }
    
    module.exports = Palette;

})();
