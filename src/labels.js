(function () {

	/** Lables class maintains a label mapping from old pixels to new pixels. */
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
			// List is an array of old pixels clustered to a new pixel.
			this.lists = Array(this.newWidth)
				.fill().map(() => Array(this.newHeight)
					.fill().map(() => Array(0)));
			// Initialize labels and counts.
			for (let x = 0; x < this.oldWidth; x++) {
				for (let y = 0; y < this.oldHeight; y++) {
					// Get new pixel position.
					let xx = Math.floor(x / size);
					let yy = Math.floor(y / size);
					this.labels[x][y] = { x: xx, y: yy, changed: true };
					this.lists[xx][yy].push({ x: x, y: y });
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
		 * Change label of old pixel at (x, y) to (xx, yy).
		 * @param {number} x
		 * @param {number} y
		 * @param {number} xx
		 * @param {number} yy
		 */
		setLabel(x, y, xx, yy) {
			x = Math.max(0, Math.min(x, this.oldWidth - 1));
			y = Math.max(0, Math.min(y, this.oldHeight - 1));
			xx = Math.max(0, Math.min(xx, this.newWidth - 1));
			yy = Math.max(0, Math.min(yy, this.newHeight - 1));
			let label = this.getLabel(x, y);
			let pos = { x: x, y: y };
			// Update lists.
			let idx = this.lists[label.x][label.y]
				.findIndex(pos => pos.x == x && pos.y == y);
			if (idx > -1) {
				this.lists[label.x][label.y].splice(idx, 1);
				this.lists[xx][yy].push(pos);
			}
			// Update labels.
			let changed = (label.x !== xx) || (label.y !== yy);
			this.labels[x][y] = {
				x: xx,
				y: yy,
				changed: changed
			}
		}

		/**
		 * Get a list of old pixels clustered to new pixel at (xx, yy).
		 * @param {number} xx
		 * @param {number} yy
		 */
		getList(xx, yy) {
			xx = Math.max(0, Math.min(xx, this.newWidth - 1));
			yy = Math.max(0, Math.min(yy, this.newHeight - 1));
			return this.lists[xx][yy];
		}

	}

	module.exports = Labels;

})();
