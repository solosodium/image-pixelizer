(function() {

  Pixelizer.Renderer = function(canvasId, width, height) {
    // Initialize canvas.
    this.canvas = document.getElementById(canvasId);
    this.resize(width, height);
    // Set up modules.
    var input = new Pixelizer.Input(canvas);
  };

  Pixelizer.Renderer.prototype.resize = function(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
  };

})();
