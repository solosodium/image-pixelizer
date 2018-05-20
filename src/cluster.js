(function() {

    const Pixels = require('./pixels');

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
            this.clusters = [];
            this.initLabelsAndClusters();
        }

        initLabelsAndClusters() {
            // Labels are for each individual old pixels, which indicate 
            // which cluster (new pixel) it belongs to. The label is a 
            // string of the format 'x,y', default value is 'null'.
            for (let x=0; x<this.oldPixels.width; x++) {
                for (let y=0; y<this.oldPixels.height; y++) {
                    this.labels[x + y * this.oldPixels.width] = 'null';
                }
            }
            // Clusters are for each individual new pixelx, which is the
            // number of old pixels it includes. Default value is 0.
            for (let x=0; x<this.newPixels.width; x++) {
                for (let y=0; y<this.newPixels.height; y++) {
                    this.clusters[x + y * this.newPixels.width] = 0;
                }
            }
        }

        cluster() {
            // Calculate basic metrics.
            let size = Math.round(
                (this.oldPixels.width / this.newPixels.width 
                + this.oldPixels.height / this.newPixels.height) / 2
            );

        }

        getResult() {
            return this.newPixels;
        }

        /**
         * Calculate the distance between pixel 1 and 2.
         * The distance is calculated from the maximum of x and y 
         * coordinate difference, rather than Euclidean distance.
         */
        pixelDistance(x1, y1, x2, y2) {
            return Math.max(Math.abs(x1 - x2), Math.abs(y1 - y2));
        }

    }

    module.exports = Cluster;

})();