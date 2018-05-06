(function() {

  Pixelizer.Renderer = function(canvasId, options) {
    // Initialize canvas.
    this.canvas = document.getElementById(canvasId);
    // Set up modules.
    this.draw = new Pixelizer.Draw(canvas, options);
    this.input = new Pixelizer.Input(canvas, this.draw);
  };

  Pixelizer.Renderer.prototype.updateOptions = function(options) {
    this.draw.setOptions(options);
  };

  Pixelizer.Renderer.prototype.clearCanvas = function() {
    this.draw.clear();
  };

})();
