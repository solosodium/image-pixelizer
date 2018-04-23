/**
 * This script builds src files to a single javascript file.
 */

// Required modules.
const fs = require('fs');
const uglify = require('uglify-js');

// TODO: Varibale constants.
const SRC_DIR_PATH = './src';
const DEST_DIR_PATH = './dist';
const OUTPUT_FILE_UNCOMPRESSED = 'pixelizer.js';    // Uncompressed.
const OUTPUT_FILE_COMPRESSED = 'pixelizer.min.js';  // Compressed.

// Constants.
const PATH_DELIMITER = '/';
const FILE_ENCODING = 'utf8';

// TODO: Source files. The order is preserved for simple tests purposes.
const SRC_FILES = [
  "const.js",
  "main.js"
];

// Uglify options.
let maxOptions = {
    toplevel: false,
    compress: false,
    output: {
        beautify: true,
        preamble: '/* '+ OUTPUT_FILE_UNCOMPRESSED +' */'
    }
};
let minOptions = {
    toplevel: false,
    compress: true,
    output: {
        beautify: false,
        preamble: '/* '+ OUTPUT_FILE_COMPRESSED +' */'
    }
};

// Empty source files escape.
if (SRC_FILES.length == 0) {
  console.error("No source files to compile, exit.");
} else {
  // Read src directory.
  fs.readdir(SRC_DIR_PATH, function(err, files) {
      if (err) {
          console.error("Read source directory error:", err);
      } else {
          // Build file to code map.
          console.log("Processing source files: ");
          let file2Code = {};
          SRC_FILES.forEach(function(file) {
              if (files.indexOf(file) < 0) {
                  console.error(" - Missing source file: '" + file + "'");
              } else {
                  file2Code[file] =
                      fs.readFileSync(
                          SRC_DIR_PATH + PATH_DELIMITER + file,
                          FILE_ENCODING);
                  console.log(" - Found: '" + file + "'");
              }
          });
          // Generate non-uglified code (uncompressed).
          let outputCodeUncompressed = uglify.minify(file2Code, maxOptions);
          if (outputCodeUncompressed.hasOwnProperty('error')) {
              console.error(
                "Compile '" + OUTPUT_FILE_UNCOMPRESSED
                + "' failed:", outputCodeUncompressed);
          } else {
              fs.writeFileSync(
                  DEST_DIR_PATH + PATH_DELIMITER + OUTPUT_FILE_UNCOMPRESSED,
                  outputCodeUncompressed.code,
                  FILE_ENCODING);
              // Done!
              console.log(
                "'" + OUTPUT_FILE_UNCOMPRESSED + "' compiled successfully!");
          }
          // Generate uglified code (compressed).
          let outputCodeCompressed = uglify.minify(file2Code, minOptions);
          if (outputCodeCompressed.hasOwnProperty('error')) {
              console.error(
                "Compile '" + OUTPUT_FILE_COMPRESSED
                + "' failed:", outputCodeCompressed);
          } else {
              fs.writeFileSync(
                  DEST_DIR_PATH + PATH_DELIMITER + OUTPUT_FILE_COMPRESSED,
                  outputCodeCompressed.code,
                  FILE_ENCODING);
              // Done!
              console.log(
                "'" + OUTPUT_FILE_COMPRESSED + "' compiled successfully!");
          }
      }
  });
}
