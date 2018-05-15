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

        // All functions below have a 'self' argument as they are part of Promise callback functions. 

        loadImageSuccess(self, image) {
            self.image = image;
            self.resizeImage(self);
            console.log(self.image);
        }

        resizeImage(self) {
            let size = self.options.size;
            let width = self.image.bitmap.width;
            let height = self.image.bitmap.height;
            // New width and height should be quantized by new pixel size.
            let w = Math.floor(width / size) * size;
            let h = Math.floor(height / size) * size;
            // Use cover mode.
            self.image.cover(w, h, self.options.resizeAlign, self.options.resizeFilter);
        }

        saveImage(self, image) {
            return image.write(self.output);
        }

        pixelizerError(error) {
            throw error;
        }
    }

    /** Export Pixelizer class. */
    module.exports = Pixelizer;

})();