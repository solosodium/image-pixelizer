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

});