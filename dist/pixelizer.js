/* pixelizer.js */
var Pixelizer = Pixelizer || {};

(function() {
    Pixelizer.Config = {};
})();

(function() {
    Pixelizer.Log = function() {};
    Pixelizer.Log.debug = function(t) {
        console.log("Pixelizer log: ", t);
    };
    Pixelizer.Log.throw = function(t) {
        throw "Pixelizer exception: " + t;
    };
})();

(function() {
    Pixelizer.Draw = function(t, i) {
        this.canvas = t;
        this.ctx = t.getContext("2d");
        this.points = [];
        this.options = {};
        this.setOptions(i);
        this.clear();
    };
    Pixelizer.Draw.prototype.start = function(t) {
        this.points = [];
        this.points.push({
            pos: t,
            options: this.options
        });
        this.ctx.beginPath();
    };
    Pixelizer.Draw.prototype.draw = function(t) {
        this.points.push({
            pos: t,
            options: this.options
        });
        if (this.points.length > 2) {
            var i = this.points.length - 1;
            this.ctx.strokeStyle = this.options.color;
            this.ctx.lineWidth = this.canvas.height * this.options.size;
            this.ctx.moveTo(this.points[i - 1].pos.x, this.points[i - 1].pos.y);
            this.ctx.lineTo(this.points[i].pos.x, this.points[i].pos.y);
            this.ctx.stroke();
        }
    };
    Pixelizer.Draw.prototype.end = function(t) {
        this.points.push({
            pos: t,
            options: this.options
        });
        this.points = [];
    };
    Pixelizer.Draw.prototype.setOptions = function(t) {
        this.options = {
            color: t.color,
            size: t.size,
            pixelX: t.pixelX,
            pixelY: t.pixelY
        };
    };
    Pixelizer.Draw.prototype.clear = function() {
        var t = "#ffffff";
        var i = "#e0e0e0";
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = t;
        this.ctx.fillStyle = t;
        this.ctx.stroke();
        this.ctx.fill();
        var e = this.canvas.width / this.options.pixelX;
        var s = this.canvas.height / this.options.pixelY;
        for (var n = 0; n <= this.options.pixelX; n++) {
            for (var o = 0; o <= this.options.pixelY; o++) {
                if ((n + o) % 2 == 0) {
                    this.ctx.beginPath();
                    this.ctx.rect(n * e, o * s, e, s);
                    this.ctx.lineWidth = 1;
                    this.ctx.strokeStyle = i;
                    this.ctx.fillStyle = i;
                    this.ctx.stroke();
                    this.ctx.fill();
                }
            }
        }
    };
})();

(function() {
    var t = Pixelizer.Log;
    Pixelizer.Input = function(i, e) {
        this.isPointer = false;
        i.addEventListener("mousedown", function(t) {
            this.isPointer = true;
            e.start(s(i, t));
        });
        i.addEventListener("mouseup", function(t) {
            if (this.isPointer) {
                this.isPointer = false;
                e.end(s(i, t));
            }
        });
        i.addEventListener("mouseleave", function(t) {
            if (this.isPointer) {
                this.isPointer = false;
                e.end(s(i, t));
            }
        });
        i.addEventListener("mousemove", function(t) {
            if (this.isPointer) {
                e.draw(s(i, t));
            }
        });
        i.addEventListener("touchstart", function(t) {
            this.isPointer = true;
            e.start(n(i, t));
        });
        i.addEventListener("touchend", function(t) {
            if (this.isPointer) {
                this.isPointer = false;
                e.end(n(i, t));
            }
        });
        i.addEventListener("touchmove", function(t) {
            if (this.isPointer) {
                e.draw(n(i, t));
            }
        });
    };
    function s(t, i) {
        var e = t.getBoundingClientRect();
        return {
            x: i.clientX - e.left,
            y: i.clientY - e.top
        };
    }
    function n(t, i) {
        var e = t.getBoundingClientRect();
        if (i.touches.length > 0) {
            return {
                x: i.touches[0].clientX - e.left,
                y: i.touches[0].clientY - e.top
            };
        }
    }
})();

(function() {
    Pixelizer.Renderer = function(t, i) {
        this.canvas = document.getElementById(t);
        var e = new Pixelizer.Draw(canvas, i);
        var s = new Pixelizer.Input(canvas, e);
    };
})();