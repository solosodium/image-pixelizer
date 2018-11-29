const assert = require('assert');
const Pixels = require('../src/pixels');
const RGBA = require('../src/color');
const Palette = require('../src/palette');

describe('Palette', () => {

    let mockImage = {
		bitmap: {
			width: 10,
			height: 10,
			data: []
		},
		getPixelIndex: function (x, y) {
			return (x + y * 10) * 4;
		}
	};
	for (var i = 0; i < 10 * 10 * 4; i++) {
		mockImage.bitmap.data.push(i % 255);
    }
    let pixels = new Pixels(5, 5, 2, mockImage);

    it('constructor should initialize correctly', () => {
        let palette = new Palette(pixels);
        assert.deepEqual(palette.pixels, pixels);
    });

    it('dry run reduce function', () => {
        let palette = new Palette(pixels);
        palette.reduce(10);
        assert.equal(palette.reducedColors.length, 10);
    });

});