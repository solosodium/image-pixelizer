const assert = require('assert');
const Labels = require('../src/labels');

describe('Labels (labels.js)', () => {

  it('constructor should initialize correct values', () => {
    let labels = new Labels(410, 210, 20);
    assert.equal(labels.labels.length, 410);
    assert.equal(labels.labels[0].length, 210);
    assert.equal(labels.lists.length, Math.ceil(410 / 20));
    assert.equal(labels.lists[0].length, Math.ceil(210 / 20));
    let label = labels.getLabel(155, 89);
    assert.deepEqual(label, { x: 7, y: 4, changed: true });
  });

  it('test set label and get label functions', () => {
    let labels = new Labels(410, 210, 20);
    labels.setLabel(125, 43, 0, 0);
    let label = labels.getLabel(125, 43);
    assert.deepEqual(label, { x: 0, y: 0, changed: true });
    labels.setLabel(125, 43, 6, 3);
    label = labels.getLabel(125, 43);
    assert.deepEqual(label, { x: 6, y: 3, changed: true });
    labels.setLabel(125, 43, 6, 3);
    label = labels.getLabel(125, 43);
    assert.deepEqual(label, { x: 6, y: 3, changed: false });
  });

  it('test get list function', () => {
    let labels = new Labels(410, 210, 20);
    let oldCount1 = labels.getList(9, 4).length;
    let oldCount2 = labels.getList(9, 3).length;
    labels.setLabel(195, 91, 9, 3);
    let newCount1 = labels.getList(9, 4).length;
    let newCount2 = labels.getList(9, 3).length;
    assert.equal(newCount1, oldCount1 - 1);
    assert.equal(newCount2, oldCount2 + 1);
  });

});
