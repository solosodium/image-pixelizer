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
    let newPixels = new Pixels(5, 5, 2, mockImage);

    it('constructor should initialize the corret values', () => {
        let cluster = new Cluster(oldPixels, newPixels);
        assert.deepEqual(cluster.oldPixels, oldPixels);
        assert.deepEqual(cluster.newPixels, newPixels);
        assert.deepEqual(cluster.labels[10], { x: -1, y: -1 });
    });

    it('constructor should throw exception for invalid inputs', () => {
        let badNewPixels = new Pixels(3, 3, 3, mockImage);
        assert.throws(
            () => new Cluster(oldPixels, badNewPixels), 
            Error
        );
    });

    it('calculate pixel distance exceptions', () => {
        let cluster = new Cluster(oldPixels, newPixels);
        assert.throws(
            () => cluster.pixelDistance(-1, 20, 0, 0, 0, 0),
            Error
        );
        assert.throws(
            () => cluster.pixelDistance(5, 5, -1, 3, 0, 0),
            Error
        );
        assert.throws(
            () => cluster.pixelDistance(1, 1, 3, 3, 0, 0),
            Error
        );
    });

    it('test pixel distance calculation', () => {
        let cluster = new Cluster(oldPixels, newPixels);
        let distance = cluster.pixelDistance(1, 1, 0, 0, 2, 0.5);
        assert(distance >= 0 && distance <= 1);
    });

    it('dry run cluster map function', () => {
        let cluster = new Cluster(oldPixels, newPixels);
        let acc = cluster.map();
        assert.equal(acc, 10 * 10);
    });

});