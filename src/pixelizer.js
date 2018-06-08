(function() {

    const Jimp = require('jimp');
    const Log = require('./log');
    const Pixels = require('./pixels');
    const Options = require('./options');
    const Cluster =require('./cluster');

    /**
     * Pixelizer main class.
     * Responsible for: loading input image file, pixelizing input file,
     * and output to image files.
     */
    class Pixelizer {

        /** Default constructor. */
        constructor() {
            // Do nothing.
        }

        /**
         * Read an input image file.
         * @param {string} input file path to input image file 
         */
        read(input) {
            Log.info('reading input image file from: ' + input);
            return Jimp.read(input);
        }

        test(image) {
            console.log(image);
            return new Promise((resolve, reject) => {
                resolve('test');
            });
        }

        pixelizeImage(self, image) {
            // Resize image with new pixel size.
            image = self.resizeImage(self, image);
            // Create a pixels representation of image.
            var oldPixels = self.createPixels(self, image, 1);
            // Blur image by new pixel size first.
            image.blur(self.options.pixelSize / 2);
            // Create a pixel representation of image with new pixel size.
            var newPixels = self.createPixels(self, image, self.options.pixelSize);
            // Create cluster.
            var cluster = self.createCluster(self, oldPixels, newPixels);
            cluster.cluster();
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

        createCluster(self, oldPixels, newPixels) {
            return new Cluster(oldPixels, newPixels);
        }

        saveImage(self, image) {
            return image.write(self.output, (error, image) => {
                if (error) {
                    throw error;
                }
            });
        }
    }

    Pixelizer.Options = Options;
    module.exports = Pixelizer;

})();