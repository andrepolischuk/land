
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

var sandbox = document.createElement('div');
sandbox.id = 'sandbox';
sandbox.style.display = 'none';
document.getElementsByTagName('body')[0].appendChild(sandbox);

var sandboxChild = document.createElement('div');
sandboxChild.id = 'sandboxChild';
sandboxChild.style.display = 'none';
sandbox.appendChild(sandboxChild);

var section = land(sandbox);
var children = section.children(sandboxChild);

describe('land(el)', function() {
  it('should return object', function() {
    assert(typeof section === 'object');
  });

  it('should contain props', function() {
    assert(section.element);
    assert(section.childrens && section.childrens.length > 0);
    assert.deepEqual(children, section.childrens[0]);
  });

  it('should contain methods', function() {
    assert(typeof section.children === 'function');
  });
});

describe('Section#children(el)', function() {
  it('should return object', function() {
    assert(typeof children === 'object');
  });

  it('should contain props', function() {
    assert(children.element);
    assert(children.section);
    assert.deepEqual(section, children.section);
  });

  it('should contain methods', function() {
    assert(typeof children.set === 'function');
    assert(typeof children.opacity === 'function');
    assert(typeof children.x === 'function');
    assert(typeof children.y === 'function');
    assert(typeof children.scale === 'function');
    assert(typeof children.rotate === 'function');
    assert(typeof children.children === 'function');
  });
});
