const assert = require('assert');
const Options = require('../src/options');

describe('Options (options.js)', () => {

	let options = new Options();

	it('constructor should set default parameters', () => {
		assert.equal(options.pixelSize, 1);
		assert.equal(options.colorDistRatio, 0.5);
		assert.equal(options.clusterThreshold, 0.01);
		assert.equal(options.maxIteration, 10);
		assert.equal(options.numberOfColors, 128);
	});

	it('test set pixel size', () => {
		options.setPixelSize(5);
		assert.equal(options.pixelSize, 5);
		options.setPixelSize(10);
		assert.equal(options.pixelSize, 10);
	});

	it('test set color distance ratio', () => {
		options.setColorDistRatio(0.5);
		assert.equal(options.colorDistRatio, 0.5);
		options.setColorDistRatio(-1);
		assert.equal(options.colorDistRatio, 0);
		options.setColorDistRatio(2);
		assert.equal(options.colorDistRatio, 1);
	});

	it('test set cluster threshold', () => {
		options.setClusterThreshold(0.1);
		assert.equal(options.clusterThreshold, 0.1);
		options.setClusterThreshold(-1);
		assert.equal(options.clusterThreshold, 0);
		options.setClusterThreshold(2);
		assert.equal(options.clusterThreshold, 1);
	});

	it('test set max iteration', () => {
		options.setMaxIteration(1);
		assert.equal(options.maxIteration, 1);
		options.setMaxIteration(20);
		assert.equal(options.maxIteration, 20);
	});

	it('test set number of colors', () => {
		options.setNumberOfColors(10);
		assert.equal(options.numberOfColors, 10);
		options.setNumberOfColors(-10);
		assert.equal(options.numberOfColors, -10);
		options.setNumberOfColors(10.1);
		assert.equal(options.numberOfColors, 10);
	});

});
