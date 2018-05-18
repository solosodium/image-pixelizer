const assert = require('assert');
const Options = require('../src/options');
const Jimp = require("jimp");

describe('Options (options.js)', () => {

    let options = new Options();

    it('constructor should set default parameters', () => {
        assert.equal(options.resizeAlign, Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE);
        assert.equal(options.resizeFilter, Jimp.RESIZE_BEZIER);
        assert.equal(options.pixelSize, 1);
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

    it('test set pixel size', () => {
        options.setPixelSize(5);
        assert.equal(options.pixelSize, 5);
        options.setPixelSize(10);
        assert.equal(options.pixelSize, 10);
    });

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