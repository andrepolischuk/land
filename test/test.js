
var land = require('..');
var assert = require('assert');

describe('land', function() {
  it('should return function', function() {
    assert(typeof land === 'function');
  });

  it('should contain props', function() {
    assert(land.sections);
  });

  it('should contain methods', function() {
    assert(typeof land.on === 'function');
  });
});
