/**
 * This is an example of how to use pixelizer to convret
 * images to pixel art.
 */

/** Import modules. */
const Options = require('./src/options');
const Pixelizer = require('./src/pixelizer');

/** Example. */
const input = './images/obama.jpg';
const output = './images/obama.pixel.jpg';
const options = new Options()
    .setPixelSize(10);

var pixelizer = new Pixelizer(input, output, options);