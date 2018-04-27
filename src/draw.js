(function() {

  // Point object
  // {
  //   pos: { x: <number>, y: <number> },
  //   options: { color: <string>, size: <number> }
  // }

  Pixelizer.Draw = function(canvas, options) {
    this.options = {};
    this.points = [];
    this.setOptions(options);
  };

  Pixelizer.Draw.prototype.start = function(pos) {
    this.points = [];
    this.points.push({
      pos: pos,
      options: this.options
    });
  };

  Pixelizer.Draw.prototype.draw = function(pos) {
    this.points.push({
      pos: pos,
      options: this.options
    });
  };

  Pixelizer.Draw.prototype.end = function(pos) {
    this.points.push({
      pos: pos,
      options: this.options
    });
    Pixelizer.Log.debug(this.points);
    this.points = [];
  };

  Pixelizer.Draw.prototype.setOptions = function(options) {
    this.options = {
      color: options.color,
      size: options.size
    };
  };

})();
