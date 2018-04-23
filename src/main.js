/** Implementations of public facing functions. */
(function() {

  Pixelizer.init = function(canvasId, width, height) {
    // Initialize canvas.
    Pixelizer.canvas = document.getElementById(canvasId);
    Pixelizer.resize(width, height);
  };

  Pixelizer.resize = function(width, height) {
    if (Pixelizer.canvas) {
      Pixelizer.canvas.width = width;
      Pixelizer.canvas.height = height;
      Pixelizer.context = Pixelizer.canvas.getContext("2d");
    }
  };

  Pixelizer.setBrushColor = function(color) {

  };

  Pixelizer.setBrushSize = function(size) {

  };

  Pixelizer.rasterize = function() {

  };

})();
