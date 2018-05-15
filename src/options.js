(function() {

    const Jimp = require("jimp");

    class Options {

        constructor() {
            // Set up default parameters.
            this.resizeAlign = Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE;
            this.resizeFilter = Jimp.RESIZE_BILINEAR;
            this.pixelSize = 1;
            return this;
        }

        /** Set resize align bits (Jimp.HORIZONTAL_ALIGN_*, Jimp.VERTICAL_ALIGN_*). */
        setResizeAlign(align) {
            this.resizeAlign = align;
            return this;
        }

        /** Set resize filter (Jimp.RESIZE_*). */
        setResizeFilter(filter) {
            this.resizeFilter = filter;
            return this;
        }

        /** Set the pixel size after pixelization. */
        setPixelSize(size) {
            this.pixelSize = size;
            return this;
        }

    }

    module.exports = Options;

})();