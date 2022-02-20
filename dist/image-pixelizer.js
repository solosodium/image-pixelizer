var Pixelizer;

(function() {

    class Bitmap {
        constructor(width, height, data) {
            if (width * height * 4 !== data.length) {
                throw new Error("Length of data doesn't match width and height");
            }
            this.width = width;
            this.height = height;
            this.data = data;
        }
        getPixelIndex(x, y) {
            x = Math.min(Math.max(0, x), this.width - 1);
            y = Math.min(Math.max(0, y), this.height - 1);
            return (this.width * y + x) * 4;
        }
    }
    
    class Cluster {
        constructor(oldPixels, newPixels, options) {
            this.oldPixels = oldPixels;
            this.newPixels = newPixels;
            this.options = options;
            this.labels = new Labels(oldPixels.width, oldPixels.height, options.pixelSize);
            this.permutations = [ {
                x: -1,
                y: -1
            }, {
                x: 0,
                y: -1
            }, {
                x: 1,
                y: -1
            }, {
                x: -1,
                y: 0
            }, {
                x: 0,
                y: 0
            }, {
                x: 1,
                y: 0
            }, {
                x: -1,
                y: 1
            }, {
                x: 0,
                y: 1
            }, {
                x: 1,
                y: 1
            } ];
        }
        cluster() {
            for (let i = 0; i < this.options.maxIteration; i++) {
                let pixelChangeCount = this.map();
                this.reduce();
                let percentage = pixelChangeCount / this.oldPixels.width / this.oldPixels.height;
                if (percentage < this.options.clusterThreshold) {
                    break;
                }
            }
            return this;
        }
        getPixels() {
            return this.newPixels;
        }
        map() {
            let acc = 0;
            for (let x = 0; x < this.oldPixels.width; x++) {
                for (let y = 0; y < this.oldPixels.height; y++) {
                    let position;
                    let cost = Number.MAX_VALUE;
                    for (let n = 0; n < this.permutations.length; n++) {
                        let xx = Math.floor(x / this.options.pixelSize) + this.permutations[n].x;
                        let yy = Math.floor(y / this.options.pixelSize) + this.permutations[n].y;
                        if (xx >= 0 && xx < this.newPixels.width && yy >= 0 && yy < this.newPixels.height) {
                            let c = this.pixelDifference(x, y, xx, yy);
                            if (c < cost) {
                                cost = c;
                                position = {
                                    x: xx,
                                    y: yy
                                };
                            }
                        }
                    }
                    this.labels.setLabel(x, y, position.x, position.y);
                    acc += this.labels.getLabel(x, y).changed ? 1 : 0;
                }
            }
            return acc;
        }
        reduce() {
            for (let xx = 0; xx < this.newPixels.width; xx++) {
                for (let yy = 0; yy < this.newPixels.height; yy++) {
                    let list = this.labels.getList(xx, yy);
                    let aggregate = this.newPixels.getPixel(xx, yy);
                    if (list.length > 0) {
                        aggregate = RGBA.scale(aggregate, 1 / 2);
                        for (let i = 0; i < list.length; i++) {
                            let pos = list[i];
                            let pixel = this.oldPixels.getPixel(pos.x, pos.y);
                            aggregate = RGBA.add(aggregate, RGBA.scale(pixel, 1 / list.length / 2));
                        }
                    }
                    this.newPixels.setPixel(xx, yy, aggregate);
                }
            }
        }
        pixelDifference(x, y, xx, yy) {
            let pixelSize = this.options.pixelSize;
            let colorDistRatio = this.options.colorDistRatio;
            x = Math.max(0, Math.min(x, this.oldPixels.width - 1));
            y = Math.max(0, Math.min(y, this.oldPixels.height - 1));
            xx = Math.max(0, Math.min(xx, this.newPixels.width - 1));
            yy = Math.max(0, Math.min(yy, this.newPixels.height - 1));
            let oldPixel = this.oldPixels.getPixel(x, y);
            let newPixel = this.newPixels.getPixel(xx, yy);
            let colorDiff = RGBA.difference(oldPixel, newPixel);
            let xxt = xx * pixelSize + (pixelSize - 1) / 2;
            let yyt = yy * pixelSize + (pixelSize - 1) / 2;
            let dx = Math.abs(x - xxt);
            let dy = Math.abs(y - yyt);
            let dxy = dx * dx + dy * dy;
            let distDiff = Math.sqrt(dxy / (pixelSize + 1) / (pixelSize + 1));
            return colorDistRatio * colorDiff + (1 - colorDistRatio) * distDiff;
        }
    }
    
    class XYZA {
        constructor(rgba) {
            let r = rgba.r / 255;
            let g = rgba.g / 255;
            let b = rgba.b / 255;
            let a = rgba.a / 255;
            this.x = .4124564 * r + .3575761 * g + .1804375 * b;
            this.y = .2126729 * r + .7151522 * g + .072175 * b;
            this.z = .0193339 * r + .119192 * g + .9503041 * b;
            this.a = a;
        }
    }
    
    class LABAlpha {
        constructor(xyza) {
            const e = .008856;
            const k = 903.3;
            let x = xyza.x / .31271;
            let y = xyza.y / .32902;
            let z = xyza.z / .35827;
            let a = xyza.a * 255;
            let fx = x > e ? Math.cbrt(x) : (k * x + 16) / 116;
            let fy = y > e ? Math.cbrt(y) : (k * y + 16) / 116;
            let fz = z > e ? Math.cbrt(z) : (k * z + 16) / 116;
            this.l = 116 * fy - 16;
            this.a = 500 * (fx - fy);
            this.b = 200 * (fy - fz);
            this.alpha = a;
        }
    }
    
    class RGBA {
        constructor(r, g, b, a) {
            this.r = Math.min(Math.max(0, r), 255);
            this.g = Math.min(Math.max(0, g), 255);
            this.b = Math.min(Math.max(0, b), 255);
            this.a = Math.min(Math.max(0, a), 255);
        }
        copy() {
            return new RGBA(this.r, this.g, this.b, this.a);
        }
        toString() {
            return "rgba(" + this.r + ", " + this.g + ", " + this.b + ", " + this.a + ")";
        }
        static difference(c1, c2) {
            let labaplha1 = new LABAlpha(new XYZA(c1));
			let labaplha2 = new LABAlpha(new XYZA(c2));
			let dl = Math.abs(labaplha1.l - labaplha2.l);
			let da = Math.abs(labaplha1.a - labaplha2.a);
			let db = Math.abs(labaplha1.b - labaplha2.b);
			let dalpha = Math.abs(labaplha1.alpha - labaplha2.alpha);
			return Math.sqrt(dl * dl + da * da + db * db + dalpha * dalpha) / 453;
        }
        static add(c1, c2) {
            let r = c1.r + c2.r;
            let g = c1.g + c2.g;
            let b = c1.b + c2.b;
            let a = c1.a + c2.a;
            return new RGBA(r, g, b, a);
        }
        static subtract(c1, c2) {
            let r = c1.r - c2.r;
            let g = c1.g - c2.g;
            let b = c1.b - c2.b;
            let a = c1.a - c2.a;
            return new RGBA(r, g, b, a);
        }
        static scale(c, val) {
            let r = c.r * val;
            let g = c.g * val;
            let b = c.b * val;
            let a = c.a * val;
            return new RGBA(r, g, b, a);
        }
        static zero() {
            return new RGBA(0, 0, 0, 0);
        }
        static length(c) {
            return Math.sqrt(c.r * c.r + c.g * c.g + c.b * c.b + c.a * c.a);
        }
    }
    
    class Labels {
        constructor(width, height, size) {
            this.oldWidth = width;
            this.oldHeight = height;
            this.size = size;
            this.newWidth = Math.ceil(this.oldWidth / this.size);
            this.newHeight = Math.ceil(this.oldHeight / this.size);
            this.labels = Array(this.oldWidth).fill().map(() => Array(this.oldHeight));
            this.lists = Array(this.newWidth).fill().map(() => Array(this.newHeight).fill().map(() => Array(0)));
            for (let x = 0; x < this.oldWidth; x++) {
                for (let y = 0; y < this.oldHeight; y++) {
                    let xx = Math.floor(x / size);
                    let yy = Math.floor(y / size);
                    this.labels[x][y] = {
                        x: xx,
                        y: yy,
                        changed: true
                    };
                    this.lists[xx][yy].push({
                        x: x,
                        y: y
                    });
                }
            }
        }
        getLabel(x, y) {
            x = Math.max(0, Math.min(x, this.oldWidth - 1));
            y = Math.max(0, Math.min(y, this.oldHeight - 1));
            return this.labels[x][y];
        }
        setLabel(x, y, xx, yy) {
            x = Math.max(0, Math.min(x, this.oldWidth - 1));
            y = Math.max(0, Math.min(y, this.oldHeight - 1));
            xx = Math.max(0, Math.min(xx, this.newWidth - 1));
            yy = Math.max(0, Math.min(yy, this.newHeight - 1));
            let label = this.getLabel(x, y);
            let pos = {
                x: x,
                y: y
            };
            let idx = this.lists[label.x][label.y].findIndex(pos => pos.x == x && pos.y == y);
            if (idx > -1) {
                this.lists[label.x][label.y].splice(idx, 1);
                this.lists[xx][yy].push(pos);
            }
            let changed = label.x !== xx || label.y !== yy;
            this.labels[x][y] = {
                x: xx,
                y: yy,
                changed: changed
            };
        }
        getList(xx, yy) {
            xx = Math.max(0, Math.min(xx, this.newWidth - 1));
            yy = Math.max(0, Math.min(yy, this.newHeight - 1));
            return this.lists[xx][yy];
        }
    }
    
    class Options {
        constructor() {
            this.pixelSize = 1;
            this.colorDistRatio = .5;
            this.clusterThreshold = .01;
            this.maxIteration = 10;
            this.numberOfColors = 128;
            return this;
        }
        setPixelSize(size) {
            this.pixelSize = size;
            return this;
        }
        setColorDistRatio(ratio) {
            this.colorDistRatio = Math.max(0, Math.min(ratio, 1));
            return this;
        }
        setClusterThreshold(threshold) {
            this.clusterThreshold = Math.max(0, Math.min(threshold, 1));
            return this;
        }
        setMaxIteration(iteration) {
            this.maxIteration = iteration;
            return this;
        }
        setNumberOfColors(number) {
            this.numberOfColors = parseInt(number);
            return this;
        }
    }
    
    class Palette {
        constructor(pixels, options) {
            this.pixels = pixels;
            this.options = options;
            this.colors = pixels.pixels;
            this.groups = [];
        }
        reduce() {
            if (this.options.numberOfColors <= 0) {
                return this.pixels;
            }
            this.initGroups();
            while (this.groups.length < this.options.numberOfColors) {
                this.splitGroups();
                let iter = 0;
                let change = 2;
                while (iter < 1e5 && change > this.options.clusterThreshold) {
                    change = this.assignGroups();
                    this.updateGroups();
                    iter++;
                }
            }
            this.map();
            return this.pixels;
        }
        initGroups() {
            this.groups.push({
                mean: RGBA.zero(),
                sd: RGBA.zero(),
                oldList: [],
                newList: []
            });
        }
        assignGroups() {
            let colorChanged = 0;
            for (let i = 0; i < this.colors.length; i++) {
                let minDiff = Number.MAX_VALUE;
                let groupIndex = -1;
                for (let j = 0; j < this.groups.length; j++) {
                    let diff = RGBA.difference(this.groups[j].mean, this.colors[i]);
                    if (diff < minDiff) {
                        minDiff = diff;
                        groupIndex = j;
                    }
                }
                this.groups[groupIndex].newList.push(this.colors[i]);
                if (this.groups[groupIndex].oldList.indexOf(this.colors[i]) < 0) {
                    colorChanged++;
                }
            }
            for (let i = 0; i < this.groups.length; i++) {
                this.groups[i].oldList = this.groups[i].newList;
                this.groups[i].newList = [];
            }
            return colorChanged / this.colors.length;
        }
        updateGroups() {
            for (let i = 0; i < this.groups.length; i++) {
                let aggregate = RGBA.zero();
                let r2 = 0, g2 = 0, b2 = 0, a2 = 0;
                let length = this.groups[i].oldList.length;
                for (let j = 0; j < length; j++) {
                    let color = this.groups[i].oldList[j];
                    aggregate = RGBA.add(aggregate, RGBA.scale(color, 1 / length));
                    r2 += color.r * color.r / length;
                    g2 += color.g * color.g / length;
                    b2 += color.b * color.b / length;
                    a2 += color.a * color.a / length;
                }
                this.groups[i].mean = aggregate;
                this.groups[i].sd = new RGBA(Math.sqrt(Math.max(0, r2 - aggregate.r * aggregate.r)), Math.sqrt(Math.max(0, g2 - aggregate.g * aggregate.g)), Math.sqrt(Math.max(0, b2 - aggregate.b * aggregate.b)), Math.sqrt(Math.max(0, a2 - aggregate.a * aggregate.a)));
            }
        }
        splitGroups() {
            let maxSd = -1;
            let group = null;
            for (let i = 0; i < this.groups.length; i++) {
                if (RGBA.length(this.groups[i].sd) >= maxSd) {
                    maxSd = RGBA.length(this.groups[i].sd);
                    group = this.groups[i];
                }
            }
            this.groups.splice(this.groups.indexOf(group), 1);
            this.groups.push({
                mean: RGBA.subtract(group.mean, group.sd),
                sd: RGBA.zero(),
                oldList: [],
                newList: []
            });
            this.groups.push({
                mean: RGBA.add(group.mean, group.sd),
                sd: RGBA.zero(),
                oldList: [],
                newList: []
            });
        }
        map() {
            for (let x = 0; x < this.pixels.width; x++) {
                for (let y = 0; y < this.pixels.height; y++) {
                    let minDiff = Number.MAX_VALUE;
                    let closestColor = this.pixels.getPixel(x, y);
                    for (let i = 0; i < this.groups.length; i++) {
                        let diff = RGBA.difference(this.pixels.getPixel(x, y), this.groups[i].mean);
                        if (diff <= minDiff) {
                            minDiff = diff;
                            closestColor = this.groups[i].mean;
                        }
                    }
                    this.pixels.setPixel(x, y, closestColor);
                }
            }
        }
    }
    
    class Pixels {
        constructor(width, height, size, bitmap) {
            this.width = width;
            this.height = height;
            this.size = size;
            if (width * size > bitmap.width) {
                throw new Error("invalid width combination, width(" + width + "), " + "size(" + size + "), bitmap width(" + bitmap.width + ")");
            }
            if (height * size > bitmap.height) {
                throw new Error("invalid height combination, height(" + height + "), " + "size(" + size + "), bitmap height(" + bitmap.height + ")");
            }
            this.pixels = [];
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    let r = 0, g = 0, b = 0, a = 0;
                    for (let i = 0; i < size; i++) {
                        for (let j = 0; j < size; j++) {
                            let xx = x * size + i;
                            let yy = y * size + j;
                            let idx = bitmap.getPixelIndex(xx, yy);
                            r += bitmap.data[idx + 0] / size / size;
                            g += bitmap.data[idx + 1] / size / size;
                            b += bitmap.data[idx + 2] / size / size;
                            a += bitmap.data[idx + 3] / size / size;
                        }
                    }
                    this.pixels[y * width + x] = new RGBA(r, g, b, a);
                }
            }
        }
        getPixel(x, y) {
            if (x < 0 || x > this.width - 1) {
                throw new Error("x (" + x + ") is not in bound");
            }
            if (y < 0 || y > this.height - 1) {
                throw new Error("y (" + y + ") is not in bound");
            }
            return this.pixels[y * this.width + x];
        }
        setPixel(x, y, rgba) {
            if (x < 0 || x > this.width - 1) {
                throw new Error("x (" + x + ") is not in bound");
            }
            if (y < 0 || y > this.height - 1) {
                throw new Error("y (" + y + ") is not in bound");
            }
            this.pixels[y * this.width + x] = rgba;
        }
        toBitmap() {
            let data = [];
            for (let y = 0; y < this.height; y++) {
                for (let x = 0; x < this.width; x++) {
                    let rgba = this.getPixel(x, y);
                    data.push(rgba.r);
                    data.push(rgba.g);
                    data.push(rgba.b);
                    data.push(rgba.a);
                }
            }
            return new Bitmap(this.width, this.height, data);
        }
    }
    
    class _Pixelizer {
        constructor(bitmap, options) {
            this.options = options;
            this.oldPixels = this.createPixels(bitmap, 1);
            this.newPixels = this.createPixels(bitmap, options.pixelSize);
        }
        updateOptions(options) {
            this.options = options;
            this.newPixels = this.createPixels(bitmap, options.pixelSize);
        }
        pixelize() {
            let cluster = new Cluster(this.oldPixels, this.newPixels, this.options);
            cluster.cluster();
            let palette = new Palette(cluster.getPixels(), this.options);
            let reducedPixels = palette.reduce();
            return reducedPixels.toBitmap();
        }
        createPixels(bitmap, size) {
            let width = bitmap.width;
            let height = bitmap.height;
            let w = Math.floor(width / size);
            let h = Math.floor(height / size);
            return new Pixels(w, h, size, bitmap);
        }
    }
    
    _Pixelizer.Options = Options;
    
    _Pixelizer.Bitmap = Bitmap;
    
    _Pixelizer.RGBA = RGBA;

    Pixelizer = _Pixelizer;

})();