// Land © 2014-2015 Andrey Polischuk
// github.com/andrepolischuk/land

!function() {

  'use strict';

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
   * Arrays iterator
   */

  function each(array, fn) {

    var i;

    if ('length' in array) {

      for (i = 0; i < array.length; i++) {
        fn(array[i], i);
      }

    } else {

      for (i in array) {
        if (array.hasOwnProperty(i)) {
          fn(array[i], i);
        }
      }

    }

  }

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
   * Module
   * @api public
   */

  var land = {};

  /**
   * Set callbacks
   * @api public
   */

  land.on = function(name, callback) {

    if (typeof callbacks[name] !== 'function' && typeof callback === 'function') {
      callbacks[name] = callback;
    }

  };

  /**
   * Sections
   */

  var sections = land.sections = document.querySelectorAll(sectionClass);

  /**
   * Update section childrens styles via scroll progress
   * @param {Object} section
   * @param {Number} progress
   * @api private
   */

  function update(section, progress) {

    var start;
    var final;
    var value;
    var set;
    var prop;
    var delay;

    var css = {};
    var elements = section.querySelectorAll(effectsAttr.join(','));

    each(elements, function(element) {

      css   = {};
      delay = element.getAttribute(delayAttr);

      each(effects, function(effect, key) {

        set   = effect;
        start = element.getAttribute(set.attr);

        if (start) {

          // calculate range
          start = parseFloat(start);
          delay = parseFloat(delay) || 0;
          final = set.def;

          // calculate current values
          value = start + ((final - start) * (progress < delay ? 0 : progress - 1 + ((progress - delay) / (1 - delay))));
          value += set.ext || '';
          value = key === 'opacity' ? value : set.func + '(' + value + ')';

          // add values to CSS object
          each(prefix[set.prop], function(pref) {
            prop = pref + set.prop;
            css[prop] = css[prop] ? css[prop] + ' ' + value : value;
          });

        }

      });

      each(css, function(param, key) {
        element.style[key] = param;
      });

    });

  }

  /**
   * Scroll handler
   * @api private
   */

  function scroll() {

    var cur = 0;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    var scrollBottom;
    var offsetBottom;
    var offsetTop;
    var height;
    var progress;

    each(sections, function(section, key) {

      height       = section.offsetHeight;
      offsetTop    = section.offsetTop;
      offsetBottom = offsetTop + height;
      scrollBottom = scrollTop + height;

      // check current block
      if (scrollTop >= offsetTop && scrollTop <= offsetBottom) {

        cur = key;
        progress = (scrollTop - offsetTop) / height;

      }

      // set styles to all blocks
      if (scrollBottom <= offsetTop) {

        // prev items
        update(section, 0);

      } else if (scrollBottom > offsetTop && scrollBottom < offsetBottom) {

        // current item
        update(section, progress);

      } else if (scrollBottom >= offsetBottom) {

        // next item
        update(section, 1);

      }

    });

    // change section
    if (cur !== current) {

      current = cur;

      // call change handler
      if (typeof callbacks.change === 'function') {
        callbacks.change(current);
      }

    }

  }

  /**
   * Initialization
   */

  if ('addEventListener' in window) {
    window.addEventListener('scroll', scroll, false);
  }

  scroll();

  /**
   * Module exports
   */

  if (typeof define === 'function' && define.amd) {

    define([], function() {
      return land;
    });

  } else if (typeof module !== 'undefined' && module.exports) {

    module.exports = land;

  } else {

    this.land = land;

  }

}.call(this);
