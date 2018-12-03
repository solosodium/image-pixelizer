(function() {

    const Pixels = require('./pixels');
    const RGBA = require('./color');
	const Log = require('./log');
	const Options = require('./options');

    /**
	 * A color palette utility class.
	 * It can reduce the number of colors of a given pixels to a fixed number.
	 * This is done by comparing color difference.
	 */
	class Palette {

		/**
		 * Default constructor.
		 * @param {Pixels} pixels 
		 * @param {Options} options
		 */
		constructor(pixels, options) {
			this.pixels = pixels;
			this.options = options;
			this.colors = pixels.pixels;
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
		
		/** Create color groups. */
		group(number) {
			// Initialize groups data structure.
			this.groups = [];
			this.groups.push({
				mean: new RGBA(0, 0, 0, 0),
				sd: 0,
				oldList: [],
				newList: []
			});


		}

		/** Initialize groups for next iteration. */
		initGroup() {
			for (let i=0; i<this.groups.length; i++) {
				this.groups[i].oldList = this.groups[i].newList;
				this.groups[i].newList = [];
			}
		}

		/** Assign colors to groups. */
		assignGroup() {
			let colorChanged = 0;
			for (let i=0; i<this.colors.length; i++) {
				let minDiff = 1;
				let groupIndex = 0;
				for (let j=0; j<this.groups.length; j++) {
					let diff = RGBA.difference(this.groups[j].mean, this.colors[i]);
					if (diff < minDiff) {
						minDiff = diff;
						groupIndex = j;
					}
				}
				if (!this.groups[groupIndex].oldList.indexOf(this.colors[i])) {
					colorChanged++;
				}
				this.groups[groupIndex].newList.push(this.colors[i]);
			}
			return colorChanged / this.colors.length;
		}

		/** Update groups parameters. */
		updateGroup() {
			for (let i=0; i<this.groups.length; i++) {
				let aggregate = new RGBA(0, 0, 0, 0);
				let r2 = 0, g2 = 0, b2 = 0, a2 = 0;
				for (let j=0; j<this.groups[i].newList.length; j++) {
					let length = this.groups[i].newList.length;
					RGBA.add(aggregate, 
						RGBA.scale(
							this.groups[i].newList[j], 
							1 / length));
					r2 += this.groups[i].newList[j].r 
						* this.groups[i].newList[j].r 
						/ length;
					g2 += this.groups[i].newList[j].g 
						* this.groups[i].newList[j].g 
						/ length;
					b2 += this.groups[i].newList[j].b 
						* this.groups[i].newList[j].b 
						/ length;
					a2 += this.groups[i].newList[j].a 
						* this.groups[i].newList[j].a 
						/ length;
				}
				this.groups[i].mean = aggregate;
				this.groups[i].sd = (
					Math.sqrt(r2 - aggregate.r * aggregate.r) + 
					Math.sqrt(g2 - aggregate.g * aggregate.g) + 
					Math.sqrt(b2 - aggregate.b * aggregate.b) + 
					Math.sqrt(a2 - aggregate.a * aggregate.a)
				) / 4;
			}
		}

		/** Split the group with the highest sd into 2. */
		splitGroup() {
			// Find group with the largest sd.
			let maxSd = 0;
			let group = null;
			for (let i=0; i<this.groups.length; i++) {
				if (this.groups[i].sd > maxSd) {
					maxSd = this.groups[i].sd;
					group = this.groups[i];
				}
			}
			// Remove group in groups array.
			this.groups.splice(this.groups.indexOf(group), 1);
			// Add two new groups.
			this.groups.push({
				mean: RGBA.scale(group.mean, 0.5),
				sd: 0,
				oldList: [],
				newList: []
			});
			this.groups.push({
				mean: RGBA.scale(group.mean, 1.5),
				sd: 0,
				oldList: [],
				newList: []
			});
		}
        
        /** Eliminate the colors in pixels to a fixed number. */
        eliminate(number) {// Skip if number is non-positive.
			if (number <= 0) {
				this.reducedColors = this.pixels.pixels;
				return this.reducedColors;
			}
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
			return this.reducedColors;
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
