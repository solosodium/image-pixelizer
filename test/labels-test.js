const assert = require('assert');
const Labels = require('../src/labels');

describe('Labels (labels.js)', () => {

    it('constructor should initialize correct values', () => {
        let labels = new Labels(210, 210, 20);
        let label = labels.getLabel(20, 20);
    });

});