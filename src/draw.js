(function() {

  Pixelizer.Draw = function(canvas, context, options) {

    this.setOptions(options);
  };

  Pixelizer.Draw.prototype.draw = function() {

  };

  Pixelizer.Draw.prototype.setOptions = function(options) {
    // Brush color, format TBD.
    this.color = options.color;
    // Brush size, which is represented as the fraction of canvas pixel size.
    this.size = options.size;
  };

})();
