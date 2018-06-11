const assert = require('assert');
const Labels = require('../src/labels');

describe('Labels (labels.js)', () => {

    it('constructor should initialize correct values', () => {
        let labels = new Labels(200, 200);
        assert.equal(labels.labels.length, 200 * 200);
        let label = labels.getLabel(20, 20);
        assert.equal
    });

});