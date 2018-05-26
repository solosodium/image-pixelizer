const assert = require('assert');
const Pixels = require('../src/pixels');
const Cluster = require('../src/cluster');

describe('Cluster (cluster.js)', () => {
    
    let mockImage = {
        bitmap: {
            width: 10,
            height: 10,
            data: []
        },
        getPixelIndex: function(x, y) {
            return (x + y * 10) * 4;
        }
    };
    for (var i=0; i<10 * 10 * 4; i++) {
        mockImage.bitmap.data.push(i % 255);
    }

    let oldPixels = new Pixels(10, 10, 1, mockImage);
    let newPixels = new Pixels(10, 10, 2, mockImage);

    it('constructor should initialize the corret values', () => {
        let cluster = new Cluster(oldPixels, newPixels);
        assert.deepEqual(cluster.oldPixels, oldPixels);
        assert.deepEqual(cluster.newPixels, newPixels);
        assert.deepEqual(cluster.labels[0], { x: -1, y: -1 });
    });

    it('calculate pixel distance exceptions', () => {
        let cluster = new Cluster(oldPixels, newPixels);
        assert.throws(
            () => cluster.pixelDistance(-1, 20, 0, 0, 0, 0),
            'x1 (-1), y1 (20) is out of range');
        assert.throws(
            () => cluster.pixelDistance(5, 5, -1, 6, 0, 0),
            'x2 (-1), y2 (6) is out of range');
        assert.throws(
            () => cluster.pixelDistance(1, 1, 3, 3, 0, 0),
            'Old (1, 1) and new (3, 3) pixels are not neighbors');
        
    });

    it('test calculate pixel distance', () => {
        let cluster = new Cluster(oldPixels, newPixels);
        let dist1 = cluster.pixelDistance(2, 2, 1, 1, 2, 0);
        let dist2 = cluster.pixelDistance(0, 4, 0, 2, 2, 0.5);
        let dist3 = cluster.pixelDistance(5, 0, 2, 0, 2, 1) ;
        assert(Math.abs(dist1 - 0.250) < 0.001);
        assert(Math.abs(dist2 - 0.147) < 0.001);
        assert(Math.abs(dist3 - 0.0412) < 0.001);
    });

    it('test cluster map function', () => {
        let cluster = new Cluster(oldPixels, newPixels);
        let acc = cluster.map();
    });

});