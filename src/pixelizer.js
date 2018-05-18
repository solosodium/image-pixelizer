(function() {

    const Jimp = require('jimp');
    const Pixels = require('./pixels');
    const Options = require('./options');

    class Pixelizer {

        /**
         * Load, pixelize, and output image.
         * @param {string} input complete path of the input file
         * @param {string} output complete path of the output file
         * @param {Options} options options for pixelizer 
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

        loadImageSuccess(self, image) {
            // Resize image with new pixel size.
            image = self.resizeImage(self, image);
            // Create a pixels representation of image.
            var oldPixels = self.createPixels(self, image, 1);
            // Create a pixel representation of image with new pixel size.
            var newPixels = self.createPixels(self, image, self.options.pixelSize);
            // Save new pixels as output image.
            self.saveImage(self, newPixels.toImage());
        }

        resizeImage(self, image) {
            let size = self.options.pixelSize;
            let width = image.bitmap.width;
            let height = image.bitmap.height;
            // New width and height should be quantized by new pixel size.
            let fixedWidth = Math.floor(width / size) * size;
            let fixedHeight = Math.floor(height / size) * size;
            // Use cover mode.
            let resizeAlign = self.options.resizeAlign;
            let resizeFilter = self.options.resizeFilter;
            return image.cover(fixedWidth, fixedHeight, resizeAlign, resizeFilter);
        }

        createPixels(self, image, size) {
            let width = image.bitmap.width;
            let height = image.bitmap.height;
            let w = Math.floor(width / size);
            let h = Math.floor(height / size);
            return new Pixels(w, h, size, image);
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

    module.exports = Pixelizer;

})();