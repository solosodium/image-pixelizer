/* pixelizer.js */
var Pixelizer = Pixelizer || {};

(function() {
    Pixelizer.init = function(e, i, n) {
        Pixelizer.canvas = document.getElementById(e);
        Pixelizer.resize(i, n);
    };
    Pixelizer.resize = function(e, i) {
        if (Pixelizer.canvas) {
            Pixelizer.canvas.width = e;
            Pixelizer.canvas.height = i;
            Pixelizer.context = Pixelizer.canvas.getContext("2d");
        }
    };
    Pixelizer.setBrushColor = function(e) {};
    Pixelizer.setBrushSize = function(e) {};
    Pixelizer.rasterize = function() {};
})();