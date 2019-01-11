const assert = require('assert');
const Bitmap = require('../src/bitmap');

describe('Bitmap (bitmap.js)', () => {

    let data = [
        1, 1, 1, 1,  2, 2, 2, 2,  3, 3, 3, 3,
        4, 4, 4, 4,  5, 5, 5, 5,  6, 6, 6, 6
    ];

    it('constructor should initialize members', () => {
        let bitmap = new Bitmap(3, 2, data);
        assert.equal(bitmap.width, 3);
        assert.equal(bitmap.height, 2);
        assert.deepEqual(bitmap.data, data);
    });

    it('constructor input data sanity check', () => {
        assert.throws(
			() => new Bitmap(3, 3, data),
			Error
        );
        assert.throws(
			() => new Bitmap(2, 2, data),
			Error
		);
    });

    it('get pixel index function', () => {
        let bitmap = new Bitmap(3, 2, data);
        assert.equal(bitmap.getPixelIndex(0, 1), 12);
        assert.equal(bitmap.getPixelIndex(-1, 0), 0);
        assert.equal(bitmap.getPixelIndex(0, 4), 12);
        assert.equal(bitmap.getPixelIndex(0, -1), 0);
        assert.equal(bitmap.getPixelIndex(4, 3), 20);
    });

});