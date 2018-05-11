var Jimp = require("jimp");
var io = require("./src/io.js");

var example = io.load("obama.jpg", (err, image) => {
    if (err) {
        console.error(err);
    } else {
        console.log(image.bitmap.width);
        console.log(image.bitmap.height);
        console.log(image.getPixelIndex(0, 3));
        console.log(image.getPixelIndex(1, 0));
    }
});