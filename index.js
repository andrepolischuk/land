
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
 * Data attr
 */

var dataAttr = 'data-land';

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

module.exports = land;

/**
 * Attach section
 * @param  {String|Element} element
 * @return {Object}
 * @api public
 */

function land(element) {
  element = type(element) === 'element' ?
    element :
    document.querySelector(element);

  if (!element) return;

  var section = new Section(element);
  land.sections.push(section);
  return section;
}

/**
 * Section
 * @param {Element} element
 * @api public
 */

function Section(element) {
  this.element = element;
  this.childrens = [];
}

/**
 * Create section children
 * @param  {String} selector
 * @return {Object}
 * @api public
 */

Section.prototype.children = function(element) {
  element = type(element) === 'element' ?
    element :
    this.element.querySelector(element);

  if (!element) return;

  var children = new Children(element, this);
  this.childrens.push(children);
  return children;
};

/**
 * Section children
 * @param {Element} element
 * @api public
 */

function Children(element, section) {
  this.element = element;
  this.section = section;
  this.transform = {};
}

/**
 * Attach opacity
 * @param  {Number} start
 * @return {Object}
 * @api public
 */

Children.prototype.opacity = function(start) {
  this.transform.opacity = parseFloat(start);
  return this;
};

/**
 * Attach horizontal movement
 * @param  {Number} start
 * @return {Object}
 * @api public
 */

Children.prototype.x = function(start) {
  this.transform.x = parseFloat(start);
  return this;
};

/**
 * Attach vertical movement
 * @param  {Number} start
 * @return {Object}
 * @api public
 */

Children.prototype.y = function(start) {
  this.transform.y = parseFloat(start);
  return this;
};

/**
 * Attach rotate
 * @param  {Number} start
 * @return {Object}
 * @api public
 */

Children.prototype.rotate = function(start) {
  this.transform.rotate = parseFloat(start);
  return this;
};

/**
 * Attach scale
 * @param  {Number} start
 * @return {Object}
 * @api public
 */

Children.prototype.scale = function(start) {
  this.transform.scale = parseFloat(start);
  return this;
};

/**
 * Attach delay
 * @param  {Number} start
 * @return {Object}
 * @api public
 */

Children.prototype.delay = function(delay) {
  this.transform.delay = parseFloat(delay);
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
 * Set callback
 * @param {String} event
 * @param {Function} fn
 * @api public
 */

land.on = function(event, fn) {
  if (type(fn) !== 'function') return;
  callbacks[event] = fn;
};

/**
 * Sections array
 * @api public
 */

land.sections = [];

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
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  each(land.sections, function(section, i) {
    updateSection(section, scrollTop);
    cur = isCurrent(section, scrollTop) ? i : cur;
  });

  if (cur === current) return;
  current = cur;

  if (callbacks.change) {
    callbacks.change(current);
  }
}

/**
 * Update section via scrollTop
 * @param {Object} section
 * @param {Number} scrollTop
 * @api private
 */

function updateSection(section, scrollTop) {
  section.progress = progress(section, scrollTop);

  each(section.childrens, function(children) {
    updateChildren(children);
  });
}

/**
 * Current section detection
 * @param  {Object} section
 * @param  {Number} scrollTop
 * @return {Number}
 * @api private
 */

function isCurrent(section, scrollTop) {
  var height = section.element.offsetHeight;
  var offsetTop = section.element.offsetTop;
  return scrollTop >= offsetTop && scrollTop <= offsetTop + height;
}

/**
 * Calculate progress
 * @param  {Object} section
 * @param  {Number} scrollTop
 * @return {Number}
 * @api private
 */

function progress(section, scrollTop) {
  var height = section.element.offsetHeight;
  var offsetTop = section.element.offsetTop;
  var offsetBottom = offsetTop + height;
  var scrollBottom = scrollTop + height;

  if (scrollBottom <= offsetTop) return 0;
  if (scrollBottom >= offsetBottom) return 1;

  return (scrollBottom - offsetTop) / height;
}

/**
 * Update section children
 * @param {Object} children
 * @api private
 */

function updateChildren(children) {
  var delay = children.transform.delay || 0;
  var progress = children.section.progress;
  var css = {};

  each(children.transform, function(start, param) {
    if (param === 'delay') return;

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
    children.element.style[prop] = value;
  });
}

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
  var section = land(element);
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
