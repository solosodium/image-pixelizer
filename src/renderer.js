(function() {

  Pixelizer.Renderer = function(canvasId, options) {
    // Initialize canvas.
    this.canvas = document.getElementById(canvasId);
    // Set up modules.
    var draw = new Pixelizer.Draw(canvas, options);
    var input = new Pixelizer.Input(canvas, draw);
  };

})();
