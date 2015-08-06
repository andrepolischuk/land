'use strict';
var each = require('ea');

try {
  var type = require('type');
} catch (err) {
  var type = require('component-type');
}

var callbacks = {};
var current;
var scrollTop;

var transforms = {
  x: {
    prop: 'transform',
    def: 0,
    ext: 'px',
    func: 'translateX'
  },
  y: {
    prop: 'transform',
    def: 0,
    ext: 'px',
    func: 'translateY'
  },
  scale: {
    prop: 'transform',
    def: 1,
    func: 'scale'
  },
  rotate: {
    prop: 'transform',
    def: 0,
    ext: 'deg',
    func: 'rotate'
  },
  opacity: {
    def: 1,
    prop: 'opacity'
  }
};

var prefix = {
  transform: [
    'webkitTransform',
    'MozTransform',
    'msTransform',
    'oTransform',
    'transform'
  ],
  opacity: [
    'MozOpacity',
    'opacity'
  ]
};

module.exports = Section;

function Section(el) {
  if (!(this instanceof Section)) return new Section(el);
  if (type(el) === 'string') el = document.querySelector(el);
  if (!el) return;
  this.element = el;
  this.childrens = [];
  this.current = false;
  this._progress = 0;
  Section.sections.push(this);
}

Section.prototype.children = function(el) {
  return new Children(el, this);
};

Section.prototype.update = function() {
  var height = this.element.offsetHeight;
  var scrollBottom = scrollTop + window.innerHeight;
  var offsetTop = this.element.offsetTop;
  this.current = scrollBottom >= offsetTop &&
  scrollBottom <= offsetTop + height;

  this._progress = scrollBottom <= offsetTop ? 0 :
    (scrollBottom >= offsetTop + height ? 1 :
    (scrollBottom - offsetTop) / height);

  each(this.childrens, function(children) {
    children.update();
  });
};

function Children(el, section) {
  if (type(el) === 'string') el = section.element.querySelector(el);
  if (!el) return;
  this.element = el;
  this.section = section;
  this._transform = {};
  this._delay = 0;
  section.childrens.push(this);
}

Children.prototype.set = function(prop, val) {
  this._transform[prop] = type(val) === 'function' ? val : parseFloat(val);
  this.update();
  return this;
};

each(transforms, function(transform, prop) {
  Children.prototype[prop] = function(val) {
    this.set(prop, val);
    return this;
  };
});

Children.prototype.delay = function(delay) {
  this._delay = parseFloat(delay) || 0;
  return this;
};

Children.prototype.children = function(el) {
  return this.section.children(el);
};

Children.prototype.update = function() {
  var delay = this._delay;
  var progress = this.section._progress;
  var element = this.element;
  var css = {};

  each(this._transform, function(val, param) {
    var transform = transforms[param];
    var final = transform.def;

    var value = type(val) === 'function' ?
      val(progress, final) :
      val + ((final - val) * (progress < delay ? 0 :
        progress - 1 + ((progress - delay) / (1 - delay))));

    value += transform.ext || '';
    value = param === 'opacity' ? value : transform.func + '(' + value + ')';

    each(prefix[transform.prop], function(pref) {
      css[pref] = css[pref] ? css[pref] + ' ' + value : value;
    });
  });

  each(css, function(value, prop) {
    element.style[prop] = value;
  });
};

Section.on = function(event, fn) {
  if (type(fn) !== 'function') return;
  callbacks[event] = fn;
};

Section.sections = [];
window.addEventListener('scroll', scroll, false);
scroll();

function scroll() {
  var cur = 0;
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  each(Section.sections, function(section, i) {
    section.update();
    cur = section.current ? i : cur;
  });

  if (cur === current) return;
  current = cur;
  if (callbacks.change) callbacks.change(current);
}
