const assert = require('assert');
const Pixels = require('../src/pixels');
const Cluster = require('../src/cluster');
const Options = require('../src/options');

describe('Cluster (cluster.js)', () => {
    
    let mockImage = {
        bitmap: {
            width: 400,
            height: 200,
            data: []
        },
        getPixelIndex: function(x, y) {
            return (x + y * 400) * 4;
        }
    };
    for (var i=0; i<400 * 200 * 4; i++) {
        mockImage.bitmap.data.push(i % 255);
    }

    let oldPixels = new Pixels(400, 200, 1, mockImage);
    let newPixels = new Pixels(20, 10, 20, mockImage);

    let options = new Options().setPixelSize(20);

    it('constructor should initialize the corret values', () => {
        let cluster = new Cluster(oldPixels, newPixels, options);
        assert.deepEqual(cluster.oldPixels, oldPixels);
        assert.deepEqual(cluster.newPixels, newPixels);
        assert.deepEqual(cluster.options, options);
        assert.notEqual(cluster.labels, null);
        assert.notEqual(cluster.permutations, null);
    });

    it('dry run cluster map function', () => {
        let cluster = new Cluster(oldPixels, newPixels, options);
        let acc = cluster.map();
        assert.equal(acc, 1439);
    });

    it('dry run cluster reduce function', () => {
        let cluster = new Cluster(oldPixels, newPixels, options);
        let acc = cluster.map();
        cluster.reduce();
    });

    it('calculate pixel distance exceptions', () => {
        let cluster = new Cluster(oldPixels, newPixels, options);
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
        let cluster = new Cluster(oldPixels, newPixels, options);
        let distance = cluster.pixelDistance(1, 1, 0, 0, 2, 0.5);
        assert(distance >= 0 && distance <= 1);
    });

});