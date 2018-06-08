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
        static read(input) {
            Log.info('reading input image file from: ' + input);
            return Jimp.read(input);
        }

        /**
         * Pixelize image with options.
         * @param {Jimp} image input image to be pixelized
         * @param {Options} options pixeliation options
         */
        process(image, options) {
            // Step 1: resize input image.
            let resizedImage = resizeImage(image, options);
            // Step 2: convert resized image to pixels.
            let oldPixels = createPixels(resizedImage, 1);
            // Step 3: blur resized image.
            resizedImage.blur(options.pixelSize * options.blurSize);
            // Step 4: create pixels with new pixel size.
            let newPixels = 
                this.createPixels(resizedImage, options.pixelSize);
            // Step 5: clustering pixels.


            return new Promise((resolve, reject) => {

            });
        }

        /**
         * Resize input image width and height to be multiple of new pixel 
         * size, so there will be no artifact lines after pixelization.
         * @param {Jimp} image 
         * @param {Options} options
         * @returns {Jimp}
         */
        static resizeImage(image, options) {
            // Gather parameters.
            let size = options.pixelSize;
            let width = image.bitmap.width;
            let height = image.bitmap.height;
            let resizeAlign = self.options.resizeAlign;
            let resizeFilter = self.options.resizeFilter;
            // New width and height should be quantized by new pixel size.
            let fixedWidth = Math.floor(width / size) * size;
            let fixedHeight = Math.floor(height / size) * size;
            // Use cover mode for resize.
            return image.cover(fixedWidth, fixedHeight, resizeAlign, resizeFilter);
        }

        /**
         * Convert image to pixels controlled by pixel size.
         * @param {Jimp} image 
         * @param {number} size 
         * @return {Pixels}
         */
        createPixels(image, size) {
            let width = image.bitmap.width;
            let height = image.bitmap.height;
            let w = Math.floor(width / size);
            let h = Math.floor(height / size);
            return new Pixels(w, h, size, image);
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