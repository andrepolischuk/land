
'use strict';

/**
 * Module dependencies
 */

try {
  var type = require('type');
} catch (err) {
  var type = require('component-type');
}

var each = require('ea');

/**
 * Current section
 */

var current;

/**
 * Transform parameters
 */

var transforms = {
  x : {
    prop : 'transform',
    def  : 0,
    ext  : 'px',
    func : 'translateX'
  },
  y : {
    prop : 'transform',
    def  : 0,
    ext  : 'px',
    func : 'translateY'
  },
  scale : {
    prop : 'transform',
    def  : 1,
    func : 'scale'
  },
  rotate : {
    prop : 'transform',
    def  : 0,
    ext  : 'deg',
    func : 'rotate'
  },
  opacity : {
    def  : 1,
    prop : 'opacity'
  }
};

/**
 * CSS prefixes for transform parameters
 */

var prefix = {
  transform : [
    'webkitTransform',
    'MozTransform',
    'msTransform',
    'oTransform',
    'transform'
  ],
  opacity : [
    'MozOpacity',
    'opacity'
  ]
};

/**
 * Callbacks
 */

var callbacks = {};

/**
 * Expose land
 */

module.exports = Section;

/**
 * Section
 * @param {Element} element
 * @api public
 */

function Section(element) {
  if (!(this instanceof Section)) return new Section(element);
  if (type(element) === 'string') element = document.querySelector(element);
  if (!element) return;

  this.element = element;
  this.childrens = [];
  this._progress = 0;
  this._current = false;

  Section.sections.push(this);
}

/**
 * Create section children
 * @param  {String} selector
 * @return {Object}
 * @api public
 */

Section.prototype.children = function(element) {
  return new Children(element, this);
};

/**
 * Update section
 * @api private
 */

Section.prototype.update = function() {
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  var height = this.element.offsetHeight;
  var offsetTop = this.element.offsetTop;

  this._current = scrollTop >= offsetTop &&
    scrollTop <= offsetTop + height;

  this._progress = scrollTop + height <= offsetTop ? 0 :
    (scrollTop >= offsetTop ? 1 :
    (scrollTop + height - offsetTop) / height);

  each(this.childrens, function(children) {
    children.update();
  });
};

/**
 * Section children
 * @param {Element} element
 * @api public
 */

function Children(element, section) {
  if (type(element) === 'string') element = this.element.querySelector(element);
  if (!element) return;

  this.element = element;
  this.section = section;

  this._transform = {};
  this._delay = 0;

  section.childrens.push(this);
}

/**
 * Attach opacity
 * @param  {Number} start
 * @return {Object}
 * @api public
 */

Children.prototype.opacity = function(start) {
  this._transform.opacity = parseFloat(start);
  return this;
};

/**
 * Attach horizontal movement
 * @param  {Number} start
 * @return {Object}
 * @api public
 */

Children.prototype.x = function(start) {
  this._transform.x = parseFloat(start);
  return this;
};

/**
 * Attach vertical movement
 * @param  {Number} start
 * @return {Object}
 * @api public
 */

Children.prototype.y = function(start) {
  this._transform.y = parseFloat(start);
  return this;
};

/**
 * Attach rotate
 * @param  {Number} start
 * @return {Object}
 * @api public
 */

Children.prototype.rotate = function(start) {
  this._transform.rotate = parseFloat(start);
  return this;
};

/**
 * Attach scale
 * @param  {Number} start
 * @return {Object}
 * @api public
 */

Children.prototype.scale = function(start) {
  this._transform.scale = parseFloat(start);
  return this;
};

/**
 * Attach delay
 * @param  {Number} start
 * @return {Object}
 * @api public
 */

Children.prototype.delay = function(delay) {
  this._delay = parseFloat(delay) || 0;
  return this;
};

/**
 * Create next children
 * @param  {Number} start
 * @return {Object}
 * @api public
 */

Children.prototype.children = function(selector) {
  return this.section.children(selector);
};

/**
 * Update section children
 * @param {Object} children
 * @api private
 */

Children.prototype.update = function() {
  var delay = this._delay;
  var progress = this.section._progress;
  var element = this.element;
  var css = {};

  each(this._transform, function(start, param) {
    var transform = transforms[param];
    var final = transform.def;

    var value = start + ((final - start) * (progress < delay ? 0 :
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

/**
 * Set callback
 * @param {String} event
 * @param {Function} fn
 * @api public
 */

Section.on = function(event, fn) {
  if (type(fn) !== 'function') return;
  callbacks[event] = fn;
};

/**
 * Sections array
 * @api public
 */

Section.sections = [];

/**
 * Initialize
 */

window.addEventListener('scroll', scroll, false);
scroll();

/**
 * Scroll handler
 * @api private
 */

function scroll() {
  var cur = 0;

  each(Section.sections, function(section, i) {
    section.update();
    cur = section._current ? i : cur;
  });

  if (cur === current) return;
  current = cur;

  if (callbacks.change) {
    callbacks.change(current);
  }
}

/**
 * Data attr
 */

var dataAttr = 'data-land';

/**
 * Init landing from DOM attributes
 */

parseDom();

/**
 * Parse DOM
 * @api private
 */

function parseDom() {
  var sectionClass = document.body.getAttribute(dataAttr);
  if (!sectionClass) return;

  var elements = document.querySelectorAll(sectionClass);

  each(elements, function(element) {
    parseSection(element);
  });
}

/**
 * Parse sections
 * @param {Element} element
 * @api private
 */

function parseSection(element) {
  var section = Section(element);
  var transformAttr = [];

  each(transforms, function(transform, param) {
    transformAttr.push([
      '[',
      dataAttr,
      '-',
      param,
      ']'
    ].join(''));
  });

  var elements = section.element.querySelectorAll(transformAttr.join(','));

  each(elements, function(element) {
    parseChildren(element, section);
  });
}

/**
 * Parse section childrens
 * @param {Element} element
 * @param {Object} section
 * @api private
 */

function parseChildren(element, section) {
  var children = section.children(element);
  var attr;

  each(transforms, function(transform, param) {
    attr = element.getAttribute(dataAttr + '-' + param);
    if (!attr) return;
    children[param](attr);
  });
}
