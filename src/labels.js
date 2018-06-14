(function() {

    class Labels {

        /**
         * Default constructor.
         * @param {number} width old pixels width
         * @param {number} height old pixels height
         * @param {number} size new pixel size
         */
        constructor(width, height, size) {
            this.oldWidth = width;
            this.oldHeight = height;
            this.size = size;
            // Create new pixels width and height.
            this.newWidth = Math.ceil(this.oldWidth / this.size);
            this.newHeight = Math.ceil(this.oldHeight / this.size);
            // Label is for each old pixel to map to a new pixel.
            this.labels = Array(this.oldWidth)
                .fill().map(() => Array(this.oldHeight));
            // Count is the number of old pixels mapped to a new pixel. 
            this.counts = Array(this.newWidth)
                .fill().map(() => Array(this.newHeight).fill(0));
            // Initialize labels and counts.
            for (let x=0; x<this.oldWidth; x++) {
                for (let y=0; y<this.oldHeight; y++) {
                    // Get new pixel position.
                    let xx = Math.floor(x / size);
                    let yy = Math.floor(y / size);
                    this.labels[x][y] = { x: xx, y: yy, changed: true };
                    this.counts[xx][yy] += 1;
                }
            }
        }

        /**
         * Get old pixel label at (x, y).
         * @param {number} x 
         * @param {number} y 
         */
        getLabel(x, y) {
            x = Math.max(0, Math.min(x, this.oldWidth - 1));
            y = Math.max(0, Math.min(y, this.oldHeight - 1));
            return this.labels[x][y];
        }

        /**
         * Change label at old pixel at (x, y) to (labelX, labelY). 
         * @param {number} x 
         * @param {number} y 
         * @param {number} labelX 
         * @param {number} labelY 
         */
        setLabel(x, y, labelX, labelY) {
            x = Math.max(0, Math.min(x, this.oldWidth - 1));
            y = Math.max(0, Math.min(y, this.oldHeight - 1));
            labelX = Math.max(0, Math.min(labelX, this.newWidth - 1));
            labelY = Math.max(0, Math.min(labelY, this.newHeight - 1));
            let label = this.getLabel(x, y);
            // Update counts.
            this.counts[label.x][label.y] -= 1;
            this.counts[labelX][labelY] += 1;
            // Update labels.
            let changed = (label.x !== labelX) || (label.y !== labelY);
            this.labels[x][y] = {
                x: labelX,
                y: labelY,
                changed: changed
            }
        }

        /**
         * Get the number of old pixels clustered to new pixel at (x, y).
         * @param {number} x 
         * @param {number} y 
         */
        getCount(x, y) {
            x = Math.max(0, Math.min(x, this.newWidth - 1));
            y = Math.max(0, Math.min(y, this.newHeight - 1));
            return this.counts[x][y];
        }

    }

    module.exports = Labels;

})();