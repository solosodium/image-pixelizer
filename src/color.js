(function() {

    class RGBA {
        /**
         * RGBA constructor.
         * @param {number} r red 0~255
         * @param {number} g green 0~255
         * @param {number} b blue 0~255
         * @param {number} a alpha 0~255 
         */
        constructor(r, g, b, a) {
            this.r = clamp(r, 0, 255);
            this.g = clamp(g, 0, 255);
            this.b = clamp(b, 0, 255);
            this.a = clamp(a, 0, 255);
        }

        /** Convert to HSVA color space. */
        toHSVA() {
            let R = this.r / 255;
            let G = this.g / 255
            let B = this.b / 255;
            let M = Math.max(R, G, B);
            let m = Math.min(R, G, B);
            let C = M - m;
            let H = 0;
            if (M === R) {
                H = ((G - B) / C) % 6;
            } else if (M === G) {
                H = (B - R) / C + 2;
            } else if (M === B) {
                H = (R - G) / C + 4;
            }
            H *= 60;
            let V = M;
            let S = 0;
            if (V !== 0) {
                S = C / V;
            }
            return new HSVA(H, S, V, this.a / 255);
        }
    }

    class HSVA {
        /**
         * HSVA constructor.
         * @param {number} h hue 0~360
         * @param {number} s saturation 0~1
         * @param {number} v value 0~1 
         * @param {number} a alpha 0~1
         */
        constructor(h, s, v, a) {
            this.h = clamp(h, 0, 360);
            this.s = clamp(s, 0, 1);
            this.v = clamp(v, 0, 1);
            this.a = clamp(a, 0, 1);
        }

        /** Convert to RGBA color space. */
        toRGBA() {
            let C = this.v * this.s;
            let H = this.h / 60;
            let X = C * (1 - Math.abs((H % 2) - 1));
            let R = 0, G = 0, B = 0;
            if (H >= 0 && H < 1) {
                R = C; G = X; B = 0;
            } else if (H >= 1 && H < 2) {
                R = X; G = C; B = 0;
            } else if (H >= 2 && H < 3) {
                R = 0; G = C; B = X;
            } else if (H >= 3 && H < 4) {
                R = 0; G = X; B = C;
            } else if (H >= 4 && H < 5) {
                R = X; G = 0; B = C;
            } else if (H >= 5 && H <= 6) {
                R = C; G = 0; B = X;
            }
            let m = this.v - C;
            R = Math.round((R + m) * 255);
            G = Math.round((G + m) * 255);
            B = Math.round((B + m) * 255);
            return new RGBA(R, G, B, Math.round(this.a * 255));
        }
    }

    /** Clamp value between min and max values. */
    function clamp(val, min, max) {
        return Math.min(Math.max(min, val), max);
    }

    /**
     * Color module for color format conversion.
     */
    module.exports = {
        RGBA: RGBA,
        HSVA: HSVA
    };

})();