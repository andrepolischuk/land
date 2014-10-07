// Landing © 2014 Andrey Polischuk
// https://github.com/andrepolischuk/landing

!function(undefined) {

  'use strict';

  /**
   * Object classes
   */
  
  var sectionClass   = document.body.getAttribute('data-landing');
  var navClass       = document.body.getAttribute('data-landing-nav');  
  var navActiveClass = 'active';

  /**
   * Base options undefined
   */

  if (!sectionClass) {
    return false;
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
      attr : 'landing-x',
      prop : 'transform',
      def  : 0,
      ext  : 'px',
      func : 'translateX'
    },
    y : {
      attr : 'landing-y',
      prop : 'transform',
      def  : 0,
      ext  : 'px',
      func : 'translateY'
    },
    scale : {
      attr : 'landing-scale',
      prop : 'transform',
      def  : 1,
      func : 'scale'
    },
    rotate : {
      attr : 'landing-rotate',
      prop : 'transform',
      def  : 0,
      ext  : 'deg',
      func : 'rotate'
    },
    opacity : {
      attr : 'landing-opacity',
      def  : 1,
      prop : 'opacity'
    }
  };

  /**
   * Effects attributes array
   */
  
  var effectsAttr = [];

  for (var effect in effects) {
    if (effects.hasOwnProperty(effect)) {
      effectsAttr.push('[' + effects[effect].attr + ']');
    }
  }

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
   * Callbacks
   */
  
  var callbacks = {};

  /**
   * Sections
   */
  
  var sections = document.querySelectorAll(sectionClass);

  /**
   * Navigation
   */
  
  var nav = navClass ? document.querySelector(navClass) : undefined;

  /**
   * Landing module
   * @api public
   */
  
  var landing = {};

  /**
   * Set callbacks
   * @api public
   */

  landing.on = function(name, callback) {

    if ('function' !== typeof callbacks[name] && 'function' === typeof callback) {
      callbacks[name] = callback;
    }

  };

  /**
   * Update section childrens styles via scroll progress
   * @api private
   */
  
  var update = function(section, progress) {

    var start;
    var final;
    var value;
    var set;
    var prop;
    var element;

    var css = {};
    var elements = section.querySelectorAll(effectsAttr.join(','));

    for (var el = 0; el < elements.length; el++) {

      css     = {};
      element = elements[el];

      for (var effect in effects) {

        if (effects.hasOwnProperty(effect)) {

          set   = effects[effect];
          start = element.getAttribute(set.attr);

          if (start) {

            // calculate range
            start = parseInt(start);
            final = set.def;

            // calculate current values
            value = (start + ((final - start) * progress));
            value += set.ext || '';
            value = effect === 'opacity' ? value : set.func + '(' + value + ')';

            // add values to CSS object
            for (var pref = 0; pref < prefix[set.prop].length; pref++) {
              prop = prefix[set.prop][pref] + set.prop;
              css[prop] = css[prop] ? css[prop] + ' ' + value : value;
            }

          }

        }

      }

      for (var param in css) {
        if (css.hasOwnProperty(param)) {
          element.style[param] = css[param];
        }
      }
      
    }

  };

  /**
   * Scroll handler
   * @api private
   */
    
  var scroll = function() {

    var cur = 0;
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    var offsetBottom;
    var offsetTop;
    var height;
    var progress;

    var section;

    for (var sect = 0; sect < sections.length; sect++) {

      section = sections[sect];

      height       = section.offsetHeight;
      offsetTop    = section.offsetTop;
      offsetBottom = offsetTop + height;

      // check current block
      if (scrollTop >= offsetTop && scrollTop <= offsetBottom) {

        cur = sect;
        progress = (scrollTop - offsetTop) / height;

      }

      // set styles to all blocks
      if (scrollTop + height <= offsetTop) {

        // prev items
        update(section, 0);

      } else if (scrollTop + height > offsetTop && scrollTop + height < offsetBottom) {

        // current item
        update(section, progress);

      } else if (scrollTop + height >= offsetBottom) {

        // next item
        update(section, 1);

      }

    }

    // change section
    if (cur !== current) {

      current = cur;

      // update nav
      if (nav) {

        var active = nav.querySelector('.' + navActiveClass);

        if (active) {
          active.className = active.className.replace(new RegExp('(' + navActiveClass + ')', 'gi'), "");
        }

        nav.children[current].className += ' active';

      }

      // call change handler
      if ('function' === typeof callbacks.change) {
        callbacks.change(current);
      }

    }

  };

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
  
  window.landing = landing;

}();