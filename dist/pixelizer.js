/* pixelizer.js */
var Pixelizer = Pixelizer || {};

(function() {
    Pixelizer.Config = {
        isDebug: true
    };
})();

(function() {
    Pixelizer.Log = function() {};
    Pixelizer.Log.debug = function(e) {
        if (Pixelizer.Config.isDebug) {
            console.log("Pixelizer log: ", e);
        }
    };
    Pixelizer.Log.throw = function(e) {
        throw "Pixelizer exception: " + e;
    };
})();

(function() {
    var i = Pixelizer.Log;
    Pixelizer.Input = function(e) {
        this.isMouseDown = false;
        e.addEventListener("mousedown", function(e) {
            this.isMouseDown = true;
        });
        e.addEventListener("mouseup", function(e) {
            this.isMouseDown = false;
        });
        e.addEventListener("mousemove", function(e) {
            if (this.isMouseDown) {
                i.debug(e.offsetX + ", " + e.offsetY);
            }
        });
        e.addEventListener("mouseleave", function(e) {
            this.isMouseDown = false;
        });
    };
})();

(function() {
    Pixelizer.Renderer = function(e, i, n) {
        this.canvas = document.getElementById(e);
        this.resize(i, n);
        var o = new Pixelizer.Input(canvas);
    };
    Pixelizer.Renderer.prototype.resize = function(e, i) {
        this.canvas.width = e;
        this.canvas.height = i;
    };
})();