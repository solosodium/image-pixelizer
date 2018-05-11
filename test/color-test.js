let assert = require('assert');
let Color = require('../src/color');

describe('Color (color.js)', function() {
    
    describe('RGBA', function() {
        
        it('constructor should pass all values', function() {
            let rgba = new Color.RGBA(128, 120, 20, 240);
            assert.equal(rgba.r, 128);
            assert.equal(rgba.g, 120);
            assert.equal(rgba.b, 20);
            assert.equal(rgba.a, 240);
        });

        it('constructor should bound r, g, b, a values', function() {
            let rgba = new Color.RGBA(300, -10, 1000, 0);
            assert.equal(rgba.r, 255);
            assert.equal(rgba.g, 0);
            assert.equal(rgba.b, 255);
            assert.equal(rgba.a, 0);
        });

        it('convert RGBA to HSVA', function() {
            let rgba = new Color.RGBA(128, 120, 20, 240);
            let hsva = rgba.toHSVA();
            assert(Math.abs(hsva.h - 55.556) < 0.01);
            assert(Math.abs(hsva.s - 0.844) < 0.01);
            assert(Math.abs(hsva.v - 0.502) < 0.01);
            assert(Math.abs(hsva.a - 0.941) < 0.01);
        });
    });

    describe('HSVA', function() {

        it('constructor should pass all values', function() {
            let hsva = new Color.HSVA(100, 0.2, 0.7, 0.1);
            assert.equal(hsva.h, 100);
            assert.equal(hsva.s, 0.2);
            assert.equal(hsva.v, 0.7);
            assert.equal(hsva.a, 0.1);
        });

        it('constructor should bound h, s, v, a values', function() {
            let hsva = new Color.HSVA(1000, -0.4, 2, 0);
            assert.equal(hsva.h, 360);
            assert.equal(hsva.s, 0);
            assert.equal(hsva.v, 1);
            assert.equal(hsva.a, 0);
        });

        it('convert HSVA to RGBA', function() {
            let hsva = new Color.HSVA(100, 0.2, 0.7, 0.1);
            let rgba = hsva.toRGBA();
            assert.equal(rgba.r, 155);
            assert.equal(rgba.g, 179);
            assert.equal(rgba.b, 143);
            assert.equal(rgba.a, 26);
        });

    });

});
