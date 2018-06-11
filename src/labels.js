(function() {

    class Labels {

        /**
         * Default constructor.
         * @param {number} width pixels width
         * @param {number} height pixels height
         * @param {number} size new pixel size
         */
        constructor(width, height, size) {
            this.width = width;
            this.height = height;
            this.size = size;
            this.labels = [];
            // Initialize labels.
            for (let x=0; x<width; x++) {
                for (let y=0; y<height; y++) {
                    this.labels[y * width + x] = {
                        x: Math.floor(x / size),
                        y: Math.floor(y / size),
                        changed: true
                    };
                }
            }
            this.counts = [];
        }

        /**
         * Get label at pixel (x, y).
         * @param {number} x 
         * @param {number} y 
         */
        getLabel(x, y) {
            x = Math.max(0, Math.min(x, this.width));
            y = Math.max(0, Math.min(x, this.height));
            return this.labels[y * this.width + x];
        }

        /**
         * Change label at pixel at (x, y) to (labelX, labelY). 
         * @param {number} x 
         * @param {number} y 
         * @param {number} labelX 
         * @param {number} labelY 
         * @param {number} forceChange 
         */
        setLabel(x, y, labelX, labelY, forceChanged) {
            let label = this.getLabel(x, y);
            let changed = forceChanged || 
                (label.x !== labelX && label.y !== labelY);
            this.labels = {
                x: labelX,
                y: labelY,
                changed: changed
            }
        }

    }

    module.exports = Labels;

})();