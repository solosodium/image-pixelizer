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

            console.log(this.newWidth, this.newHeight);

            // Label is for each 
            this.labels = Array(this.oldWidth)
                .fill()
                .map(() => Array(this.oldHeight));
            this.counts = Array(this.newWidth)
                .fill()
                .map(() => Array(this.newHeight).fill(0));
            // Initialize labels and counts.
            for (let x=0; x<this.oldWidth; x++) {
                for (let y=0; y<this.oldHeight; y++) {
                    // Get new pixel position.
                    let xx = Math.floor(x / size);
                    let yy = Math.floor(y / size);
                    // Set label.
                    this.labels[x][y] = {
                        x: xx,
                        y: yy,
                        changed: true
                    };
                    // Set count.
                    this.counts[xx][yy] += 1;
                }
            }
        }

        /**
         * Get label at pixel (x, y).
         * @param {number} x 
         * @param {number} y 
         */
        getLabel(x, y) {
            x = Math.max(0, Math.min(x, this.oldWidth));
            y = Math.max(0, Math.min(x, this.oldHeight));
            return this.labels[x][y];
        }

        /**
         * Change label at pixel at (x, y) to (labelX, labelY). 
         * @param {number} x 
         * @param {number} y 
         * @param {number} labelX 
         * @param {number} labelY 
         */
        setLabel(x, y, labelX, labelY) {
            let label = this.getLabel(x, y);
            let changed = (label.x !== labelX) && (label.y !== labelY);
            this.labels[x][y] = {
                x: labelX,
                y: labelY,
                changed: changed
            }
        }

    }

    module.exports = Labels;

})();