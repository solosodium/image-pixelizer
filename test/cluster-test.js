const assert = require('assert');
const Pixels = require('../src/pixels');
const Cluster = require('../src/cluster');
const Options = require('../src/options');
const Bitmap = require('../src/bitmap');

describe('Cluster (cluster.js)', () => {

	let data = [];
	for (var i = 0; i < 100 * 80 * 4; i++) {
		data.push(i % 255);
	}
	let mockBitmap = new Bitmap(100, 80, data);
	

	let oldPixels = new Pixels(100, 80, 1, mockBitmap);
	let newPixels = new Pixels(10, 8, 10, mockBitmap);

	let options = new Options().setPixelSize(10);

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
	});

	it('dry run cluster reduce function', () => {
		let cluster = new Cluster(oldPixels, newPixels, options);
		let acc = cluster.map();
		cluster.reduce();
	});

	it('test pixel difference calculation', () => {
		let cluster = new Cluster(oldPixels, newPixels, options);
		let distance = cluster.pixelDifference(1, 1, 0, 0);
		assert(distance >= 0 && distance <= 1);
	});

	it('test get pixels', () => {
		let cluster = new Cluster(oldPixels, newPixels, options);
		assert.deepEqual(cluster.getPixels(), newPixels);
	});

});
