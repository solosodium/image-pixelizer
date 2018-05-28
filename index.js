/**
 * This is an example of how to use pixelizer to convret
 * images to pixel art.
 */

/** Import modules. */
const Options = require('./src/options');
const Pixelizer = require('./src/pixelizer');

/** Example. */
const image = 'obama';
const ext = '.jpg';
const size = 10;

const input = './images/' + image + ext;
const output = './images/' + image + '.pixel.png';
const options = new Options()
    .setPixelSize(size);

var pixelizer = new Pixelizer(input, output, options);