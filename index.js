var Jimp = require("jimp");
var io = require("./src/io.js");

var example = io.load("penguins.png", (err, image) => {
    if (err) {
        console.error(err);
    } else {
        image = image.blur(10);
        console.log(image);

        io.save(image, "test.png");
    }
});