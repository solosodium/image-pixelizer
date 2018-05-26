const assert = require('assert');
const Pixels = require('../src/pixels');

describe('Pixels (pixels.js)', () => {

    let mockImage = {
        bitmap: {
            width: 10,
            height: 10,
            data: []
        },
        getPixelIndex: function(x, y) {
            return (x + y * 10) * 4;
        }
    };
    for (var i=0; i<10 * 10 * 4; i++) {
        mockImage.bitmap.data.push(i % 255);
    }

    it('constructor should correctly initialize pixels', () => {
        let pixels = new Pixels(5, 5, 2, mockImage);
        assert.equal(pixels.width, 5);
        assert.equal(pixels.height, 5);
        assert.equal(pixels.pixels.length, 5 * 5);
    });

    it('constructor should throw exception for invalid inputs', () => {
        assert.throws(
            () => new Pixels(6, 5, 2, mockImage), 
            Error
        );
        assert.throws(
            () => new Pixels(5, 6, 2, mockImage), 
            Error
        );
    });

    it('getPixel throws exceptions invalid x and y positions', () => {
        let pixels = new Pixels(5, 5, 2, mockImage);
        assert.throws(
            () => pixels.getPixel(-1, 3),
            Error
        );
        assert.throws(
            () => pixels.getPixel(2, 8), 
            Error
        );
    });

    it('getPixel returns the correct color', () => {
        let pixels = new Pixels(5, 5, 2, mockImage);
        assert(Math.abs(pixels.getPixel(2, 2).h - 210) < 1);
        assert(Math.abs(pixels.getPixel(2, 2).s - 0.010) < 0.001);
        assert(Math.abs(pixels.getPixel(2, 2).v - 0.784) < 0.001);
        assert(Math.abs(pixels.getPixel(2, 2).a - 0.788) < 0.001);
    });

    it('toImage should return the correct image', () => {
        let pixels = new Pixels(5, 5, 2, mockImage);
        let image = pixels.toImage();
        let idx = image.getPixelIndex(2, 2);
        assert.equal(image.bitmap.data[idx + 0], 198);
        assert.equal(image.bitmap.data[idx + 1], 199);
        assert.equal(image.bitmap.data[idx + 2], 200);
        assert.equal(image.bitmap.data[idx + 3], 201);
    });

});
