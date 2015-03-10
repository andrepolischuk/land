
'use strict';

/**
 * Module dependencies
 */

try {
  var events = require('event');
} catch (err) {
  var events = require('component-event');
}

var each = require('ea');

/**
 * Object classes
 */

var sectionClass = document.body.getAttribute('data-land');

/**
 * Base options undefined
 */

if (!sectionClass) {
  return;
}

/**
 * Current section
 */

var current;

/**
 * Effects parameters
 * x, y
 * scale
 * rotate
 * opacity
 */

var effects = {
  x : {
    attr : 'data-land-x',
    prop : 'transform',
    def  : 0,
    ext  : 'px',
    func : 'translateX'
  },
  y : {
    attr : 'data-land-y',
    prop : 'transform',
    def  : 0,
    ext  : 'px',
    func : 'translateY'
  },
  scale : {
    attr : 'data-land-scale',
    prop : 'transform',
    def  : 1,
    func : 'scale'
  },
  rotate : {
    attr : 'data-land-rotate',
    prop : 'transform',
    def  : 0,
    ext  : 'deg',
    func : 'rotate'
  },
  opacity : {
    attr : 'data-land-opacity',
    def  : 1,
    prop : 'opacity'
  }
};

/**
 * Effects attributes array
 */

var effectsAttr = [];

each(effects, function(effect) {
  effectsAttr.push('[' + effect.attr + ']');
});

/**
 * CSS prefixes for effects parameters
 */

var prefix = {
  transform : [
    '-webkit-',
    '-moz-',
    '-ms-',
    '-o-',
    ''
  ],
  opacity : [
    '-moz-',
    ''
  ]
};

/**
 * Delay attribute
 */

var delayAttr = 'data-land-delay';

/**
 * Callbacks
 */

var callbacks = {};

/**
 * Expose land
 * @api public
 */

module.exports = function() {

};

/**
 * Expose set callbacks
 * @param {String} event
 * @param {Function} fn
 * @api public
 */

module.exports.on = function(event, fn) {
  if (typeof fn !== 'function') return;
  callbacks[event] = fn;
};

/**
 * Expose sections
 * @api public
 */

var sections = module.exports.sections =
  document.querySelectorAll(sectionClass);

/**
 * Initialize
 */

events.bind(window, 'scroll', scroll, false)();

/**
 * Scroll handler
 * @api private
 */

function scroll() {
  var cur = 0;
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  each(sections, function(section, i) {
    updateSection(section, progress(
      section,
      scrollTop,
      function() {
        cur = i;
      }
    ));
  });

  if (cur === current) return;
  current = cur;

  if (typeof callbacks.change === 'function') {
    callbacks.change(current);
  }
}

/**
 * Calculate section progress
 * @param  {Element} section
 * @param  {Number} scrollTop
 * @param  {Function} match
 * @return {Number}
 * @api private
 */

function progress(section, scrollTop, current) {
  var height = section.offsetHeight;
  var offsetTop = section.offsetTop;
  var offsetBottom = offsetTop + height;
  var scrollBottom = scrollTop + height;

  if (scrollTop >= offsetTop && scrollTop <= offsetBottom) current();
  if (scrollBottom <= offsetTop) return 0;
  if (scrollBottom >= offsetBottom) return 1;

  return (scrollBottom - offsetTop) / height;
}

/**
 * Update section
 * @param {Element} section
 * @param {Number} progress
 * @api private
 */

function updateSection(section, progress) {
  var elements = section.querySelectorAll(effectsAttr.join(','));

  each(elements, function(element) {
    updateElement(element, progress);
  });
}

/**
 * Update section childrens
 * @param {Element} section
 * @param {Number} progress
 * @api private
 */

function updateElement(element, progress) {
  var delay = parseFloat(element.getAttribute(delayAttr)) || 0;

  each(effects, function(effect, param) {
    each(style(
      element,
      progress,
      effect,
      param,
      delay
    ), function(value, prop) {
      element.style[prop] = value;
    });
  });
}

/**
 * Calculate children style
 * @param {Element} element
 * @param {Number} progress
 * @param {Object} effect
 * @param {String} param
 * @param {Number} delay
 * @api private
 */

function style(element, progress, effect, param, delay) {
  var start = element.getAttribute(effect.attr);

  if (!start) return;
  start = parseFloat(start);

  var final = effect.def;
  var value = start + ((final - start) * (progress < delay ? 0 :
    progress - 1 + ((progress - delay) / (1 - delay))));

  value += effect.ext || '';
  value = param === 'opacity' ? value : effect.func + '(' + value + ')';

  var css = {};
  var prop;

  each(prefix[effect.prop], function(pref) {
    prop = pref + effect.prop;
    css[prop] = css[prop] ? css[prop] + ' ' + value : value;
  });

  return css;
}
