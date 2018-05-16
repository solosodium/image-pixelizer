(function() {

    const Jimp = require("jimp");

    class Pixelizer {

        /**
         * Load, pixelize, and output image.
         * @param {string} input complete path of the input file
         * @param {string} output complete path of the output file
         * @param {object} options options for pixelizer 
         */
        constructor(input, output, options) {
            // Cache parameters.
            this.input = input;
            this.output = output;
            this.options = options;
            // Bootstrap.
            var self = this;
            Jimp.read(input, (error, image) => {
                if (error) {
                    self.pixelizerError(error);
                }
                self.loadImageSuccess(self, image);
            });
        }

        // All functions below have a 'self' argument as they are part of callback functions. 

        loadImageSuccess(self, image) {
            self.image = image;
            self.image = self.resizeImage(self);
            self.saveImage(self);
        }

        resizeImage(self) {
            let size = self.options.pixelSize;
            let width = self.image.bitmap.width;
            let height = self.image.bitmap.height;
            // New width and height should be quantized by new pixel size.
            let w = Math.floor(width / size) * size;
            let h = Math.floor(height / size) * size;
            // Use cover mode.
            let resizeAlign = self.options.resizeAlign;
            let resizeFilter = self.options.resizeFilter;
            return image.cover(w, h, resizeAlign, resizeFilter);
        }

        createPixels(self) {
            
        }

        saveImage(self, image) {
            return image.write(self.output, (error, image) => {
                if (error) {
                    this.pixelizerError(error);
                }
            });
        }

        pixelizerError(error) {
            throw error;
        }
    }

    /** Export Pixelizer class. */
    module.exports = Pixelizer;

})();