const assert = require('assert');
const Options = require('../src/options');
const Jimp = require("jimp");

describe('Options (options.js)', () => {

	let options = new Options();

	it('constructor should set default parameters', () => {
		assert.equal(options.resizeAlign, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);
		assert.equal(options.resizeFilter, Jimp.RESIZE_BEZIER);
		assert.equal(options.blurSize, 0.5);
		assert.equal(options.pixelSize, 1);
		assert.equal(options.colorDistRatio, 0.75);
		assert.equal(options.maxIteration, 10);
		assert.equal(options.clusterThreshold, 0.01);
		assert.equal(options.numberOfColors, 128);
		assert.equal(options.jpgQuality, 90);
		assert.equal(options.pngFilter, Jimp.PNG_FILTER_AUTO);
	});

	it('test set resize align bits', () => {
		options.setResizeAlign(Jimp.HORIZONTAL_ALIGN_LEFT);
		assert.equal(options.resizeAlign, Jimp.HORIZONTAL_ALIGN_LEFT);
		options.setResizeAlign(Jimp.VERTICAL_ALIGN_BOTTOM);
		assert.equal(options.resizeAlign, Jimp.VERTICAL_ALIGN_BOTTOM);
	});

	it('test set resize filter', () => {
		options.setResizeFilter(Jimp.RESIZE_BICUBIC);
		assert.equal(options.resizeFilter, Jimp.RESIZE_BICUBIC);
		options.setResizeFilter(Jimp.RESIZE_BEZIER);
		assert.equal(options.resizeFilter, Jimp.RESIZE_BEZIER);
	});

	it('test set blur size', () => {
		options.setBlurSize(0.1);
		assert.equal(options.blurSize, 0.1);
		options.setBlurSize(-1);
		assert.equal(options.blurSize, 0);
		options.setBlurSize(2);
		assert.equal(options.blurSize, 2);
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

	it('test set max iteration', () => {
		options.setMaxIteration(1);
		assert.equal(options.maxIteration, 1);
		options.setMaxIteration(20);
		assert.equal(options.maxIteration, 20);
	});

	it('test set cluster threshold', () => {
		options.setClusterThreshold(0.1);
		assert.equal(options.clusterThreshold, 0.1);
		options.setClusterThreshold(-1);
		assert.equal(options.clusterThreshold, 0);
		options.setClusterThreshold(2);
		assert.equal(options.clusterThreshold, 1);
	});

	it('test set number of colors', () => {
		options.setNumberOfColors(10);
		assert.equal(options.numberOfColors, 10);
		options.setNumberOfColors(-10);
		assert.equal(options.numberOfColors, -10);
		options.setNumberOfColors(10.1);
		assert.equal(options.numberOfColors, 10);
	})

	it('test set JPEG image quality', () => {
		options.setJpgQuality(20);
		assert.equal(options.jpgQuality, 20);
		options.setJpgQuality(-10);
		assert.equal(options.jpgQuality, 0);
		options.setJpgQuality(300);
		assert.equal(options.jpgQuality, 100);
	});

	it('test set PNG image filter', () => {
		options.setPngFilter(Jimp.PNG_FILTER_NONE);
		assert.equal(options.pngFilter, Jimp.PNG_FILTER_NONE);
		options.setPngFilter(Jimp.PNG_FILTER_PAETH);
		assert.equal(options.pngFilter, Jimp.PNG_FILTER_PAETH);
	});

});
