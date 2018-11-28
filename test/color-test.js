const assert = require('assert');
const RGBA = require('../src/color').RGBA;
const Palette = require('../src/color').Palette;

describe('Color (color.js)', () => {

	describe('RGBA', () => {

		it('constructor should pass all values', () => {
			let rgba = new RGBA(128, 120, 20, 240);
			assert.equal(rgba.r, 128);
			assert.equal(rgba.g, 120);
			assert.equal(rgba.b, 20);
			assert.equal(rgba.a, 240);
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
			assert(Math.abs(RGBA.difference(rgba1, rgba2) - 0.502) < 0.001);
		});

		it('test add colors function', () => {
			let rgba1 = new RGBA(128, 128, 128, 128);
			let rgba2 = new RGBA(0, 0, 0, 0);
			let rgba3 = new RGBA(255, 255, 255, 255);
			assert.deepEqual(RGBA.add(rgba1, rgba2), rgba1);
			assert.deepEqual(RGBA.add(rgba1, rgba3), new RGBA(383, 383, 383, 383));
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
	});

	describe('Palette', () => {

		let colors = [
			new RGBA(10, 10, 10, 10),
			new RGBA(20, 20, 20, 20),
			new RGBA(40, 40, 40, 40),
			new RGBA(80, 80, 80, 80),
			new RGBA(160, 160, 160, 160)
		];

		it('constructor should initialize correctly', () => {
			let palette = new Palette(colors);
			let weightedColors = colors.map((color) => {
				return { weight: 1, color: color };
			});
			assert.deepEqual(palette.colors, colors);
			assert.deepEqual(palette.weightedColors, weightedColors);
		});

		it('test reduce function', () => {
			let palette = new Palette(colors);
			console.log(palette.reduce(3));
		});

	});

});
