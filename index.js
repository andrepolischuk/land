
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
 * Current scrollTop
 */

var scrollTop;

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
 *
 * @param {String|Element} el
 * @api public
 */

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

/**
 * Create section children
 *
 * @param  {String|Element} el
 * @return {Object}
 * @api public
 */

Section.prototype.children = function(el) {
  return new Children(el, this);
};

/**
 * Update section
 *
 * @api public
 */

Section.prototype.update = function() {
  var height = this.element.offsetHeight;
  var offsetTop = this.element.offsetTop;

  this.current = scrollTop >= offsetTop &&
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
 *
 * @param {String|Element} el
 * @api public
 */

function Children(el, section) {
  if (type(el) === 'string') el = section.element.querySelector(el);
  if (!el) return;

  this.element = el;
  this.section = section;

  this._transform = {};
  this._delay = 0;

  section.childrens.push(this);
}

/**
 * Attach transform props
 *
 * @param {String} prop
 * @param {Number|Function} val
 * @api public
 */

Children.prototype.set = function(prop, val) {
  this._transform[prop] = type(val) === 'function' ?
    val : parseFloat(val);
  return this;
};

/**
 * Attach transform prop
 *
 * @param  {Number|Function} val
 * @return {Object}
 * @api public
 */

each(transforms, function(transform, prop) {
  Children.prototype[prop] = function(val) {
    this.set(prop, val);
    return this;
  };
});

/**
 * Attach delay
 *
 * @param  {Number} delay
 * @return {Object}
 * @api public
 */

Children.prototype.delay = function(delay) {
  this._delay = parseFloat(delay) || 0;
  return this;
};

/**
 * Create next children
 *
 * @param  {String|Element} el
 * @return {Object}
 * @api public
 */

Children.prototype.children = function(el) {
  return this.section.children(el);
};

/**
 * Update section children
 *
 * @api public
 */

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

/**
 * Set callback
 *
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
 *
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
 *
 * @api private
 */

function scroll() {
  var cur = 0;
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  each(Section.sections, function(section, i) {
    section.update();
    cur = section.current ? i : cur;
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
 *
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
 *
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
 *
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
