(function() {

    const Jimp = require('jimp');
    const RGBA = require('./color').RGBA;
    const HSVA = require('./color').HSVA;

    class Pixels {
        /**
         * Create a Jimp image and pixels with an input image.
         * @param {number} width pixels width
         * @param {number} height pixels height
         * @param {number} size pixel size
         * @param {Jimp.Image} image an input Jimp image object
         */
        constructor(width, height, size, image) {
            this.width = width;
            this.height = height;
            this.size = size;
            // Initialize pixels. Each pixel is the average of all the
            // pixels in size * size square in the input image.
            this.pixels = [];
            for (var x=0; x<this.width; x++) {
                for (var y=0; y<this.height; y++) {
                    let h, s, v, a;
                    // Iterate through square.
                    for (var i=0; i<size; i++) {
                        for (var j=0; j<size; j++) {
                            let xx = x * size + i;
                            let yy = y * size + j;
                            let idx = image.getPixelIndex(xx, yy);
                            let rgba = new RGBA(
                                image.bitmap.data[idx + 0],
                                image.bitmap.data[idx + 1],
                                image.bitmap.data[idx + 2],
                                image.bitmap.data[idx + 3]
                            );
                            let hsva = rgba.toHSVA();
                            if (i === 0 && j === 0) {
                                h = hsva.h / size / size;
                                s = hsva.s / size / size;
                                v = hsva.v / size / size;
                                a = hsva.a / size / size;
                            } else {
                                h += hsva.h / size / size;
                                s += hsva.s / size / size;
                                v += hsva.v / size / size;
                                a += hsva.a / size / size;
                            }
                        }
                    }
                    this.pixels[y * width + x] = new HSVA(h, s, v, a);
                }
            }
        }

        /**
         * Get pixel as Color.
         * @param {number} x pixel x position
         * @param {number} y pixel y position
         */
        getPixel(x, y) {
            if (x < 0 || x > this.width - 1) {
                throw new RangeError('x (' + x + ') is not in bound');
            }
            if (y < 0 || y > this.height - 1) {
                throw new RangeError('y (' + y + ') is not in bound');
            }
            return this.pixels[x + y * this.width];
        }
    }

    module.exports = Pixels;

})();
