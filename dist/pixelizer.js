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
        this.ctx.arc(t.x, t.y, this.options.size * this.canvas.height / 2, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.options.color;
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.options.color;
        this.ctx.lineWidth = this.canvas.height * this.options.size;
        this.ctx.moveTo(t.x, t.y);
    };
    Pixelizer.Draw.prototype.draw = function(t) {
        this.points.push({
            pos: t,
            options: this.options
        });
        this.ctx.lineTo(t.x, t.y);
        this.ctx.stroke();
        this.ctx.moveTo(t.x, t.y);
    };
    Pixelizer.Draw.prototype.end = function(t) {
        if (t) {
            this.points.push({
                pos: t,
                options: this.options
            });
        } else {
            t = this.points[this.points.length - 1].pos;
        }
        this.ctx.lineTo(t.x, t.y);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(t.x, t.y, this.options.size * this.canvas.height / 2, 0, 2 * Math.PI);
        this.ctx.fillStyle = this.options.color;
        this.ctx.fill();
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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };
})();

(function() {
    var t = Pixelizer.Log;
    Pixelizer.Input = function(i, e) {
        this.isPointer = false;
        i.addEventListener("mousedown", function(t) {
            this.isPointer = true;
            e.start(n(i, t));
        });
        i.addEventListener("mouseup", function(t) {
            if (this.isPointer) {
                this.isPointer = false;
                e.end(n(i, t));
            }
        });
        i.addEventListener("mouseleave", function(t) {
            if (this.isPointer) {
                this.isPointer = false;
                e.end(n(i, t));
            }
        });
        i.addEventListener("mousemove", function(t) {
            if (this.isPointer) {
                e.draw(n(i, t));
            }
        });
        i.addEventListener("touchstart", function(t) {
            this.isPointer = true;
            e.start(s(i, t));
        });
        i.addEventListener("touchend", function(t) {
            if (this.isPointer) {
                this.isPointer = false;
                e.end(null);
            }
        });
        i.addEventListener("touchmove", function(t) {
            if (this.isPointer) {
                e.draw(s(i, t));
            }
        });
    };
    function n(t, i) {
        var e = t.getBoundingClientRect();
        return {
            x: i.clientX - e.left,
            y: i.clientY - e.top
        };
    }
    function s(t, i) {
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
        this.draw = new Pixelizer.Draw(canvas, i);
        this.input = new Pixelizer.Input(canvas, this.draw);
    };
    Pixelizer.Renderer.prototype.updateOptions = function(t) {
        this.draw.setOptions(t);
    };
    Pixelizer.Renderer.prototype.clearCanvas = function() {
        this.draw.clear();
    };
})();