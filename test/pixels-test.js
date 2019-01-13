const assert = require('assert');
const Pixels = require('../src/pixels');
const RGBA = require('../src/color');
const Bitmap = require('../src/bitmap');

describe('Pixels (pixels.js)', () => {

	// Create a mock bitmap.
	let data = [];
	for (var i = 0; i < 10 * 10 * 4; i++) {
		data.push(i % 255);
	}
	let mockBitmap = new Bitmap(10, 10, data);

	it('constructor should correctly initialize pixels', () => {
		let pixels = new Pixels(5, 5, 2, mockBitmap);
		assert.equal(pixels.width, 5);
		assert.equal(pixels.height, 5);
		assert.equal(pixels.pixels.length, 5 * 5);
	});

	it('constructor should throw exception for invalid inputs', () => {
		assert.throws(
			() => new Pixels(6, 5, 2, mockBitmap),
			Error
		);
		assert.throws(
			() => new Pixels(5, 6, 2, mockBitmap),
			Error
		);
	});

	it('getPixel throws exceptions invalid x and y positions', () => {
		let pixels = new Pixels(5, 5, 2, mockBitmap);
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
		let pixels = new Pixels(5, 5, 2, mockBitmap);
		assert(Math.abs(pixels.getPixel(2, 2).r - 198) < 1);
		assert(Math.abs(pixels.getPixel(2, 2).g - 199) < 0.001);
		assert(Math.abs(pixels.getPixel(2, 2).b - 200) < 0.001);
		assert(Math.abs(pixels.getPixel(2, 2).a - 201) < 0.001);
	});

	it('setPixel throws exceptions invalid x and y positions', () => {
		let pixels = new Pixels(5, 5, 2, mockBitmap);
		assert.throws(
			() => pixels.setPixel(-1, 3, null),
			Error
		);
		assert.throws(
			() => pixels.setPixel(2, 8, null),
			Error
		);
	});

	it('setPixel sets the correct color', () => {
		let pixels = new Pixels(5, 5, 2, mockBitmap);
		let rgba = new RGBA(180, 170, 160, 150);
		pixels.setPixel(2, 2, rgba);
		assert.deepEqual(pixels.getPixel(2, 2), rgba);
	});

	it('toBitmap should return the correct bitmap', () => {
		let pixels = new Pixels(5, 5, 2, mockBitmap);
		let bitmap = pixels.toBitmap();
		let idx = bitmap.getPixelIndex(2, 2);
		assert.equal(bitmap.data[idx + 0], 198);
		assert.equal(bitmap.data[idx + 1], 199);
		assert.equal(bitmap.data[idx + 2], 200);
		assert.equal(bitmap.data[idx + 3], 201);
	});

});
