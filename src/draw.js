(function() {

  // Point object
  // {
  //   pos: { x: <number>, y: <number> },
  //   options: { color: <string>, size: <number> }
  // }

  Pixelizer.Draw = function(canvas, options) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.points = [];
    this.options = {};
    this.setOptions(options);
  };

  Pixelizer.Draw.prototype.start = function(pos) {
    this.points = [];
    this.points.push({
      pos: pos,
      options: this.options
    });
    this.ctx.beginPath();
  };

  Pixelizer.Draw.prototype.draw = function(pos) {
    this.points.push({
      pos: pos,
      options: this.options
    });
    if (this.points.length > 2) {
      var idx = this.points.length - 1;
      this.ctx.strokeStyle = this.options.color;
      this.ctx.lineWidth = this.canvas.height * this.options.size;
      this.ctx.moveTo(this.points[idx-1].pos.x, this.points[idx-1].pos.y);
      this.ctx.lineTo(this.points[idx].pos.x, this.points[idx].pos.y);
      this.ctx.stroke();
    }
  };

  Pixelizer.Draw.prototype.end = function(pos) {
    this.points.push({
      pos: pos,
      options: this.options
    });
    this.points = [];
  };

  Pixelizer.Draw.prototype.setOptions = function(options) {
    this.options = {
      color: options.color,
      size: options.size
    };
  };

})();
