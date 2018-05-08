var Jimp = require("jimp");
var io = require("./src/io.js");

var example = io.load("obama.jpg", (err, image) => {
    if (err) {
        console.error(err);
    } else {
        image = image.pixelate(10, 0, 0, 522, 665);
        console.log(image.bitmap.width);
        console.log(image.bitmap.height);
        console.log(image.getPixelIndex(0, 3));
    }
});