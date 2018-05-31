/**
 * This is an example of how to use pixelizer to convret
 * images to pixel art.
 */

// Import modules.
const fs = require('fs');
const Options = require('./src/options');
const Pixelizer = require('./src/pixelizer');

// Pixelizer options.
// TODO: change this options.
const options = new Options()
    .setPixelSize(30);

// Process all images without 'pixel' in the name.
const folder = 'images/';
const extPattern = /\..+$/i;
fs.readdir(folder, function(err, files) {
    for (let i=0; i<files.length; i++) {
        let file = files[i];
        if (!file.includes('pixel')) {
            let ext = file.match(extPattern)[0];
            let name = file.substring(0, file.indexOf(ext));
            let input = folder + file;
            let output = folder + name + '.pixel' + ext;
            console.log('Pixelizing ' + input + ', output to ' + output);
            var pixelizer = new Pixelizer(input, output, options);
        }
    }
});
