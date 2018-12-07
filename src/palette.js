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
			this.groups = [];
		}

		/**
		 * Reduce the number of colors in pixels.
		 * @return {Array{RGBA}} an array of reduced colors
		 */
		reduce() {
			// If number of colors is not positve, do not reduce.
			if (this.options.numberOfColors <= 0) {
				return this.pixels;
			}
			// Loop to increase groups sizes to input number.
			this.initGroups();
			while (this.groups.length < this.options.numberOfColors) {
				this.splitGroups();
				let iter = 0;
				let change = 2;
				while (iter < 100000 && change > this.options.clusterThreshold) {
					change = this.assignGroups();
					this.updateGroups();
					iter++;
				}
			}
			// Map pixels to groups and return pixels.
            this.map();
            return this.pixels;
		}

		/** Initialize groups for next iteration. */
		initGroups() {
			this.groups.push({
				mean: RGBA.zero(),
				sd: RGBA.zero(),
				oldList: [],
				newList: []
			});
		}

		/** Assign colors to groups. */
		assignGroups() {
			// Assign colors to groups.
			let colorChanged = 0;
			for (let i=0; i<this.colors.length; i++) {
				let minDiff = 2;
				let groupIndex = -1;
				for (let j=0; j<this.groups.length; j++) {
					let diff = RGBA.difference(this.groups[j].mean, this.colors[i]);
					if (diff < minDiff) {
						minDiff = diff;
						groupIndex = j;
					}
				}
				this.groups[groupIndex].newList.push(this.colors[i]);
				if (this.groups[groupIndex].oldList.indexOf(this.colors[i]) < 0) {
					colorChanged++;
				}
			}
			// Swap old list with new list.
			for (let i=0; i<this.groups.length; i++) {
				this.groups[i].oldList = this.groups[i].newList;
				this.groups[i].newList = [];
			}
			return colorChanged / this.colors.length;
		}

		/** Update groups parameters. */
		updateGroups() {
			for (let i=0; i<this.groups.length; i++) {
				let aggregate = RGBA.zero();
				let r2 = 0, g2 = 0, b2 = 0, a2 = 0;
				let length = this.groups[i].oldList.length;
				for (let j=0; j<length; j++) {
					let color = this.groups[i].oldList[j];
					aggregate = RGBA.add(aggregate, RGBA.scale(color, 1 / length));
					r2 += color.r * color.r / length;
					g2 += color.g * color.g / length;
					b2 += color.b * color.b / length;
					a2 += color.a * color.a / length;;
				}
				this.groups[i].mean = aggregate;
				this.groups[i].sd = new RGBA(
					Math.sqrt(r2 - aggregate.r * aggregate.r),
					Math.sqrt(g2 - aggregate.g * aggregate.g), 
					Math.sqrt(b2 - aggregate.b * aggregate.b), 
					Math.sqrt(a2 - aggregate.a * aggregate.a)
				);
			}
		}

		/** Split the group with the highest sd into 2. */
		splitGroups() {
			// Find group with the largest sd.
			let maxSd = -1;
			let group = null;
			for (let i=0; i<this.groups.length; i++) {
				if (RGBA.length(this.groups[i].sd) >= maxSd) {
					maxSd = RGBA.length(this.groups[i].sd);
					group = this.groups[i];
				}
			}
			// Remove group in groups array.
			this.groups.splice(this.groups.indexOf(group), 1);
			// Add two new groups.
			this.groups.push({
				mean: RGBA.subtract(group.mean, group.sd),
				sd: RGBA.zero(),
				oldList: [],
				newList: []
			});
			this.groups.push({
				mean: RGBA.add(group.mean, group.sd),
				sd: RGBA.zero(),
				oldList: [],
				newList: []
			});
		}

        /** Map pixels to color groups. */
        map() {
            for (let x=0; x<this.pixels.width; x++) {
                for (let y=0; y<this.pixels.height; y++) {
                    let minDiff = 2;
                    let closestColor = this.pixels.getPixel(x, y);
                    for (let i=0; i<this.groups.length; i++) {
                        let diff = RGBA.difference(
                            this.pixels.getPixel(x, y), 
                            this.groups[i].mean);
                        if (diff <= minDiff) {
                            minDiff = diff;
                            closestColor = this.groups[i].mean;
                        }
                    }
                    this.pixels.setPixel(x, y, closestColor);
                }
            }
        }
    }
    
    module.exports = Palette;

})();
