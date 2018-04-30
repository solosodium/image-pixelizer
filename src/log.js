(function() {

  Pixelizer.Log = function() {
    // Nothing to do.
  };

  /** Debug log. */
  Pixelizer.Log.debug = function(message) {
    console.log("Pixelizer log: ", message);
  };

  /** Throw exception. */
  Pixelizer.Log.throw = function(message) {
    throw "Pixelizer exception: " + message;
  };

})();
