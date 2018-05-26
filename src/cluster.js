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
            // Verify new pixel size is correct.
            let widthSize = Math.floor(oldPixels.width / newPixels.width);
            let heightSize 
                = Math.floor(oldPixels.height / newPixels.height);
            if (widthSize !== heightSize) {
                throw new Error('width(' + widthSize + ') and height('
                    + heightSize + ') sizes fail to match');
            }
            this.size = widthSize;
            if (oldPixels.width !== this.size * newPixels.width) {
                throw new Error('invalid old width(' + oldPixels.width
                    + '), size(' + this.size + '), new width(' 
                    + newPixels.width + ') combination');
            }
            if (oldPixels.height !== this.size * newPixels.height) {
                throw new Error('invalid old height(' + oldPixels.height
                    + '), size(' + this.size + '), new height(' 
                    + newPixels.height + ') combination');
            }
            // TODO: mix should be fine tuned.
            this.mix = 0.5;
            // Labels are for each individual old pixel, which indicates 
            // which cluster (new pixel) it belongs to.
            for (let x=0; x<this.oldPixels.width; x++) {
                for (let y=0; y<this.oldPixels.height; y++) {
                    this.labels[x + y * this.oldPixels.width] 
                        = { x: -1, y: -1 };
                }
            }
        }

        /** Clustering algorithm, compute the new pixels. */
        cluster() {
            let acc = map();
        }

        /** Assgin old pixels with labels. */
        map() {
            // Set an accumulator for number of changed labels.
            let acc = 0;
            for (let x=0; x<this.oldPixels.width; x++) {
                for (let y=0; y<this.oldPixels.height; y++) {
                    // Get default label (new pixel it belongs to).
                    let label = {
                        x: Math.floor(x / this.size),
                        y: Math.floor(y / this.size)
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
                    this.saveLabel(x, y, {
                        x: label.x,
                        y: label.y
                    });
                }
            }
            return acc;
        }

        /** Based on assgined labels, calculate new pixel values. */
        reduce() {

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
        
        readLabel(x, y) {
            return this.labels[x + y * this.oldPixels.width];
        }

        saveLabel(x, y, val) {
            this.labels[x + y * this.oldPixels.width] = val;
        }

    }

    module.exports = Cluster;

})();
