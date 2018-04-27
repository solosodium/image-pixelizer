(function() {

  var log = Pixelizer.Log;

  /**
   * Input module to handle input events.
   */
  Pixelizer.Input = function(canvas, draw) {

    // Indicator if pointer is active on canvas.
    this.isPointer = false;

    // Mouse events.
    canvas.addEventListener('mousedown', function(evt) {
      this.isPointer = true;
      draw.start(getMousePos(canvas, evt));
    });
    canvas.addEventListener('mouseup', function(evt) {
      if (this.isPointer) {
        this.isPointer = false;
        draw.end(getMousePos(canvas, evt));
      }
    });
    canvas.addEventListener('mouseleave', function(evt) {
      if (this.isPointer) {
        this.isPointer = false;
        draw.end(getMousePos(canvas, evt));
      }
    });
    canvas.addEventListener('mousemove', function(evt) {
      if (this.isPointer) {
        draw.draw(getMousePos(canvas, evt));
        Pixelizer.Log.debug(getMousePos(canvas, evt));
      }
    });

    // Touch events.
    canvas.addEventListener('touchstart', function(evt) {
      this.isPointer = true;
    });
    canvas.addEventListener('touchend', function(evt) {
      this.isPointer = false;
    });
    canvas.addEventListener('touchmove', function(evt) {
      if (this.isPointer) {

      }
    });
  };

  function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

})();
