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
        assert.equal(cluster.labels[0], 'null');
        assert.equal(cluster.clusters[0], 0);
    });

    it('test calculate pixel distance', () => {
        let cluster = new Cluster(oldPixels, newPixels);
        let dist1 = cluster.pixelDistance(2, 2, 10, 8);
        let dist2 = cluster.pixelDistance(0, 10, 0, 20);
        let dist3 = cluster.pixelDistance(5, 0, 10, 0);
        assert.equal(dist1, 8);
        assert.equal(dist2, 10);
        assert.equal(dist3, 5);
    });

});