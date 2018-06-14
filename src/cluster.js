(function() {

    const Pixels = require('./pixels');
    const HSVA = require('./color').HSVA;
    const Options = require('./options');
    const Labels = require('./labels');
    const Log = require('./log');

    class Cluster {
        
        /**
         * Default constructor.
         * @param {Pixels} oldPixels pixels of the old image 
         * @param {Pixels} newPixels pixels of the new image
         * @param {Options} options pixelization options
         */
        constructor(oldPixels, newPixels, options) {
            this.oldPixels = oldPixels;
            this.newPixels = newPixels;
            this.options = options;
            this.labels = new Labels(
                oldPixels.width, oldPixels.height, options.pixelSize);
        }

        /** Map old pixels to new pixels, and update new pixels. */
        cluster() {
            Log.info("Clustering started.");
            for (let i=0; i<this.options.maxIteration; i++) {
                let pixelChangeCount = this.map();
                this.reduce();
                let percentage = pixelChangeCount 
                    / this.oldPixels.width / this.oldPixels.height;
                Log.info("Cluster iteration " + i
                    + ", change % is "+ percentage);
                if (percentage < this.options.clusterThreshold) {
                    break;
                }
            }
            Log.info("Clustering done.");
            return this;
        }

        /** Assgin old pixels with new pixel labels. */
        map() {
            // Set an accumulator for number of changed labels.
            let acc = 0;
            for (let x=0; x<this.oldPixels.width; x++) {
                for (let y=0; y<this.oldPixels.height; y++) {
                    // Get corresponding new pixel position.
                    let xx = Math.floor(x / this.options.pixelSize);
                    let yy = Math.floor(x / this.options.pixelSize);
                    // Generate 9 neighboring pixels permutation.
                    let permutations = [
                        {x: -1, y: -1}, {x: 0, y: -1}, {x: 1, y: -1},
                        {x: -1, y:  0}, {x: 0, y:  0}, {x: 1, y:  0},
                        {x: -1, y:  1}, {x: 0, y:  1}, {x: 1, y:  1}
                    ];
                    // Iterate through all neighbors.
                    let permutation;
                    let cost = Number.MAX_VALUE;
                    for (let n=0; n<permutations.length; n++) {
                        let xx = label.x + permutations[n].x;
                        let yy = label.y + permutations[n].y;
                        if (xx >= 0 && xx < this.newPixels.width && 
                            yy >= 0 && yy < this.newPixels.height) {
                            let c = this.pixelDistance(
                                x, y,       // Old pixel index
                                xx, yy,     // New pixel index
                                this.size,  // New pixel size
                                this.mix    // Distance mix
                            );
                            if (c < cost) {
                                cost = c;
                                permutation = permutations[n];
                            }
                        }
                    }
                    // Update new label.
                    label.x = label.x + permutation.x
                    label.y = label.y + permutation.y;
                    // Check if old label is changed to a new label.
                    let l = this.readLabel(x, y);
                    if (l.x !== label.x || l.y !== label.y) {
                        acc++;
                    }
                    // Save new label.
                    this.writeLabel(x, y, {
                        x: label.x,
                        y: label.y
                    });
                }
            }
            return acc;
        }

        /** Based on assgined labels, calculate new pixel values. */
        reduce() {
            // Tansform labels to new pixels space. Map will be map new 
            // pixel to a list of old pixels.
            let map = [];
            for (let x=0; x<this.newPixels.width; x++) {
                for (let y=0; y<this.newPixels.height; y++) {
                    map[x + y * this.newPixels.width] = [];
                }
            }
            for (let x=0; x<this.oldPixels.width; x++) {
                for (let y=0; y<this.oldPixels.height; y++) {
                    let l = this.readLabel(x, y);
                    map[l.x + l.y * this.newPixels.width].push({
                        x: x,
                        y: y
                    });
                }
            }
            // Assgin values to new pixels.
            for (let x=0; x<this.newPixels.width; x++) {
                for (let y=0; y<this.newPixels.height; y++) {
                    let h = 0, s = 0, v = 0, a = 0;
                    let ls = map[x + y * this.newPixels.width];
                    for (let i=0; i<ls.length; i++) {
                        let l = ls[i];
                        let p = this.oldPixels.getPixel(l.x, l.y);
                        h += p.h / ls.length;
                        s += p.s / ls.length;
                        v += p.v / ls.length;
                        a += p.a / ls.length;
                    }
                    this.newPixels.setPixel(x, y, new HSVA(h, s, v, a));
                }
            }

        }

        /** Result is clusted new pixels. */
        getResult() {
            return this.newPixels;
        }

        /**
         * Calculate the distance between old pixel 1 and new pixel 2.
         * The distance is calculated for both color difference and 
         * physical distance (evaluated as minimum 1D Manhattan). The old
         * and new pixels should be neighbors, which means once new pixel
         * is transformed to old pixel space, their 1D Manhattan distance
         * should be less than new pixel size.
         * @param {number} x1 old pixel 1 x index 
         * @param {number} y1 old pixel 1 y index
         * @param {number} x2 new pixel 2 x index
         * @param {number} y2 new pixel 2 y index
         * @param {number} size size of the new pixel
         * @param {number} mix mixing ratio of color and physical distance
         *     the ratio should between 0 to 1, and value is proportional
         *     to the color distance (mix), and complementary proportional
         *     to physical distance (1 - mix)
         */
        pixelDistance(x1, y1, x2, y2, size, mix) {
            // Precheck pixel index range.
            if (x1 < 0 || x1 >= this.oldPixels.width 
                || y1 < 0 || y1 >= this.oldPixels.height) {
                throw new Error('x1 (' + x1 + '), y1 (' + y1
                    + ') is out of range');
            }
            if (x2 < 0 || x2 >= this.newPixels.width 
                || y2 < 0 || y2 >= this.newPixels.height) {
                throw new Error('x2 (' + x2 + '), y2 (' + y2
                    + ') is out of range');
            }
            // Calculate color distance.
            let op = this.oldPixels.getPixel(x1, y1);
            let np = this.newPixels.getPixel(x2, y2);
            let cd = HSVA.difference(op, np);
            // New pixel is transformed to old pixel equivalent.
            let x2t = x2 * size + (size - 1) / 2;
            let y2t = y2 * size + (size - 1) / 2;
            // Calculate physical distance.
            let dx = Math.abs(x1 - x2t);
            let dy = Math.abs(y1 - y2t);
            let dxy = Math.max(dx, dy);
            // Make sure distance is less than size.
            if (dxy > size * 1.5) {
                throw new Error('old (' + x1 + ', ' + y1
                    + ') and new (' + x2 + ', ' + y2
                    + ') pixels are not neighbors');
            }
            let pd = dxy / size;
            // Return distance with mix factor.
            return mix * cd + (1 - mix) * pd;
        }

    }

    module.exports = Cluster;

})();
