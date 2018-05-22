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

    it('test calculate pixel distance', () => {
        let cluster = new Cluster(oldPixels, newPixels);
        let dist1 = cluster.pixelDistance(2, 2, 4, 4, 2);
        let dist2 = cluster.pixelDistance(0, 1, 0, 2, 2);
        let dist3 = cluster.pixelDistance(1, 0, 2, 0, 2) ;
        assert.equal(dist1, 1);
        assert.equal(dist2, 0.5);
        assert.equal(dist3, 0.5);
    });

});