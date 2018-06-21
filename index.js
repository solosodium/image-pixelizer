/**
 * This is an example of how to use pixelizer to convret
 * images to pixel art.
 */

// Import modules.
const fs = require('fs');
const Pixelizer = require('./src/pixelizer');

// TODO: change this Pixelizer options.
const options = new Pixelizer.Options()
    .setPixelSize(30)
    .setBlurSize(0.5)
    .setClusterThreshold(0.01)
    .setVoidThreshold(0.1)
    .setMaxIteration(0);

// Process all images without 'pixel' in the name.
const folder = 'images/';
const extPattern = /\..+$/i;
const keyword = 'pixel';
fs.readdir(folder, function(err, files) {
    for (let i=0; i<files.length; i++) {
        let file = files[i];
        if (!file.includes(keyword)) {
            let ext = file.match(extPattern)[0];
            let name = file.substring(0, file.indexOf(ext));
            let input = folder + file;
            let output = folder + name + '.' + keyword + ext;
            // Actual pixelizing.
            Pixelizer.read(input).then((image) => {
                return Pixelizer.process(image, options);
            }).then((image) => {
                Pixelizer.saveImage(image, output);
            });
        }
    }
});
