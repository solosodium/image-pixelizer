(function() {

  var log = Pixelizer.Log;

  /**
   * Input module to handle input events.
   */
  Pixelizer.Input = function(canvas) {

    // Indicator if pointer is active on canvas.
    this.isPointer = false;

    // Mouse or touch down or start.
    canvas.addEventListener('mousedown', function(e) {
      this.isPointer = true;
    });
    canvas.addEventListener('touchstart', function(e) {
      this.isPointer = true;
    });

    // Mouse or touch up or end.
    canvas.addEventListener('mouseup', function(e) {
      this.isPointer = false;
    });
    canvas.addEventListener('touchend', function(e) {
      this.isPointer = false;
    });

    // Mouse or touch move.
    canvas.addEventListener('mousemove', function(e) {
      if (this.isPointer) {

      }
    });
    canvas.addEventListener('touchmove', function(e) {
      if (this.isPointer) {

      }
    });

    canvas.addEventListener('mouseleave', function(e) {
      this.isPointer = false;
    });
  };



})();
