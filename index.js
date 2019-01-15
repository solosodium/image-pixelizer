/**
 * Wrapper index.js to export Pixelizer class.
 */

module.exports = require('./src/pixelizer');

/** Local Run */

const fs = require('fs');
const Pixelizer = require('./src/pixelizer');
const Jimp = require('jimp');
const Log = require('./src/log');

// TODO: change this Pixelizer options.
const options = new Pixelizer.Options()
	.setPixelSize(20)
	.setClusterThreshold(0.001)
	.setMaxIteration(200)
	.setNumberOfColors(16);

// Process all images without keyword 'pixel' in the name.
const folder = './example/images/';
const namePattern = /^(?!\.)(.+)\.(?!\.)(.+)$/i;
const extPattern = /\.(?!\.)(.+)$/i;
const keyword = 'pixel';
fs.readdir(folder, function (err, files) {
	for (let i = 0; i < files.length; i++) {
		let file = files[i];
		if (file.match(namePattern) && !file.includes(keyword)) {
			let ext = file.match(extPattern)[0];
			let name = file.substring(0, file.indexOf(ext));
			let input = folder + file;
			let output = folder + name + '.' + keyword + ext;
			// Actual pixelizing.
			Jimp.read(input).then(image => {
				let bitmap = new Pixelizer.Bitmap(
					image.bitmap.width,
					image.bitmap.height,
					image.bitmap.data);
				let pixelizer = new Pixelizer(bitmap, options);
				let resultBitmap = pixelizer.pixelize();
				let resultImage = new Jimp(resultBitmap.width, resultBitmap.height);
				resultImage.bitmap.data = resultBitmap.data;
				resultImage.write(output);
			}).catch(error => {
				console.error(error);
			});
		}
	}
});