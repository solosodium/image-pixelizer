let assert = require('assert');
let Image = require('../src/image');

describe('Image (image.js)', function() {

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

    it('constructor should correctly initialize image', function() {
        let image = new Image(mockImage);
        assert.equal(image.width, 10);
        assert.equal(image.height, 10);
        assert.equal(image.pixels.length, 10 * 10);
    });

    it('getPixel throws exceptions invalid x and y positions', function() {
        let image = new Image(mockImage);
        assert.throws(
            () => {
                image.getPixel(-1, 5);
            },
            RangeError
        );
        assert.throws(
            () => {
                image.getPixel(5, 20);
            }, 
            RangeError
        );
    });

    it('getPixel returns the correct color', function() {
        let image = new Image(mockImage);
        assert.equal(image.getPixel(3, 6).r, ((3 + 6 * 10) * 4 + 0) % 255);
        assert.equal(image.getPixel(3, 6).g, ((3 + 6 * 10) * 4 + 1) % 255);
        assert.equal(image.getPixel(3, 6).b, ((3 + 6 * 10) * 4 + 2) % 255);
        assert.equal(image.getPixel(3, 6).a, ((3 + 6 * 10) * 4 + 3) % 255);
    });

});
