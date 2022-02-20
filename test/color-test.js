const assert = require('assert');
const RGBA = require('../src/color');

describe('Color (color.js)', () => {

	describe('RGBA', () => {

		it('constructor should pass all values', () => {
			let rgba = new RGBA(128, 120, 20, 240);
			assert.equal(rgba.r, 128);
			assert.equal(rgba.g, 120);
			assert.equal(rgba.b, 20);
			assert.equal(rgba.a, 240);
		});

		it('test copy constructor', () => {
			let rgba = new RGBA(128, 120, 20, 240);
			let copy = rgba.copy();
			assert.deepEqual(rgba, copy);
			rgba.r = 0;
			assert(Math.abs(rgba.r - copy.r) > 127.9);
		});

		it('constructor should bound r, g, b, a values', () => {
			let rgba = new RGBA(300, -10, 1000, 0);
			assert.equal(rgba.r, 255);
			assert.equal(rgba.g, 0);
			assert.equal(rgba.b, 255);
			assert.equal(rgba.a, 0);
		});

		it('test color difference function', () => {
			let rgba1 = new RGBA(128, 128, 128, 128);
			let rgba2 = new RGBA(0, 0, 0, 0);
			assert.equal(RGBA.difference(rgba1, rgba1), 0);
			assert(Math.abs(RGBA.difference(rgba1, rgba2) - 0.4193) < 0.001);
		});

		it('test add colors function', () => {
			let rgba1 = new RGBA(128, 128, 128, 128);
			let rgba2 = new RGBA(0, 0, 0, 0);
			let rgba3 = new RGBA(255, 255, 255, 255);
			assert.deepEqual(RGBA.add(rgba1, rgba2), rgba1);
			assert.deepEqual(RGBA.add(rgba1, rgba3), rgba3);
		});

		it('test subtract colors function', () => {
			let rgba1 = new RGBA(128, 128, 128, 128);
			let rgba2 = new RGBA(0, 0, 0, 0);
			let rgba3 = new RGBA(255, 255, 255, 255);
			assert.deepEqual(RGBA.subtract(rgba1, rgba2), rgba1);
			assert.deepEqual(RGBA.subtract(rgba1, rgba3), rgba2);
		});

		it('test scale colors function', () => {
			let rgba = new RGBA(128, 128, 128, 128);
			let value1 = 1;
			let value2 = 0.5;
			let result1 = RGBA.scale(rgba, value1);
			assert.notEqual(result1, rgba);
			assert.deepEqual(result1, new RGBA(128, 128, 128, 128));
			let result2 = RGBA.scale(rgba, value2);
			assert.notEqual(result2, rgba);
			assert.deepEqual(result2, new RGBA(64, 64, 64, 64));
		});

		it('test zero color', () => {
			assert.deepEqual(RGBA.zero(), new RGBA(0, 0, 0, 0));
		});

		it('test color vector length', () => {
			let rgba = new RGBA(1, 1, 1, 1);
			assert.equal(RGBA.length(rgba), 2);
		});

		it('test to string function', () => {
			let rgba = new RGBA(1, 2, 3, 4);
			assert.equal(rgba.toString(), 'rgba(1, 2, 3, 4)');
		});
	});

});
