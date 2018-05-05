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
    this.clear();
  };

  Pixelizer.Draw.prototype.start = function(pos) {
    this.points = [];
    this.points.push({
      pos: pos,
      options: this.options
    });
    // Draw initial circle.
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, this.options.size * this.canvas.height / 2, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.options.color;
    this.ctx.fill();
    // Begin line path.
    this.ctx.beginPath();
    this.ctx.strokeStyle = this.options.color;
    this.ctx.lineWidth = this.canvas.height * this.options.size;
    this.ctx.moveTo(pos.x, pos.y);
  };

  Pixelizer.Draw.prototype.draw = function(pos) {
    this.points.push({
      pos: pos,
      options: this.options
    });
    // Continue line path.
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
    this.ctx.moveTo(pos.x, pos.y);
  };

  Pixelizer.Draw.prototype.end = function(pos) {
    if (pos) {
      this.points.push({
        pos: pos,
        options: this.options
      });
    } else {
      pos = this.points[this.points.length - 1].pos;
    }
    // Complete line path.
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();
    // Draw final circle.
    this.ctx.beginPath();
    this.ctx.arc(pos.x, pos.y, this.options.size * this.canvas.height / 2, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.options.color;
    this.ctx.fill();
    // Clear points.
    this.points = [];
  };

  // Options object
  // {
  //   color: "color string for pointer",
  //   size: <size of pointer, as fraction of canvas height>,
  //   pixelX: <number of x pixels>,
  //   pixelY: <number of y pixels>
  // }

  Pixelizer.Draw.prototype.setOptions = function(options) {
    this.options = {
      color: options.color,
      size: options.size,
      pixelX: options.pixelX,
      pixelY: options.pixelY
    };
  };

  Pixelizer.Draw.prototype.clear = function() {
    // Draw default background.
    var backgroundColor = '#ffffff';
    var checkerColor = '#e0e0e0';
    // Draw background.
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = backgroundColor;
    this.ctx.fillStyle = backgroundColor;
    this.ctx.stroke();
    this.ctx.fill();
    var x = this.canvas.width/this.options.pixelX;
    var y = this.canvas.height/this.options.pixelY;
    for (var i=0; i<=this.options.pixelX; i++) {
      for (var j=0; j<=this.options.pixelY; j++) {
        if ((i + j) % 2 == 0) {
          this.ctx.beginPath();
          this.ctx.rect(i*x, j*y, x, y);
          this.ctx.lineWidth = 1;
          this.ctx.strokeStyle = checkerColor;
          this.ctx.fillStyle = checkerColor;
          this.ctx.stroke();
          this.ctx.fill();
        }
      }
    }
  };

})();
