(function() {

    var Jimp = require("jimp");

    const IMAGE_FOLDER = "images/";

    /**
     * IO module for image loading and saving.
     */
    module.exports = {
        /**
         * Load an image file.
         * @param file image file name
         * @param callback function for error and image
         * @throws error if reading failed
         */
        load: function(file, callback) {
            Jimp.read(createPath(file)).then((image) => {
                callback(null, image);
            }).catch((err) => {
                callback(err, null);
            });
        },

        /**
         * Save an image file.
         * @param image image object
         * @param file image file name
         */
        save: function(image, file) {
            image.write(createPath(file));
        }
    };

    /** Create complete file path. */
    function createPath(file) {
        return IMAGE_FOLDER + file;
    }

})();
