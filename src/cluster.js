(function() {

    const Pixels = require('./pixels');
    const HSVA = require('./color').HSVA;

    class Cluster {
        
        /**
         * Default constructor.
         * @param {Pixels} oldPixels pixel representation of the old image 
         * @param {Pixels} newPixels pixel representation of the new image
         */
        constructor(oldPixels, newPixels) {
            this.oldPixels = oldPixels;
            this.newPixels = newPixels;
            this.labels = [];
            this.size = Math.round(     // new pixel size relative to old
                (this.oldPixels.width / this.newPixels.width 
                + this.oldPixels.height / this.newPixels.height) / 2);
            // TODO: initialize new pixels should make a difference
            this.initialize();
        }

        /** Initialize cluster data. */
        initialize() {
            // Labels are for each individual old pixel, which indicates 
            // which cluster (new pixel) it belongs to.
            for (let x=0; x<this.oldPixels.width; x++) {
                for (let y=0; y<this.oldPixels.height; y++) {
                    this.labels[x + y * this.oldPixels.width] 
                        = { x: -1, y: -1 };
                }
            }
        }

        /** Assgin old pixels with labels. */
        map() {
            let acc = 0;
            for (let x=0; x<this.oldPixels.width; x++) {
                for (let y=0; y<this.oldPixels.height; y++) {
                    // Get default label (new pixel it belongs to).
                    let label = {
                        x: Math.floor(x / this.size),
                        y: Math.floor(y/ this.size)
                    };
                    // Generate permutation (9 neighbors).
                    let permutations = [
                        { x: -1, y: -1 }, { x:  0, y: -1 },
                        { x:  1, y: -1 },   // Row 1
                        { x: -1, y:  0 }, { x:  0, y:  0 },
                        { x:  1, y:  0 },   // Row 2
                        { x: -1, y:  1 }, { x:  0, y:  1 },
                        { x:  1, y:  1 }    // Row 3
                    ];
                    // Iterate through all neighbors.
                    let permutation;
                    let cost = 1;
                    for (let n=0; n<permutations.length; n++) {
                        let xx = label.x + permutations[n];
                        let yy = label.x + permutations[n];
                        if (xx >= 0 && xx < this.newPixels.width && 
                            yy >= 0 && yy < this.newPixels.height) {
                            
                        }
                    }
                }
            }
        }

        /** Clustering algorithm, compute the new pixels. */
        cluster() {
            
        }



        /** Result is clusted new pixels. */
        getResult() {
            return this.newPixels;
        }

        /**
         * Calculate the distance between old pixel 1 and new pixel 2.
         * The distance is calculated for both color difference and 
         * physical distance (evaluated as minimum 1D Manhattan).
         * @param {number} x1 old pixel 1 x index 
         * @param {number} y1 old pixel 1 y index
         * @param {number} x2 new pixel 2 x index
         * @param {number} y2 new pixel 2 y index
         * @param {number} size size of the new pixel
         * @param {number} mix mixing ratio of color and physical distance
         */
        pixelDistance(x1, y1, x2, y2, size, mix) {
            // New pixel is transformed to old pixel equivalent.
            
            let dx = Math.abs(x1 - x2);
            let dy = Math.abs(y1 - y2);
            return Math.max(dx, dy) / size;
        }

        /**
         * Calculate the differnce between HSVA color 1 and 2.
         * @param {HSVA} c1 color 1 
         * @param {HSVA} c2 color 2
         */
        colorDifference(c1, c2) {
            let dh = Math.abs(c1.h - c2.h) / 360;
        }

    }

    module.exports = Cluster;

})();
