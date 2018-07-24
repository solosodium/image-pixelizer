const assert = require('assert');
const Log = require('../src/log');

describe('Log (log.js)', () => {

  it('config should return correct configuration', () => {
    assert.deepEqual(Log.config(), {
      isVerbose: true
    });
  });
  
});
