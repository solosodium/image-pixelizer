const assert = require('assert');
const RGBA = require('../src/color').RGBA;

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

    it('color difference', () => {
      let rgba1 = new RGBA(128, 128, 128, 128);
      let rgba2 = new RGBA(0, 0, 0, 0);
      assert.equal(RGBA.difference(rgba1, rgba1), 0);
      assert(Math.abs(RGBA.difference(rgba1, rgba2) - 0.502) < 0.001);
    });

    it('add colors', () => {
      let rgba1 = new RGBA(128, 128, 128, 128);
      let rgba2 = new RGBA(0, 0, 0, 0);
      let rgba3 = new RGBA(255, 255, 255, 255);
      assert.deepEqual(RGBA.add(rgba1, rgba2), rgba1);
      assert.deepEqual(RGBA.add(rgba1, rgba3), new RGBA(383, 383, 383, 383));
    });
  });

});
