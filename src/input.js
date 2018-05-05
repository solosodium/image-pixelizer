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
      }
    });

    // Touch events.
    canvas.addEventListener('touchstart', function(evt) {
      this.isPointer = true;
      draw.start(getTouchPos(canvas, evt));
    });
    canvas.addEventListener('touchend', function(evt) {
      if (this.isPointer) {
        this.isPointer = false;
        // No touch is registered with 'touchend' event.
        draw.end(null);
      }
    });
    canvas.addEventListener('touchmove', function(evt) {
      if (this.isPointer) {
        draw.draw(getTouchPos(canvas, evt));
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

  function getTouchPos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    if (evt.touches.length > 0) {
      return {
        x: evt.touches[0].clientX - rect.left,
        y: evt.touches[0].clientY - rect.top
      };
    }
  }

})();
