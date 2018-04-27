/* pixelizer.js */
var Pixelizer = Pixelizer || {};

(function() {
    Pixelizer.Config = {
        isDebug: true
    };
})();

(function() {
    Pixelizer.Log = function() {};
    Pixelizer.Log.debug = function(i) {
        if (Pixelizer.Config.isDebug) {
            console.log("Pixelizer log: ", i);
        }
    };
    Pixelizer.Log.throw = function(i) {
        throw "Pixelizer exception: " + i;
    };
})();

(function() {
    Pixelizer.Draw = function(i, t) {
        this.options = {};
        this.points = [];
        this.setOptions(t);
    };
    Pixelizer.Draw.prototype.start = function(i) {
        this.points = [];
        this.points.push({
            pos: i,
            options: this.options
        });
    };
    Pixelizer.Draw.prototype.draw = function(i) {
        this.points.push({
            pos: i,
            options: this.options
        });
    };
    Pixelizer.Draw.prototype.end = function(i) {
        this.points.push({
            pos: i,
            options: this.options
        });
        Pixelizer.Log.debug(this.points);
        this.points = [];
    };
    Pixelizer.Draw.prototype.setOptions = function(i) {
        this.options = {
            color: i.color,
            size: i.size
        };
    };
})();

(function() {
    var i = Pixelizer.Log;
    Pixelizer.Input = function(t, e) {
        this.isPointer = false;
        t.addEventListener("mousedown", function(i) {
            this.isPointer = true;
            e.start(n(t, i));
        });
        t.addEventListener("mouseup", function(i) {
            if (this.isPointer) {
                this.isPointer = false;
                e.end(n(t, i));
            }
        });
        t.addEventListener("mouseleave", function(i) {
            if (this.isPointer) {
                this.isPointer = false;
                e.end(n(t, i));
            }
        });
        t.addEventListener("mousemove", function(i) {
            if (this.isPointer) {
                e.draw(n(t, i));
                Pixelizer.Log.debug(n(t, i));
            }
        });
        t.addEventListener("touchstart", function(i) {
            this.isPointer = true;
        });
        t.addEventListener("touchend", function(i) {
            this.isPointer = false;
        });
        t.addEventListener("touchmove", function(i) {
            if (this.isPointer) {}
        });
    };
    function n(i, t) {
        var e = i.getBoundingClientRect();
        return {
            x: t.clientX - e.left,
            y: t.clientY - e.top
        };
    }
})();

(function() {
    Pixelizer.Renderer = function(i, t) {
        this.canvas = document.getElementById(i);
        var e = new Pixelizer.Draw(canvas, t);
        var n = new Pixelizer.Input(canvas, e);
    };
})();