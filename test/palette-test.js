const assert = require('assert');
const Pixels = require('../src/pixels');
const RGBA = require('../src/color');
const Palette = require('../src/palette');
const Options = require('../src/options');

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

    let options = new Options().setNumberOfColors(5);

    it('constructor should initialize correctly', () => {
        let palette = new Palette(pixels, options);
        assert.deepEqual(palette.pixels, pixels);
        assert.deepEqual(palette.options, options);
        assert.deepEqual(palette.colors, pixels.pixels);
        assert.deepEqual(palette.groups, []);
    });

    it('test init group function', () => {
        let palette = new Palette(pixels, options);
        palette.initGroups();
        assert.equal(palette.groups.length, 1);
        assert.deepEqual(palette.groups[0], {
            mean: RGBA.zero(),
            sd: RGBA.zero(),
            oldList: [],
            newList: []
        });
        assert.equal(palette.colors.length, 25);
    });

    it('test assign group function', () => {
        let palette = new Palette(pixels, options);
        palette.initGroups();
        let change = palette.assignGroups();
        assert.equal(change, 1);
        change = palette.assignGroups();
        assert.equal(change, 0);
    });

    it('test update group function', () => {
        let palette = new Palette(pixels, options);
        palette.initGroups();
        palette.assignGroups();
        palette.updateGroups();
    });

    it('test split group function', () => {
        let palette = new Palette(pixels, options);
        palette.initGroups();
        for (let i=2; i<10; i++) {
            palette.assignGroups();
            palette.updateGroups();
            palette.splitGroups();
            assert.equal(palette.groups.length, i);
        }
    });

    it('dry run reduce function', () => {
        let palette = new Palette(pixels, options);
        palette.reduce();
        let num = 0;
        for (let i=0; i<palette.groups.length; i++) {
            num += palette.groups[i].oldList.length;
        }
    });

});