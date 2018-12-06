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
		 * @return {Array{RGBA}} an array of reduced colors
		 */
		reduce() {
			// If number of colors is not positve, do not reduce.
			if (this.options.numberOfColors <= 0) {
				return this.pixels;
			}
			// Initialize groups data structure.
			this.groups = [];
			this.groups.push({
				mean: new RGBA(0, 0, 0, 0),
				sd: 0,
				oldList: [],
				newList: []
			});
			// Loop to increase groups sizes to input number.
			while (this.groups.length < this.options.numberOfColors) {
				this.initGroups();
				let iter = 0;
				let change = this.assignGroups();
				while (iter < 100000 && change > this.options.clusterThreshold) {
					this.initGroups();
					change = this.assignGroups();
					iter++;
					console.log("Iteration: " + iter + ", change is: " + change);
				}
				this.updateGroups();
				this.splitGroups();
				Log.info("Color number is " + this.groups.length);
				
			}
			// Map pixels to groups and return pixels.
            this.map();
            return this.pixels;
		}

		/** Initialize groups for next iteration. */
		initGroups() {
			for (let i=0; i<this.groups.length; i++) {
				this.groups[i].oldList = this.groups[i].newList;
				this.groups[i].newList = [];
			}
		}

		/** Assign colors to groups. */
		assignGroups() {
			let colorChanged = 0;
			for (let i=0; i<this.colors.length; i++) {
				let minDiff = 2;
				let groupIndex = 0;
				for (let j=0; j<this.groups.length; j++) {
					let diff = RGBA.difference(this.groups[j].mean, this.colors[i]);
					if (diff < minDiff) {
						minDiff = diff;
						groupIndex = j;
					}
				}
				if (this.groups[groupIndex].oldList.indexOf(this.colors[i]) < 0) {
					colorChanged++;
				}
				this.groups[groupIndex].newList.push(this.colors[i]);
			}

			//console.log(colorChanged / this.colors.length);

			return colorChanged / this.colors.length;
		}

		/** Update groups parameters. */
		updateGroups() {
			for (let i=0; i<this.groups.length; i++) {
				let aggregate = new RGBA(0, 0, 0, 0);
				let r2 = 0, g2 = 0, b2 = 0, a2 = 0;
				let length = this.groups[i].newList.length;
				for (let j=0; j<length; j++) {
					aggregate = RGBA.add(aggregate, 
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
			//console.log(this.groups[0]);
		}

		/** Split the group with the highest sd into 2. */
		splitGroups() {
			// Find group with the largest sd.
			let maxSd = -1;
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
