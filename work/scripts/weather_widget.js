(function () {
  'use strict';

  /*!
   * Glide.js v3.4.1
   * (c) 2013-2019 Jędrzej Chałubek <jedrzej.chalubek@gmail.com> (http://jedrzejchalubek.com/)
   * Released under the MIT License.
   */

  var defaults = {
    /**
     * Type of the movement.
     *
     * Available types:
     * `slider` - Rewinds slider to the start/end when it reaches the first or last slide.
     * `carousel` - Changes slides without starting over when it reaches the first or last slide.
     *
     * @type {String}
     */
    type: 'slider',

    /**
     * Start at specific slide number defined with zero-based index.
     *
     * @type {Number}
     */
    startAt: 0,

    /**
     * A number of slides visible on the single viewport.
     *
     * @type {Number}
     */
    perView: 1,

    /**
     * Focus currently active slide at a specified position in the track.
     *
     * Available inputs:
     * `center` - Current slide will be always focused at the center of a track.
     * `0,1,2,3...` - Current slide will be focused on the specified zero-based index.
     *
     * @type {String|Number}
     */
    focusAt: 0,

    /**
     * A size of the gap added between slides.
     *
     * @type {Number}
     */
    gap: 10,

    /**
     * Change slides after a specified interval. Use `false` for turning off autoplay.
     *
     * @type {Number|Boolean}
     */
    autoplay: false,

    /**
     * Stop autoplay on mouseover event.
     *
     * @type {Boolean}
     */
    hoverpause: true,

    /**
     * Allow for changing slides with left and right keyboard arrows.
     *
     * @type {Boolean}
     */
    keyboard: true,

    /**
     * Stop running `perView` number of slides from the end. Use this
     * option if you don't want to have an empty space after
     * a slider. Works only with `slider` type and a
     * non-centered `focusAt` setting.
     *
     * @type {Boolean}
     */
    bound: false,

    /**
     * Minimal swipe distance needed to change the slide. Use `false` for turning off a swiping.
     *
     * @type {Number|Boolean}
     */
    swipeThreshold: 80,

    /**
     * Minimal mouse drag distance needed to change the slide. Use `false` for turning off a dragging.
     *
     * @type {Number|Boolean}
     */
    dragThreshold: 120,

    /**
     * A maximum number of slides to which movement will be made on swiping or dragging. Use `false` for unlimited.
     *
     * @type {Number|Boolean}
     */
    perTouch: false,

    /**
     * Moving distance ratio of the slides on a swiping and dragging.
     *
     * @type {Number}
     */
    touchRatio: 0.5,

    /**
     * Angle required to activate slides moving on swiping or dragging.
     *
     * @type {Number}
     */
    touchAngle: 45,

    /**
     * Duration of the animation in milliseconds.
     *
     * @type {Number}
     */
    animationDuration: 400,

    /**
     * Allows looping the `slider` type. Slider will rewind to the first/last slide when it's at the start/end.
     *
     * @type {Boolean}
     */
    rewind: true,

    /**
     * Duration of the rewinding animation of the `slider` type in milliseconds.
     *
     * @type {Number}
     */
    rewindDuration: 800,

    /**
     * Easing function for the animation.
     *
     * @type {String}
     */
    animationTimingFunc: 'cubic-bezier(.165, .840, .440, 1)',

    /**
     * Throttle costly events at most once per every wait milliseconds.
     *
     * @type {Number}
     */
    throttle: 10,

    /**
     * Moving direction mode.
     *
     * Available inputs:
     * - 'ltr' - left to right movement,
     * - 'rtl' - right to left movement.
     *
     * @type {String}
     */
    direction: 'ltr',

    /**
     * The distance value of the next and previous viewports which
     * have to peek in the current view. Accepts number and
     * pixels as a string. Left and right peeking can be
     * set up separately with a directions object.
     *
     * For example:
     * `100` - Peek 100px on the both sides.
     * { before: 100, after: 50 }` - Peek 100px on the left side and 50px on the right side.
     *
     * @type {Number|String|Object}
     */
    peek: 0,

    /**
     * Collection of options applied at specified media breakpoints.
     * For example: display two slides per view under 800px.
     * `{
     *   '800px': {
     *     perView: 2
     *   }
     * }`
     */
    breakpoints: {},

    /**
     * Collection of internally used HTML classes.
     *
     * @todo Refactor `slider` and `carousel` properties to single `type: { slider: '', carousel: '' }` object
     * @type {Object}
     */
    classes: {
      direction: {
        ltr: 'glide--ltr',
        rtl: 'glide--rtl'
      },
      slider: 'glide--slider',
      carousel: 'glide--carousel',
      swipeable: 'glide--swipeable',
      dragging: 'glide--dragging',
      cloneSlide: 'glide__slide--clone',
      activeNav: 'glide__bullet--active',
      activeSlide: 'glide__slide--active',
      disabledArrow: 'glide__arrow--disabled'
    }
  };

  /**
   * Outputs warning message to the bowser console.
   *
   * @param  {String} msg
   * @return {Void}
   */
  function warn(msg) {
    console.error("[Glide warn]: " + msg);
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  var get = function get(object, property, receiver) {
    if (object === null) object = Function.prototype;
    var desc = Object.getOwnPropertyDescriptor(object, property);

    if (desc === undefined) {
      var parent = Object.getPrototypeOf(object);

      if (parent === null) {
        return undefined;
      } else {
        return get(parent, property, receiver);
      }
    } else if ("value" in desc) {
      return desc.value;
    } else {
      var getter = desc.get;

      if (getter === undefined) {
        return undefined;
      }

      return getter.call(receiver);
    }
  };

  var inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  var possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  /**
   * Converts value entered as number
   * or string to integer value.
   *
   * @param {String} value
   * @returns {Number}
   */
  function toInt(value) {
    return parseInt(value);
  }

  /**
   * Converts value entered as number
   * or string to flat value.
   *
   * @param {String} value
   * @returns {Number}
   */
  function toFloat(value) {
    return parseFloat(value);
  }

  /**
   * Indicates whether the specified value is a string.
   *
   * @param  {*}   value
   * @return {Boolean}
   */
  function isString(value) {
    return typeof value === 'string';
  }

  /**
   * Indicates whether the specified value is an object.
   *
   * @param  {*} value
   * @return {Boolean}
   *
   * @see https://github.com/jashkenas/underscore
   */
  function isObject(value) {
    var type = typeof value === 'undefined' ? 'undefined' : _typeof(value);

    return type === 'function' || type === 'object' && !!value; // eslint-disable-line no-mixed-operators
  }

  /**
   * Indicates whether the specified value is a number.
   *
   * @param  {*} value
   * @return {Boolean}
   */
  function isNumber(value) {
    return typeof value === 'number';
  }

  /**
   * Indicates whether the specified value is a function.
   *
   * @param  {*} value
   * @return {Boolean}
   */
  function isFunction(value) {
    return typeof value === 'function';
  }

  /**
   * Indicates whether the specified value is undefined.
   *
   * @param  {*} value
   * @return {Boolean}
   */
  function isUndefined(value) {
    return typeof value === 'undefined';
  }

  /**
   * Indicates whether the specified value is an array.
   *
   * @param  {*} value
   * @return {Boolean}
   */
  function isArray(value) {
    return value.constructor === Array;
  }

  /**
   * Creates and initializes specified collection of extensions.
   * Each extension receives access to instance of glide and rest of components.
   *
   * @param {Object} glide
   * @param {Object} extensions
   *
   * @returns {Object}
   */
  function mount(glide, extensions, events) {
    var components = {};

    for (var name in extensions) {
      if (isFunction(extensions[name])) {
        components[name] = extensions[name](glide, components, events);
      } else {
        warn('Extension must be a function');
      }
    }

    for (var _name in components) {
      if (isFunction(components[_name].mount)) {
        components[_name].mount();
      }
    }

    return components;
  }

  /**
   * Defines getter and setter property on the specified object.
   *
   * @param  {Object} obj         Object where property has to be defined.
   * @param  {String} prop        Name of the defined property.
   * @param  {Object} definition  Get and set definitions for the property.
   * @return {Void}
   */
  function define(obj, prop, definition) {
    Object.defineProperty(obj, prop, definition);
  }

  /**
   * Sorts aphabetically object keys.
   *
   * @param  {Object} obj
   * @return {Object}
   */
  function sortKeys(obj) {
    return Object.keys(obj).sort().reduce(function (r, k) {
      r[k] = obj[k];

      return r[k], r;
    }, {});
  }

  /**
   * Merges passed settings object with default options.
   *
   * @param  {Object} defaults
   * @param  {Object} settings
   * @return {Object}
   */
  function mergeOptions(defaults, settings) {
    var options = _extends({}, defaults, settings);

    // `Object.assign` do not deeply merge objects, so we
    // have to do it manually for every nested object
    // in options. Although it does not look smart,
    // it's smaller and faster than some fancy
    // merging deep-merge algorithm script.
    if (settings.hasOwnProperty('classes')) {
      options.classes = _extends({}, defaults.classes, settings.classes);

      if (settings.classes.hasOwnProperty('direction')) {
        options.classes.direction = _extends({}, defaults.classes.direction, settings.classes.direction);
      }
    }

    if (settings.hasOwnProperty('breakpoints')) {
      options.breakpoints = _extends({}, defaults.breakpoints, settings.breakpoints);
    }

    return options;
  }

  var EventsBus = function () {
    /**
     * Construct a EventBus instance.
     *
     * @param {Object} events
     */
    function EventsBus() {
      var events = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      classCallCheck(this, EventsBus);

      this.events = events;
      this.hop = events.hasOwnProperty;
    }

    /**
     * Adds listener to the specifed event.
     *
     * @param {String|Array} event
     * @param {Function} handler
     */


    createClass(EventsBus, [{
      key: 'on',
      value: function on(event, handler) {
        if (isArray(event)) {
          for (var i = 0; i < event.length; i++) {
            this.on(event[i], handler);
          }
        }

        // Create the event's object if not yet created
        if (!this.hop.call(this.events, event)) {
          this.events[event] = [];
        }

        // Add the handler to queue
        var index = this.events[event].push(handler) - 1;

        // Provide handle back for removal of event
        return {
          remove: function remove() {
            delete this.events[event][index];
          }
        };
      }

      /**
       * Runs registered handlers for specified event.
       *
       * @param {String|Array} event
       * @param {Object=} context
       */

    }, {
      key: 'emit',
      value: function emit(event, context) {
        if (isArray(event)) {
          for (var i = 0; i < event.length; i++) {
            this.emit(event[i], context);
          }
        }

        // If the event doesn't exist, or there's no handlers in queue, just leave
        if (!this.hop.call(this.events, event)) {
          return;
        }

        // Cycle through events queue, fire!
        this.events[event].forEach(function (item) {
          item(context || {});
        });
      }
    }]);
    return EventsBus;
  }();

  var Glide = function () {
    /**
     * Construct glide.
     *
     * @param  {String} selector
     * @param  {Object} options
     */
    function Glide(selector) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      classCallCheck(this, Glide);

      this._c = {};
      this._t = [];
      this._e = new EventsBus();

      this.disabled = false;
      this.selector = selector;
      this.settings = mergeOptions(defaults, options);
      this.index = this.settings.startAt;
    }

    /**
     * Initializes glide.
     *
     * @param {Object} extensions Collection of extensions to initialize.
     * @return {Glide}
     */


    createClass(Glide, [{
      key: 'mount',
      value: function mount$$1() {
        var extensions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        this._e.emit('mount.before');

        if (isObject(extensions)) {
          this._c = mount(this, extensions, this._e);
        } else {
          warn('You need to provide a object on `mount()`');
        }

        this._e.emit('mount.after');

        return this;
      }

      /**
       * Collects an instance `translate` transformers.
       *
       * @param  {Array} transformers Collection of transformers.
       * @return {Void}
       */

    }, {
      key: 'mutate',
      value: function mutate() {
        var transformers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

        if (isArray(transformers)) {
          this._t = transformers;
        } else {
          warn('You need to provide a array on `mutate()`');
        }

        return this;
      }

      /**
       * Updates glide with specified settings.
       *
       * @param {Object} settings
       * @return {Glide}
       */

    }, {
      key: 'update',
      value: function update() {
        var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        this.settings = mergeOptions(this.settings, settings);

        if (settings.hasOwnProperty('startAt')) {
          this.index = settings.startAt;
        }

        this._e.emit('update');

        return this;
      }

      /**
       * Change slide with specified pattern. A pattern must be in the special format:
       * `>` - Move one forward
       * `<` - Move one backward
       * `={i}` - Go to {i} zero-based slide (eq. '=1', will go to second slide)
       * `>>` - Rewinds to end (last slide)
       * `<<` - Rewinds to start (first slide)
       *
       * @param {String} pattern
       * @return {Glide}
       */

    }, {
      key: 'go',
      value: function go(pattern) {
        this._c.Run.make(pattern);

        return this;
      }

      /**
       * Move track by specified distance.
       *
       * @param {String} distance
       * @return {Glide}
       */

    }, {
      key: 'move',
      value: function move(distance) {
        this._c.Transition.disable();
        this._c.Move.make(distance);

        return this;
      }

      /**
       * Destroy instance and revert all changes done by this._c.
       *
       * @return {Glide}
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        this._e.emit('destroy');

        return this;
      }

      /**
       * Start instance autoplaying.
       *
       * @param {Boolean|Number} interval Run autoplaying with passed interval regardless of `autoplay` settings
       * @return {Glide}
       */

    }, {
      key: 'play',
      value: function play() {
        var interval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

        if (interval) {
          this.settings.autoplay = interval;
        }

        this._e.emit('play');

        return this;
      }

      /**
       * Stop instance autoplaying.
       *
       * @return {Glide}
       */

    }, {
      key: 'pause',
      value: function pause() {
        this._e.emit('pause');

        return this;
      }

      /**
       * Sets glide into a idle status.
       *
       * @return {Glide}
       */

    }, {
      key: 'disable',
      value: function disable() {
        this.disabled = true;

        return this;
      }

      /**
       * Sets glide into a active status.
       *
       * @return {Glide}
       */

    }, {
      key: 'enable',
      value: function enable() {
        this.disabled = false;

        return this;
      }

      /**
       * Adds cuutom event listener with handler.
       *
       * @param  {String|Array} event
       * @param  {Function} handler
       * @return {Glide}
       */

    }, {
      key: 'on',
      value: function on(event, handler) {
        this._e.on(event, handler);

        return this;
      }

      /**
       * Checks if glide is a precised type.
       *
       * @param  {String} name
       * @return {Boolean}
       */

    }, {
      key: 'isType',
      value: function isType(name) {
        return this.settings.type === name;
      }

      /**
       * Gets value of the core options.
       *
       * @return {Object}
       */

    }, {
      key: 'settings',
      get: function get$$1() {
        return this._o;
      }

      /**
       * Sets value of the core options.
       *
       * @param  {Object} o
       * @return {Void}
       */
      ,
      set: function set$$1(o) {
        if (isObject(o)) {
          this._o = o;
        } else {
          warn('Options must be an `object` instance.');
        }
      }

      /**
       * Gets current index of the slider.
       *
       * @return {Object}
       */

    }, {
      key: 'index',
      get: function get$$1() {
        return this._i;
      }

      /**
       * Sets current index a slider.
       *
       * @return {Object}
       */
      ,
      set: function set$$1(i) {
        this._i = toInt(i);
      }

      /**
       * Gets type name of the slider.
       *
       * @return {String}
       */

    }, {
      key: 'type',
      get: function get$$1() {
        return this.settings.type;
      }

      /**
       * Gets value of the idle status.
       *
       * @return {Boolean}
       */

    }, {
      key: 'disabled',
      get: function get$$1() {
        return this._d;
      }

      /**
       * Sets value of the idle status.
       *
       * @return {Boolean}
       */
      ,
      set: function set$$1(status) {
        this._d = !!status;
      }
    }]);
    return Glide;
  }();

  function Run (Glide, Components, Events) {
    var Run = {
      /**
       * Initializes autorunning of the glide.
       *
       * @return {Void}
       */
      mount: function mount() {
        this._o = false;
      },


      /**
       * Makes glides running based on the passed moving schema.
       *
       * @param {String} move
       */
      make: function make(move) {
        var _this = this;

        if (!Glide.disabled) {
          Glide.disable();

          this.move = move;

          Events.emit('run.before', this.move);

          this.calculate();

          Events.emit('run', this.move);

          Components.Transition.after(function () {
            if (_this.isStart()) {
              Events.emit('run.start', _this.move);
            }

            if (_this.isEnd()) {
              Events.emit('run.end', _this.move);
            }

            if (_this.isOffset('<') || _this.isOffset('>')) {
              _this._o = false;

              Events.emit('run.offset', _this.move);
            }

            Events.emit('run.after', _this.move);

            Glide.enable();
          });
        }
      },


      /**
       * Calculates current index based on defined move.
       *
       * @return {Void}
       */
      calculate: function calculate() {
        var move = this.move,
            length = this.length;
        var steps = move.steps,
            direction = move.direction;


        var countableSteps = isNumber(toInt(steps)) && toInt(steps) !== 0;

        switch (direction) {
          case '>':
            if (steps === '>') {
              Glide.index = length;
            } else if (this.isEnd()) {
              if (!(Glide.isType('slider') && !Glide.settings.rewind)) {
                this._o = true;

                Glide.index = 0;
              }
            } else if (countableSteps) {
              Glide.index += Math.min(length - Glide.index, -toInt(steps));
            } else {
              Glide.index++;
            }
            break;

          case '<':
            if (steps === '<') {
              Glide.index = 0;
            } else if (this.isStart()) {
              if (!(Glide.isType('slider') && !Glide.settings.rewind)) {
                this._o = true;

                Glide.index = length;
              }
            } else if (countableSteps) {
              Glide.index -= Math.min(Glide.index, toInt(steps));
            } else {
              Glide.index--;
            }
            break;

          case '=':
            Glide.index = steps;
            break;

          default:
            warn('Invalid direction pattern [' + direction + steps + '] has been used');
            break;
        }
      },


      /**
       * Checks if we are on the first slide.
       *
       * @return {Boolean}
       */
      isStart: function isStart() {
        return Glide.index === 0;
      },


      /**
       * Checks if we are on the last slide.
       *
       * @return {Boolean}
       */
      isEnd: function isEnd() {
        return Glide.index === this.length;
      },


      /**
       * Checks if we are making a offset run.
       *
       * @param {String} direction
       * @return {Boolean}
       */
      isOffset: function isOffset(direction) {
        return this._o && this.move.direction === direction;
      }
    };

    define(Run, 'move', {
      /**
       * Gets value of the move schema.
       *
       * @returns {Object}
       */
      get: function get() {
        return this._m;
      },


      /**
       * Sets value of the move schema.
       *
       * @returns {Object}
       */
      set: function set(value) {
        var step = value.substr(1);

        this._m = {
          direction: value.substr(0, 1),
          steps: step ? toInt(step) ? toInt(step) : step : 0
        };
      }
    });

    define(Run, 'length', {
      /**
       * Gets value of the running distance based
       * on zero-indexing number of slides.
       *
       * @return {Number}
       */
      get: function get() {
        var settings = Glide.settings;
        var length = Components.Html.slides.length;

        // If the `bound` option is acitve, a maximum running distance should be
        // reduced by `perView` and `focusAt` settings. Running distance
        // should end before creating an empty space after instance.

        if (Glide.isType('slider') && settings.focusAt !== 'center' && settings.bound) {
          return length - 1 - (toInt(settings.perView) - 1) + toInt(settings.focusAt);
        }

        return length - 1;
      }
    });

    define(Run, 'offset', {
      /**
       * Gets status of the offsetting flag.
       *
       * @return {Boolean}
       */
      get: function get() {
        return this._o;
      }
    });

    return Run;
  }

  /**
   * Returns a current time.
   *
   * @return {Number}
   */
  function now() {
    return new Date().getTime();
  }

  /**
   * Returns a function, that, when invoked, will only be triggered
   * at most once during a given window of time.
   *
   * @param {Function} func
   * @param {Number} wait
   * @param {Object=} options
   * @return {Function}
   *
   * @see https://github.com/jashkenas/underscore
   */
  function throttle(func, wait, options) {
    var timeout = void 0,
        context = void 0,
        args = void 0,
        result = void 0;
    var previous = 0;
    if (!options) options = {};

    var later = function later() {
      previous = options.leading === false ? 0 : now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function throttled() {
      var at = now();
      if (!previous && options.leading === false) previous = at;
      var remaining = wait - (at - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = at;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function () {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  }

  var MARGIN_TYPE = {
    ltr: ['marginLeft', 'marginRight'],
    rtl: ['marginRight', 'marginLeft']
  };

  function Gaps (Glide, Components, Events) {
    var Gaps = {
      /**
       * Applies gaps between slides. First and last
       * slides do not receive it's edge margins.
       *
       * @param {HTMLCollection} slides
       * @return {Void}
       */
      apply: function apply(slides) {
        for (var i = 0, len = slides.length; i < len; i++) {
          var style = slides[i].style;
          var direction = Components.Direction.value;

          if (i !== 0) {
            style[MARGIN_TYPE[direction][0]] = this.value / 2 + 'px';
          } else {
            style[MARGIN_TYPE[direction][0]] = '';
          }

          if (i !== slides.length - 1) {
            style[MARGIN_TYPE[direction][1]] = this.value / 2 + 'px';
          } else {
            style[MARGIN_TYPE[direction][1]] = '';
          }
        }
      },


      /**
       * Removes gaps from the slides.
       *
       * @param {HTMLCollection} slides
       * @returns {Void}
      */
      remove: function remove(slides) {
        for (var i = 0, len = slides.length; i < len; i++) {
          var style = slides[i].style;

          style.marginLeft = '';
          style.marginRight = '';
        }
      }
    };

    define(Gaps, 'value', {
      /**
       * Gets value of the gap.
       *
       * @returns {Number}
       */
      get: function get() {
        return toInt(Glide.settings.gap);
      }
    });

    define(Gaps, 'grow', {
      /**
       * Gets additional dimentions value caused by gaps.
       * Used to increase width of the slides wrapper.
       *
       * @returns {Number}
       */
      get: function get() {
        return Gaps.value * (Components.Sizes.length - 1);
      }
    });

    define(Gaps, 'reductor', {
      /**
       * Gets reduction value caused by gaps.
       * Used to subtract width of the slides.
       *
       * @returns {Number}
       */
      get: function get() {
        var perView = Glide.settings.perView;

        return Gaps.value * (perView - 1) / perView;
      }
    });

    /**
     * Apply calculated gaps:
     * - after building, so slides (including clones) will receive proper margins
     * - on updating via API, to recalculate gaps with new options
     */
    Events.on(['build.after', 'update'], throttle(function () {
      Gaps.apply(Components.Html.wrapper.children);
    }, 30));

    /**
     * Remove gaps:
     * - on destroying to bring markup to its inital state
     */
    Events.on('destroy', function () {
      Gaps.remove(Components.Html.wrapper.children);
    });

    return Gaps;
  }

  /**
   * Finds siblings nodes of the passed node.
   *
   * @param  {Element} node
   * @return {Array}
   */
  function siblings(node) {
    if (node && node.parentNode) {
      var n = node.parentNode.firstChild;
      var matched = [];

      for (; n; n = n.nextSibling) {
        if (n.nodeType === 1 && n !== node) {
          matched.push(n);
        }
      }

      return matched;
    }

    return [];
  }

  /**
   * Checks if passed node exist and is a valid element.
   *
   * @param  {Element} node
   * @return {Boolean}
   */
  function exist(node) {
    if (node && node instanceof window.HTMLElement) {
      return true;
    }

    return false;
  }

  var TRACK_SELECTOR = '[data-glide-el="track"]';

  function Html (Glide, Components) {
    var Html = {
      /**
       * Setup slider HTML nodes.
       *
       * @param {Glide} glide
       */
      mount: function mount() {
        this.root = Glide.selector;
        this.track = this.root.querySelector(TRACK_SELECTOR);
        this.slides = Array.prototype.slice.call(this.wrapper.children).filter(function (slide) {
          return !slide.classList.contains(Glide.settings.classes.cloneSlide);
        });
      }
    };

    define(Html, 'root', {
      /**
       * Gets node of the glide main element.
       *
       * @return {Object}
       */
      get: function get() {
        return Html._r;
      },


      /**
       * Sets node of the glide main element.
       *
       * @return {Object}
       */
      set: function set(r) {
        if (isString(r)) {
          r = document.querySelector(r);
        }

        if (exist(r)) {
          Html._r = r;
        } else {
          warn('Root element must be a existing Html node');
        }
      }
    });

    define(Html, 'track', {
      /**
       * Gets node of the glide track with slides.
       *
       * @return {Object}
       */
      get: function get() {
        return Html._t;
      },


      /**
       * Sets node of the glide track with slides.
       *
       * @return {Object}
       */
      set: function set(t) {
        if (exist(t)) {
          Html._t = t;
        } else {
          warn('Could not find track element. Please use ' + TRACK_SELECTOR + ' attribute.');
        }
      }
    });

    define(Html, 'wrapper', {
      /**
       * Gets node of the slides wrapper.
       *
       * @return {Object}
       */
      get: function get() {
        return Html.track.children[0];
      }
    });

    return Html;
  }

  function Peek (Glide, Components, Events) {
    var Peek = {
      /**
       * Setups how much to peek based on settings.
       *
       * @return {Void}
       */
      mount: function mount() {
        this.value = Glide.settings.peek;
      }
    };

    define(Peek, 'value', {
      /**
       * Gets value of the peek.
       *
       * @returns {Number|Object}
       */
      get: function get() {
        return Peek._v;
      },


      /**
       * Sets value of the peek.
       *
       * @param {Number|Object} value
       * @return {Void}
       */
      set: function set(value) {
        if (isObject(value)) {
          value.before = toInt(value.before);
          value.after = toInt(value.after);
        } else {
          value = toInt(value);
        }

        Peek._v = value;
      }
    });

    define(Peek, 'reductor', {
      /**
       * Gets reduction value caused by peek.
       *
       * @returns {Number}
       */
      get: function get() {
        var value = Peek.value;
        var perView = Glide.settings.perView;

        if (isObject(value)) {
          return value.before / perView + value.after / perView;
        }

        return value * 2 / perView;
      }
    });

    /**
     * Recalculate peeking sizes on:
     * - when resizing window to update to proper percents
     */
    Events.on(['resize', 'update'], function () {
      Peek.mount();
    });

    return Peek;
  }

  function Move (Glide, Components, Events) {
    var Move = {
      /**
       * Constructs move component.
       *
       * @returns {Void}
       */
      mount: function mount() {
        this._o = 0;
      },


      /**
       * Calculates a movement value based on passed offset and currently active index.
       *
       * @param  {Number} offset
       * @return {Void}
       */
      make: function make() {
        var _this = this;

        var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

        this.offset = offset;

        Events.emit('move', {
          movement: this.value
        });

        Components.Transition.after(function () {
          Events.emit('move.after', {
            movement: _this.value
          });
        });
      }
    };

    define(Move, 'offset', {
      /**
       * Gets an offset value used to modify current translate.
       *
       * @return {Object}
       */
      get: function get() {
        return Move._o;
      },


      /**
       * Sets an offset value used to modify current translate.
       *
       * @return {Object}
       */
      set: function set(value) {
        Move._o = !isUndefined(value) ? toInt(value) : 0;
      }
    });

    define(Move, 'translate', {
      /**
       * Gets a raw movement value.
       *
       * @return {Number}
       */
      get: function get() {
        return Components.Sizes.slideWidth * Glide.index;
      }
    });

    define(Move, 'value', {
      /**
       * Gets an actual movement value corrected by offset.
       *
       * @return {Number}
       */
      get: function get() {
        var offset = this.offset;
        var translate = this.translate;

        if (Components.Direction.is('rtl')) {
          return translate + offset;
        }

        return translate - offset;
      }
    });

    /**
     * Make movement to proper slide on:
     * - before build, so glide will start at `startAt` index
     * - on each standard run to move to newly calculated index
     */
    Events.on(['build.before', 'run'], function () {
      Move.make();
    });

    return Move;
  }

  function Sizes (Glide, Components, Events) {
    var Sizes = {
      /**
       * Setups dimentions of slides.
       *
       * @return {Void}
       */
      setupSlides: function setupSlides() {
        var width = this.slideWidth + 'px';
        var slides = Components.Html.slides;

        for (var i = 0; i < slides.length; i++) {
          slides[i].style.width = width;
        }
      },


      /**
       * Setups dimentions of slides wrapper.
       *
       * @return {Void}
       */
      setupWrapper: function setupWrapper(dimention) {
        Components.Html.wrapper.style.width = this.wrapperSize + 'px';
      },


      /**
       * Removes applied styles from HTML elements.
       *
       * @returns {Void}
       */
      remove: function remove() {
        var slides = Components.Html.slides;

        for (var i = 0; i < slides.length; i++) {
          slides[i].style.width = '';
        }

        Components.Html.wrapper.style.width = '';
      }
    };

    define(Sizes, 'length', {
      /**
       * Gets count number of the slides.
       *
       * @return {Number}
       */
      get: function get() {
        return Components.Html.slides.length;
      }
    });

    define(Sizes, 'width', {
      /**
       * Gets width value of the glide.
       *
       * @return {Number}
       */
      get: function get() {
        return Components.Html.root.offsetWidth;
      }
    });

    define(Sizes, 'wrapperSize', {
      /**
       * Gets size of the slides wrapper.
       *
       * @return {Number}
       */
      get: function get() {
        return Sizes.slideWidth * Sizes.length + Components.Gaps.grow + Components.Clones.grow;
      }
    });

    define(Sizes, 'slideWidth', {
      /**
       * Gets width value of the single slide.
       *
       * @return {Number}
       */
      get: function get() {
        return Sizes.width / Glide.settings.perView - Components.Peek.reductor - Components.Gaps.reductor;
      }
    });

    /**
     * Apply calculated glide's dimensions:
     * - before building, so other dimentions (e.g. translate) will be calculated propertly
     * - when resizing window to recalculate sildes dimensions
     * - on updating via API, to calculate dimensions based on new options
     */
    Events.on(['build.before', 'resize', 'update'], function () {
      Sizes.setupSlides();
      Sizes.setupWrapper();
    });

    /**
     * Remove calculated glide's dimensions:
     * - on destoting to bring markup to its inital state
     */
    Events.on('destroy', function () {
      Sizes.remove();
    });

    return Sizes;
  }

  function Build (Glide, Components, Events) {
    var Build = {
      /**
       * Init glide building. Adds classes, sets
       * dimensions and setups initial state.
       *
       * @return {Void}
       */
      mount: function mount() {
        Events.emit('build.before');

        this.typeClass();
        this.activeClass();

        Events.emit('build.after');
      },


      /**
       * Adds `type` class to the glide element.
       *
       * @return {Void}
       */
      typeClass: function typeClass() {
        Components.Html.root.classList.add(Glide.settings.classes[Glide.settings.type]);
      },


      /**
       * Sets active class to current slide.
       *
       * @return {Void}
       */
      activeClass: function activeClass() {
        var classes = Glide.settings.classes;
        var slide = Components.Html.slides[Glide.index];

        if (slide) {
          slide.classList.add(classes.activeSlide);

          siblings(slide).forEach(function (sibling) {
            sibling.classList.remove(classes.activeSlide);
          });
        }
      },


      /**
       * Removes HTML classes applied at building.
       *
       * @return {Void}
       */
      removeClasses: function removeClasses() {
        var classes = Glide.settings.classes;

        Components.Html.root.classList.remove(classes[Glide.settings.type]);

        Components.Html.slides.forEach(function (sibling) {
          sibling.classList.remove(classes.activeSlide);
        });
      }
    };

    /**
     * Clear building classes:
     * - on destroying to bring HTML to its initial state
     * - on updating to remove classes before remounting component
     */
    Events.on(['destroy', 'update'], function () {
      Build.removeClasses();
    });

    /**
     * Remount component:
     * - on resizing of the window to calculate new dimentions
     * - on updating settings via API
     */
    Events.on(['resize', 'update'], function () {
      Build.mount();
    });

    /**
     * Swap active class of current slide:
     * - after each move to the new index
     */
    Events.on('move.after', function () {
      Build.activeClass();
    });

    return Build;
  }

  function Clones (Glide, Components, Events) {
    var Clones = {
      /**
       * Create pattern map and collect slides to be cloned.
       */
      mount: function mount() {
        this.items = [];

        if (Glide.isType('carousel')) {
          this.items = this.collect();
        }
      },


      /**
       * Collect clones with pattern.
       *
       * @return {Void}
       */
      collect: function collect() {
        var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
        var slides = Components.Html.slides;
        var _Glide$settings = Glide.settings,
            perView = _Glide$settings.perView,
            classes = _Glide$settings.classes;


        var peekIncrementer = +!!Glide.settings.peek;
        var part = perView + peekIncrementer;
        var start = slides.slice(0, part);
        var end = slides.slice(-part);

        for (var r = 0; r < Math.max(1, Math.floor(perView / slides.length)); r++) {
          for (var i = 0; i < start.length; i++) {
            var clone = start[i].cloneNode(true);

            clone.classList.add(classes.cloneSlide);

            items.push(clone);
          }

          for (var _i = 0; _i < end.length; _i++) {
            var _clone = end[_i].cloneNode(true);

            _clone.classList.add(classes.cloneSlide);

            items.unshift(_clone);
          }
        }

        return items;
      },


      /**
       * Append cloned slides with generated pattern.
       *
       * @return {Void}
       */
      append: function append() {
        var items = this.items;
        var _Components$Html = Components.Html,
            wrapper = _Components$Html.wrapper,
            slides = _Components$Html.slides;


        var half = Math.floor(items.length / 2);
        var prepend = items.slice(0, half).reverse();
        var append = items.slice(half, items.length);
        var width = Components.Sizes.slideWidth + 'px';

        for (var i = 0; i < append.length; i++) {
          wrapper.appendChild(append[i]);
        }

        for (var _i2 = 0; _i2 < prepend.length; _i2++) {
          wrapper.insertBefore(prepend[_i2], slides[0]);
        }

        for (var _i3 = 0; _i3 < items.length; _i3++) {
          items[_i3].style.width = width;
        }
      },


      /**
       * Remove all cloned slides.
       *
       * @return {Void}
       */
      remove: function remove() {
        var items = this.items;


        for (var i = 0; i < items.length; i++) {
          Components.Html.wrapper.removeChild(items[i]);
        }
      }
    };

    define(Clones, 'grow', {
      /**
       * Gets additional dimentions value caused by clones.
       *
       * @return {Number}
       */
      get: function get() {
        return (Components.Sizes.slideWidth + Components.Gaps.value) * Clones.items.length;
      }
    });

    /**
     * Append additional slide's clones:
     * - while glide's type is `carousel`
     */
    Events.on('update', function () {
      Clones.remove();
      Clones.mount();
      Clones.append();
    });

    /**
     * Append additional slide's clones:
     * - while glide's type is `carousel`
     */
    Events.on('build.before', function () {
      if (Glide.isType('carousel')) {
        Clones.append();
      }
    });

    /**
     * Remove clones HTMLElements:
     * - on destroying, to bring HTML to its initial state
     */
    Events.on('destroy', function () {
      Clones.remove();
    });

    return Clones;
  }

  var EventsBinder = function () {
    /**
     * Construct a EventsBinder instance.
     */
    function EventsBinder() {
      var listeners = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      classCallCheck(this, EventsBinder);

      this.listeners = listeners;
    }

    /**
     * Adds events listeners to arrows HTML elements.
     *
     * @param  {String|Array} events
     * @param  {Element|Window|Document} el
     * @param  {Function} closure
     * @param  {Boolean|Object} capture
     * @return {Void}
     */


    createClass(EventsBinder, [{
      key: 'on',
      value: function on(events, el, closure) {
        var capture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

        if (isString(events)) {
          events = [events];
        }

        for (var i = 0; i < events.length; i++) {
          this.listeners[events[i]] = closure;

          el.addEventListener(events[i], this.listeners[events[i]], capture);
        }
      }

      /**
       * Removes event listeners from arrows HTML elements.
       *
       * @param  {String|Array} events
       * @param  {Element|Window|Document} el
       * @param  {Boolean|Object} capture
       * @return {Void}
       */

    }, {
      key: 'off',
      value: function off(events, el) {
        var capture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

        if (isString(events)) {
          events = [events];
        }

        for (var i = 0; i < events.length; i++) {
          el.removeEventListener(events[i], this.listeners[events[i]], capture);
        }
      }

      /**
       * Destroy collected listeners.
       *
       * @returns {Void}
       */

    }, {
      key: 'destroy',
      value: function destroy() {
        delete this.listeners;
      }
    }]);
    return EventsBinder;
  }();

  function Resize (Glide, Components, Events) {
    /**
     * Instance of the binder for DOM Events.
     *
     * @type {EventsBinder}
     */
    var Binder = new EventsBinder();

    var Resize = {
      /**
       * Initializes window bindings.
       */
      mount: function mount() {
        this.bind();
      },


      /**
       * Binds `rezsize` listener to the window.
       * It's a costly event, so we are debouncing it.
       *
       * @return {Void}
       */
      bind: function bind() {
        Binder.on('resize', window, throttle(function () {
          Events.emit('resize');
        }, Glide.settings.throttle));
      },


      /**
       * Unbinds listeners from the window.
       *
       * @return {Void}
       */
      unbind: function unbind() {
        Binder.off('resize', window);
      }
    };

    /**
     * Remove bindings from window:
     * - on destroying, to remove added EventListener
     */
    Events.on('destroy', function () {
      Resize.unbind();
      Binder.destroy();
    });

    return Resize;
  }

  var VALID_DIRECTIONS = ['ltr', 'rtl'];
  var FLIPED_MOVEMENTS = {
    '>': '<',
    '<': '>',
    '=': '='
  };

  function Direction (Glide, Components, Events) {
    var Direction = {
      /**
       * Setups gap value based on settings.
       *
       * @return {Void}
       */
      mount: function mount() {
        this.value = Glide.settings.direction;
      },


      /**
       * Resolves pattern based on direction value
       *
       * @param {String} pattern
       * @returns {String}
       */
      resolve: function resolve(pattern) {
        var token = pattern.slice(0, 1);

        if (this.is('rtl')) {
          return pattern.split(token).join(FLIPED_MOVEMENTS[token]);
        }

        return pattern;
      },


      /**
       * Checks value of direction mode.
       *
       * @param {String} direction
       * @returns {Boolean}
       */
      is: function is(direction) {
        return this.value === direction;
      },


      /**
       * Applies direction class to the root HTML element.
       *
       * @return {Void}
       */
      addClass: function addClass() {
        Components.Html.root.classList.add(Glide.settings.classes.direction[this.value]);
      },


      /**
       * Removes direction class from the root HTML element.
       *
       * @return {Void}
       */
      removeClass: function removeClass() {
        Components.Html.root.classList.remove(Glide.settings.classes.direction[this.value]);
      }
    };

    define(Direction, 'value', {
      /**
       * Gets value of the direction.
       *
       * @returns {Number}
       */
      get: function get() {
        return Direction._v;
      },


      /**
       * Sets value of the direction.
       *
       * @param {String} value
       * @return {Void}
       */
      set: function set(value) {
        if (VALID_DIRECTIONS.indexOf(value) > -1) {
          Direction._v = value;
        } else {
          warn('Direction value must be `ltr` or `rtl`');
        }
      }
    });

    /**
     * Clear direction class:
     * - on destroy to bring HTML to its initial state
     * - on update to remove class before reappling bellow
     */
    Events.on(['destroy', 'update'], function () {
      Direction.removeClass();
    });

    /**
     * Remount component:
     * - on update to reflect changes in direction value
     */
    Events.on('update', function () {
      Direction.mount();
    });

    /**
     * Apply direction class:
     * - before building to apply class for the first time
     * - on updating to reapply direction class that may changed
     */
    Events.on(['build.before', 'update'], function () {
      Direction.addClass();
    });

    return Direction;
  }

  /**
   * Reflects value of glide movement.
   *
   * @param  {Object} Glide
   * @param  {Object} Components
   * @return {Object}
   */
  function Rtl (Glide, Components) {
    return {
      /**
       * Negates the passed translate if glide is in RTL option.
       *
       * @param  {Number} translate
       * @return {Number}
       */
      modify: function modify(translate) {
        if (Components.Direction.is('rtl')) {
          return -translate;
        }

        return translate;
      }
    };
  }

  /**
   * Updates glide movement with a `gap` settings.
   *
   * @param  {Object} Glide
   * @param  {Object} Components
   * @return {Object}
   */
  function Gap (Glide, Components) {
    return {
      /**
       * Modifies passed translate value with number in the `gap` settings.
       *
       * @param  {Number} translate
       * @return {Number}
       */
      modify: function modify(translate) {
        return translate + Components.Gaps.value * Glide.index;
      }
    };
  }

  /**
   * Updates glide movement with width of additional clones width.
   *
   * @param  {Object} Glide
   * @param  {Object} Components
   * @return {Object}
   */
  function Grow (Glide, Components) {
    return {
      /**
       * Adds to the passed translate width of the half of clones.
       *
       * @param  {Number} translate
       * @return {Number}
       */
      modify: function modify(translate) {
        return translate + Components.Clones.grow / 2;
      }
    };
  }

  /**
   * Updates glide movement with a `peek` settings.
   *
   * @param  {Object} Glide
   * @param  {Object} Components
   * @return {Object}
   */
  function Peeking (Glide, Components) {
    return {
      /**
       * Modifies passed translate value with a `peek` setting.
       *
       * @param  {Number} translate
       * @return {Number}
       */
      modify: function modify(translate) {
        if (Glide.settings.focusAt >= 0) {
          var peek = Components.Peek.value;

          if (isObject(peek)) {
            return translate - peek.before;
          }

          return translate - peek;
        }

        return translate;
      }
    };
  }

  /**
   * Updates glide movement with a `focusAt` settings.
   *
   * @param  {Object} Glide
   * @param  {Object} Components
   * @return {Object}
   */
  function Focusing (Glide, Components) {
    return {
      /**
       * Modifies passed translate value with index in the `focusAt` setting.
       *
       * @param  {Number} translate
       * @return {Number}
       */
      modify: function modify(translate) {
        var gap = Components.Gaps.value;
        var width = Components.Sizes.width;
        var focusAt = Glide.settings.focusAt;
        var slideWidth = Components.Sizes.slideWidth;

        if (focusAt === 'center') {
          return translate - (width / 2 - slideWidth / 2);
        }

        return translate - slideWidth * focusAt - gap * focusAt;
      }
    };
  }

  /**
   * Applies diffrent transformers on translate value.
   *
   * @param  {Object} Glide
   * @param  {Object} Components
   * @return {Object}
   */
  function mutator (Glide, Components, Events) {
    /**
     * Merge instance transformers with collection of default transformers.
     * It's important that the Rtl component be last on the list,
     * so it reflects all previous transformations.
     *
     * @type {Array}
     */
    var TRANSFORMERS = [Gap, Grow, Peeking, Focusing].concat(Glide._t, [Rtl]);

    return {
      /**
       * Piplines translate value with registered transformers.
       *
       * @param  {Number} translate
       * @return {Number}
       */
      mutate: function mutate(translate) {
        for (var i = 0; i < TRANSFORMERS.length; i++) {
          var transformer = TRANSFORMERS[i];

          if (isFunction(transformer) && isFunction(transformer().modify)) {
            translate = transformer(Glide, Components, Events).modify(translate);
          } else {
            warn('Transformer should be a function that returns an object with `modify()` method');
          }
        }

        return translate;
      }
    };
  }

  function Translate (Glide, Components, Events) {
    var Translate = {
      /**
       * Sets value of translate on HTML element.
       *
       * @param {Number} value
       * @return {Void}
       */
      set: function set(value) {
        var transform = mutator(Glide, Components).mutate(value);

        Components.Html.wrapper.style.transform = 'translate3d(' + -1 * transform + 'px, 0px, 0px)';
      },


      /**
       * Removes value of translate from HTML element.
       *
       * @return {Void}
       */
      remove: function remove() {
        Components.Html.wrapper.style.transform = '';
      }
    };

    /**
     * Set new translate value:
     * - on move to reflect index change
     * - on updating via API to reflect possible changes in options
     */
    Events.on('move', function (context) {
      var gap = Components.Gaps.value;
      var length = Components.Sizes.length;
      var width = Components.Sizes.slideWidth;

      if (Glide.isType('carousel') && Components.Run.isOffset('<')) {
        Components.Transition.after(function () {
          Events.emit('translate.jump');

          Translate.set(width * (length - 1));
        });

        return Translate.set(-width - gap * length);
      }

      if (Glide.isType('carousel') && Components.Run.isOffset('>')) {
        Components.Transition.after(function () {
          Events.emit('translate.jump');

          Translate.set(0);
        });

        return Translate.set(width * length + gap * length);
      }

      return Translate.set(context.movement);
    });

    /**
     * Remove translate:
     * - on destroying to bring markup to its inital state
     */
    Events.on('destroy', function () {
      Translate.remove();
    });

    return Translate;
  }

  function Transition (Glide, Components, Events) {
    /**
     * Holds inactivity status of transition.
     * When true transition is not applied.
     *
     * @type {Boolean}
     */
    var disabled = false;

    var Transition = {
      /**
       * Composes string of the CSS transition.
       *
       * @param {String} property
       * @return {String}
       */
      compose: function compose(property) {
        var settings = Glide.settings;

        if (!disabled) {
          return property + ' ' + this.duration + 'ms ' + settings.animationTimingFunc;
        }

        return property + ' 0ms ' + settings.animationTimingFunc;
      },


      /**
       * Sets value of transition on HTML element.
       *
       * @param {String=} property
       * @return {Void}
       */
      set: function set() {
        var property = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'transform';

        Components.Html.wrapper.style.transition = this.compose(property);
      },


      /**
       * Removes value of transition from HTML element.
       *
       * @return {Void}
       */
      remove: function remove() {
        Components.Html.wrapper.style.transition = '';
      },


      /**
       * Runs callback after animation.
       *
       * @param  {Function} callback
       * @return {Void}
       */
      after: function after(callback) {
        setTimeout(function () {
          callback();
        }, this.duration);
      },


      /**
       * Enable transition.
       *
       * @return {Void}
       */
      enable: function enable() {
        disabled = false;

        this.set();
      },


      /**
       * Disable transition.
       *
       * @return {Void}
       */
      disable: function disable() {
        disabled = true;

        this.set();
      }
    };

    define(Transition, 'duration', {
      /**
       * Gets duration of the transition based
       * on currently running animation type.
       *
       * @return {Number}
       */
      get: function get() {
        var settings = Glide.settings;

        if (Glide.isType('slider') && Components.Run.offset) {
          return settings.rewindDuration;
        }

        return settings.animationDuration;
      }
    });

    /**
     * Set transition `style` value:
     * - on each moving, because it may be cleared by offset move
     */
    Events.on('move', function () {
      Transition.set();
    });

    /**
     * Disable transition:
     * - before initial build to avoid transitioning from `0` to `startAt` index
     * - while resizing window and recalculating dimentions
     * - on jumping from offset transition at start and end edges in `carousel` type
     */
    Events.on(['build.before', 'resize', 'translate.jump'], function () {
      Transition.disable();
    });

    /**
     * Enable transition:
     * - on each running, because it may be disabled by offset move
     */
    Events.on('run', function () {
      Transition.enable();
    });

    /**
     * Remove transition:
     * - on destroying to bring markup to its inital state
     */
    Events.on('destroy', function () {
      Transition.remove();
    });

    return Transition;
  }

  /**
   * Test via a getter in the options object to see
   * if the passive property is accessed.
   *
   * @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
   */

  var supportsPassive = false;

  try {
    var opts = Object.defineProperty({}, 'passive', {
      get: function get() {
        supportsPassive = true;
      }
    });

    window.addEventListener('testPassive', null, opts);
    window.removeEventListener('testPassive', null, opts);
  } catch (e) {}

  var supportsPassive$1 = supportsPassive;

  var START_EVENTS = ['touchstart', 'mousedown'];
  var MOVE_EVENTS = ['touchmove', 'mousemove'];
  var END_EVENTS = ['touchend', 'touchcancel', 'mouseup', 'mouseleave'];
  var MOUSE_EVENTS = ['mousedown', 'mousemove', 'mouseup', 'mouseleave'];

  function Swipe (Glide, Components, Events) {
    /**
     * Instance of the binder for DOM Events.
     *
     * @type {EventsBinder}
     */
    var Binder = new EventsBinder();

    var swipeSin = 0;
    var swipeStartX = 0;
    var swipeStartY = 0;
    var disabled = false;
    var capture = supportsPassive$1 ? { passive: true } : false;

    var Swipe = {
      /**
       * Initializes swipe bindings.
       *
       * @return {Void}
       */
      mount: function mount() {
        this.bindSwipeStart();
      },


      /**
       * Handler for `swipestart` event. Calculates entry points of the user's tap.
       *
       * @param {Object} event
       * @return {Void}
       */
      start: function start(event) {
        if (!disabled && !Glide.disabled) {
          this.disable();

          var swipe = this.touches(event);

          swipeSin = null;
          swipeStartX = toInt(swipe.pageX);
          swipeStartY = toInt(swipe.pageY);

          this.bindSwipeMove();
          this.bindSwipeEnd();

          Events.emit('swipe.start');
        }
      },


      /**
       * Handler for `swipemove` event. Calculates user's tap angle and distance.
       *
       * @param {Object} event
       */
      move: function move(event) {
        if (!Glide.disabled) {
          var _Glide$settings = Glide.settings,
              touchAngle = _Glide$settings.touchAngle,
              touchRatio = _Glide$settings.touchRatio,
              classes = _Glide$settings.classes;


          var swipe = this.touches(event);

          var subExSx = toInt(swipe.pageX) - swipeStartX;
          var subEySy = toInt(swipe.pageY) - swipeStartY;
          var powEX = Math.abs(subExSx << 2);
          var powEY = Math.abs(subEySy << 2);
          var swipeHypotenuse = Math.sqrt(powEX + powEY);
          var swipeCathetus = Math.sqrt(powEY);

          swipeSin = Math.asin(swipeCathetus / swipeHypotenuse);

          if (swipeSin * 180 / Math.PI < touchAngle) {
            event.stopPropagation();

            Components.Move.make(subExSx * toFloat(touchRatio));

            Components.Html.root.classList.add(classes.dragging);

            Events.emit('swipe.move');
          } else {
            return false;
          }
        }
      },


      /**
       * Handler for `swipeend` event. Finitializes user's tap and decides about glide move.
       *
       * @param {Object} event
       * @return {Void}
       */
      end: function end(event) {
        if (!Glide.disabled) {
          var settings = Glide.settings;

          var swipe = this.touches(event);
          var threshold = this.threshold(event);

          var swipeDistance = swipe.pageX - swipeStartX;
          var swipeDeg = swipeSin * 180 / Math.PI;
          var steps = Math.round(swipeDistance / Components.Sizes.slideWidth);

          this.enable();

          if (swipeDistance > threshold && swipeDeg < settings.touchAngle) {
            // While swipe is positive and greater than threshold move backward.
            if (settings.perTouch) {
              steps = Math.min(steps, toInt(settings.perTouch));
            }

            if (Components.Direction.is('rtl')) {
              steps = -steps;
            }

            Components.Run.make(Components.Direction.resolve('<' + steps));
          } else if (swipeDistance < -threshold && swipeDeg < settings.touchAngle) {
            // While swipe is negative and lower than negative threshold move forward.
            if (settings.perTouch) {
              steps = Math.max(steps, -toInt(settings.perTouch));
            }

            if (Components.Direction.is('rtl')) {
              steps = -steps;
            }

            Components.Run.make(Components.Direction.resolve('>' + steps));
          } else {
            // While swipe don't reach distance apply previous transform.
            Components.Move.make();
          }

          Components.Html.root.classList.remove(settings.classes.dragging);

          this.unbindSwipeMove();
          this.unbindSwipeEnd();

          Events.emit('swipe.end');
        }
      },


      /**
       * Binds swipe's starting event.
       *
       * @return {Void}
       */
      bindSwipeStart: function bindSwipeStart() {
        var _this = this;

        var settings = Glide.settings;

        if (settings.swipeThreshold) {
          Binder.on(START_EVENTS[0], Components.Html.wrapper, function (event) {
            _this.start(event);
          }, capture);
        }

        if (settings.dragThreshold) {
          Binder.on(START_EVENTS[1], Components.Html.wrapper, function (event) {
            _this.start(event);
          }, capture);
        }
      },


      /**
       * Unbinds swipe's starting event.
       *
       * @return {Void}
       */
      unbindSwipeStart: function unbindSwipeStart() {
        Binder.off(START_EVENTS[0], Components.Html.wrapper, capture);
        Binder.off(START_EVENTS[1], Components.Html.wrapper, capture);
      },


      /**
       * Binds swipe's moving event.
       *
       * @return {Void}
       */
      bindSwipeMove: function bindSwipeMove() {
        var _this2 = this;

        Binder.on(MOVE_EVENTS, Components.Html.wrapper, throttle(function (event) {
          _this2.move(event);
        }, Glide.settings.throttle), capture);
      },


      /**
       * Unbinds swipe's moving event.
       *
       * @return {Void}
       */
      unbindSwipeMove: function unbindSwipeMove() {
        Binder.off(MOVE_EVENTS, Components.Html.wrapper, capture);
      },


      /**
       * Binds swipe's ending event.
       *
       * @return {Void}
       */
      bindSwipeEnd: function bindSwipeEnd() {
        var _this3 = this;

        Binder.on(END_EVENTS, Components.Html.wrapper, function (event) {
          _this3.end(event);
        });
      },


      /**
       * Unbinds swipe's ending event.
       *
       * @return {Void}
       */
      unbindSwipeEnd: function unbindSwipeEnd() {
        Binder.off(END_EVENTS, Components.Html.wrapper);
      },


      /**
       * Normalizes event touches points accorting to different types.
       *
       * @param {Object} event
       */
      touches: function touches(event) {
        if (MOUSE_EVENTS.indexOf(event.type) > -1) {
          return event;
        }

        return event.touches[0] || event.changedTouches[0];
      },


      /**
       * Gets value of minimum swipe distance settings based on event type.
       *
       * @return {Number}
       */
      threshold: function threshold(event) {
        var settings = Glide.settings;

        if (MOUSE_EVENTS.indexOf(event.type) > -1) {
          return settings.dragThreshold;
        }

        return settings.swipeThreshold;
      },


      /**
       * Enables swipe event.
       *
       * @return {self}
       */
      enable: function enable() {
        disabled = false;

        Components.Transition.enable();

        return this;
      },


      /**
       * Disables swipe event.
       *
       * @return {self}
       */
      disable: function disable() {
        disabled = true;

        Components.Transition.disable();

        return this;
      }
    };

    /**
     * Add component class:
     * - after initial building
     */
    Events.on('build.after', function () {
      Components.Html.root.classList.add(Glide.settings.classes.swipeable);
    });

    /**
     * Remove swiping bindings:
     * - on destroying, to remove added EventListeners
     */
    Events.on('destroy', function () {
      Swipe.unbindSwipeStart();
      Swipe.unbindSwipeMove();
      Swipe.unbindSwipeEnd();
      Binder.destroy();
    });

    return Swipe;
  }

  function Images (Glide, Components, Events) {
    /**
     * Instance of the binder for DOM Events.
     *
     * @type {EventsBinder}
     */
    var Binder = new EventsBinder();

    var Images = {
      /**
       * Binds listener to glide wrapper.
       *
       * @return {Void}
       */
      mount: function mount() {
        this.bind();
      },


      /**
       * Binds `dragstart` event on wrapper to prevent dragging images.
       *
       * @return {Void}
       */
      bind: function bind() {
        Binder.on('dragstart', Components.Html.wrapper, this.dragstart);
      },


      /**
       * Unbinds `dragstart` event on wrapper.
       *
       * @return {Void}
       */
      unbind: function unbind() {
        Binder.off('dragstart', Components.Html.wrapper);
      },


      /**
       * Event handler. Prevents dragging.
       *
       * @return {Void}
       */
      dragstart: function dragstart(event) {
        event.preventDefault();
      }
    };

    /**
     * Remove bindings from images:
     * - on destroying, to remove added EventListeners
     */
    Events.on('destroy', function () {
      Images.unbind();
      Binder.destroy();
    });

    return Images;
  }

  function Anchors (Glide, Components, Events) {
    /**
     * Instance of the binder for DOM Events.
     *
     * @type {EventsBinder}
     */
    var Binder = new EventsBinder();

    /**
     * Holds detaching status of anchors.
     * Prevents detaching of already detached anchors.
     *
     * @private
     * @type {Boolean}
     */
    var detached = false;

    /**
     * Holds preventing status of anchors.
     * If `true` redirection after click will be disabled.
     *
     * @private
     * @type {Boolean}
     */
    var prevented = false;

    var Anchors = {
      /**
       * Setups a initial state of anchors component.
       *
       * @returns {Void}
       */
      mount: function mount() {
        /**
         * Holds collection of anchors elements.
         *
         * @private
         * @type {HTMLCollection}
         */
        this._a = Components.Html.wrapper.querySelectorAll('a');

        this.bind();
      },


      /**
       * Binds events to anchors inside a track.
       *
       * @return {Void}
       */
      bind: function bind() {
        Binder.on('click', Components.Html.wrapper, this.click);
      },


      /**
       * Unbinds events attached to anchors inside a track.
       *
       * @return {Void}
       */
      unbind: function unbind() {
        Binder.off('click', Components.Html.wrapper);
      },


      /**
       * Handler for click event. Prevents clicks when glide is in `prevent` status.
       *
       * @param  {Object} event
       * @return {Void}
       */
      click: function click(event) {
        if (prevented) {
          event.stopPropagation();
          event.preventDefault();
        }
      },


      /**
       * Detaches anchors click event inside glide.
       *
       * @return {self}
       */
      detach: function detach() {
        prevented = true;

        if (!detached) {
          for (var i = 0; i < this.items.length; i++) {
            this.items[i].draggable = false;

            this.items[i].setAttribute('data-href', this.items[i].getAttribute('href'));

            this.items[i].removeAttribute('href');
          }

          detached = true;
        }

        return this;
      },


      /**
       * Attaches anchors click events inside glide.
       *
       * @return {self}
       */
      attach: function attach() {
        prevented = false;

        if (detached) {
          for (var i = 0; i < this.items.length; i++) {
            this.items[i].draggable = true;

            this.items[i].setAttribute('href', this.items[i].getAttribute('data-href'));
          }

          detached = false;
        }

        return this;
      }
    };

    define(Anchors, 'items', {
      /**
       * Gets collection of the arrows HTML elements.
       *
       * @return {HTMLElement[]}
       */
      get: function get() {
        return Anchors._a;
      }
    });

    /**
     * Detach anchors inside slides:
     * - on swiping, so they won't redirect to its `href` attributes
     */
    Events.on('swipe.move', function () {
      Anchors.detach();
    });

    /**
     * Attach anchors inside slides:
     * - after swiping and transitions ends, so they can redirect after click again
     */
    Events.on('swipe.end', function () {
      Components.Transition.after(function () {
        Anchors.attach();
      });
    });

    /**
     * Unbind anchors inside slides:
     * - on destroying, to bring anchors to its initial state
     */
    Events.on('destroy', function () {
      Anchors.attach();
      Anchors.unbind();
      Binder.destroy();
    });

    return Anchors;
  }

  var NAV_SELECTOR = '[data-glide-el="controls[nav]"]';
  var CONTROLS_SELECTOR = '[data-glide-el^="controls"]';

  function Controls (Glide, Components, Events) {
    /**
     * Instance of the binder for DOM Events.
     *
     * @type {EventsBinder}
     */
    var Binder = new EventsBinder();

    var capture = supportsPassive$1 ? { passive: true } : false;

    var Controls = {
      /**
       * Inits arrows. Binds events listeners
       * to the arrows HTML elements.
       *
       * @return {Void}
       */
      mount: function mount() {
        /**
         * Collection of navigation HTML elements.
         *
         * @private
         * @type {HTMLCollection}
         */
        this._n = Components.Html.root.querySelectorAll(NAV_SELECTOR);

        /**
         * Collection of controls HTML elements.
         *
         * @private
         * @type {HTMLCollection}
         */
        this._c = Components.Html.root.querySelectorAll(CONTROLS_SELECTOR);

        this.addBindings();
      },


      /**
       * Sets active class to current slide.
       *
       * @return {Void}
       */
      setActive: function setActive() {
        for (var i = 0; i < this._n.length; i++) {
          this.addClass(this._n[i].children);
        }
      },


      /**
       * Removes active class to current slide.
       *
       * @return {Void}
       */
      removeActive: function removeActive() {
        for (var i = 0; i < this._n.length; i++) {
          this.removeClass(this._n[i].children);
        }
      },


      /**
       * Toggles active class on items inside navigation.
       *
       * @param  {HTMLElement} controls
       * @return {Void}
       */
      addClass: function addClass(controls) {
        var settings = Glide.settings;
        var item = controls[Glide.index];

        if (item) {
          item.classList.add(settings.classes.activeNav);

          siblings(item).forEach(function (sibling) {
            sibling.classList.remove(settings.classes.activeNav);
          });
        }
      },


      /**
       * Removes active class from active control.
       *
       * @param  {HTMLElement} controls
       * @return {Void}
       */
      removeClass: function removeClass(controls) {
        var item = controls[Glide.index];

        if (item) {
          item.classList.remove(Glide.settings.classes.activeNav);
        }
      },


      /**
       * Adds handles to the each group of controls.
       *
       * @return {Void}
       */
      addBindings: function addBindings() {
        for (var i = 0; i < this._c.length; i++) {
          this.bind(this._c[i].children);
        }
      },


      /**
       * Removes handles from the each group of controls.
       *
       * @return {Void}
       */
      removeBindings: function removeBindings() {
        for (var i = 0; i < this._c.length; i++) {
          this.unbind(this._c[i].children);
        }
      },


      /**
       * Binds events to arrows HTML elements.
       *
       * @param {HTMLCollection} elements
       * @return {Void}
       */
      bind: function bind(elements) {
        for (var i = 0; i < elements.length; i++) {
          Binder.on('click', elements[i], this.click);
          Binder.on('touchstart', elements[i], this.click, capture);
        }
      },


      /**
       * Unbinds events binded to the arrows HTML elements.
       *
       * @param {HTMLCollection} elements
       * @return {Void}
       */
      unbind: function unbind(elements) {
        for (var i = 0; i < elements.length; i++) {
          Binder.off(['click', 'touchstart'], elements[i]);
        }
      },


      /**
       * Handles `click` event on the arrows HTML elements.
       * Moves slider in driection precised in
       * `data-glide-dir` attribute.
       *
       * @param {Object} event
       * @return {Void}
       */
      click: function click(event) {
        event.preventDefault();

        Components.Run.make(Components.Direction.resolve(event.currentTarget.getAttribute('data-glide-dir')));
      }
    };

    define(Controls, 'items', {
      /**
       * Gets collection of the controls HTML elements.
       *
       * @return {HTMLElement[]}
       */
      get: function get() {
        return Controls._c;
      }
    });

    /**
     * Swap active class of current navigation item:
     * - after mounting to set it to initial index
     * - after each move to the new index
     */
    Events.on(['mount.after', 'move.after'], function () {
      Controls.setActive();
    });

    /**
     * Remove bindings and HTML Classes:
     * - on destroying, to bring markup to its initial state
     */
    Events.on('destroy', function () {
      Controls.removeBindings();
      Controls.removeActive();
      Binder.destroy();
    });

    return Controls;
  }

  function Keyboard (Glide, Components, Events) {
    /**
     * Instance of the binder for DOM Events.
     *
     * @type {EventsBinder}
     */
    var Binder = new EventsBinder();

    var Keyboard = {
      /**
       * Binds keyboard events on component mount.
       *
       * @return {Void}
       */
      mount: function mount() {
        if (Glide.settings.keyboard) {
          this.bind();
        }
      },


      /**
       * Adds keyboard press events.
       *
       * @return {Void}
       */
      bind: function bind() {
        Binder.on('keyup', document, this.press);
      },


      /**
       * Removes keyboard press events.
       *
       * @return {Void}
       */
      unbind: function unbind() {
        Binder.off('keyup', document);
      },


      /**
       * Handles keyboard's arrows press and moving glide foward and backward.
       *
       * @param  {Object} event
       * @return {Void}
       */
      press: function press(event) {
        if (event.keyCode === 39) {
          Components.Run.make(Components.Direction.resolve('>'));
        }

        if (event.keyCode === 37) {
          Components.Run.make(Components.Direction.resolve('<'));
        }
      }
    };

    /**
     * Remove bindings from keyboard:
     * - on destroying to remove added events
     * - on updating to remove events before remounting
     */
    Events.on(['destroy', 'update'], function () {
      Keyboard.unbind();
    });

    /**
     * Remount component
     * - on updating to reflect potential changes in settings
     */
    Events.on('update', function () {
      Keyboard.mount();
    });

    /**
     * Destroy binder:
     * - on destroying to remove listeners
     */
    Events.on('destroy', function () {
      Binder.destroy();
    });

    return Keyboard;
  }

  function Autoplay (Glide, Components, Events) {
    /**
     * Instance of the binder for DOM Events.
     *
     * @type {EventsBinder}
     */
    var Binder = new EventsBinder();

    var Autoplay = {
      /**
       * Initializes autoplaying and events.
       *
       * @return {Void}
       */
      mount: function mount() {
        this.start();

        if (Glide.settings.hoverpause) {
          this.bind();
        }
      },


      /**
       * Starts autoplaying in configured interval.
       *
       * @param {Boolean|Number} force Run autoplaying with passed interval regardless of `autoplay` settings
       * @return {Void}
       */
      start: function start() {
        var _this = this;

        if (Glide.settings.autoplay) {
          if (isUndefined(this._i)) {
            this._i = setInterval(function () {
              _this.stop();

              Components.Run.make('>');

              _this.start();
            }, this.time);
          }
        }
      },


      /**
       * Stops autorunning of the glide.
       *
       * @return {Void}
       */
      stop: function stop() {
        this._i = clearInterval(this._i);
      },


      /**
       * Stops autoplaying while mouse is over glide's area.
       *
       * @return {Void}
       */
      bind: function bind() {
        var _this2 = this;

        Binder.on('mouseover', Components.Html.root, function () {
          _this2.stop();
        });

        Binder.on('mouseout', Components.Html.root, function () {
          _this2.start();
        });
      },


      /**
       * Unbind mouseover events.
       *
       * @returns {Void}
       */
      unbind: function unbind() {
        Binder.off(['mouseover', 'mouseout'], Components.Html.root);
      }
    };

    define(Autoplay, 'time', {
      /**
       * Gets time period value for the autoplay interval. Prioritizes
       * times in `data-glide-autoplay` attrubutes over options.
       *
       * @return {Number}
       */
      get: function get() {
        var autoplay = Components.Html.slides[Glide.index].getAttribute('data-glide-autoplay');

        if (autoplay) {
          return toInt(autoplay);
        }

        return toInt(Glide.settings.autoplay);
      }
    });

    /**
     * Stop autoplaying and unbind events:
     * - on destroying, to clear defined interval
     * - on updating via API to reset interval that may changed
     */
    Events.on(['destroy', 'update'], function () {
      Autoplay.unbind();
    });

    /**
     * Stop autoplaying:
     * - before each run, to restart autoplaying
     * - on pausing via API
     * - on destroying, to clear defined interval
     * - while starting a swipe
     * - on updating via API to reset interval that may changed
     */
    Events.on(['run.before', 'pause', 'destroy', 'swipe.start', 'update'], function () {
      Autoplay.stop();
    });

    /**
     * Start autoplaying:
     * - after each run, to restart autoplaying
     * - on playing via API
     * - while ending a swipe
     */
    Events.on(['run.after', 'play', 'swipe.end'], function () {
      Autoplay.start();
    });

    /**
     * Remount autoplaying:
     * - on updating via API to reset interval that may changed
     */
    Events.on('update', function () {
      Autoplay.mount();
    });

    /**
     * Destroy a binder:
     * - on destroying glide instance to clearup listeners
     */
    Events.on('destroy', function () {
      Binder.destroy();
    });

    return Autoplay;
  }

  /**
   * Sorts keys of breakpoint object so they will be ordered from lower to bigger.
   *
   * @param {Object} points
   * @returns {Object}
   */
  function sortBreakpoints(points) {
    if (isObject(points)) {
      return sortKeys(points);
    } else {
      warn('Breakpoints option must be an object');
    }

    return {};
  }

  function Breakpoints (Glide, Components, Events) {
    /**
     * Instance of the binder for DOM Events.
     *
     * @type {EventsBinder}
     */
    var Binder = new EventsBinder();

    /**
     * Holds reference to settings.
     *
     * @type {Object}
     */
    var settings = Glide.settings;

    /**
     * Holds reference to breakpoints object in settings. Sorts breakpoints
     * from smaller to larger. It is required in order to proper
     * matching currently active breakpoint settings.
     *
     * @type {Object}
     */
    var points = sortBreakpoints(settings.breakpoints);

    /**
     * Cache initial settings before overwritting.
     *
     * @type {Object}
     */
    var defaults = _extends({}, settings);

    var Breakpoints = {
      /**
       * Matches settings for currectly matching media breakpoint.
       *
       * @param {Object} points
       * @returns {Object}
       */
      match: function match(points) {
        if (typeof window.matchMedia !== 'undefined') {
          for (var point in points) {
            if (points.hasOwnProperty(point)) {
              if (window.matchMedia('(max-width: ' + point + 'px)').matches) {
                return points[point];
              }
            }
          }
        }

        return defaults;
      }
    };

    /**
     * Overwrite instance settings with currently matching breakpoint settings.
     * This happens right after component initialization.
     */
    _extends(settings, Breakpoints.match(points));

    /**
     * Update glide with settings of matched brekpoint:
     * - window resize to update slider
     */
    Binder.on('resize', window, throttle(function () {
      Glide.settings = mergeOptions(settings, Breakpoints.match(points));
    }, Glide.settings.throttle));

    /**
     * Resort and update default settings:
     * - on reinit via API, so breakpoint matching will be performed with options
     */
    Events.on('update', function () {
      points = sortBreakpoints(points);

      defaults = _extends({}, settings);
    });

    /**
     * Unbind resize listener:
     * - on destroying, to bring markup to its initial state
     */
    Events.on('destroy', function () {
      Binder.off('resize', window);
    });

    return Breakpoints;
  }

  var COMPONENTS = {
    // Required
    Html: Html,
    Translate: Translate,
    Transition: Transition,
    Direction: Direction,
    Peek: Peek,
    Sizes: Sizes,
    Gaps: Gaps,
    Move: Move,
    Clones: Clones,
    Resize: Resize,
    Build: Build,
    Run: Run,

    // Optional
    Swipe: Swipe,
    Images: Images,
    Anchors: Anchors,
    Controls: Controls,
    Keyboard: Keyboard,
    Autoplay: Autoplay,
    Breakpoints: Breakpoints
  };

  var Glide$1 = function (_Core) {
    inherits(Glide$$1, _Core);

    function Glide$$1() {
      classCallCheck(this, Glide$$1);
      return possibleConstructorReturn(this, (Glide$$1.__proto__ || Object.getPrototypeOf(Glide$$1)).apply(this, arguments));
    }

    createClass(Glide$$1, [{
      key: 'mount',
      value: function mount() {
        var extensions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        return get(Glide$$1.prototype.__proto__ || Object.getPrototypeOf(Glide$$1.prototype), 'mount', this).call(this, _extends({}, COMPONENTS, extensions));
      }
    }]);
    return Glide$$1;
  }(Glide);

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const directives = new WeakMap();
  const isDirective = (o) => {
      return typeof o === 'function' && directives.has(o);
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * True if the custom elements polyfill is in use.
   */
  const isCEPolyfill = window.customElements !== undefined &&
      window.customElements.polyfillWrapFlushCallback !==
          undefined;
  /**
   * Removes nodes, starting from `start` (inclusive) to `end` (exclusive), from
   * `container`.
   */
  const removeNodes = (container, start, end = null) => {
      while (start !== end) {
          const n = start.nextSibling;
          container.removeChild(start);
          start = n;
      }
  };

  /**
   * @license
   * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * A sentinel value that signals that a value was handled by a directive and
   * should not be written to the DOM.
   */
  const noChange = {};
  /**
   * A sentinel value that signals a NodePart to fully clear its content.
   */
  const nothing = {};

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * An expression marker with embedded unique key to avoid collision with
   * possible text in templates.
   */
  const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
  /**
   * An expression marker used text-positions, multi-binding attributes, and
   * attributes with markup-like text values.
   */
  const nodeMarker = `<!--${marker}-->`;
  const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
  /**
   * Suffix appended to all bound attribute names.
   */
  const boundAttributeSuffix = '$lit$';
  /**
   * An updateable Template that tracks the location of dynamic parts.
   */
  class Template {
      constructor(result, element) {
          this.parts = [];
          this.element = element;
          const nodesToRemove = [];
          const stack = [];
          // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
          const walker = document.createTreeWalker(element.content, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
          // Keeps track of the last index associated with a part. We try to delete
          // unnecessary nodes, but we never want to associate two different parts
          // to the same index. They must have a constant node between.
          let lastPartIndex = 0;
          let index = -1;
          let partIndex = 0;
          const { strings, values: { length } } = result;
          while (partIndex < length) {
              const node = walker.nextNode();
              if (node === null) {
                  // We've exhausted the content inside a nested template element.
                  // Because we still have parts (the outer for-loop), we know:
                  // - There is a template in the stack
                  // - The walker will find a nextNode outside the template
                  walker.currentNode = stack.pop();
                  continue;
              }
              index++;
              if (node.nodeType === 1 /* Node.ELEMENT_NODE */) {
                  if (node.hasAttributes()) {
                      const attributes = node.attributes;
                      const { length } = attributes;
                      // Per
                      // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap,
                      // attributes are not guaranteed to be returned in document order.
                      // In particular, Edge/IE can return them out of order, so we cannot
                      // assume a correspondence between part index and attribute index.
                      let count = 0;
                      for (let i = 0; i < length; i++) {
                          if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                              count++;
                          }
                      }
                      while (count-- > 0) {
                          // Get the template literal section leading up to the first
                          // expression in this attribute
                          const stringForPart = strings[partIndex];
                          // Find the attribute name
                          const name = lastAttributeNameRegex.exec(stringForPart)[2];
                          // Find the corresponding attribute
                          // All bound attributes have had a suffix added in
                          // TemplateResult#getHTML to opt out of special attribute
                          // handling. To look up the attribute value we also need to add
                          // the suffix.
                          const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
                          const attributeValue = node.getAttribute(attributeLookupName);
                          node.removeAttribute(attributeLookupName);
                          const statics = attributeValue.split(markerRegex);
                          this.parts.push({ type: 'attribute', index, name, strings: statics });
                          partIndex += statics.length - 1;
                      }
                  }
                  if (node.tagName === 'TEMPLATE') {
                      stack.push(node);
                      walker.currentNode = node.content;
                  }
              }
              else if (node.nodeType === 3 /* Node.TEXT_NODE */) {
                  const data = node.data;
                  if (data.indexOf(marker) >= 0) {
                      const parent = node.parentNode;
                      const strings = data.split(markerRegex);
                      const lastIndex = strings.length - 1;
                      // Generate a new text node for each literal section
                      // These nodes are also used as the markers for node parts
                      for (let i = 0; i < lastIndex; i++) {
                          let insert;
                          let s = strings[i];
                          if (s === '') {
                              insert = createMarker();
                          }
                          else {
                              const match = lastAttributeNameRegex.exec(s);
                              if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                                  s = s.slice(0, match.index) + match[1] +
                                      match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                              }
                              insert = document.createTextNode(s);
                          }
                          parent.insertBefore(insert, node);
                          this.parts.push({ type: 'node', index: ++index });
                      }
                      // If there's no text, we must insert a comment to mark our place.
                      // Else, we can trust it will stick around after cloning.
                      if (strings[lastIndex] === '') {
                          parent.insertBefore(createMarker(), node);
                          nodesToRemove.push(node);
                      }
                      else {
                          node.data = strings[lastIndex];
                      }
                      // We have a part for each match found
                      partIndex += lastIndex;
                  }
              }
              else if (node.nodeType === 8 /* Node.COMMENT_NODE */) {
                  if (node.data === marker) {
                      const parent = node.parentNode;
                      // Add a new marker node to be the startNode of the Part if any of
                      // the following are true:
                      //  * We don't have a previousSibling
                      //  * The previousSibling is already the start of a previous part
                      if (node.previousSibling === null || index === lastPartIndex) {
                          index++;
                          parent.insertBefore(createMarker(), node);
                      }
                      lastPartIndex = index;
                      this.parts.push({ type: 'node', index });
                      // If we don't have a nextSibling, keep this node so we have an end.
                      // Else, we can remove it to save future costs.
                      if (node.nextSibling === null) {
                          node.data = '';
                      }
                      else {
                          nodesToRemove.push(node);
                          index--;
                      }
                      partIndex++;
                  }
                  else {
                      let i = -1;
                      while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
                          // Comment node has a binding marker inside, make an inactive part
                          // The binding won't work, but subsequent bindings will
                          // TODO (justinfagnani): consider whether it's even worth it to
                          // make bindings in comments work
                          this.parts.push({ type: 'node', index: -1 });
                          partIndex++;
                      }
                  }
              }
          }
          // Remove text binding nodes after the walk to not disturb the TreeWalker
          for (const n of nodesToRemove) {
              n.parentNode.removeChild(n);
          }
      }
  }
  const endsWith = (str, suffix) => {
      const index = str.length - suffix.length;
      return index >= 0 && str.slice(index) === suffix;
  };
  const isTemplatePartActive = (part) => part.index !== -1;
  // Allows `document.createComment('')` to be renamed for a
  // small manual size-savings.
  const createMarker = () => document.createComment('');
  /**
   * This regex extracts the attribute name preceding an attribute-position
   * expression. It does this by matching the syntax allowed for attributes
   * against the string literal directly preceding the expression, assuming that
   * the expression is in an attribute-value position.
   *
   * See attributes in the HTML spec:
   * https://www.w3.org/TR/html5/syntax.html#elements-attributes
   *
   * " \x09\x0a\x0c\x0d" are HTML space characters:
   * https://www.w3.org/TR/html5/infrastructure.html#space-characters
   *
   * "\0-\x1F\x7F-\x9F" are Unicode control characters, which includes every
   * space character except " ".
   *
   * So an attribute is:
   *  * The name: any character except a control character, space character, ('),
   *    ("), ">", "=", or "/"
   *  * Followed by zero or more space characters
   *  * Followed by "="
   *  * Followed by zero or more space characters
   *  * Followed by:
   *    * Any character except space, ('), ("), "<", ">", "=", (`), or
   *    * (") then any non-("), or
   *    * (') then any non-(')
   */
  const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * An instance of a `Template` that can be attached to the DOM and updated
   * with new values.
   */
  class TemplateInstance {
      constructor(template, processor, options) {
          this.__parts = [];
          this.template = template;
          this.processor = processor;
          this.options = options;
      }
      update(values) {
          let i = 0;
          for (const part of this.__parts) {
              if (part !== undefined) {
                  part.setValue(values[i]);
              }
              i++;
          }
          for (const part of this.__parts) {
              if (part !== undefined) {
                  part.commit();
              }
          }
      }
      _clone() {
          // There are a number of steps in the lifecycle of a template instance's
          // DOM fragment:
          //  1. Clone - create the instance fragment
          //  2. Adopt - adopt into the main document
          //  3. Process - find part markers and create parts
          //  4. Upgrade - upgrade custom elements
          //  5. Update - set node, attribute, property, etc., values
          //  6. Connect - connect to the document. Optional and outside of this
          //     method.
          //
          // We have a few constraints on the ordering of these steps:
          //  * We need to upgrade before updating, so that property values will pass
          //    through any property setters.
          //  * We would like to process before upgrading so that we're sure that the
          //    cloned fragment is inert and not disturbed by self-modifying DOM.
          //  * We want custom elements to upgrade even in disconnected fragments.
          //
          // Given these constraints, with full custom elements support we would
          // prefer the order: Clone, Process, Adopt, Upgrade, Update, Connect
          //
          // But Safari dooes not implement CustomElementRegistry#upgrade, so we
          // can not implement that order and still have upgrade-before-update and
          // upgrade disconnected fragments. So we instead sacrifice the
          // process-before-upgrade constraint, since in Custom Elements v1 elements
          // must not modify their light DOM in the constructor. We still have issues
          // when co-existing with CEv0 elements like Polymer 1, and with polyfills
          // that don't strictly adhere to the no-modification rule because shadow
          // DOM, which may be created in the constructor, is emulated by being placed
          // in the light DOM.
          //
          // The resulting order is on native is: Clone, Adopt, Upgrade, Process,
          // Update, Connect. document.importNode() performs Clone, Adopt, and Upgrade
          // in one step.
          //
          // The Custom Elements v1 polyfill supports upgrade(), so the order when
          // polyfilled is the more ideal: Clone, Process, Adopt, Upgrade, Update,
          // Connect.
          const fragment = isCEPolyfill ?
              this.template.element.content.cloneNode(true) :
              document.importNode(this.template.element.content, true);
          const stack = [];
          const parts = this.template.parts;
          // Edge needs all 4 parameters present; IE11 needs 3rd parameter to be null
          const walker = document.createTreeWalker(fragment, 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */, null, false);
          let partIndex = 0;
          let nodeIndex = 0;
          let part;
          let node = walker.nextNode();
          // Loop through all the nodes and parts of a template
          while (partIndex < parts.length) {
              part = parts[partIndex];
              if (!isTemplatePartActive(part)) {
                  this.__parts.push(undefined);
                  partIndex++;
                  continue;
              }
              // Progress the tree walker until we find our next part's node.
              // Note that multiple parts may share the same node (attribute parts
              // on a single element), so this loop may not run at all.
              while (nodeIndex < part.index) {
                  nodeIndex++;
                  if (node.nodeName === 'TEMPLATE') {
                      stack.push(node);
                      walker.currentNode = node.content;
                  }
                  if ((node = walker.nextNode()) === null) {
                      // We've exhausted the content inside a nested template element.
                      // Because we still have parts (the outer for-loop), we know:
                      // - There is a template in the stack
                      // - The walker will find a nextNode outside the template
                      walker.currentNode = stack.pop();
                      node = walker.nextNode();
                  }
              }
              // We've arrived at our part's node.
              if (part.type === 'node') {
                  const part = this.processor.handleTextExpression(this.options);
                  part.insertAfterNode(node.previousSibling);
                  this.__parts.push(part);
              }
              else {
                  this.__parts.push(...this.processor.handleAttributeExpressions(node, part.name, part.strings, this.options));
              }
              partIndex++;
          }
          if (isCEPolyfill) {
              document.adoptNode(fragment);
              customElements.upgrade(fragment);
          }
          return fragment;
      }
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const commentMarker = ` ${marker} `;
  /**
   * The return type of `html`, which holds a Template and the values from
   * interpolated expressions.
   */
  class TemplateResult {
      constructor(strings, values, type, processor) {
          this.strings = strings;
          this.values = values;
          this.type = type;
          this.processor = processor;
      }
      /**
       * Returns a string of HTML used to create a `<template>` element.
       */
      getHTML() {
          const l = this.strings.length - 1;
          let html = '';
          let isCommentBinding = false;
          for (let i = 0; i < l; i++) {
              const s = this.strings[i];
              // For each binding we want to determine the kind of marker to insert
              // into the template source before it's parsed by the browser's HTML
              // parser. The marker type is based on whether the expression is in an
              // attribute, text, or comment poisition.
              //   * For node-position bindings we insert a comment with the marker
              //     sentinel as its text content, like <!--{{lit-guid}}-->.
              //   * For attribute bindings we insert just the marker sentinel for the
              //     first binding, so that we support unquoted attribute bindings.
              //     Subsequent bindings can use a comment marker because multi-binding
              //     attributes must be quoted.
              //   * For comment bindings we insert just the marker sentinel so we don't
              //     close the comment.
              //
              // The following code scans the template source, but is *not* an HTML
              // parser. We don't need to track the tree structure of the HTML, only
              // whether a binding is inside a comment, and if not, if it appears to be
              // the first binding in an attribute.
              const commentOpen = s.lastIndexOf('<!--');
              // We're in comment position if we have a comment open with no following
              // comment close. Because <-- can appear in an attribute value there can
              // be false positives.
              isCommentBinding = (commentOpen > -1 || isCommentBinding) &&
                  s.indexOf('-->', commentOpen + 1) === -1;
              // Check to see if we have an attribute-like sequence preceeding the
              // expression. This can match "name=value" like structures in text,
              // comments, and attribute values, so there can be false-positives.
              const attributeMatch = lastAttributeNameRegex.exec(s);
              if (attributeMatch === null) {
                  // We're only in this branch if we don't have a attribute-like
                  // preceeding sequence. For comments, this guards against unusual
                  // attribute values like <div foo="<!--${'bar'}">. Cases like
                  // <!-- foo=${'bar'}--> are handled correctly in the attribute branch
                  // below.
                  html += s + (isCommentBinding ? commentMarker : nodeMarker);
              }
              else {
                  // For attributes we use just a marker sentinel, and also append a
                  // $lit$ suffix to the name to opt-out of attribute-specific parsing
                  // that IE and Edge do for style and certain SVG attributes.
                  html += s.substr(0, attributeMatch.index) + attributeMatch[1] +
                      attributeMatch[2] + boundAttributeSuffix + attributeMatch[3] +
                      marker;
              }
          }
          html += this.strings[l];
          return html;
      }
      getTemplateElement() {
          const template = document.createElement('template');
          template.innerHTML = this.getHTML();
          return template;
      }
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const isPrimitive = (value) => {
      return (value === null ||
          !(typeof value === 'object' || typeof value === 'function'));
  };
  const isIterable = (value) => {
      return Array.isArray(value) ||
          // tslint:disable-next-line:no-any
          !!(value && value[Symbol.iterator]);
  };
  /**
   * Writes attribute values to the DOM for a group of AttributeParts bound to a
   * single attibute. The value is only set once even if there are multiple parts
   * for an attribute.
   */
  class AttributeCommitter {
      constructor(element, name, strings) {
          this.dirty = true;
          this.element = element;
          this.name = name;
          this.strings = strings;
          this.parts = [];
          for (let i = 0; i < strings.length - 1; i++) {
              this.parts[i] = this._createPart();
          }
      }
      /**
       * Creates a single part. Override this to create a differnt type of part.
       */
      _createPart() {
          return new AttributePart(this);
      }
      _getValue() {
          const strings = this.strings;
          const l = strings.length - 1;
          let text = '';
          for (let i = 0; i < l; i++) {
              text += strings[i];
              const part = this.parts[i];
              if (part !== undefined) {
                  const v = part.value;
                  if (isPrimitive(v) || !isIterable(v)) {
                      text += typeof v === 'string' ? v : String(v);
                  }
                  else {
                      for (const t of v) {
                          text += typeof t === 'string' ? t : String(t);
                      }
                  }
              }
          }
          text += strings[l];
          return text;
      }
      commit() {
          if (this.dirty) {
              this.dirty = false;
              this.element.setAttribute(this.name, this._getValue());
          }
      }
  }
  /**
   * A Part that controls all or part of an attribute value.
   */
  class AttributePart {
      constructor(committer) {
          this.value = undefined;
          this.committer = committer;
      }
      setValue(value) {
          if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
              this.value = value;
              // If the value is a not a directive, dirty the committer so that it'll
              // call setAttribute. If the value is a directive, it'll dirty the
              // committer if it calls setValue().
              if (!isDirective(value)) {
                  this.committer.dirty = true;
              }
          }
      }
      commit() {
          while (isDirective(this.value)) {
              const directive = this.value;
              this.value = noChange;
              directive(this);
          }
          if (this.value === noChange) {
              return;
          }
          this.committer.commit();
      }
  }
  /**
   * A Part that controls a location within a Node tree. Like a Range, NodePart
   * has start and end locations and can set and update the Nodes between those
   * locations.
   *
   * NodeParts support several value types: primitives, Nodes, TemplateResults,
   * as well as arrays and iterables of those types.
   */
  class NodePart {
      constructor(options) {
          this.value = undefined;
          this.__pendingValue = undefined;
          this.options = options;
      }
      /**
       * Appends this part into a container.
       *
       * This part must be empty, as its contents are not automatically moved.
       */
      appendInto(container) {
          this.startNode = container.appendChild(createMarker());
          this.endNode = container.appendChild(createMarker());
      }
      /**
       * Inserts this part after the `ref` node (between `ref` and `ref`'s next
       * sibling). Both `ref` and its next sibling must be static, unchanging nodes
       * such as those that appear in a literal section of a template.
       *
       * This part must be empty, as its contents are not automatically moved.
       */
      insertAfterNode(ref) {
          this.startNode = ref;
          this.endNode = ref.nextSibling;
      }
      /**
       * Appends this part into a parent part.
       *
       * This part must be empty, as its contents are not automatically moved.
       */
      appendIntoPart(part) {
          part.__insert(this.startNode = createMarker());
          part.__insert(this.endNode = createMarker());
      }
      /**
       * Inserts this part after the `ref` part.
       *
       * This part must be empty, as its contents are not automatically moved.
       */
      insertAfterPart(ref) {
          ref.__insert(this.startNode = createMarker());
          this.endNode = ref.endNode;
          ref.endNode = this.startNode;
      }
      setValue(value) {
          this.__pendingValue = value;
      }
      commit() {
          while (isDirective(this.__pendingValue)) {
              const directive = this.__pendingValue;
              this.__pendingValue = noChange;
              directive(this);
          }
          const value = this.__pendingValue;
          if (value === noChange) {
              return;
          }
          if (isPrimitive(value)) {
              if (value !== this.value) {
                  this.__commitText(value);
              }
          }
          else if (value instanceof TemplateResult) {
              this.__commitTemplateResult(value);
          }
          else if (value instanceof Node) {
              this.__commitNode(value);
          }
          else if (isIterable(value)) {
              this.__commitIterable(value);
          }
          else if (value === nothing) {
              this.value = nothing;
              this.clear();
          }
          else {
              // Fallback, will render the string representation
              this.__commitText(value);
          }
      }
      __insert(node) {
          this.endNode.parentNode.insertBefore(node, this.endNode);
      }
      __commitNode(value) {
          if (this.value === value) {
              return;
          }
          this.clear();
          this.__insert(value);
          this.value = value;
      }
      __commitText(value) {
          const node = this.startNode.nextSibling;
          value = value == null ? '' : value;
          // If `value` isn't already a string, we explicitly convert it here in case
          // it can't be implicitly converted - i.e. it's a symbol.
          const valueAsString = typeof value === 'string' ? value : String(value);
          if (node === this.endNode.previousSibling &&
              node.nodeType === 3 /* Node.TEXT_NODE */) {
              // If we only have a single text node between the markers, we can just
              // set its value, rather than replacing it.
              // TODO(justinfagnani): Can we just check if this.value is primitive?
              node.data = valueAsString;
          }
          else {
              this.__commitNode(document.createTextNode(valueAsString));
          }
          this.value = value;
      }
      __commitTemplateResult(value) {
          const template = this.options.templateFactory(value);
          if (this.value instanceof TemplateInstance &&
              this.value.template === template) {
              this.value.update(value.values);
          }
          else {
              // Make sure we propagate the template processor from the TemplateResult
              // so that we use its syntax extension, etc. The template factory comes
              // from the render function options so that it can control template
              // caching and preprocessing.
              const instance = new TemplateInstance(template, value.processor, this.options);
              const fragment = instance._clone();
              instance.update(value.values);
              this.__commitNode(fragment);
              this.value = instance;
          }
      }
      __commitIterable(value) {
          // For an Iterable, we create a new InstancePart per item, then set its
          // value to the item. This is a little bit of overhead for every item in
          // an Iterable, but it lets us recurse easily and efficiently update Arrays
          // of TemplateResults that will be commonly returned from expressions like:
          // array.map((i) => html`${i}`), by reusing existing TemplateInstances.
          // If _value is an array, then the previous render was of an
          // iterable and _value will contain the NodeParts from the previous
          // render. If _value is not an array, clear this part and make a new
          // array for NodeParts.
          if (!Array.isArray(this.value)) {
              this.value = [];
              this.clear();
          }
          // Lets us keep track of how many items we stamped so we can clear leftover
          // items from a previous render
          const itemParts = this.value;
          let partIndex = 0;
          let itemPart;
          for (const item of value) {
              // Try to reuse an existing part
              itemPart = itemParts[partIndex];
              // If no existing part, create a new one
              if (itemPart === undefined) {
                  itemPart = new NodePart(this.options);
                  itemParts.push(itemPart);
                  if (partIndex === 0) {
                      itemPart.appendIntoPart(this);
                  }
                  else {
                      itemPart.insertAfterPart(itemParts[partIndex - 1]);
                  }
              }
              itemPart.setValue(item);
              itemPart.commit();
              partIndex++;
          }
          if (partIndex < itemParts.length) {
              // Truncate the parts array so _value reflects the current state
              itemParts.length = partIndex;
              this.clear(itemPart && itemPart.endNode);
          }
      }
      clear(startNode = this.startNode) {
          removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
      }
  }
  /**
   * Implements a boolean attribute, roughly as defined in the HTML
   * specification.
   *
   * If the value is truthy, then the attribute is present with a value of
   * ''. If the value is falsey, the attribute is removed.
   */
  class BooleanAttributePart {
      constructor(element, name, strings) {
          this.value = undefined;
          this.__pendingValue = undefined;
          if (strings.length !== 2 || strings[0] !== '' || strings[1] !== '') {
              throw new Error('Boolean attributes can only contain a single expression');
          }
          this.element = element;
          this.name = name;
          this.strings = strings;
      }
      setValue(value) {
          this.__pendingValue = value;
      }
      commit() {
          while (isDirective(this.__pendingValue)) {
              const directive = this.__pendingValue;
              this.__pendingValue = noChange;
              directive(this);
          }
          if (this.__pendingValue === noChange) {
              return;
          }
          const value = !!this.__pendingValue;
          if (this.value !== value) {
              if (value) {
                  this.element.setAttribute(this.name, '');
              }
              else {
                  this.element.removeAttribute(this.name);
              }
              this.value = value;
          }
          this.__pendingValue = noChange;
      }
  }
  /**
   * Sets attribute values for PropertyParts, so that the value is only set once
   * even if there are multiple parts for a property.
   *
   * If an expression controls the whole property value, then the value is simply
   * assigned to the property under control. If there are string literals or
   * multiple expressions, then the strings are expressions are interpolated into
   * a string first.
   */
  class PropertyCommitter extends AttributeCommitter {
      constructor(element, name, strings) {
          super(element, name, strings);
          this.single =
              (strings.length === 2 && strings[0] === '' && strings[1] === '');
      }
      _createPart() {
          return new PropertyPart(this);
      }
      _getValue() {
          if (this.single) {
              return this.parts[0].value;
          }
          return super._getValue();
      }
      commit() {
          if (this.dirty) {
              this.dirty = false;
              // tslint:disable-next-line:no-any
              this.element[this.name] = this._getValue();
          }
      }
  }
  class PropertyPart extends AttributePart {
  }
  // Detect event listener options support. If the `capture` property is read
  // from the options object, then options are supported. If not, then the thrid
  // argument to add/removeEventListener is interpreted as the boolean capture
  // value so we should only pass the `capture` property.
  let eventOptionsSupported = false;
  try {
      const options = {
          get capture() {
              eventOptionsSupported = true;
              return false;
          }
      };
      // tslint:disable-next-line:no-any
      window.addEventListener('test', options, options);
      // tslint:disable-next-line:no-any
      window.removeEventListener('test', options, options);
  }
  catch (_e) {
  }
  class EventPart {
      constructor(element, eventName, eventContext) {
          this.value = undefined;
          this.__pendingValue = undefined;
          this.element = element;
          this.eventName = eventName;
          this.eventContext = eventContext;
          this.__boundHandleEvent = (e) => this.handleEvent(e);
      }
      setValue(value) {
          this.__pendingValue = value;
      }
      commit() {
          while (isDirective(this.__pendingValue)) {
              const directive = this.__pendingValue;
              this.__pendingValue = noChange;
              directive(this);
          }
          if (this.__pendingValue === noChange) {
              return;
          }
          const newListener = this.__pendingValue;
          const oldListener = this.value;
          const shouldRemoveListener = newListener == null ||
              oldListener != null &&
                  (newListener.capture !== oldListener.capture ||
                      newListener.once !== oldListener.once ||
                      newListener.passive !== oldListener.passive);
          const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
          if (shouldRemoveListener) {
              this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
          }
          if (shouldAddListener) {
              this.__options = getOptions(newListener);
              this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
          }
          this.value = newListener;
          this.__pendingValue = noChange;
      }
      handleEvent(event) {
          if (typeof this.value === 'function') {
              this.value.call(this.eventContext || this.element, event);
          }
          else {
              this.value.handleEvent(event);
          }
      }
  }
  // We copy options because of the inconsistent behavior of browsers when reading
  // the third argument of add/removeEventListener. IE11 doesn't support options
  // at all. Chrome 41 only reads `capture` if the argument is an object.
  const getOptions = (o) => o &&
      (eventOptionsSupported ?
          { capture: o.capture, passive: o.passive, once: o.once } :
          o.capture);

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * Creates Parts when a template is instantiated.
   */
  class DefaultTemplateProcessor {
      /**
       * Create parts for an attribute-position binding, given the event, attribute
       * name, and string literals.
       *
       * @param element The element containing the binding
       * @param name  The attribute name
       * @param strings The string literals. There are always at least two strings,
       *   event for fully-controlled bindings with a single expression.
       */
      handleAttributeExpressions(element, name, strings, options) {
          const prefix = name[0];
          if (prefix === '.') {
              const committer = new PropertyCommitter(element, name.slice(1), strings);
              return committer.parts;
          }
          if (prefix === '@') {
              return [new EventPart(element, name.slice(1), options.eventContext)];
          }
          if (prefix === '?') {
              return [new BooleanAttributePart(element, name.slice(1), strings)];
          }
          const committer = new AttributeCommitter(element, name, strings);
          return committer.parts;
      }
      /**
       * Create parts for a text-position binding.
       * @param templateFactory
       */
      handleTextExpression(options) {
          return new NodePart(options);
      }
  }
  const defaultTemplateProcessor = new DefaultTemplateProcessor();

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  /**
   * The default TemplateFactory which caches Templates keyed on
   * result.type and result.strings.
   */
  function templateFactory(result) {
      let templateCache = templateCaches.get(result.type);
      if (templateCache === undefined) {
          templateCache = {
              stringsArray: new WeakMap(),
              keyString: new Map()
          };
          templateCaches.set(result.type, templateCache);
      }
      let template = templateCache.stringsArray.get(result.strings);
      if (template !== undefined) {
          return template;
      }
      // If the TemplateStringsArray is new, generate a key from the strings
      // This key is shared between all templates with identical content
      const key = result.strings.join(marker);
      // Check if we already have a Template for this key
      template = templateCache.keyString.get(key);
      if (template === undefined) {
          // If we have not seen this key before, create a new Template
          template = new Template(result, result.getTemplateElement());
          // Cache the Template for this key
          templateCache.keyString.set(key, template);
      }
      // Cache all future queries for this TemplateStringsArray
      templateCache.stringsArray.set(result.strings, template);
      return template;
  }
  const templateCaches = new Map();

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const parts = new WeakMap();
  /**
   * Renders a template result or other value to a container.
   *
   * To update a container with new values, reevaluate the template literal and
   * call `render` with the new result.
   *
   * @param result Any value renderable by NodePart - typically a TemplateResult
   *     created by evaluating a template tag like `html` or `svg`.
   * @param container A DOM parent to render to. The entire contents are either
   *     replaced, or efficiently updated if the same result type was previous
   *     rendered there.
   * @param options RenderOptions for the entire render tree rendered to this
   *     container. Render options must *not* change between renders to the same
   *     container, as those changes will not effect previously rendered DOM.
   */
  const render = (result, container, options) => {
      let part = parts.get(container);
      if (part === undefined) {
          removeNodes(container, container.firstChild);
          parts.set(container, part = new NodePart(Object.assign({ templateFactory }, options)));
          part.appendInto(container);
      }
      part.setValue(result);
      part.commit();
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // IMPORTANT: do not change the property name or the assignment expression.
  // This line will be used in regexes to search for lit-html usage.
  // TODO(justinfagnani): inject version number at build time
  (window['litHtmlVersions'] || (window['litHtmlVersions'] = [])).push('1.1.2');
  /**
   * Interprets a template literal as an HTML template that can efficiently
   * render to and update a container.
   */
  const html = (strings, ...values) => new TemplateResult(strings, values, 'html', defaultTemplateProcessor);

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const walkerNodeFilter = 133 /* NodeFilter.SHOW_{ELEMENT|COMMENT|TEXT} */;
  /**
   * Removes the list of nodes from a Template safely. In addition to removing
   * nodes from the Template, the Template part indices are updated to match
   * the mutated Template DOM.
   *
   * As the template is walked the removal state is tracked and
   * part indices are adjusted as needed.
   *
   * div
   *   div#1 (remove) <-- start removing (removing node is div#1)
   *     div
   *       div#2 (remove)  <-- continue removing (removing node is still div#1)
   *         div
   * div <-- stop removing since previous sibling is the removing node (div#1,
   * removed 4 nodes)
   */
  function removeNodesFromTemplate(template, nodesToRemove) {
      const { element: { content }, parts } = template;
      const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
      let partIndex = nextActiveIndexInTemplateParts(parts);
      let part = parts[partIndex];
      let nodeIndex = -1;
      let removeCount = 0;
      const nodesToRemoveInTemplate = [];
      let currentRemovingNode = null;
      while (walker.nextNode()) {
          nodeIndex++;
          const node = walker.currentNode;
          // End removal if stepped past the removing node
          if (node.previousSibling === currentRemovingNode) {
              currentRemovingNode = null;
          }
          // A node to remove was found in the template
          if (nodesToRemove.has(node)) {
              nodesToRemoveInTemplate.push(node);
              // Track node we're removing
              if (currentRemovingNode === null) {
                  currentRemovingNode = node;
              }
          }
          // When removing, increment count by which to adjust subsequent part indices
          if (currentRemovingNode !== null) {
              removeCount++;
          }
          while (part !== undefined && part.index === nodeIndex) {
              // If part is in a removed node deactivate it by setting index to -1 or
              // adjust the index as needed.
              part.index = currentRemovingNode !== null ? -1 : part.index - removeCount;
              // go to the next active part.
              partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
              part = parts[partIndex];
          }
      }
      nodesToRemoveInTemplate.forEach((n) => n.parentNode.removeChild(n));
  }
  const countNodes = (node) => {
      let count = (node.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */) ? 0 : 1;
      const walker = document.createTreeWalker(node, walkerNodeFilter, null, false);
      while (walker.nextNode()) {
          count++;
      }
      return count;
  };
  const nextActiveIndexInTemplateParts = (parts, startIndex = -1) => {
      for (let i = startIndex + 1; i < parts.length; i++) {
          const part = parts[i];
          if (isTemplatePartActive(part)) {
              return i;
          }
      }
      return -1;
  };
  /**
   * Inserts the given node into the Template, optionally before the given
   * refNode. In addition to inserting the node into the Template, the Template
   * part indices are updated to match the mutated Template DOM.
   */
  function insertNodeIntoTemplate(template, node, refNode = null) {
      const { element: { content }, parts } = template;
      // If there's no refNode, then put node at end of template.
      // No part indices need to be shifted in this case.
      if (refNode === null || refNode === undefined) {
          content.appendChild(node);
          return;
      }
      const walker = document.createTreeWalker(content, walkerNodeFilter, null, false);
      let partIndex = nextActiveIndexInTemplateParts(parts);
      let insertCount = 0;
      let walkerIndex = -1;
      while (walker.nextNode()) {
          walkerIndex++;
          const walkerNode = walker.currentNode;
          if (walkerNode === refNode) {
              insertCount = countNodes(node);
              refNode.parentNode.insertBefore(node, refNode);
          }
          while (partIndex !== -1 && parts[partIndex].index === walkerIndex) {
              // If we've inserted the node, simply adjust all subsequent parts
              if (insertCount > 0) {
                  while (partIndex !== -1) {
                      parts[partIndex].index += insertCount;
                      partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
                  }
                  return;
              }
              partIndex = nextActiveIndexInTemplateParts(parts, partIndex);
          }
      }
  }

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // Get a key to lookup in `templateCaches`.
  const getTemplateCacheKey = (type, scopeName) => `${type}--${scopeName}`;
  let compatibleShadyCSSVersion = true;
  if (typeof window.ShadyCSS === 'undefined') {
      compatibleShadyCSSVersion = false;
  }
  else if (typeof window.ShadyCSS.prepareTemplateDom === 'undefined') {
      console.warn(`Incompatible ShadyCSS version detected. ` +
          `Please update to at least @webcomponents/webcomponentsjs@2.0.2 and ` +
          `@webcomponents/shadycss@1.3.1.`);
      compatibleShadyCSSVersion = false;
  }
  /**
   * Template factory which scopes template DOM using ShadyCSS.
   * @param scopeName {string}
   */
  const shadyTemplateFactory = (scopeName) => (result) => {
      const cacheKey = getTemplateCacheKey(result.type, scopeName);
      let templateCache = templateCaches.get(cacheKey);
      if (templateCache === undefined) {
          templateCache = {
              stringsArray: new WeakMap(),
              keyString: new Map()
          };
          templateCaches.set(cacheKey, templateCache);
      }
      let template = templateCache.stringsArray.get(result.strings);
      if (template !== undefined) {
          return template;
      }
      const key = result.strings.join(marker);
      template = templateCache.keyString.get(key);
      if (template === undefined) {
          const element = result.getTemplateElement();
          if (compatibleShadyCSSVersion) {
              window.ShadyCSS.prepareTemplateDom(element, scopeName);
          }
          template = new Template(result, element);
          templateCache.keyString.set(key, template);
      }
      templateCache.stringsArray.set(result.strings, template);
      return template;
  };
  const TEMPLATE_TYPES = ['html', 'svg'];
  /**
   * Removes all style elements from Templates for the given scopeName.
   */
  const removeStylesFromLitTemplates = (scopeName) => {
      TEMPLATE_TYPES.forEach((type) => {
          const templates = templateCaches.get(getTemplateCacheKey(type, scopeName));
          if (templates !== undefined) {
              templates.keyString.forEach((template) => {
                  const { element: { content } } = template;
                  // IE 11 doesn't support the iterable param Set constructor
                  const styles = new Set();
                  Array.from(content.querySelectorAll('style')).forEach((s) => {
                      styles.add(s);
                  });
                  removeNodesFromTemplate(template, styles);
              });
          }
      });
  };
  const shadyRenderSet = new Set();
  /**
   * For the given scope name, ensures that ShadyCSS style scoping is performed.
   * This is done just once per scope name so the fragment and template cannot
   * be modified.
   * (1) extracts styles from the rendered fragment and hands them to ShadyCSS
   * to be scoped and appended to the document
   * (2) removes style elements from all lit-html Templates for this scope name.
   *
   * Note, <style> elements can only be placed into templates for the
   * initial rendering of the scope. If <style> elements are included in templates
   * dynamically rendered to the scope (after the first scope render), they will
   * not be scoped and the <style> will be left in the template and rendered
   * output.
   */
  const prepareTemplateStyles = (scopeName, renderedDOM, template) => {
      shadyRenderSet.add(scopeName);
      // If `renderedDOM` is stamped from a Template, then we need to edit that
      // Template's underlying template element. Otherwise, we create one here
      // to give to ShadyCSS, which still requires one while scoping.
      const templateElement = !!template ? template.element : document.createElement('template');
      // Move styles out of rendered DOM and store.
      const styles = renderedDOM.querySelectorAll('style');
      const { length } = styles;
      // If there are no styles, skip unnecessary work
      if (length === 0) {
          // Ensure prepareTemplateStyles is called to support adding
          // styles via `prepareAdoptedCssText` since that requires that
          // `prepareTemplateStyles` is called.
          //
          // ShadyCSS will only update styles containing @apply in the template
          // given to `prepareTemplateStyles`. If no lit Template was given,
          // ShadyCSS will not be able to update uses of @apply in any relevant
          // template. However, this is not a problem because we only create the
          // template for the purpose of supporting `prepareAdoptedCssText`,
          // which doesn't support @apply at all.
          window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
          return;
      }
      const condensedStyle = document.createElement('style');
      // Collect styles into a single style. This helps us make sure ShadyCSS
      // manipulations will not prevent us from being able to fix up template
      // part indices.
      // NOTE: collecting styles is inefficient for browsers but ShadyCSS
      // currently does this anyway. When it does not, this should be changed.
      for (let i = 0; i < length; i++) {
          const style = styles[i];
          style.parentNode.removeChild(style);
          condensedStyle.textContent += style.textContent;
      }
      // Remove styles from nested templates in this scope.
      removeStylesFromLitTemplates(scopeName);
      // And then put the condensed style into the "root" template passed in as
      // `template`.
      const content = templateElement.content;
      if (!!template) {
          insertNodeIntoTemplate(template, condensedStyle, content.firstChild);
      }
      else {
          content.insertBefore(condensedStyle, content.firstChild);
      }
      // Note, it's important that ShadyCSS gets the template that `lit-html`
      // will actually render so that it can update the style inside when
      // needed (e.g. @apply native Shadow DOM case).
      window.ShadyCSS.prepareTemplateStyles(templateElement, scopeName);
      const style = content.querySelector('style');
      if (window.ShadyCSS.nativeShadow && style !== null) {
          // When in native Shadow DOM, ensure the style created by ShadyCSS is
          // included in initially rendered output (`renderedDOM`).
          renderedDOM.insertBefore(style.cloneNode(true), renderedDOM.firstChild);
      }
      else if (!!template) {
          // When no style is left in the template, parts will be broken as a
          // result. To fix this, we put back the style node ShadyCSS removed
          // and then tell lit to remove that node from the template.
          // There can be no style in the template in 2 cases (1) when Shady DOM
          // is in use, ShadyCSS removes all styles, (2) when native Shadow DOM
          // is in use ShadyCSS removes the style if it contains no content.
          // NOTE, ShadyCSS creates its own style so we can safely add/remove
          // `condensedStyle` here.
          content.insertBefore(condensedStyle, content.firstChild);
          const removes = new Set();
          removes.add(condensedStyle);
          removeNodesFromTemplate(template, removes);
      }
  };
  /**
   * Extension to the standard `render` method which supports rendering
   * to ShadowRoots when the ShadyDOM (https://github.com/webcomponents/shadydom)
   * and ShadyCSS (https://github.com/webcomponents/shadycss) polyfills are used
   * or when the webcomponentsjs
   * (https://github.com/webcomponents/webcomponentsjs) polyfill is used.
   *
   * Adds a `scopeName` option which is used to scope element DOM and stylesheets
   * when native ShadowDOM is unavailable. The `scopeName` will be added to
   * the class attribute of all rendered DOM. In addition, any style elements will
   * be automatically re-written with this `scopeName` selector and moved out
   * of the rendered DOM and into the document `<head>`.
   *
   * It is common to use this render method in conjunction with a custom element
   * which renders a shadowRoot. When this is done, typically the element's
   * `localName` should be used as the `scopeName`.
   *
   * In addition to DOM scoping, ShadyCSS also supports a basic shim for css
   * custom properties (needed only on older browsers like IE11) and a shim for
   * a deprecated feature called `@apply` that supports applying a set of css
   * custom properties to a given location.
   *
   * Usage considerations:
   *
   * * Part values in `<style>` elements are only applied the first time a given
   * `scopeName` renders. Subsequent changes to parts in style elements will have
   * no effect. Because of this, parts in style elements should only be used for
   * values that will never change, for example parts that set scope-wide theme
   * values or parts which render shared style elements.
   *
   * * Note, due to a limitation of the ShadyDOM polyfill, rendering in a
   * custom element's `constructor` is not supported. Instead rendering should
   * either done asynchronously, for example at microtask timing (for example
   * `Promise.resolve()`), or be deferred until the first time the element's
   * `connectedCallback` runs.
   *
   * Usage considerations when using shimmed custom properties or `@apply`:
   *
   * * Whenever any dynamic changes are made which affect
   * css custom properties, `ShadyCSS.styleElement(element)` must be called
   * to update the element. There are two cases when this is needed:
   * (1) the element is connected to a new parent, (2) a class is added to the
   * element that causes it to match different custom properties.
   * To address the first case when rendering a custom element, `styleElement`
   * should be called in the element's `connectedCallback`.
   *
   * * Shimmed custom properties may only be defined either for an entire
   * shadowRoot (for example, in a `:host` rule) or via a rule that directly
   * matches an element with a shadowRoot. In other words, instead of flowing from
   * parent to child as do native css custom properties, shimmed custom properties
   * flow only from shadowRoots to nested shadowRoots.
   *
   * * When using `@apply` mixing css shorthand property names with
   * non-shorthand names (for example `border` and `border-width`) is not
   * supported.
   */
  const render$1 = (result, container, options) => {
      if (!options || typeof options !== 'object' || !options.scopeName) {
          throw new Error('The `scopeName` option is required.');
      }
      const scopeName = options.scopeName;
      const hasRendered = parts.has(container);
      const needsScoping = compatibleShadyCSSVersion &&
          container.nodeType === 11 /* Node.DOCUMENT_FRAGMENT_NODE */ &&
          !!container.host;
      // Handle first render to a scope specially...
      const firstScopeRender = needsScoping && !shadyRenderSet.has(scopeName);
      // On first scope render, render into a fragment; this cannot be a single
      // fragment that is reused since nested renders can occur synchronously.
      const renderContainer = firstScopeRender ? document.createDocumentFragment() : container;
      render(result, renderContainer, Object.assign({ templateFactory: shadyTemplateFactory(scopeName) }, options));
      // When performing first scope render,
      // (1) We've rendered into a fragment so that there's a chance to
      // `prepareTemplateStyles` before sub-elements hit the DOM
      // (which might cause them to render based on a common pattern of
      // rendering in a custom element's `connectedCallback`);
      // (2) Scope the template with ShadyCSS one time only for this scope.
      // (3) Render the fragment into the container and make sure the
      // container knows its `part` is the one we just rendered. This ensures
      // DOM will be re-used on subsequent renders.
      if (firstScopeRender) {
          const part = parts.get(renderContainer);
          parts.delete(renderContainer);
          // ShadyCSS might have style sheets (e.g. from `prepareAdoptedCssText`)
          // that should apply to `renderContainer` even if the rendered value is
          // not a TemplateInstance. However, it will only insert scoped styles
          // into the document if `prepareTemplateStyles` has already been called
          // for the given scope name.
          const template = part.value instanceof TemplateInstance ?
              part.value.template :
              undefined;
          prepareTemplateStyles(scopeName, renderContainer, template);
          removeNodes(container, container.firstChild);
          container.appendChild(renderContainer);
          parts.set(container, part);
      }
      // After elements have hit the DOM, update styling if this is the
      // initial render to this container.
      // This is needed whenever dynamic changes are made so it would be
      // safest to do every render; however, this would regress performance
      // so we leave it up to the user to call `ShadyCSS.styleElement`
      // for dynamic changes.
      if (!hasRendered && needsScoping) {
          window.ShadyCSS.styleElement(container.host);
      }
  };

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  // serializer/deserializers for boolean attribute
  const fromBooleanAttribute = (value) => value !== null;
  const toBooleanAttribute = (value) => value ? '' : null;
  /**
   * Change function that returns true if `value` is different from `oldValue`.
   * This method is used as the default for a property's `hasChanged` function.
   */
  const notEqual = (value, old) => {
      // This ensures (old==NaN, value==NaN) always returns false
      return old !== value && (old === old || value === value);
  };
  const defaultPropertyDeclaration = {
      attribute: true,
      type: String,
      reflect: false,
      hasChanged: notEqual
  };
  const microtaskPromise = new Promise((resolve) => resolve(true));
  const STATE_HAS_UPDATED = 1;
  const STATE_UPDATE_REQUESTED = 1 << 2;
  const STATE_IS_REFLECTING = 1 << 3;
  /**
   * Base element class which manages element properties and attributes. When
   * properties change, the `update` method is asynchronously called. This method
   * should be supplied by subclassers to render updates as desired.
   */
  class UpdatingElement extends HTMLElement {
      constructor() {
          super();
          this._updateState = 0;
          this._instanceProperties = undefined;
          this._updatePromise = microtaskPromise;
          /**
           * Map with keys for any properties that have changed since the last
           * update cycle with previous values.
           */
          this._changedProperties = new Map();
          /**
           * Map with keys of properties that should be reflected when updated.
           */
          this._reflectingProperties = undefined;
          this.initialize();
      }
      /**
       * Returns a list of attributes corresponding to the registered properties.
       */
      static get observedAttributes() {
          // note: piggy backing on this to ensure we're _finalized.
          this._finalize();
          const attributes = [];
          for (const [p, v] of this._classProperties) {
              const attr = this._attributeNameForProperty(p, v);
              if (attr !== undefined) {
                  this._attributeToPropertyMap.set(attr, p);
                  attributes.push(attr);
              }
          }
          return attributes;
      }
      /**
       * Creates a property accessor on the element prototype if one does not exist.
       * The property setter calls the property's `hasChanged` property option
       * or uses a strict identity check to determine whether or not to request
       * an update.
       */
      static createProperty(name, options = defaultPropertyDeclaration) {
          // ensure private storage for property declarations.
          if (!this.hasOwnProperty('_classProperties')) {
              this._classProperties = new Map();
              // NOTE: Workaround IE11 not supporting Map constructor argument.
              const superProperties = Object.getPrototypeOf(this)._classProperties;
              if (superProperties !== undefined) {
                  superProperties.forEach((v, k) => this._classProperties.set(k, v));
              }
          }
          this._classProperties.set(name, options);
          // Allow user defined accessors by not replacing an existing own-property
          // accessor.
          if (this.prototype.hasOwnProperty(name)) {
              return;
          }
          const key = typeof name === 'symbol' ? Symbol() : `__${name}`;
          Object.defineProperty(this.prototype, name, {
              get() { return this[key]; },
              set(value) {
                  const oldValue = this[name];
                  this[key] = value;
                  this._requestPropertyUpdate(name, oldValue, options);
              },
              configurable: true,
              enumerable: true
          });
      }
      /**
       * Creates property accessors for registered properties and ensures
       * any superclasses are also finalized.
       */
      static _finalize() {
          if (this.hasOwnProperty('_finalized') && this._finalized) {
              return;
          }
          // finalize any superclasses
          const superCtor = Object.getPrototypeOf(this);
          if (typeof superCtor._finalize === 'function') {
              superCtor._finalize();
          }
          this._finalized = true;
          // initialize Map populated in observedAttributes
          this._attributeToPropertyMap = new Map();
          // make any properties
          const props = this.properties;
          // support symbols in properties (IE11 does not support this)
          const propKeys = [
              ...Object.getOwnPropertyNames(props),
              ...(typeof Object.getOwnPropertySymbols === 'function')
                  ? Object.getOwnPropertySymbols(props)
                  : []
          ];
          for (const p of propKeys) {
              // note, use of `any` is due to TypeSript lack of support for symbol in
              // index types
              this.createProperty(p, props[p]);
          }
      }
      /**
       * Returns the property name for the given attribute `name`.
       */
      static _attributeNameForProperty(name, options) {
          const attribute = options !== undefined && options.attribute;
          return attribute === false
              ? undefined
              : (typeof attribute === 'string'
                  ? attribute
                  : (typeof name === 'string' ? name.toLowerCase()
                      : undefined));
      }
      /**
       * Returns true if a property should request an update.
       * Called when a property value is set and uses the `hasChanged`
       * option for the property if present or a strict identity check.
       */
      static _valueHasChanged(value, old, hasChanged = notEqual) {
          return hasChanged(value, old);
      }
      /**
       * Returns the property value for the given attribute value.
       * Called via the `attributeChangedCallback` and uses the property's `type`
       * or `type.fromAttribute` property option.
       */
      static _propertyValueFromAttribute(value, options) {
          const type = options && options.type;
          if (type === undefined) {
              return value;
          }
          // Note: special case `Boolean` so users can use it as a `type`.
          const fromAttribute = type === Boolean
              ? fromBooleanAttribute
              : (typeof type === 'function' ? type : type.fromAttribute);
          return fromAttribute ? fromAttribute(value) : value;
      }
      /**
       * Returns the attribute value for the given property value. If this
       * returns undefined, the property will *not* be reflected to an attribute.
       * If this returns null, the attribute will be removed, otherwise the
       * attribute will be set to the value.
       * This uses the property's `reflect` and `type.toAttribute` property options.
       */
      static _propertyValueToAttribute(value, options) {
          if (options === undefined || options.reflect === undefined) {
              return;
          }
          // Note: special case `Boolean` so users can use it as a `type`.
          const toAttribute = options.type === Boolean
              ? toBooleanAttribute
              : (options.type &&
                  options.type.toAttribute ||
                  String);
          return toAttribute(value);
      }
      /**
       * Performs element initialization. By default this calls `createRenderRoot`
       * to create the element `renderRoot` node and captures any pre-set values for
       * registered properties.
       */
      initialize() {
          this.renderRoot = this.createRenderRoot();
          this._saveInstanceProperties();
      }
      /**
       * Fixes any properties set on the instance before upgrade time.
       * Otherwise these would shadow the accessor and break these properties.
       * The properties are stored in a Map which is played back after the
       * constructor runs. Note, on very old versions of Safari (<=9) or Chrome
       * (<=41), properties created for native platform properties like (`id` or
       * `name`) may not have default values set in the element constructor. On
       * these browsers native properties appear on instances and therefore their
       * default value will overwrite any element default (e.g. if the element sets
       * this.id = 'id' in the constructor, the 'id' will become '' since this is
       * the native platform default).
       */
      _saveInstanceProperties() {
          for (const [p] of this.constructor
              ._classProperties) {
              if (this.hasOwnProperty(p)) {
                  const value = this[p];
                  delete this[p];
                  if (!this._instanceProperties) {
                      this._instanceProperties = new Map();
                  }
                  this._instanceProperties.set(p, value);
              }
          }
      }
      /**
       * Applies previously saved instance properties.
       */
      _applyInstanceProperties() {
          for (const [p, v] of this._instanceProperties) {
              this[p] = v;
          }
          this._instanceProperties = undefined;
      }
      /**
       * Returns the node into which the element should render and by default
       * creates and returns an open shadowRoot. Implement to customize where the
       * element's DOM is rendered. For example, to render into the element's
       * childNodes, return `this`.
       * @returns {Element|DocumentFragment} Returns a node into which to render.
       */
      createRenderRoot() {
          return this.attachShadow({ mode: 'open' });
      }
      /**
       * Uses ShadyCSS to keep element DOM updated.
       */
      connectedCallback() {
          if ((this._updateState & STATE_HAS_UPDATED)) {
              if (window.ShadyCSS !== undefined) {
                  window.ShadyCSS.styleElement(this);
              }
          }
          else {
              this.requestUpdate();
          }
      }
      /**
       * Allows for `super.disconnectedCallback()` in extensions while
       * reserving the possibility of making non-breaking feature additions
       * when disconnecting at some point in the future.
       */
      disconnectedCallback() { }
      /**
       * Synchronizes property values when attributes change.
       */
      attributeChangedCallback(name, old, value) {
          if (old !== value) {
              this._attributeToProperty(name, value);
          }
      }
      _propertyToAttribute(name, value, options = defaultPropertyDeclaration) {
          const ctor = this.constructor;
          const attrValue = ctor._propertyValueToAttribute(value, options);
          if (attrValue !== undefined) {
              const attr = ctor._attributeNameForProperty(name, options);
              if (attr !== undefined) {
                  // Track if the property is being reflected to avoid
                  // setting the property again via `attributeChangedCallback`. Note:
                  // 1. this takes advantage of the fact that the callback is synchronous.
                  // 2. will behave incorrectly if multiple attributes are in the reaction
                  // stack at time of calling. However, since we process attributes
                  // in `update` this should not be possible (or an extreme corner case
                  // that we'd like to discover).
                  // mark state reflecting
                  this._updateState = this._updateState | STATE_IS_REFLECTING;
                  if (attrValue === null) {
                      this.removeAttribute(attr);
                  }
                  else {
                      this.setAttribute(attr, attrValue);
                  }
                  // mark state not reflecting
                  this._updateState = this._updateState & ~STATE_IS_REFLECTING;
              }
          }
      }
      _attributeToProperty(name, value) {
          // Use tracking info to avoid deserializing attribute value if it was
          // just set from a property setter.
          if (!(this._updateState & STATE_IS_REFLECTING)) {
              const ctor = this.constructor;
              const propName = ctor._attributeToPropertyMap.get(name);
              if (propName !== undefined) {
                  const options = ctor._classProperties.get(propName);
                  this[propName] =
                      ctor._propertyValueFromAttribute(value, options);
              }
          }
      }
      /**
       * Requests an update which is processed asynchronously. This should
       * be called when an element should update based on some state not triggered
       * by setting a property. In this case, pass no arguments. It should also be
       * called when manually implementing a property setter. In this case, pass the
       * property `name` and `oldValue` to ensure that any configured property
       * options are honored. Returns the `updateComplete` Promise which is resolved
       * when the update completes.
       *
       * @param name {PropertyKey} (optional) name of requesting property
       * @param oldValue {any} (optional) old value of requesting property
       * @returns {Promise} A Promise that is resolved when the update completes.
       */
      requestUpdate(name, oldValue) {
          if (name !== undefined) {
              const options = this.constructor
                  ._classProperties.get(name) ||
                  defaultPropertyDeclaration;
              return this._requestPropertyUpdate(name, oldValue, options);
          }
          return this._invalidate();
      }
      /**
       * Requests an update for a specific property and records change information.
       * @param name {PropertyKey} name of requesting property
       * @param oldValue {any} old value of requesting property
       * @param options {PropertyDeclaration}
       */
      _requestPropertyUpdate(name, oldValue, options) {
          if (!this.constructor
              ._valueHasChanged(this[name], oldValue, options.hasChanged)) {
              return this.updateComplete;
          }
          // track old value when changing.
          if (!this._changedProperties.has(name)) {
              this._changedProperties.set(name, oldValue);
          }
          // add to reflecting properties set
          if (options.reflect === true) {
              if (this._reflectingProperties === undefined) {
                  this._reflectingProperties = new Map();
              }
              this._reflectingProperties.set(name, options);
          }
          return this._invalidate();
      }
      /**
       * Invalidates the element causing it to asynchronously update regardless
       * of whether or not any property changes are pending. This method is
       * automatically called when any registered property changes.
       */
      async _invalidate() {
          if (!this._hasRequestedUpdate) {
              // mark state updating...
              this._updateState = this._updateState | STATE_UPDATE_REQUESTED;
              let resolver;
              const previousValidatePromise = this._updatePromise;
              this._updatePromise = new Promise((r) => resolver = r);
              await previousValidatePromise;
              this._validate();
              resolver(!this._hasRequestedUpdate);
          }
          return this.updateComplete;
      }
      get _hasRequestedUpdate() {
          return (this._updateState & STATE_UPDATE_REQUESTED);
      }
      /**
       * Validates the element by updating it.
       */
      _validate() {
          // Mixin instance properties once, if they exist.
          if (this._instanceProperties) {
              this._applyInstanceProperties();
          }
          if (this.shouldUpdate(this._changedProperties)) {
              const changedProperties = this._changedProperties;
              this.update(changedProperties);
              this._markUpdated();
              if (!(this._updateState & STATE_HAS_UPDATED)) {
                  this._updateState = this._updateState | STATE_HAS_UPDATED;
                  this.firstUpdated(changedProperties);
              }
              this.updated(changedProperties);
          }
          else {
              this._markUpdated();
          }
      }
      _markUpdated() {
          this._changedProperties = new Map();
          this._updateState = this._updateState & ~STATE_UPDATE_REQUESTED;
      }
      /**
       * Returns a Promise that resolves when the element has completed updating.
       * The Promise value is a boolean that is `true` if the element completed the
       * update without triggering another update. The Promise result is `false` if
       * a property was set inside `updated()`. This getter can be implemented to
       * await additional state. For example, it is sometimes useful to await a
       * rendered element before fulfilling this Promise. To do this, first await
       * `super.updateComplete` then any subsequent state.
       *
       * @returns {Promise} The Promise returns a boolean that indicates if the
       * update resolved without triggering another update.
       */
      get updateComplete() { return this._updatePromise; }
      /**
       * Controls whether or not `update` should be called when the element requests
       * an update. By default, this method always returns `true`, but this can be
       * customized to control when to update.
       *
       * * @param _changedProperties Map of changed properties with old values
       */
      shouldUpdate(_changedProperties) {
          return true;
      }
      /**
       * Updates the element. This method reflects property values to attributes.
       * It can be overridden to render and keep updated DOM in the element's
       * `renderRoot`. Setting properties inside this method will *not* trigger
       * another update.
       *
       * * @param _changedProperties Map of changed properties with old values
       */
      update(_changedProperties) {
          if (this._reflectingProperties !== undefined &&
              this._reflectingProperties.size > 0) {
              for (const [k, v] of this._reflectingProperties) {
                  this._propertyToAttribute(k, this[k], v);
              }
              this._reflectingProperties = undefined;
          }
      }
      /**
       * Invoked whenever the element is updated. Implement to perform
       * post-updating tasks via DOM APIs, for example, focusing an element.
       *
       * Setting properties inside this method will trigger the element to update
       * again after this update cycle completes.
       *
       * * @param _changedProperties Map of changed properties with old values
       */
      updated(_changedProperties) { }
      /**
       * Invoked when the element is first updated. Implement to perform one time
       * work on the element after update.
       *
       * Setting properties inside this method will trigger the element to update
       * again after this update cycle completes.
       *
       * * @param _changedProperties Map of changed properties with old values
       */
      firstUpdated(_changedProperties) { }
  }
  /**
   * Maps attribute names to properties; for example `foobar` attribute
   * to `fooBar` property.
   */
  UpdatingElement._attributeToPropertyMap = new Map();
  /**
   * Marks class as having finished creating properties.
   */
  UpdatingElement._finalized = true;
  /**
   * Memoized list of all class properties, including any superclass properties.
   */
  UpdatingElement._classProperties = new Map();
  UpdatingElement.properties = {};

  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  class LitElement extends UpdatingElement {
      /**
       * Updates the element. This method reflects property values to attributes
       * and calls `render` to render DOM via lit-html. Setting properties inside
       * this method will *not* trigger another update.
       * * @param _changedProperties Map of changed properties with old values
       */
      update(changedProperties) {
          super.update(changedProperties);
          const templateResult = this.render();
          if (templateResult instanceof TemplateResult) {
              this.constructor
                  .render(templateResult, this.renderRoot, { scopeName: this.localName, eventContext: this });
          }
      }
      /**
       * Invoked on each update to perform rendering tasks. This method must return
       * a lit-html TemplateResult. Setting properties inside this method will *not*
       * trigger the element to update.
       */
      render() { }
  }
  /**
   * Render method used to render the lit-html TemplateResult to the element's
   * DOM.
   * @param {TemplateResult} Template to render.
   * @param {Element|DocumentFragment} Node into which to render.
   * @param {String} Element name.
   */
  LitElement.render = render$1;

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function commonjsRequire () {
  	throw new Error('Dynamic requires are not currently supported by rollup-plugin-commonjs');
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var moment = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
       module.exports = factory() ;
  }(commonjsGlobal, (function () {
      var hookCallback;

      function hooks () {
          return hookCallback.apply(null, arguments);
      }

      // This is done to register the method called with moment()
      // without creating circular dependencies.
      function setHookCallback (callback) {
          hookCallback = callback;
      }

      function isArray(input) {
          return input instanceof Array || Object.prototype.toString.call(input) === '[object Array]';
      }

      function isObject(input) {
          // IE8 will treat undefined and null as object if it wasn't for
          // input != null
          return input != null && Object.prototype.toString.call(input) === '[object Object]';
      }

      function isObjectEmpty(obj) {
          if (Object.getOwnPropertyNames) {
              return (Object.getOwnPropertyNames(obj).length === 0);
          } else {
              var k;
              for (k in obj) {
                  if (obj.hasOwnProperty(k)) {
                      return false;
                  }
              }
              return true;
          }
      }

      function isUndefined(input) {
          return input === void 0;
      }

      function isNumber(input) {
          return typeof input === 'number' || Object.prototype.toString.call(input) === '[object Number]';
      }

      function isDate(input) {
          return input instanceof Date || Object.prototype.toString.call(input) === '[object Date]';
      }

      function map(arr, fn) {
          var res = [], i;
          for (i = 0; i < arr.length; ++i) {
              res.push(fn(arr[i], i));
          }
          return res;
      }

      function hasOwnProp(a, b) {
          return Object.prototype.hasOwnProperty.call(a, b);
      }

      function extend(a, b) {
          for (var i in b) {
              if (hasOwnProp(b, i)) {
                  a[i] = b[i];
              }
          }

          if (hasOwnProp(b, 'toString')) {
              a.toString = b.toString;
          }

          if (hasOwnProp(b, 'valueOf')) {
              a.valueOf = b.valueOf;
          }

          return a;
      }

      function createUTC (input, format, locale, strict) {
          return createLocalOrUTC(input, format, locale, strict, true).utc();
      }

      function defaultParsingFlags() {
          // We need to deep clone this object.
          return {
              empty           : false,
              unusedTokens    : [],
              unusedInput     : [],
              overflow        : -2,
              charsLeftOver   : 0,
              nullInput       : false,
              invalidMonth    : null,
              invalidFormat   : false,
              userInvalidated : false,
              iso             : false,
              parsedDateParts : [],
              meridiem        : null,
              rfc2822         : false,
              weekdayMismatch : false
          };
      }

      function getParsingFlags(m) {
          if (m._pf == null) {
              m._pf = defaultParsingFlags();
          }
          return m._pf;
      }

      var some;
      if (Array.prototype.some) {
          some = Array.prototype.some;
      } else {
          some = function (fun) {
              var t = Object(this);
              var len = t.length >>> 0;

              for (var i = 0; i < len; i++) {
                  if (i in t && fun.call(this, t[i], i, t)) {
                      return true;
                  }
              }

              return false;
          };
      }

      function isValid(m) {
          if (m._isValid == null) {
              var flags = getParsingFlags(m);
              var parsedParts = some.call(flags.parsedDateParts, function (i) {
                  return i != null;
              });
              var isNowValid = !isNaN(m._d.getTime()) &&
                  flags.overflow < 0 &&
                  !flags.empty &&
                  !flags.invalidMonth &&
                  !flags.invalidWeekday &&
                  !flags.weekdayMismatch &&
                  !flags.nullInput &&
                  !flags.invalidFormat &&
                  !flags.userInvalidated &&
                  (!flags.meridiem || (flags.meridiem && parsedParts));

              if (m._strict) {
                  isNowValid = isNowValid &&
                      flags.charsLeftOver === 0 &&
                      flags.unusedTokens.length === 0 &&
                      flags.bigHour === undefined;
              }

              if (Object.isFrozen == null || !Object.isFrozen(m)) {
                  m._isValid = isNowValid;
              }
              else {
                  return isNowValid;
              }
          }
          return m._isValid;
      }

      function createInvalid (flags) {
          var m = createUTC(NaN);
          if (flags != null) {
              extend(getParsingFlags(m), flags);
          }
          else {
              getParsingFlags(m).userInvalidated = true;
          }

          return m;
      }

      // Plugins that add properties should also add the key here (null value),
      // so we can properly clone ourselves.
      var momentProperties = hooks.momentProperties = [];

      function copyConfig(to, from) {
          var i, prop, val;

          if (!isUndefined(from._isAMomentObject)) {
              to._isAMomentObject = from._isAMomentObject;
          }
          if (!isUndefined(from._i)) {
              to._i = from._i;
          }
          if (!isUndefined(from._f)) {
              to._f = from._f;
          }
          if (!isUndefined(from._l)) {
              to._l = from._l;
          }
          if (!isUndefined(from._strict)) {
              to._strict = from._strict;
          }
          if (!isUndefined(from._tzm)) {
              to._tzm = from._tzm;
          }
          if (!isUndefined(from._isUTC)) {
              to._isUTC = from._isUTC;
          }
          if (!isUndefined(from._offset)) {
              to._offset = from._offset;
          }
          if (!isUndefined(from._pf)) {
              to._pf = getParsingFlags(from);
          }
          if (!isUndefined(from._locale)) {
              to._locale = from._locale;
          }

          if (momentProperties.length > 0) {
              for (i = 0; i < momentProperties.length; i++) {
                  prop = momentProperties[i];
                  val = from[prop];
                  if (!isUndefined(val)) {
                      to[prop] = val;
                  }
              }
          }

          return to;
      }

      var updateInProgress = false;

      // Moment prototype object
      function Moment(config) {
          copyConfig(this, config);
          this._d = new Date(config._d != null ? config._d.getTime() : NaN);
          if (!this.isValid()) {
              this._d = new Date(NaN);
          }
          // Prevent infinite loop in case updateOffset creates new moment
          // objects.
          if (updateInProgress === false) {
              updateInProgress = true;
              hooks.updateOffset(this);
              updateInProgress = false;
          }
      }

      function isMoment (obj) {
          return obj instanceof Moment || (obj != null && obj._isAMomentObject != null);
      }

      function absFloor (number) {
          if (number < 0) {
              // -0 -> 0
              return Math.ceil(number) || 0;
          } else {
              return Math.floor(number);
          }
      }

      function toInt(argumentForCoercion) {
          var coercedNumber = +argumentForCoercion,
              value = 0;

          if (coercedNumber !== 0 && isFinite(coercedNumber)) {
              value = absFloor(coercedNumber);
          }

          return value;
      }

      // compare two arrays, return the number of differences
      function compareArrays(array1, array2, dontConvert) {
          var len = Math.min(array1.length, array2.length),
              lengthDiff = Math.abs(array1.length - array2.length),
              diffs = 0,
              i;
          for (i = 0; i < len; i++) {
              if ((dontConvert && array1[i] !== array2[i]) ||
                  (!dontConvert && toInt(array1[i]) !== toInt(array2[i]))) {
                  diffs++;
              }
          }
          return diffs + lengthDiff;
      }

      function warn(msg) {
          if (hooks.suppressDeprecationWarnings === false &&
                  (typeof console !==  'undefined') && console.warn) {
              console.warn('Deprecation warning: ' + msg);
          }
      }

      function deprecate(msg, fn) {
          var firstTime = true;

          return extend(function () {
              if (hooks.deprecationHandler != null) {
                  hooks.deprecationHandler(null, msg);
              }
              if (firstTime) {
                  var args = [];
                  var arg;
                  for (var i = 0; i < arguments.length; i++) {
                      arg = '';
                      if (typeof arguments[i] === 'object') {
                          arg += '\n[' + i + '] ';
                          for (var key in arguments[0]) {
                              arg += key + ': ' + arguments[0][key] + ', ';
                          }
                          arg = arg.slice(0, -2); // Remove trailing comma and space
                      } else {
                          arg = arguments[i];
                      }
                      args.push(arg);
                  }
                  warn(msg + '\nArguments: ' + Array.prototype.slice.call(args).join('') + '\n' + (new Error()).stack);
                  firstTime = false;
              }
              return fn.apply(this, arguments);
          }, fn);
      }

      var deprecations = {};

      function deprecateSimple(name, msg) {
          if (hooks.deprecationHandler != null) {
              hooks.deprecationHandler(name, msg);
          }
          if (!deprecations[name]) {
              warn(msg);
              deprecations[name] = true;
          }
      }

      hooks.suppressDeprecationWarnings = false;
      hooks.deprecationHandler = null;

      function isFunction(input) {
          return input instanceof Function || Object.prototype.toString.call(input) === '[object Function]';
      }

      function set (config) {
          var prop, i;
          for (i in config) {
              prop = config[i];
              if (isFunction(prop)) {
                  this[i] = prop;
              } else {
                  this['_' + i] = prop;
              }
          }
          this._config = config;
          // Lenient ordinal parsing accepts just a number in addition to
          // number + (possibly) stuff coming from _dayOfMonthOrdinalParse.
          // TODO: Remove "ordinalParse" fallback in next major release.
          this._dayOfMonthOrdinalParseLenient = new RegExp(
              (this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) +
                  '|' + (/\d{1,2}/).source);
      }

      function mergeConfigs(parentConfig, childConfig) {
          var res = extend({}, parentConfig), prop;
          for (prop in childConfig) {
              if (hasOwnProp(childConfig, prop)) {
                  if (isObject(parentConfig[prop]) && isObject(childConfig[prop])) {
                      res[prop] = {};
                      extend(res[prop], parentConfig[prop]);
                      extend(res[prop], childConfig[prop]);
                  } else if (childConfig[prop] != null) {
                      res[prop] = childConfig[prop];
                  } else {
                      delete res[prop];
                  }
              }
          }
          for (prop in parentConfig) {
              if (hasOwnProp(parentConfig, prop) &&
                      !hasOwnProp(childConfig, prop) &&
                      isObject(parentConfig[prop])) {
                  // make sure changes to properties don't modify parent config
                  res[prop] = extend({}, res[prop]);
              }
          }
          return res;
      }

      function Locale(config) {
          if (config != null) {
              this.set(config);
          }
      }

      var keys;

      if (Object.keys) {
          keys = Object.keys;
      } else {
          keys = function (obj) {
              var i, res = [];
              for (i in obj) {
                  if (hasOwnProp(obj, i)) {
                      res.push(i);
                  }
              }
              return res;
          };
      }

      var defaultCalendar = {
          sameDay : '[Today at] LT',
          nextDay : '[Tomorrow at] LT',
          nextWeek : 'dddd [at] LT',
          lastDay : '[Yesterday at] LT',
          lastWeek : '[Last] dddd [at] LT',
          sameElse : 'L'
      };

      function calendar (key, mom, now) {
          var output = this._calendar[key] || this._calendar['sameElse'];
          return isFunction(output) ? output.call(mom, now) : output;
      }

      var defaultLongDateFormat = {
          LTS  : 'h:mm:ss A',
          LT   : 'h:mm A',
          L    : 'MM/DD/YYYY',
          LL   : 'MMMM D, YYYY',
          LLL  : 'MMMM D, YYYY h:mm A',
          LLLL : 'dddd, MMMM D, YYYY h:mm A'
      };

      function longDateFormat (key) {
          var format = this._longDateFormat[key],
              formatUpper = this._longDateFormat[key.toUpperCase()];

          if (format || !formatUpper) {
              return format;
          }

          this._longDateFormat[key] = formatUpper.replace(/MMMM|MM|DD|dddd/g, function (val) {
              return val.slice(1);
          });

          return this._longDateFormat[key];
      }

      var defaultInvalidDate = 'Invalid date';

      function invalidDate () {
          return this._invalidDate;
      }

      var defaultOrdinal = '%d';
      var defaultDayOfMonthOrdinalParse = /\d{1,2}/;

      function ordinal (number) {
          return this._ordinal.replace('%d', number);
      }

      var defaultRelativeTime = {
          future : 'in %s',
          past   : '%s ago',
          s  : 'a few seconds',
          ss : '%d seconds',
          m  : 'a minute',
          mm : '%d minutes',
          h  : 'an hour',
          hh : '%d hours',
          d  : 'a day',
          dd : '%d days',
          M  : 'a month',
          MM : '%d months',
          y  : 'a year',
          yy : '%d years'
      };

      function relativeTime (number, withoutSuffix, string, isFuture) {
          var output = this._relativeTime[string];
          return (isFunction(output)) ?
              output(number, withoutSuffix, string, isFuture) :
              output.replace(/%d/i, number);
      }

      function pastFuture (diff, output) {
          var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
          return isFunction(format) ? format(output) : format.replace(/%s/i, output);
      }

      var aliases = {};

      function addUnitAlias (unit, shorthand) {
          var lowerCase = unit.toLowerCase();
          aliases[lowerCase] = aliases[lowerCase + 's'] = aliases[shorthand] = unit;
      }

      function normalizeUnits(units) {
          return typeof units === 'string' ? aliases[units] || aliases[units.toLowerCase()] : undefined;
      }

      function normalizeObjectUnits(inputObject) {
          var normalizedInput = {},
              normalizedProp,
              prop;

          for (prop in inputObject) {
              if (hasOwnProp(inputObject, prop)) {
                  normalizedProp = normalizeUnits(prop);
                  if (normalizedProp) {
                      normalizedInput[normalizedProp] = inputObject[prop];
                  }
              }
          }

          return normalizedInput;
      }

      var priorities = {};

      function addUnitPriority(unit, priority) {
          priorities[unit] = priority;
      }

      function getPrioritizedUnits(unitsObj) {
          var units = [];
          for (var u in unitsObj) {
              units.push({unit: u, priority: priorities[u]});
          }
          units.sort(function (a, b) {
              return a.priority - b.priority;
          });
          return units;
      }

      function zeroFill(number, targetLength, forceSign) {
          var absNumber = '' + Math.abs(number),
              zerosToFill = targetLength - absNumber.length,
              sign = number >= 0;
          return (sign ? (forceSign ? '+' : '') : '-') +
              Math.pow(10, Math.max(0, zerosToFill)).toString().substr(1) + absNumber;
      }

      var formattingTokens = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g;

      var localFormattingTokens = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g;

      var formatFunctions = {};

      var formatTokenFunctions = {};

      // token:    'M'
      // padded:   ['MM', 2]
      // ordinal:  'Mo'
      // callback: function () { this.month() + 1 }
      function addFormatToken (token, padded, ordinal, callback) {
          var func = callback;
          if (typeof callback === 'string') {
              func = function () {
                  return this[callback]();
              };
          }
          if (token) {
              formatTokenFunctions[token] = func;
          }
          if (padded) {
              formatTokenFunctions[padded[0]] = function () {
                  return zeroFill(func.apply(this, arguments), padded[1], padded[2]);
              };
          }
          if (ordinal) {
              formatTokenFunctions[ordinal] = function () {
                  return this.localeData().ordinal(func.apply(this, arguments), token);
              };
          }
      }

      function removeFormattingTokens(input) {
          if (input.match(/\[[\s\S]/)) {
              return input.replace(/^\[|\]$/g, '');
          }
          return input.replace(/\\/g, '');
      }

      function makeFormatFunction(format) {
          var array = format.match(formattingTokens), i, length;

          for (i = 0, length = array.length; i < length; i++) {
              if (formatTokenFunctions[array[i]]) {
                  array[i] = formatTokenFunctions[array[i]];
              } else {
                  array[i] = removeFormattingTokens(array[i]);
              }
          }

          return function (mom) {
              var output = '', i;
              for (i = 0; i < length; i++) {
                  output += isFunction(array[i]) ? array[i].call(mom, format) : array[i];
              }
              return output;
          };
      }

      // format date using native date object
      function formatMoment(m, format) {
          if (!m.isValid()) {
              return m.localeData().invalidDate();
          }

          format = expandFormat(format, m.localeData());
          formatFunctions[format] = formatFunctions[format] || makeFormatFunction(format);

          return formatFunctions[format](m);
      }

      function expandFormat(format, locale) {
          var i = 5;

          function replaceLongDateFormatTokens(input) {
              return locale.longDateFormat(input) || input;
          }

          localFormattingTokens.lastIndex = 0;
          while (i >= 0 && localFormattingTokens.test(format)) {
              format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
              localFormattingTokens.lastIndex = 0;
              i -= 1;
          }

          return format;
      }

      var match1         = /\d/;            //       0 - 9
      var match2         = /\d\d/;          //      00 - 99
      var match3         = /\d{3}/;         //     000 - 999
      var match4         = /\d{4}/;         //    0000 - 9999
      var match6         = /[+-]?\d{6}/;    // -999999 - 999999
      var match1to2      = /\d\d?/;         //       0 - 99
      var match3to4      = /\d\d\d\d?/;     //     999 - 9999
      var match5to6      = /\d\d\d\d\d\d?/; //   99999 - 999999
      var match1to3      = /\d{1,3}/;       //       0 - 999
      var match1to4      = /\d{1,4}/;       //       0 - 9999
      var match1to6      = /[+-]?\d{1,6}/;  // -999999 - 999999

      var matchUnsigned  = /\d+/;           //       0 - inf
      var matchSigned    = /[+-]?\d+/;      //    -inf - inf

      var matchOffset    = /Z|[+-]\d\d:?\d\d/gi; // +00:00 -00:00 +0000 -0000 or Z
      var matchShortOffset = /Z|[+-]\d\d(?::?\d\d)?/gi; // +00 -00 +00:00 -00:00 +0000 -0000 or Z

      var matchTimestamp = /[+-]?\d+(\.\d{1,3})?/; // 123456789 123456789.123

      // any word (or two) characters or numbers including two/three word month in arabic.
      // includes scottish gaelic two word and hyphenated months
      var matchWord = /[0-9]{0,256}['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFF07\uFF10-\uFFEF]{1,256}|[\u0600-\u06FF\/]{1,256}(\s*?[\u0600-\u06FF]{1,256}){1,2}/i;

      var regexes = {};

      function addRegexToken (token, regex, strictRegex) {
          regexes[token] = isFunction(regex) ? regex : function (isStrict, localeData) {
              return (isStrict && strictRegex) ? strictRegex : regex;
          };
      }

      function getParseRegexForToken (token, config) {
          if (!hasOwnProp(regexes, token)) {
              return new RegExp(unescapeFormat(token));
          }

          return regexes[token](config._strict, config._locale);
      }

      // Code from http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript
      function unescapeFormat(s) {
          return regexEscape(s.replace('\\', '').replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function (matched, p1, p2, p3, p4) {
              return p1 || p2 || p3 || p4;
          }));
      }

      function regexEscape(s) {
          return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      }

      var tokens = {};

      function addParseToken (token, callback) {
          var i, func = callback;
          if (typeof token === 'string') {
              token = [token];
          }
          if (isNumber(callback)) {
              func = function (input, array) {
                  array[callback] = toInt(input);
              };
          }
          for (i = 0; i < token.length; i++) {
              tokens[token[i]] = func;
          }
      }

      function addWeekParseToken (token, callback) {
          addParseToken(token, function (input, array, config, token) {
              config._w = config._w || {};
              callback(input, config._w, config, token);
          });
      }

      function addTimeToArrayFromToken(token, input, config) {
          if (input != null && hasOwnProp(tokens, token)) {
              tokens[token](input, config._a, config, token);
          }
      }

      var YEAR = 0;
      var MONTH = 1;
      var DATE = 2;
      var HOUR = 3;
      var MINUTE = 4;
      var SECOND = 5;
      var MILLISECOND = 6;
      var WEEK = 7;
      var WEEKDAY = 8;

      // FORMATTING

      addFormatToken('Y', 0, 0, function () {
          var y = this.year();
          return y <= 9999 ? '' + y : '+' + y;
      });

      addFormatToken(0, ['YY', 2], 0, function () {
          return this.year() % 100;
      });

      addFormatToken(0, ['YYYY',   4],       0, 'year');
      addFormatToken(0, ['YYYYY',  5],       0, 'year');
      addFormatToken(0, ['YYYYYY', 6, true], 0, 'year');

      // ALIASES

      addUnitAlias('year', 'y');

      // PRIORITIES

      addUnitPriority('year', 1);

      // PARSING

      addRegexToken('Y',      matchSigned);
      addRegexToken('YY',     match1to2, match2);
      addRegexToken('YYYY',   match1to4, match4);
      addRegexToken('YYYYY',  match1to6, match6);
      addRegexToken('YYYYYY', match1to6, match6);

      addParseToken(['YYYYY', 'YYYYYY'], YEAR);
      addParseToken('YYYY', function (input, array) {
          array[YEAR] = input.length === 2 ? hooks.parseTwoDigitYear(input) : toInt(input);
      });
      addParseToken('YY', function (input, array) {
          array[YEAR] = hooks.parseTwoDigitYear(input);
      });
      addParseToken('Y', function (input, array) {
          array[YEAR] = parseInt(input, 10);
      });

      // HELPERS

      function daysInYear(year) {
          return isLeapYear(year) ? 366 : 365;
      }

      function isLeapYear(year) {
          return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      }

      // HOOKS

      hooks.parseTwoDigitYear = function (input) {
          return toInt(input) + (toInt(input) > 68 ? 1900 : 2000);
      };

      // MOMENTS

      var getSetYear = makeGetSet('FullYear', true);

      function getIsLeapYear () {
          return isLeapYear(this.year());
      }

      function makeGetSet (unit, keepTime) {
          return function (value) {
              if (value != null) {
                  set$1(this, unit, value);
                  hooks.updateOffset(this, keepTime);
                  return this;
              } else {
                  return get(this, unit);
              }
          };
      }

      function get (mom, unit) {
          return mom.isValid() ?
              mom._d['get' + (mom._isUTC ? 'UTC' : '') + unit]() : NaN;
      }

      function set$1 (mom, unit, value) {
          if (mom.isValid() && !isNaN(value)) {
              if (unit === 'FullYear' && isLeapYear(mom.year()) && mom.month() === 1 && mom.date() === 29) {
                  mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value, mom.month(), daysInMonth(value, mom.month()));
              }
              else {
                  mom._d['set' + (mom._isUTC ? 'UTC' : '') + unit](value);
              }
          }
      }

      // MOMENTS

      function stringGet (units) {
          units = normalizeUnits(units);
          if (isFunction(this[units])) {
              return this[units]();
          }
          return this;
      }


      function stringSet (units, value) {
          if (typeof units === 'object') {
              units = normalizeObjectUnits(units);
              var prioritized = getPrioritizedUnits(units);
              for (var i = 0; i < prioritized.length; i++) {
                  this[prioritized[i].unit](units[prioritized[i].unit]);
              }
          } else {
              units = normalizeUnits(units);
              if (isFunction(this[units])) {
                  return this[units](value);
              }
          }
          return this;
      }

      function mod(n, x) {
          return ((n % x) + x) % x;
      }

      var indexOf;

      if (Array.prototype.indexOf) {
          indexOf = Array.prototype.indexOf;
      } else {
          indexOf = function (o) {
              // I know
              var i;
              for (i = 0; i < this.length; ++i) {
                  if (this[i] === o) {
                      return i;
                  }
              }
              return -1;
          };
      }

      function daysInMonth(year, month) {
          if (isNaN(year) || isNaN(month)) {
              return NaN;
          }
          var modMonth = mod(month, 12);
          year += (month - modMonth) / 12;
          return modMonth === 1 ? (isLeapYear(year) ? 29 : 28) : (31 - modMonth % 7 % 2);
      }

      // FORMATTING

      addFormatToken('M', ['MM', 2], 'Mo', function () {
          return this.month() + 1;
      });

      addFormatToken('MMM', 0, 0, function (format) {
          return this.localeData().monthsShort(this, format);
      });

      addFormatToken('MMMM', 0, 0, function (format) {
          return this.localeData().months(this, format);
      });

      // ALIASES

      addUnitAlias('month', 'M');

      // PRIORITY

      addUnitPriority('month', 8);

      // PARSING

      addRegexToken('M',    match1to2);
      addRegexToken('MM',   match1to2, match2);
      addRegexToken('MMM',  function (isStrict, locale) {
          return locale.monthsShortRegex(isStrict);
      });
      addRegexToken('MMMM', function (isStrict, locale) {
          return locale.monthsRegex(isStrict);
      });

      addParseToken(['M', 'MM'], function (input, array) {
          array[MONTH] = toInt(input) - 1;
      });

      addParseToken(['MMM', 'MMMM'], function (input, array, config, token) {
          var month = config._locale.monthsParse(input, token, config._strict);
          // if we didn't find a month name, mark the date as invalid.
          if (month != null) {
              array[MONTH] = month;
          } else {
              getParsingFlags(config).invalidMonth = input;
          }
      });

      // LOCALES

      var MONTHS_IN_FORMAT = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/;
      var defaultLocaleMonths = 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_');
      function localeMonths (m, format) {
          if (!m) {
              return isArray(this._months) ? this._months :
                  this._months['standalone'];
          }
          return isArray(this._months) ? this._months[m.month()] :
              this._months[(this._months.isFormat || MONTHS_IN_FORMAT).test(format) ? 'format' : 'standalone'][m.month()];
      }

      var defaultLocaleMonthsShort = 'Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec'.split('_');
      function localeMonthsShort (m, format) {
          if (!m) {
              return isArray(this._monthsShort) ? this._monthsShort :
                  this._monthsShort['standalone'];
          }
          return isArray(this._monthsShort) ? this._monthsShort[m.month()] :
              this._monthsShort[MONTHS_IN_FORMAT.test(format) ? 'format' : 'standalone'][m.month()];
      }

      function handleStrictParse(monthName, format, strict) {
          var i, ii, mom, llc = monthName.toLocaleLowerCase();
          if (!this._monthsParse) {
              // this is not used
              this._monthsParse = [];
              this._longMonthsParse = [];
              this._shortMonthsParse = [];
              for (i = 0; i < 12; ++i) {
                  mom = createUTC([2000, i]);
                  this._shortMonthsParse[i] = this.monthsShort(mom, '').toLocaleLowerCase();
                  this._longMonthsParse[i] = this.months(mom, '').toLocaleLowerCase();
              }
          }

          if (strict) {
              if (format === 'MMM') {
                  ii = indexOf.call(this._shortMonthsParse, llc);
                  return ii !== -1 ? ii : null;
              } else {
                  ii = indexOf.call(this._longMonthsParse, llc);
                  return ii !== -1 ? ii : null;
              }
          } else {
              if (format === 'MMM') {
                  ii = indexOf.call(this._shortMonthsParse, llc);
                  if (ii !== -1) {
                      return ii;
                  }
                  ii = indexOf.call(this._longMonthsParse, llc);
                  return ii !== -1 ? ii : null;
              } else {
                  ii = indexOf.call(this._longMonthsParse, llc);
                  if (ii !== -1) {
                      return ii;
                  }
                  ii = indexOf.call(this._shortMonthsParse, llc);
                  return ii !== -1 ? ii : null;
              }
          }
      }

      function localeMonthsParse (monthName, format, strict) {
          var i, mom, regex;

          if (this._monthsParseExact) {
              return handleStrictParse.call(this, monthName, format, strict);
          }

          if (!this._monthsParse) {
              this._monthsParse = [];
              this._longMonthsParse = [];
              this._shortMonthsParse = [];
          }

          // TODO: add sorting
          // Sorting makes sure if one month (or abbr) is a prefix of another
          // see sorting in computeMonthsParse
          for (i = 0; i < 12; i++) {
              // make the regex if we don't have it already
              mom = createUTC([2000, i]);
              if (strict && !this._longMonthsParse[i]) {
                  this._longMonthsParse[i] = new RegExp('^' + this.months(mom, '').replace('.', '') + '$', 'i');
                  this._shortMonthsParse[i] = new RegExp('^' + this.monthsShort(mom, '').replace('.', '') + '$', 'i');
              }
              if (!strict && !this._monthsParse[i]) {
                  regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                  this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
              }
              // test the regex
              if (strict && format === 'MMMM' && this._longMonthsParse[i].test(monthName)) {
                  return i;
              } else if (strict && format === 'MMM' && this._shortMonthsParse[i].test(monthName)) {
                  return i;
              } else if (!strict && this._monthsParse[i].test(monthName)) {
                  return i;
              }
          }
      }

      // MOMENTS

      function setMonth (mom, value) {
          var dayOfMonth;

          if (!mom.isValid()) {
              // No op
              return mom;
          }

          if (typeof value === 'string') {
              if (/^\d+$/.test(value)) {
                  value = toInt(value);
              } else {
                  value = mom.localeData().monthsParse(value);
                  // TODO: Another silent failure?
                  if (!isNumber(value)) {
                      return mom;
                  }
              }
          }

          dayOfMonth = Math.min(mom.date(), daysInMonth(mom.year(), value));
          mom._d['set' + (mom._isUTC ? 'UTC' : '') + 'Month'](value, dayOfMonth);
          return mom;
      }

      function getSetMonth (value) {
          if (value != null) {
              setMonth(this, value);
              hooks.updateOffset(this, true);
              return this;
          } else {
              return get(this, 'Month');
          }
      }

      function getDaysInMonth () {
          return daysInMonth(this.year(), this.month());
      }

      var defaultMonthsShortRegex = matchWord;
      function monthsShortRegex (isStrict) {
          if (this._monthsParseExact) {
              if (!hasOwnProp(this, '_monthsRegex')) {
                  computeMonthsParse.call(this);
              }
              if (isStrict) {
                  return this._monthsShortStrictRegex;
              } else {
                  return this._monthsShortRegex;
              }
          } else {
              if (!hasOwnProp(this, '_monthsShortRegex')) {
                  this._monthsShortRegex = defaultMonthsShortRegex;
              }
              return this._monthsShortStrictRegex && isStrict ?
                  this._monthsShortStrictRegex : this._monthsShortRegex;
          }
      }

      var defaultMonthsRegex = matchWord;
      function monthsRegex (isStrict) {
          if (this._monthsParseExact) {
              if (!hasOwnProp(this, '_monthsRegex')) {
                  computeMonthsParse.call(this);
              }
              if (isStrict) {
                  return this._monthsStrictRegex;
              } else {
                  return this._monthsRegex;
              }
          } else {
              if (!hasOwnProp(this, '_monthsRegex')) {
                  this._monthsRegex = defaultMonthsRegex;
              }
              return this._monthsStrictRegex && isStrict ?
                  this._monthsStrictRegex : this._monthsRegex;
          }
      }

      function computeMonthsParse () {
          function cmpLenRev(a, b) {
              return b.length - a.length;
          }

          var shortPieces = [], longPieces = [], mixedPieces = [],
              i, mom;
          for (i = 0; i < 12; i++) {
              // make the regex if we don't have it already
              mom = createUTC([2000, i]);
              shortPieces.push(this.monthsShort(mom, ''));
              longPieces.push(this.months(mom, ''));
              mixedPieces.push(this.months(mom, ''));
              mixedPieces.push(this.monthsShort(mom, ''));
          }
          // Sorting makes sure if one month (or abbr) is a prefix of another it
          // will match the longer piece.
          shortPieces.sort(cmpLenRev);
          longPieces.sort(cmpLenRev);
          mixedPieces.sort(cmpLenRev);
          for (i = 0; i < 12; i++) {
              shortPieces[i] = regexEscape(shortPieces[i]);
              longPieces[i] = regexEscape(longPieces[i]);
          }
          for (i = 0; i < 24; i++) {
              mixedPieces[i] = regexEscape(mixedPieces[i]);
          }

          this._monthsRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
          this._monthsShortRegex = this._monthsRegex;
          this._monthsStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
          this._monthsShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
      }

      function createDate (y, m, d, h, M, s, ms) {
          // can't just apply() to create a date:
          // https://stackoverflow.com/q/181348
          var date;
          // the date constructor remaps years 0-99 to 1900-1999
          if (y < 100 && y >= 0) {
              // preserve leap years using a full 400 year cycle, then reset
              date = new Date(y + 400, m, d, h, M, s, ms);
              if (isFinite(date.getFullYear())) {
                  date.setFullYear(y);
              }
          } else {
              date = new Date(y, m, d, h, M, s, ms);
          }

          return date;
      }

      function createUTCDate (y) {
          var date;
          // the Date.UTC function remaps years 0-99 to 1900-1999
          if (y < 100 && y >= 0) {
              var args = Array.prototype.slice.call(arguments);
              // preserve leap years using a full 400 year cycle, then reset
              args[0] = y + 400;
              date = new Date(Date.UTC.apply(null, args));
              if (isFinite(date.getUTCFullYear())) {
                  date.setUTCFullYear(y);
              }
          } else {
              date = new Date(Date.UTC.apply(null, arguments));
          }

          return date;
      }

      // start-of-first-week - start-of-year
      function firstWeekOffset(year, dow, doy) {
          var // first-week day -- which january is always in the first week (4 for iso, 1 for other)
              fwd = 7 + dow - doy,
              // first-week day local weekday -- which local weekday is fwd
              fwdlw = (7 + createUTCDate(year, 0, fwd).getUTCDay() - dow) % 7;

          return -fwdlw + fwd - 1;
      }

      // https://en.wikipedia.org/wiki/ISO_week_date#Calculating_a_date_given_the_year.2C_week_number_and_weekday
      function dayOfYearFromWeeks(year, week, weekday, dow, doy) {
          var localWeekday = (7 + weekday - dow) % 7,
              weekOffset = firstWeekOffset(year, dow, doy),
              dayOfYear = 1 + 7 * (week - 1) + localWeekday + weekOffset,
              resYear, resDayOfYear;

          if (dayOfYear <= 0) {
              resYear = year - 1;
              resDayOfYear = daysInYear(resYear) + dayOfYear;
          } else if (dayOfYear > daysInYear(year)) {
              resYear = year + 1;
              resDayOfYear = dayOfYear - daysInYear(year);
          } else {
              resYear = year;
              resDayOfYear = dayOfYear;
          }

          return {
              year: resYear,
              dayOfYear: resDayOfYear
          };
      }

      function weekOfYear(mom, dow, doy) {
          var weekOffset = firstWeekOffset(mom.year(), dow, doy),
              week = Math.floor((mom.dayOfYear() - weekOffset - 1) / 7) + 1,
              resWeek, resYear;

          if (week < 1) {
              resYear = mom.year() - 1;
              resWeek = week + weeksInYear(resYear, dow, doy);
          } else if (week > weeksInYear(mom.year(), dow, doy)) {
              resWeek = week - weeksInYear(mom.year(), dow, doy);
              resYear = mom.year() + 1;
          } else {
              resYear = mom.year();
              resWeek = week;
          }

          return {
              week: resWeek,
              year: resYear
          };
      }

      function weeksInYear(year, dow, doy) {
          var weekOffset = firstWeekOffset(year, dow, doy),
              weekOffsetNext = firstWeekOffset(year + 1, dow, doy);
          return (daysInYear(year) - weekOffset + weekOffsetNext) / 7;
      }

      // FORMATTING

      addFormatToken('w', ['ww', 2], 'wo', 'week');
      addFormatToken('W', ['WW', 2], 'Wo', 'isoWeek');

      // ALIASES

      addUnitAlias('week', 'w');
      addUnitAlias('isoWeek', 'W');

      // PRIORITIES

      addUnitPriority('week', 5);
      addUnitPriority('isoWeek', 5);

      // PARSING

      addRegexToken('w',  match1to2);
      addRegexToken('ww', match1to2, match2);
      addRegexToken('W',  match1to2);
      addRegexToken('WW', match1to2, match2);

      addWeekParseToken(['w', 'ww', 'W', 'WW'], function (input, week, config, token) {
          week[token.substr(0, 1)] = toInt(input);
      });

      // HELPERS

      // LOCALES

      function localeWeek (mom) {
          return weekOfYear(mom, this._week.dow, this._week.doy).week;
      }

      var defaultLocaleWeek = {
          dow : 0, // Sunday is the first day of the week.
          doy : 6  // The week that contains Jan 6th is the first week of the year.
      };

      function localeFirstDayOfWeek () {
          return this._week.dow;
      }

      function localeFirstDayOfYear () {
          return this._week.doy;
      }

      // MOMENTS

      function getSetWeek (input) {
          var week = this.localeData().week(this);
          return input == null ? week : this.add((input - week) * 7, 'd');
      }

      function getSetISOWeek (input) {
          var week = weekOfYear(this, 1, 4).week;
          return input == null ? week : this.add((input - week) * 7, 'd');
      }

      // FORMATTING

      addFormatToken('d', 0, 'do', 'day');

      addFormatToken('dd', 0, 0, function (format) {
          return this.localeData().weekdaysMin(this, format);
      });

      addFormatToken('ddd', 0, 0, function (format) {
          return this.localeData().weekdaysShort(this, format);
      });

      addFormatToken('dddd', 0, 0, function (format) {
          return this.localeData().weekdays(this, format);
      });

      addFormatToken('e', 0, 0, 'weekday');
      addFormatToken('E', 0, 0, 'isoWeekday');

      // ALIASES

      addUnitAlias('day', 'd');
      addUnitAlias('weekday', 'e');
      addUnitAlias('isoWeekday', 'E');

      // PRIORITY
      addUnitPriority('day', 11);
      addUnitPriority('weekday', 11);
      addUnitPriority('isoWeekday', 11);

      // PARSING

      addRegexToken('d',    match1to2);
      addRegexToken('e',    match1to2);
      addRegexToken('E',    match1to2);
      addRegexToken('dd',   function (isStrict, locale) {
          return locale.weekdaysMinRegex(isStrict);
      });
      addRegexToken('ddd',   function (isStrict, locale) {
          return locale.weekdaysShortRegex(isStrict);
      });
      addRegexToken('dddd',   function (isStrict, locale) {
          return locale.weekdaysRegex(isStrict);
      });

      addWeekParseToken(['dd', 'ddd', 'dddd'], function (input, week, config, token) {
          var weekday = config._locale.weekdaysParse(input, token, config._strict);
          // if we didn't get a weekday name, mark the date as invalid
          if (weekday != null) {
              week.d = weekday;
          } else {
              getParsingFlags(config).invalidWeekday = input;
          }
      });

      addWeekParseToken(['d', 'e', 'E'], function (input, week, config, token) {
          week[token] = toInt(input);
      });

      // HELPERS

      function parseWeekday(input, locale) {
          if (typeof input !== 'string') {
              return input;
          }

          if (!isNaN(input)) {
              return parseInt(input, 10);
          }

          input = locale.weekdaysParse(input);
          if (typeof input === 'number') {
              return input;
          }

          return null;
      }

      function parseIsoWeekday(input, locale) {
          if (typeof input === 'string') {
              return locale.weekdaysParse(input) % 7 || 7;
          }
          return isNaN(input) ? null : input;
      }

      // LOCALES
      function shiftWeekdays (ws, n) {
          return ws.slice(n, 7).concat(ws.slice(0, n));
      }

      var defaultLocaleWeekdays = 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_');
      function localeWeekdays (m, format) {
          var weekdays = isArray(this._weekdays) ? this._weekdays :
              this._weekdays[(m && m !== true && this._weekdays.isFormat.test(format)) ? 'format' : 'standalone'];
          return (m === true) ? shiftWeekdays(weekdays, this._week.dow)
              : (m) ? weekdays[m.day()] : weekdays;
      }

      var defaultLocaleWeekdaysShort = 'Sun_Mon_Tue_Wed_Thu_Fri_Sat'.split('_');
      function localeWeekdaysShort (m) {
          return (m === true) ? shiftWeekdays(this._weekdaysShort, this._week.dow)
              : (m) ? this._weekdaysShort[m.day()] : this._weekdaysShort;
      }

      var defaultLocaleWeekdaysMin = 'Su_Mo_Tu_We_Th_Fr_Sa'.split('_');
      function localeWeekdaysMin (m) {
          return (m === true) ? shiftWeekdays(this._weekdaysMin, this._week.dow)
              : (m) ? this._weekdaysMin[m.day()] : this._weekdaysMin;
      }

      function handleStrictParse$1(weekdayName, format, strict) {
          var i, ii, mom, llc = weekdayName.toLocaleLowerCase();
          if (!this._weekdaysParse) {
              this._weekdaysParse = [];
              this._shortWeekdaysParse = [];
              this._minWeekdaysParse = [];

              for (i = 0; i < 7; ++i) {
                  mom = createUTC([2000, 1]).day(i);
                  this._minWeekdaysParse[i] = this.weekdaysMin(mom, '').toLocaleLowerCase();
                  this._shortWeekdaysParse[i] = this.weekdaysShort(mom, '').toLocaleLowerCase();
                  this._weekdaysParse[i] = this.weekdays(mom, '').toLocaleLowerCase();
              }
          }

          if (strict) {
              if (format === 'dddd') {
                  ii = indexOf.call(this._weekdaysParse, llc);
                  return ii !== -1 ? ii : null;
              } else if (format === 'ddd') {
                  ii = indexOf.call(this._shortWeekdaysParse, llc);
                  return ii !== -1 ? ii : null;
              } else {
                  ii = indexOf.call(this._minWeekdaysParse, llc);
                  return ii !== -1 ? ii : null;
              }
          } else {
              if (format === 'dddd') {
                  ii = indexOf.call(this._weekdaysParse, llc);
                  if (ii !== -1) {
                      return ii;
                  }
                  ii = indexOf.call(this._shortWeekdaysParse, llc);
                  if (ii !== -1) {
                      return ii;
                  }
                  ii = indexOf.call(this._minWeekdaysParse, llc);
                  return ii !== -1 ? ii : null;
              } else if (format === 'ddd') {
                  ii = indexOf.call(this._shortWeekdaysParse, llc);
                  if (ii !== -1) {
                      return ii;
                  }
                  ii = indexOf.call(this._weekdaysParse, llc);
                  if (ii !== -1) {
                      return ii;
                  }
                  ii = indexOf.call(this._minWeekdaysParse, llc);
                  return ii !== -1 ? ii : null;
              } else {
                  ii = indexOf.call(this._minWeekdaysParse, llc);
                  if (ii !== -1) {
                      return ii;
                  }
                  ii = indexOf.call(this._weekdaysParse, llc);
                  if (ii !== -1) {
                      return ii;
                  }
                  ii = indexOf.call(this._shortWeekdaysParse, llc);
                  return ii !== -1 ? ii : null;
              }
          }
      }

      function localeWeekdaysParse (weekdayName, format, strict) {
          var i, mom, regex;

          if (this._weekdaysParseExact) {
              return handleStrictParse$1.call(this, weekdayName, format, strict);
          }

          if (!this._weekdaysParse) {
              this._weekdaysParse = [];
              this._minWeekdaysParse = [];
              this._shortWeekdaysParse = [];
              this._fullWeekdaysParse = [];
          }

          for (i = 0; i < 7; i++) {
              // make the regex if we don't have it already

              mom = createUTC([2000, 1]).day(i);
              if (strict && !this._fullWeekdaysParse[i]) {
                  this._fullWeekdaysParse[i] = new RegExp('^' + this.weekdays(mom, '').replace('.', '\\.?') + '$', 'i');
                  this._shortWeekdaysParse[i] = new RegExp('^' + this.weekdaysShort(mom, '').replace('.', '\\.?') + '$', 'i');
                  this._minWeekdaysParse[i] = new RegExp('^' + this.weekdaysMin(mom, '').replace('.', '\\.?') + '$', 'i');
              }
              if (!this._weekdaysParse[i]) {
                  regex = '^' + this.weekdays(mom, '') + '|^' + this.weekdaysShort(mom, '') + '|^' + this.weekdaysMin(mom, '');
                  this._weekdaysParse[i] = new RegExp(regex.replace('.', ''), 'i');
              }
              // test the regex
              if (strict && format === 'dddd' && this._fullWeekdaysParse[i].test(weekdayName)) {
                  return i;
              } else if (strict && format === 'ddd' && this._shortWeekdaysParse[i].test(weekdayName)) {
                  return i;
              } else if (strict && format === 'dd' && this._minWeekdaysParse[i].test(weekdayName)) {
                  return i;
              } else if (!strict && this._weekdaysParse[i].test(weekdayName)) {
                  return i;
              }
          }
      }

      // MOMENTS

      function getSetDayOfWeek (input) {
          if (!this.isValid()) {
              return input != null ? this : NaN;
          }
          var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
          if (input != null) {
              input = parseWeekday(input, this.localeData());
              return this.add(input - day, 'd');
          } else {
              return day;
          }
      }

      function getSetLocaleDayOfWeek (input) {
          if (!this.isValid()) {
              return input != null ? this : NaN;
          }
          var weekday = (this.day() + 7 - this.localeData()._week.dow) % 7;
          return input == null ? weekday : this.add(input - weekday, 'd');
      }

      function getSetISODayOfWeek (input) {
          if (!this.isValid()) {
              return input != null ? this : NaN;
          }

          // behaves the same as moment#day except
          // as a getter, returns 7 instead of 0 (1-7 range instead of 0-6)
          // as a setter, sunday should belong to the previous week.

          if (input != null) {
              var weekday = parseIsoWeekday(input, this.localeData());
              return this.day(this.day() % 7 ? weekday : weekday - 7);
          } else {
              return this.day() || 7;
          }
      }

      var defaultWeekdaysRegex = matchWord;
      function weekdaysRegex (isStrict) {
          if (this._weekdaysParseExact) {
              if (!hasOwnProp(this, '_weekdaysRegex')) {
                  computeWeekdaysParse.call(this);
              }
              if (isStrict) {
                  return this._weekdaysStrictRegex;
              } else {
                  return this._weekdaysRegex;
              }
          } else {
              if (!hasOwnProp(this, '_weekdaysRegex')) {
                  this._weekdaysRegex = defaultWeekdaysRegex;
              }
              return this._weekdaysStrictRegex && isStrict ?
                  this._weekdaysStrictRegex : this._weekdaysRegex;
          }
      }

      var defaultWeekdaysShortRegex = matchWord;
      function weekdaysShortRegex (isStrict) {
          if (this._weekdaysParseExact) {
              if (!hasOwnProp(this, '_weekdaysRegex')) {
                  computeWeekdaysParse.call(this);
              }
              if (isStrict) {
                  return this._weekdaysShortStrictRegex;
              } else {
                  return this._weekdaysShortRegex;
              }
          } else {
              if (!hasOwnProp(this, '_weekdaysShortRegex')) {
                  this._weekdaysShortRegex = defaultWeekdaysShortRegex;
              }
              return this._weekdaysShortStrictRegex && isStrict ?
                  this._weekdaysShortStrictRegex : this._weekdaysShortRegex;
          }
      }

      var defaultWeekdaysMinRegex = matchWord;
      function weekdaysMinRegex (isStrict) {
          if (this._weekdaysParseExact) {
              if (!hasOwnProp(this, '_weekdaysRegex')) {
                  computeWeekdaysParse.call(this);
              }
              if (isStrict) {
                  return this._weekdaysMinStrictRegex;
              } else {
                  return this._weekdaysMinRegex;
              }
          } else {
              if (!hasOwnProp(this, '_weekdaysMinRegex')) {
                  this._weekdaysMinRegex = defaultWeekdaysMinRegex;
              }
              return this._weekdaysMinStrictRegex && isStrict ?
                  this._weekdaysMinStrictRegex : this._weekdaysMinRegex;
          }
      }


      function computeWeekdaysParse () {
          function cmpLenRev(a, b) {
              return b.length - a.length;
          }

          var minPieces = [], shortPieces = [], longPieces = [], mixedPieces = [],
              i, mom, minp, shortp, longp;
          for (i = 0; i < 7; i++) {
              // make the regex if we don't have it already
              mom = createUTC([2000, 1]).day(i);
              minp = this.weekdaysMin(mom, '');
              shortp = this.weekdaysShort(mom, '');
              longp = this.weekdays(mom, '');
              minPieces.push(minp);
              shortPieces.push(shortp);
              longPieces.push(longp);
              mixedPieces.push(minp);
              mixedPieces.push(shortp);
              mixedPieces.push(longp);
          }
          // Sorting makes sure if one weekday (or abbr) is a prefix of another it
          // will match the longer piece.
          minPieces.sort(cmpLenRev);
          shortPieces.sort(cmpLenRev);
          longPieces.sort(cmpLenRev);
          mixedPieces.sort(cmpLenRev);
          for (i = 0; i < 7; i++) {
              shortPieces[i] = regexEscape(shortPieces[i]);
              longPieces[i] = regexEscape(longPieces[i]);
              mixedPieces[i] = regexEscape(mixedPieces[i]);
          }

          this._weekdaysRegex = new RegExp('^(' + mixedPieces.join('|') + ')', 'i');
          this._weekdaysShortRegex = this._weekdaysRegex;
          this._weekdaysMinRegex = this._weekdaysRegex;

          this._weekdaysStrictRegex = new RegExp('^(' + longPieces.join('|') + ')', 'i');
          this._weekdaysShortStrictRegex = new RegExp('^(' + shortPieces.join('|') + ')', 'i');
          this._weekdaysMinStrictRegex = new RegExp('^(' + minPieces.join('|') + ')', 'i');
      }

      // FORMATTING

      function hFormat() {
          return this.hours() % 12 || 12;
      }

      function kFormat() {
          return this.hours() || 24;
      }

      addFormatToken('H', ['HH', 2], 0, 'hour');
      addFormatToken('h', ['hh', 2], 0, hFormat);
      addFormatToken('k', ['kk', 2], 0, kFormat);

      addFormatToken('hmm', 0, 0, function () {
          return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2);
      });

      addFormatToken('hmmss', 0, 0, function () {
          return '' + hFormat.apply(this) + zeroFill(this.minutes(), 2) +
              zeroFill(this.seconds(), 2);
      });

      addFormatToken('Hmm', 0, 0, function () {
          return '' + this.hours() + zeroFill(this.minutes(), 2);
      });

      addFormatToken('Hmmss', 0, 0, function () {
          return '' + this.hours() + zeroFill(this.minutes(), 2) +
              zeroFill(this.seconds(), 2);
      });

      function meridiem (token, lowercase) {
          addFormatToken(token, 0, 0, function () {
              return this.localeData().meridiem(this.hours(), this.minutes(), lowercase);
          });
      }

      meridiem('a', true);
      meridiem('A', false);

      // ALIASES

      addUnitAlias('hour', 'h');

      // PRIORITY
      addUnitPriority('hour', 13);

      // PARSING

      function matchMeridiem (isStrict, locale) {
          return locale._meridiemParse;
      }

      addRegexToken('a',  matchMeridiem);
      addRegexToken('A',  matchMeridiem);
      addRegexToken('H',  match1to2);
      addRegexToken('h',  match1to2);
      addRegexToken('k',  match1to2);
      addRegexToken('HH', match1to2, match2);
      addRegexToken('hh', match1to2, match2);
      addRegexToken('kk', match1to2, match2);

      addRegexToken('hmm', match3to4);
      addRegexToken('hmmss', match5to6);
      addRegexToken('Hmm', match3to4);
      addRegexToken('Hmmss', match5to6);

      addParseToken(['H', 'HH'], HOUR);
      addParseToken(['k', 'kk'], function (input, array, config) {
          var kInput = toInt(input);
          array[HOUR] = kInput === 24 ? 0 : kInput;
      });
      addParseToken(['a', 'A'], function (input, array, config) {
          config._isPm = config._locale.isPM(input);
          config._meridiem = input;
      });
      addParseToken(['h', 'hh'], function (input, array, config) {
          array[HOUR] = toInt(input);
          getParsingFlags(config).bigHour = true;
      });
      addParseToken('hmm', function (input, array, config) {
          var pos = input.length - 2;
          array[HOUR] = toInt(input.substr(0, pos));
          array[MINUTE] = toInt(input.substr(pos));
          getParsingFlags(config).bigHour = true;
      });
      addParseToken('hmmss', function (input, array, config) {
          var pos1 = input.length - 4;
          var pos2 = input.length - 2;
          array[HOUR] = toInt(input.substr(0, pos1));
          array[MINUTE] = toInt(input.substr(pos1, 2));
          array[SECOND] = toInt(input.substr(pos2));
          getParsingFlags(config).bigHour = true;
      });
      addParseToken('Hmm', function (input, array, config) {
          var pos = input.length - 2;
          array[HOUR] = toInt(input.substr(0, pos));
          array[MINUTE] = toInt(input.substr(pos));
      });
      addParseToken('Hmmss', function (input, array, config) {
          var pos1 = input.length - 4;
          var pos2 = input.length - 2;
          array[HOUR] = toInt(input.substr(0, pos1));
          array[MINUTE] = toInt(input.substr(pos1, 2));
          array[SECOND] = toInt(input.substr(pos2));
      });

      // LOCALES

      function localeIsPM (input) {
          // IE8 Quirks Mode & IE7 Standards Mode do not allow accessing strings like arrays
          // Using charAt should be more compatible.
          return ((input + '').toLowerCase().charAt(0) === 'p');
      }

      var defaultLocaleMeridiemParse = /[ap]\.?m?\.?/i;
      function localeMeridiem (hours, minutes, isLower) {
          if (hours > 11) {
              return isLower ? 'pm' : 'PM';
          } else {
              return isLower ? 'am' : 'AM';
          }
      }


      // MOMENTS

      // Setting the hour should keep the time, because the user explicitly
      // specified which hour they want. So trying to maintain the same hour (in
      // a new timezone) makes sense. Adding/subtracting hours does not follow
      // this rule.
      var getSetHour = makeGetSet('Hours', true);

      var baseConfig = {
          calendar: defaultCalendar,
          longDateFormat: defaultLongDateFormat,
          invalidDate: defaultInvalidDate,
          ordinal: defaultOrdinal,
          dayOfMonthOrdinalParse: defaultDayOfMonthOrdinalParse,
          relativeTime: defaultRelativeTime,

          months: defaultLocaleMonths,
          monthsShort: defaultLocaleMonthsShort,

          week: defaultLocaleWeek,

          weekdays: defaultLocaleWeekdays,
          weekdaysMin: defaultLocaleWeekdaysMin,
          weekdaysShort: defaultLocaleWeekdaysShort,

          meridiemParse: defaultLocaleMeridiemParse
      };

      // internal storage for locale config files
      var locales = {};
      var localeFamilies = {};
      var globalLocale;

      function normalizeLocale(key) {
          return key ? key.toLowerCase().replace('_', '-') : key;
      }

      // pick the locale from the array
      // try ['en-au', 'en-gb'] as 'en-au', 'en-gb', 'en', as in move through the list trying each
      // substring from most specific to least, but move to the next array item if it's a more specific variant than the current root
      function chooseLocale(names) {
          var i = 0, j, next, locale, split;

          while (i < names.length) {
              split = normalizeLocale(names[i]).split('-');
              j = split.length;
              next = normalizeLocale(names[i + 1]);
              next = next ? next.split('-') : null;
              while (j > 0) {
                  locale = loadLocale(split.slice(0, j).join('-'));
                  if (locale) {
                      return locale;
                  }
                  if (next && next.length >= j && compareArrays(split, next, true) >= j - 1) {
                      //the next array item is better than a shallower substring of this one
                      break;
                  }
                  j--;
              }
              i++;
          }
          return globalLocale;
      }

      function loadLocale(name) {
          var oldLocale = null;
          // TODO: Find a better way to register and load all the locales in Node
          if (!locales[name] && ('object' !== 'undefined') &&
                  module && module.exports) {
              try {
                  oldLocale = globalLocale._abbr;
                  var aliasedRequire = commonjsRequire;
                  aliasedRequire('./locale/' + name);
                  getSetGlobalLocale(oldLocale);
              } catch (e) {}
          }
          return locales[name];
      }

      // This function will load locale and then set the global locale.  If
      // no arguments are passed in, it will simply return the current global
      // locale key.
      function getSetGlobalLocale (key, values) {
          var data;
          if (key) {
              if (isUndefined(values)) {
                  data = getLocale(key);
              }
              else {
                  data = defineLocale(key, values);
              }

              if (data) {
                  // moment.duration._locale = moment._locale = data;
                  globalLocale = data;
              }
              else {
                  if ((typeof console !==  'undefined') && console.warn) {
                      //warn user if arguments are passed but the locale could not be set
                      console.warn('Locale ' + key +  ' not found. Did you forget to load it?');
                  }
              }
          }

          return globalLocale._abbr;
      }

      function defineLocale (name, config) {
          if (config !== null) {
              var locale, parentConfig = baseConfig;
              config.abbr = name;
              if (locales[name] != null) {
                  deprecateSimple('defineLocaleOverride',
                          'use moment.updateLocale(localeName, config) to change ' +
                          'an existing locale. moment.defineLocale(localeName, ' +
                          'config) should only be used for creating a new locale ' +
                          'See http://momentjs.com/guides/#/warnings/define-locale/ for more info.');
                  parentConfig = locales[name]._config;
              } else if (config.parentLocale != null) {
                  if (locales[config.parentLocale] != null) {
                      parentConfig = locales[config.parentLocale]._config;
                  } else {
                      locale = loadLocale(config.parentLocale);
                      if (locale != null) {
                          parentConfig = locale._config;
                      } else {
                          if (!localeFamilies[config.parentLocale]) {
                              localeFamilies[config.parentLocale] = [];
                          }
                          localeFamilies[config.parentLocale].push({
                              name: name,
                              config: config
                          });
                          return null;
                      }
                  }
              }
              locales[name] = new Locale(mergeConfigs(parentConfig, config));

              if (localeFamilies[name]) {
                  localeFamilies[name].forEach(function (x) {
                      defineLocale(x.name, x.config);
                  });
              }

              // backwards compat for now: also set the locale
              // make sure we set the locale AFTER all child locales have been
              // created, so we won't end up with the child locale set.
              getSetGlobalLocale(name);


              return locales[name];
          } else {
              // useful for testing
              delete locales[name];
              return null;
          }
      }

      function updateLocale(name, config) {
          if (config != null) {
              var locale, tmpLocale, parentConfig = baseConfig;
              // MERGE
              tmpLocale = loadLocale(name);
              if (tmpLocale != null) {
                  parentConfig = tmpLocale._config;
              }
              config = mergeConfigs(parentConfig, config);
              locale = new Locale(config);
              locale.parentLocale = locales[name];
              locales[name] = locale;

              // backwards compat for now: also set the locale
              getSetGlobalLocale(name);
          } else {
              // pass null for config to unupdate, useful for tests
              if (locales[name] != null) {
                  if (locales[name].parentLocale != null) {
                      locales[name] = locales[name].parentLocale;
                  } else if (locales[name] != null) {
                      delete locales[name];
                  }
              }
          }
          return locales[name];
      }

      // returns locale data
      function getLocale (key) {
          var locale;

          if (key && key._locale && key._locale._abbr) {
              key = key._locale._abbr;
          }

          if (!key) {
              return globalLocale;
          }

          if (!isArray(key)) {
              //short-circuit everything else
              locale = loadLocale(key);
              if (locale) {
                  return locale;
              }
              key = [key];
          }

          return chooseLocale(key);
      }

      function listLocales() {
          return keys(locales);
      }

      function checkOverflow (m) {
          var overflow;
          var a = m._a;

          if (a && getParsingFlags(m).overflow === -2) {
              overflow =
                  a[MONTH]       < 0 || a[MONTH]       > 11  ? MONTH :
                  a[DATE]        < 1 || a[DATE]        > daysInMonth(a[YEAR], a[MONTH]) ? DATE :
                  a[HOUR]        < 0 || a[HOUR]        > 24 || (a[HOUR] === 24 && (a[MINUTE] !== 0 || a[SECOND] !== 0 || a[MILLISECOND] !== 0)) ? HOUR :
                  a[MINUTE]      < 0 || a[MINUTE]      > 59  ? MINUTE :
                  a[SECOND]      < 0 || a[SECOND]      > 59  ? SECOND :
                  a[MILLISECOND] < 0 || a[MILLISECOND] > 999 ? MILLISECOND :
                  -1;

              if (getParsingFlags(m)._overflowDayOfYear && (overflow < YEAR || overflow > DATE)) {
                  overflow = DATE;
              }
              if (getParsingFlags(m)._overflowWeeks && overflow === -1) {
                  overflow = WEEK;
              }
              if (getParsingFlags(m)._overflowWeekday && overflow === -1) {
                  overflow = WEEKDAY;
              }

              getParsingFlags(m).overflow = overflow;
          }

          return m;
      }

      // Pick the first defined of two or three arguments.
      function defaults(a, b, c) {
          if (a != null) {
              return a;
          }
          if (b != null) {
              return b;
          }
          return c;
      }

      function currentDateArray(config) {
          // hooks is actually the exported moment object
          var nowValue = new Date(hooks.now());
          if (config._useUTC) {
              return [nowValue.getUTCFullYear(), nowValue.getUTCMonth(), nowValue.getUTCDate()];
          }
          return [nowValue.getFullYear(), nowValue.getMonth(), nowValue.getDate()];
      }

      // convert an array to a date.
      // the array should mirror the parameters below
      // note: all values past the year are optional and will default to the lowest possible value.
      // [year, month, day , hour, minute, second, millisecond]
      function configFromArray (config) {
          var i, date, input = [], currentDate, expectedWeekday, yearToUse;

          if (config._d) {
              return;
          }

          currentDate = currentDateArray(config);

          //compute day of the year from weeks and weekdays
          if (config._w && config._a[DATE] == null && config._a[MONTH] == null) {
              dayOfYearFromWeekInfo(config);
          }

          //if the day of the year is set, figure out what it is
          if (config._dayOfYear != null) {
              yearToUse = defaults(config._a[YEAR], currentDate[YEAR]);

              if (config._dayOfYear > daysInYear(yearToUse) || config._dayOfYear === 0) {
                  getParsingFlags(config)._overflowDayOfYear = true;
              }

              date = createUTCDate(yearToUse, 0, config._dayOfYear);
              config._a[MONTH] = date.getUTCMonth();
              config._a[DATE] = date.getUTCDate();
          }

          // Default to current date.
          // * if no year, month, day of month are given, default to today
          // * if day of month is given, default month and year
          // * if month is given, default only year
          // * if year is given, don't default anything
          for (i = 0; i < 3 && config._a[i] == null; ++i) {
              config._a[i] = input[i] = currentDate[i];
          }

          // Zero out whatever was not defaulted, including time
          for (; i < 7; i++) {
              config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
          }

          // Check for 24:00:00.000
          if (config._a[HOUR] === 24 &&
                  config._a[MINUTE] === 0 &&
                  config._a[SECOND] === 0 &&
                  config._a[MILLISECOND] === 0) {
              config._nextDay = true;
              config._a[HOUR] = 0;
          }

          config._d = (config._useUTC ? createUTCDate : createDate).apply(null, input);
          expectedWeekday = config._useUTC ? config._d.getUTCDay() : config._d.getDay();

          // Apply timezone offset from input. The actual utcOffset can be changed
          // with parseZone.
          if (config._tzm != null) {
              config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);
          }

          if (config._nextDay) {
              config._a[HOUR] = 24;
          }

          // check for mismatching day of week
          if (config._w && typeof config._w.d !== 'undefined' && config._w.d !== expectedWeekday) {
              getParsingFlags(config).weekdayMismatch = true;
          }
      }

      function dayOfYearFromWeekInfo(config) {
          var w, weekYear, week, weekday, dow, doy, temp, weekdayOverflow;

          w = config._w;
          if (w.GG != null || w.W != null || w.E != null) {
              dow = 1;
              doy = 4;

              // TODO: We need to take the current isoWeekYear, but that depends on
              // how we interpret now (local, utc, fixed offset). So create
              // a now version of current config (take local/utc/offset flags, and
              // create now).
              weekYear = defaults(w.GG, config._a[YEAR], weekOfYear(createLocal(), 1, 4).year);
              week = defaults(w.W, 1);
              weekday = defaults(w.E, 1);
              if (weekday < 1 || weekday > 7) {
                  weekdayOverflow = true;
              }
          } else {
              dow = config._locale._week.dow;
              doy = config._locale._week.doy;

              var curWeek = weekOfYear(createLocal(), dow, doy);

              weekYear = defaults(w.gg, config._a[YEAR], curWeek.year);

              // Default to current week.
              week = defaults(w.w, curWeek.week);

              if (w.d != null) {
                  // weekday -- low day numbers are considered next week
                  weekday = w.d;
                  if (weekday < 0 || weekday > 6) {
                      weekdayOverflow = true;
                  }
              } else if (w.e != null) {
                  // local weekday -- counting starts from beginning of week
                  weekday = w.e + dow;
                  if (w.e < 0 || w.e > 6) {
                      weekdayOverflow = true;
                  }
              } else {
                  // default to beginning of week
                  weekday = dow;
              }
          }
          if (week < 1 || week > weeksInYear(weekYear, dow, doy)) {
              getParsingFlags(config)._overflowWeeks = true;
          } else if (weekdayOverflow != null) {
              getParsingFlags(config)._overflowWeekday = true;
          } else {
              temp = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy);
              config._a[YEAR] = temp.year;
              config._dayOfYear = temp.dayOfYear;
          }
      }

      // iso 8601 regex
      // 0000-00-00 0000-W00 or 0000-W00-0 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000 or +00)
      var extendedIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;
      var basicIsoRegex = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/;

      var tzRegex = /Z|[+-]\d\d(?::?\d\d)?/;

      var isoDates = [
          ['YYYYYY-MM-DD', /[+-]\d{6}-\d\d-\d\d/],
          ['YYYY-MM-DD', /\d{4}-\d\d-\d\d/],
          ['GGGG-[W]WW-E', /\d{4}-W\d\d-\d/],
          ['GGGG-[W]WW', /\d{4}-W\d\d/, false],
          ['YYYY-DDD', /\d{4}-\d{3}/],
          ['YYYY-MM', /\d{4}-\d\d/, false],
          ['YYYYYYMMDD', /[+-]\d{10}/],
          ['YYYYMMDD', /\d{8}/],
          // YYYYMM is NOT allowed by the standard
          ['GGGG[W]WWE', /\d{4}W\d{3}/],
          ['GGGG[W]WW', /\d{4}W\d{2}/, false],
          ['YYYYDDD', /\d{7}/]
      ];

      // iso time formats and regexes
      var isoTimes = [
          ['HH:mm:ss.SSSS', /\d\d:\d\d:\d\d\.\d+/],
          ['HH:mm:ss,SSSS', /\d\d:\d\d:\d\d,\d+/],
          ['HH:mm:ss', /\d\d:\d\d:\d\d/],
          ['HH:mm', /\d\d:\d\d/],
          ['HHmmss.SSSS', /\d\d\d\d\d\d\.\d+/],
          ['HHmmss,SSSS', /\d\d\d\d\d\d,\d+/],
          ['HHmmss', /\d\d\d\d\d\d/],
          ['HHmm', /\d\d\d\d/],
          ['HH', /\d\d/]
      ];

      var aspNetJsonRegex = /^\/?Date\((\-?\d+)/i;

      // date from iso format
      function configFromISO(config) {
          var i, l,
              string = config._i,
              match = extendedIsoRegex.exec(string) || basicIsoRegex.exec(string),
              allowTime, dateFormat, timeFormat, tzFormat;

          if (match) {
              getParsingFlags(config).iso = true;

              for (i = 0, l = isoDates.length; i < l; i++) {
                  if (isoDates[i][1].exec(match[1])) {
                      dateFormat = isoDates[i][0];
                      allowTime = isoDates[i][2] !== false;
                      break;
                  }
              }
              if (dateFormat == null) {
                  config._isValid = false;
                  return;
              }
              if (match[3]) {
                  for (i = 0, l = isoTimes.length; i < l; i++) {
                      if (isoTimes[i][1].exec(match[3])) {
                          // match[2] should be 'T' or space
                          timeFormat = (match[2] || ' ') + isoTimes[i][0];
                          break;
                      }
                  }
                  if (timeFormat == null) {
                      config._isValid = false;
                      return;
                  }
              }
              if (!allowTime && timeFormat != null) {
                  config._isValid = false;
                  return;
              }
              if (match[4]) {
                  if (tzRegex.exec(match[4])) {
                      tzFormat = 'Z';
                  } else {
                      config._isValid = false;
                      return;
                  }
              }
              config._f = dateFormat + (timeFormat || '') + (tzFormat || '');
              configFromStringAndFormat(config);
          } else {
              config._isValid = false;
          }
      }

      // RFC 2822 regex: For details see https://tools.ietf.org/html/rfc2822#section-3.3
      var rfc2822 = /^(?:(Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d{1,2})\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{2,4})\s(\d\d):(\d\d)(?::(\d\d))?\s(?:(UT|GMT|[ECMP][SD]T)|([Zz])|([+-]\d{4}))$/;

      function extractFromRFC2822Strings(yearStr, monthStr, dayStr, hourStr, minuteStr, secondStr) {
          var result = [
              untruncateYear(yearStr),
              defaultLocaleMonthsShort.indexOf(monthStr),
              parseInt(dayStr, 10),
              parseInt(hourStr, 10),
              parseInt(minuteStr, 10)
          ];

          if (secondStr) {
              result.push(parseInt(secondStr, 10));
          }

          return result;
      }

      function untruncateYear(yearStr) {
          var year = parseInt(yearStr, 10);
          if (year <= 49) {
              return 2000 + year;
          } else if (year <= 999) {
              return 1900 + year;
          }
          return year;
      }

      function preprocessRFC2822(s) {
          // Remove comments and folding whitespace and replace multiple-spaces with a single space
          return s.replace(/\([^)]*\)|[\n\t]/g, ' ').replace(/(\s\s+)/g, ' ').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
      }

      function checkWeekday(weekdayStr, parsedInput, config) {
          if (weekdayStr) {
              // TODO: Replace the vanilla JS Date object with an indepentent day-of-week check.
              var weekdayProvided = defaultLocaleWeekdaysShort.indexOf(weekdayStr),
                  weekdayActual = new Date(parsedInput[0], parsedInput[1], parsedInput[2]).getDay();
              if (weekdayProvided !== weekdayActual) {
                  getParsingFlags(config).weekdayMismatch = true;
                  config._isValid = false;
                  return false;
              }
          }
          return true;
      }

      var obsOffsets = {
          UT: 0,
          GMT: 0,
          EDT: -4 * 60,
          EST: -5 * 60,
          CDT: -5 * 60,
          CST: -6 * 60,
          MDT: -6 * 60,
          MST: -7 * 60,
          PDT: -7 * 60,
          PST: -8 * 60
      };

      function calculateOffset(obsOffset, militaryOffset, numOffset) {
          if (obsOffset) {
              return obsOffsets[obsOffset];
          } else if (militaryOffset) {
              // the only allowed military tz is Z
              return 0;
          } else {
              var hm = parseInt(numOffset, 10);
              var m = hm % 100, h = (hm - m) / 100;
              return h * 60 + m;
          }
      }

      // date and time from ref 2822 format
      function configFromRFC2822(config) {
          var match = rfc2822.exec(preprocessRFC2822(config._i));
          if (match) {
              var parsedArray = extractFromRFC2822Strings(match[4], match[3], match[2], match[5], match[6], match[7]);
              if (!checkWeekday(match[1], parsedArray, config)) {
                  return;
              }

              config._a = parsedArray;
              config._tzm = calculateOffset(match[8], match[9], match[10]);

              config._d = createUTCDate.apply(null, config._a);
              config._d.setUTCMinutes(config._d.getUTCMinutes() - config._tzm);

              getParsingFlags(config).rfc2822 = true;
          } else {
              config._isValid = false;
          }
      }

      // date from iso format or fallback
      function configFromString(config) {
          var matched = aspNetJsonRegex.exec(config._i);

          if (matched !== null) {
              config._d = new Date(+matched[1]);
              return;
          }

          configFromISO(config);
          if (config._isValid === false) {
              delete config._isValid;
          } else {
              return;
          }

          configFromRFC2822(config);
          if (config._isValid === false) {
              delete config._isValid;
          } else {
              return;
          }

          // Final attempt, use Input Fallback
          hooks.createFromInputFallback(config);
      }

      hooks.createFromInputFallback = deprecate(
          'value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), ' +
          'which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are ' +
          'discouraged and will be removed in an upcoming major release. Please refer to ' +
          'http://momentjs.com/guides/#/warnings/js-date/ for more info.',
          function (config) {
              config._d = new Date(config._i + (config._useUTC ? ' UTC' : ''));
          }
      );

      // constant that refers to the ISO standard
      hooks.ISO_8601 = function () {};

      // constant that refers to the RFC 2822 form
      hooks.RFC_2822 = function () {};

      // date from string and format string
      function configFromStringAndFormat(config) {
          // TODO: Move this to another part of the creation flow to prevent circular deps
          if (config._f === hooks.ISO_8601) {
              configFromISO(config);
              return;
          }
          if (config._f === hooks.RFC_2822) {
              configFromRFC2822(config);
              return;
          }
          config._a = [];
          getParsingFlags(config).empty = true;

          // This array is used to make a Date, either with `new Date` or `Date.UTC`
          var string = '' + config._i,
              i, parsedInput, tokens, token, skipped,
              stringLength = string.length,
              totalParsedInputLength = 0;

          tokens = expandFormat(config._f, config._locale).match(formattingTokens) || [];

          for (i = 0; i < tokens.length; i++) {
              token = tokens[i];
              parsedInput = (string.match(getParseRegexForToken(token, config)) || [])[0];
              // console.log('token', token, 'parsedInput', parsedInput,
              //         'regex', getParseRegexForToken(token, config));
              if (parsedInput) {
                  skipped = string.substr(0, string.indexOf(parsedInput));
                  if (skipped.length > 0) {
                      getParsingFlags(config).unusedInput.push(skipped);
                  }
                  string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
                  totalParsedInputLength += parsedInput.length;
              }
              // don't parse if it's not a known token
              if (formatTokenFunctions[token]) {
                  if (parsedInput) {
                      getParsingFlags(config).empty = false;
                  }
                  else {
                      getParsingFlags(config).unusedTokens.push(token);
                  }
                  addTimeToArrayFromToken(token, parsedInput, config);
              }
              else if (config._strict && !parsedInput) {
                  getParsingFlags(config).unusedTokens.push(token);
              }
          }

          // add remaining unparsed input length to the string
          getParsingFlags(config).charsLeftOver = stringLength - totalParsedInputLength;
          if (string.length > 0) {
              getParsingFlags(config).unusedInput.push(string);
          }

          // clear _12h flag if hour is <= 12
          if (config._a[HOUR] <= 12 &&
              getParsingFlags(config).bigHour === true &&
              config._a[HOUR] > 0) {
              getParsingFlags(config).bigHour = undefined;
          }

          getParsingFlags(config).parsedDateParts = config._a.slice(0);
          getParsingFlags(config).meridiem = config._meridiem;
          // handle meridiem
          config._a[HOUR] = meridiemFixWrap(config._locale, config._a[HOUR], config._meridiem);

          configFromArray(config);
          checkOverflow(config);
      }


      function meridiemFixWrap (locale, hour, meridiem) {
          var isPm;

          if (meridiem == null) {
              // nothing to do
              return hour;
          }
          if (locale.meridiemHour != null) {
              return locale.meridiemHour(hour, meridiem);
          } else if (locale.isPM != null) {
              // Fallback
              isPm = locale.isPM(meridiem);
              if (isPm && hour < 12) {
                  hour += 12;
              }
              if (!isPm && hour === 12) {
                  hour = 0;
              }
              return hour;
          } else {
              // this is not supposed to happen
              return hour;
          }
      }

      // date from string and array of format strings
      function configFromStringAndArray(config) {
          var tempConfig,
              bestMoment,

              scoreToBeat,
              i,
              currentScore;

          if (config._f.length === 0) {
              getParsingFlags(config).invalidFormat = true;
              config._d = new Date(NaN);
              return;
          }

          for (i = 0; i < config._f.length; i++) {
              currentScore = 0;
              tempConfig = copyConfig({}, config);
              if (config._useUTC != null) {
                  tempConfig._useUTC = config._useUTC;
              }
              tempConfig._f = config._f[i];
              configFromStringAndFormat(tempConfig);

              if (!isValid(tempConfig)) {
                  continue;
              }

              // if there is any input that was not parsed add a penalty for that format
              currentScore += getParsingFlags(tempConfig).charsLeftOver;

              //or tokens
              currentScore += getParsingFlags(tempConfig).unusedTokens.length * 10;

              getParsingFlags(tempConfig).score = currentScore;

              if (scoreToBeat == null || currentScore < scoreToBeat) {
                  scoreToBeat = currentScore;
                  bestMoment = tempConfig;
              }
          }

          extend(config, bestMoment || tempConfig);
      }

      function configFromObject(config) {
          if (config._d) {
              return;
          }

          var i = normalizeObjectUnits(config._i);
          config._a = map([i.year, i.month, i.day || i.date, i.hour, i.minute, i.second, i.millisecond], function (obj) {
              return obj && parseInt(obj, 10);
          });

          configFromArray(config);
      }

      function createFromConfig (config) {
          var res = new Moment(checkOverflow(prepareConfig(config)));
          if (res._nextDay) {
              // Adding is smart enough around DST
              res.add(1, 'd');
              res._nextDay = undefined;
          }

          return res;
      }

      function prepareConfig (config) {
          var input = config._i,
              format = config._f;

          config._locale = config._locale || getLocale(config._l);

          if (input === null || (format === undefined && input === '')) {
              return createInvalid({nullInput: true});
          }

          if (typeof input === 'string') {
              config._i = input = config._locale.preparse(input);
          }

          if (isMoment(input)) {
              return new Moment(checkOverflow(input));
          } else if (isDate(input)) {
              config._d = input;
          } else if (isArray(format)) {
              configFromStringAndArray(config);
          } else if (format) {
              configFromStringAndFormat(config);
          }  else {
              configFromInput(config);
          }

          if (!isValid(config)) {
              config._d = null;
          }

          return config;
      }

      function configFromInput(config) {
          var input = config._i;
          if (isUndefined(input)) {
              config._d = new Date(hooks.now());
          } else if (isDate(input)) {
              config._d = new Date(input.valueOf());
          } else if (typeof input === 'string') {
              configFromString(config);
          } else if (isArray(input)) {
              config._a = map(input.slice(0), function (obj) {
                  return parseInt(obj, 10);
              });
              configFromArray(config);
          } else if (isObject(input)) {
              configFromObject(config);
          } else if (isNumber(input)) {
              // from milliseconds
              config._d = new Date(input);
          } else {
              hooks.createFromInputFallback(config);
          }
      }

      function createLocalOrUTC (input, format, locale, strict, isUTC) {
          var c = {};

          if (locale === true || locale === false) {
              strict = locale;
              locale = undefined;
          }

          if ((isObject(input) && isObjectEmpty(input)) ||
                  (isArray(input) && input.length === 0)) {
              input = undefined;
          }
          // object construction must be done this way.
          // https://github.com/moment/moment/issues/1423
          c._isAMomentObject = true;
          c._useUTC = c._isUTC = isUTC;
          c._l = locale;
          c._i = input;
          c._f = format;
          c._strict = strict;

          return createFromConfig(c);
      }

      function createLocal (input, format, locale, strict) {
          return createLocalOrUTC(input, format, locale, strict, false);
      }

      var prototypeMin = deprecate(
          'moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/',
          function () {
              var other = createLocal.apply(null, arguments);
              if (this.isValid() && other.isValid()) {
                  return other < this ? this : other;
              } else {
                  return createInvalid();
              }
          }
      );

      var prototypeMax = deprecate(
          'moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/',
          function () {
              var other = createLocal.apply(null, arguments);
              if (this.isValid() && other.isValid()) {
                  return other > this ? this : other;
              } else {
                  return createInvalid();
              }
          }
      );

      // Pick a moment m from moments so that m[fn](other) is true for all
      // other. This relies on the function fn to be transitive.
      //
      // moments should either be an array of moment objects or an array, whose
      // first element is an array of moment objects.
      function pickBy(fn, moments) {
          var res, i;
          if (moments.length === 1 && isArray(moments[0])) {
              moments = moments[0];
          }
          if (!moments.length) {
              return createLocal();
          }
          res = moments[0];
          for (i = 1; i < moments.length; ++i) {
              if (!moments[i].isValid() || moments[i][fn](res)) {
                  res = moments[i];
              }
          }
          return res;
      }

      // TODO: Use [].sort instead?
      function min () {
          var args = [].slice.call(arguments, 0);

          return pickBy('isBefore', args);
      }

      function max () {
          var args = [].slice.call(arguments, 0);

          return pickBy('isAfter', args);
      }

      var now = function () {
          return Date.now ? Date.now() : +(new Date());
      };

      var ordering = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'];

      function isDurationValid(m) {
          for (var key in m) {
              if (!(indexOf.call(ordering, key) !== -1 && (m[key] == null || !isNaN(m[key])))) {
                  return false;
              }
          }

          var unitHasDecimal = false;
          for (var i = 0; i < ordering.length; ++i) {
              if (m[ordering[i]]) {
                  if (unitHasDecimal) {
                      return false; // only allow non-integers for smallest unit
                  }
                  if (parseFloat(m[ordering[i]]) !== toInt(m[ordering[i]])) {
                      unitHasDecimal = true;
                  }
              }
          }

          return true;
      }

      function isValid$1() {
          return this._isValid;
      }

      function createInvalid$1() {
          return createDuration(NaN);
      }

      function Duration (duration) {
          var normalizedInput = normalizeObjectUnits(duration),
              years = normalizedInput.year || 0,
              quarters = normalizedInput.quarter || 0,
              months = normalizedInput.month || 0,
              weeks = normalizedInput.week || normalizedInput.isoWeek || 0,
              days = normalizedInput.day || 0,
              hours = normalizedInput.hour || 0,
              minutes = normalizedInput.minute || 0,
              seconds = normalizedInput.second || 0,
              milliseconds = normalizedInput.millisecond || 0;

          this._isValid = isDurationValid(normalizedInput);

          // representation for dateAddRemove
          this._milliseconds = +milliseconds +
              seconds * 1e3 + // 1000
              minutes * 6e4 + // 1000 * 60
              hours * 1000 * 60 * 60; //using 1000 * 60 * 60 instead of 36e5 to avoid floating point rounding errors https://github.com/moment/moment/issues/2978
          // Because of dateAddRemove treats 24 hours as different from a
          // day when working around DST, we need to store them separately
          this._days = +days +
              weeks * 7;
          // It is impossible to translate months into days without knowing
          // which months you are are talking about, so we have to store
          // it separately.
          this._months = +months +
              quarters * 3 +
              years * 12;

          this._data = {};

          this._locale = getLocale();

          this._bubble();
      }

      function isDuration (obj) {
          return obj instanceof Duration;
      }

      function absRound (number) {
          if (number < 0) {
              return Math.round(-1 * number) * -1;
          } else {
              return Math.round(number);
          }
      }

      // FORMATTING

      function offset (token, separator) {
          addFormatToken(token, 0, 0, function () {
              var offset = this.utcOffset();
              var sign = '+';
              if (offset < 0) {
                  offset = -offset;
                  sign = '-';
              }
              return sign + zeroFill(~~(offset / 60), 2) + separator + zeroFill(~~(offset) % 60, 2);
          });
      }

      offset('Z', ':');
      offset('ZZ', '');

      // PARSING

      addRegexToken('Z',  matchShortOffset);
      addRegexToken('ZZ', matchShortOffset);
      addParseToken(['Z', 'ZZ'], function (input, array, config) {
          config._useUTC = true;
          config._tzm = offsetFromString(matchShortOffset, input);
      });

      // HELPERS

      // timezone chunker
      // '+10:00' > ['10',  '00']
      // '-1530'  > ['-15', '30']
      var chunkOffset = /([\+\-]|\d\d)/gi;

      function offsetFromString(matcher, string) {
          var matches = (string || '').match(matcher);

          if (matches === null) {
              return null;
          }

          var chunk   = matches[matches.length - 1] || [];
          var parts   = (chunk + '').match(chunkOffset) || ['-', 0, 0];
          var minutes = +(parts[1] * 60) + toInt(parts[2]);

          return minutes === 0 ?
            0 :
            parts[0] === '+' ? minutes : -minutes;
      }

      // Return a moment from input, that is local/utc/zone equivalent to model.
      function cloneWithOffset(input, model) {
          var res, diff;
          if (model._isUTC) {
              res = model.clone();
              diff = (isMoment(input) || isDate(input) ? input.valueOf() : createLocal(input).valueOf()) - res.valueOf();
              // Use low-level api, because this fn is low-level api.
              res._d.setTime(res._d.valueOf() + diff);
              hooks.updateOffset(res, false);
              return res;
          } else {
              return createLocal(input).local();
          }
      }

      function getDateOffset (m) {
          // On Firefox.24 Date#getTimezoneOffset returns a floating point.
          // https://github.com/moment/moment/pull/1871
          return -Math.round(m._d.getTimezoneOffset() / 15) * 15;
      }

      // HOOKS

      // This function will be called whenever a moment is mutated.
      // It is intended to keep the offset in sync with the timezone.
      hooks.updateOffset = function () {};

      // MOMENTS

      // keepLocalTime = true means only change the timezone, without
      // affecting the local hour. So 5:31:26 +0300 --[utcOffset(2, true)]-->
      // 5:31:26 +0200 It is possible that 5:31:26 doesn't exist with offset
      // +0200, so we adjust the time as needed, to be valid.
      //
      // Keeping the time actually adds/subtracts (one hour)
      // from the actual represented time. That is why we call updateOffset
      // a second time. In case it wants us to change the offset again
      // _changeInProgress == true case, then we have to adjust, because
      // there is no such time in the given timezone.
      function getSetOffset (input, keepLocalTime, keepMinutes) {
          var offset = this._offset || 0,
              localAdjust;
          if (!this.isValid()) {
              return input != null ? this : NaN;
          }
          if (input != null) {
              if (typeof input === 'string') {
                  input = offsetFromString(matchShortOffset, input);
                  if (input === null) {
                      return this;
                  }
              } else if (Math.abs(input) < 16 && !keepMinutes) {
                  input = input * 60;
              }
              if (!this._isUTC && keepLocalTime) {
                  localAdjust = getDateOffset(this);
              }
              this._offset = input;
              this._isUTC = true;
              if (localAdjust != null) {
                  this.add(localAdjust, 'm');
              }
              if (offset !== input) {
                  if (!keepLocalTime || this._changeInProgress) {
                      addSubtract(this, createDuration(input - offset, 'm'), 1, false);
                  } else if (!this._changeInProgress) {
                      this._changeInProgress = true;
                      hooks.updateOffset(this, true);
                      this._changeInProgress = null;
                  }
              }
              return this;
          } else {
              return this._isUTC ? offset : getDateOffset(this);
          }
      }

      function getSetZone (input, keepLocalTime) {
          if (input != null) {
              if (typeof input !== 'string') {
                  input = -input;
              }

              this.utcOffset(input, keepLocalTime);

              return this;
          } else {
              return -this.utcOffset();
          }
      }

      function setOffsetToUTC (keepLocalTime) {
          return this.utcOffset(0, keepLocalTime);
      }

      function setOffsetToLocal (keepLocalTime) {
          if (this._isUTC) {
              this.utcOffset(0, keepLocalTime);
              this._isUTC = false;

              if (keepLocalTime) {
                  this.subtract(getDateOffset(this), 'm');
              }
          }
          return this;
      }

      function setOffsetToParsedOffset () {
          if (this._tzm != null) {
              this.utcOffset(this._tzm, false, true);
          } else if (typeof this._i === 'string') {
              var tZone = offsetFromString(matchOffset, this._i);
              if (tZone != null) {
                  this.utcOffset(tZone);
              }
              else {
                  this.utcOffset(0, true);
              }
          }
          return this;
      }

      function hasAlignedHourOffset (input) {
          if (!this.isValid()) {
              return false;
          }
          input = input ? createLocal(input).utcOffset() : 0;

          return (this.utcOffset() - input) % 60 === 0;
      }

      function isDaylightSavingTime () {
          return (
              this.utcOffset() > this.clone().month(0).utcOffset() ||
              this.utcOffset() > this.clone().month(5).utcOffset()
          );
      }

      function isDaylightSavingTimeShifted () {
          if (!isUndefined(this._isDSTShifted)) {
              return this._isDSTShifted;
          }

          var c = {};

          copyConfig(c, this);
          c = prepareConfig(c);

          if (c._a) {
              var other = c._isUTC ? createUTC(c._a) : createLocal(c._a);
              this._isDSTShifted = this.isValid() &&
                  compareArrays(c._a, other.toArray()) > 0;
          } else {
              this._isDSTShifted = false;
          }

          return this._isDSTShifted;
      }

      function isLocal () {
          return this.isValid() ? !this._isUTC : false;
      }

      function isUtcOffset () {
          return this.isValid() ? this._isUTC : false;
      }

      function isUtc () {
          return this.isValid() ? this._isUTC && this._offset === 0 : false;
      }

      // ASP.NET json date format regex
      var aspNetRegex = /^(\-|\+)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/;

      // from http://docs.closure-library.googlecode.com/git/closure_goog_date_date.js.source.html
      // somewhat more in line with 4.4.3.2 2004 spec, but allows decimal anywhere
      // and further modified to allow for strings containing both week and day
      var isoRegex = /^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/;

      function createDuration (input, key) {
          var duration = input,
              // matching against regexp is expensive, do it on demand
              match = null,
              sign,
              ret,
              diffRes;

          if (isDuration(input)) {
              duration = {
                  ms : input._milliseconds,
                  d  : input._days,
                  M  : input._months
              };
          } else if (isNumber(input)) {
              duration = {};
              if (key) {
                  duration[key] = input;
              } else {
                  duration.milliseconds = input;
              }
          } else if (!!(match = aspNetRegex.exec(input))) {
              sign = (match[1] === '-') ? -1 : 1;
              duration = {
                  y  : 0,
                  d  : toInt(match[DATE])                         * sign,
                  h  : toInt(match[HOUR])                         * sign,
                  m  : toInt(match[MINUTE])                       * sign,
                  s  : toInt(match[SECOND])                       * sign,
                  ms : toInt(absRound(match[MILLISECOND] * 1000)) * sign // the millisecond decimal point is included in the match
              };
          } else if (!!(match = isoRegex.exec(input))) {
              sign = (match[1] === '-') ? -1 : 1;
              duration = {
                  y : parseIso(match[2], sign),
                  M : parseIso(match[3], sign),
                  w : parseIso(match[4], sign),
                  d : parseIso(match[5], sign),
                  h : parseIso(match[6], sign),
                  m : parseIso(match[7], sign),
                  s : parseIso(match[8], sign)
              };
          } else if (duration == null) {// checks for null or undefined
              duration = {};
          } else if (typeof duration === 'object' && ('from' in duration || 'to' in duration)) {
              diffRes = momentsDifference(createLocal(duration.from), createLocal(duration.to));

              duration = {};
              duration.ms = diffRes.milliseconds;
              duration.M = diffRes.months;
          }

          ret = new Duration(duration);

          if (isDuration(input) && hasOwnProp(input, '_locale')) {
              ret._locale = input._locale;
          }

          return ret;
      }

      createDuration.fn = Duration.prototype;
      createDuration.invalid = createInvalid$1;

      function parseIso (inp, sign) {
          // We'd normally use ~~inp for this, but unfortunately it also
          // converts floats to ints.
          // inp may be undefined, so careful calling replace on it.
          var res = inp && parseFloat(inp.replace(',', '.'));
          // apply sign while we're at it
          return (isNaN(res) ? 0 : res) * sign;
      }

      function positiveMomentsDifference(base, other) {
          var res = {};

          res.months = other.month() - base.month() +
              (other.year() - base.year()) * 12;
          if (base.clone().add(res.months, 'M').isAfter(other)) {
              --res.months;
          }

          res.milliseconds = +other - +(base.clone().add(res.months, 'M'));

          return res;
      }

      function momentsDifference(base, other) {
          var res;
          if (!(base.isValid() && other.isValid())) {
              return {milliseconds: 0, months: 0};
          }

          other = cloneWithOffset(other, base);
          if (base.isBefore(other)) {
              res = positiveMomentsDifference(base, other);
          } else {
              res = positiveMomentsDifference(other, base);
              res.milliseconds = -res.milliseconds;
              res.months = -res.months;
          }

          return res;
      }

      // TODO: remove 'name' arg after deprecation is removed
      function createAdder(direction, name) {
          return function (val, period) {
              var dur, tmp;
              //invert the arguments, but complain about it
              if (period !== null && !isNaN(+period)) {
                  deprecateSimple(name, 'moment().' + name  + '(period, number) is deprecated. Please use moment().' + name + '(number, period). ' +
                  'See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info.');
                  tmp = val; val = period; period = tmp;
              }

              val = typeof val === 'string' ? +val : val;
              dur = createDuration(val, period);
              addSubtract(this, dur, direction);
              return this;
          };
      }

      function addSubtract (mom, duration, isAdding, updateOffset) {
          var milliseconds = duration._milliseconds,
              days = absRound(duration._days),
              months = absRound(duration._months);

          if (!mom.isValid()) {
              // No op
              return;
          }

          updateOffset = updateOffset == null ? true : updateOffset;

          if (months) {
              setMonth(mom, get(mom, 'Month') + months * isAdding);
          }
          if (days) {
              set$1(mom, 'Date', get(mom, 'Date') + days * isAdding);
          }
          if (milliseconds) {
              mom._d.setTime(mom._d.valueOf() + milliseconds * isAdding);
          }
          if (updateOffset) {
              hooks.updateOffset(mom, days || months);
          }
      }

      var add      = createAdder(1, 'add');
      var subtract = createAdder(-1, 'subtract');

      function getCalendarFormat(myMoment, now) {
          var diff = myMoment.diff(now, 'days', true);
          return diff < -6 ? 'sameElse' :
                  diff < -1 ? 'lastWeek' :
                  diff < 0 ? 'lastDay' :
                  diff < 1 ? 'sameDay' :
                  diff < 2 ? 'nextDay' :
                  diff < 7 ? 'nextWeek' : 'sameElse';
      }

      function calendar$1 (time, formats) {
          // We want to compare the start of today, vs this.
          // Getting start-of-today depends on whether we're local/utc/offset or not.
          var now = time || createLocal(),
              sod = cloneWithOffset(now, this).startOf('day'),
              format = hooks.calendarFormat(this, sod) || 'sameElse';

          var output = formats && (isFunction(formats[format]) ? formats[format].call(this, now) : formats[format]);

          return this.format(output || this.localeData().calendar(format, this, createLocal(now)));
      }

      function clone () {
          return new Moment(this);
      }

      function isAfter (input, units) {
          var localInput = isMoment(input) ? input : createLocal(input);
          if (!(this.isValid() && localInput.isValid())) {
              return false;
          }
          units = normalizeUnits(units) || 'millisecond';
          if (units === 'millisecond') {
              return this.valueOf() > localInput.valueOf();
          } else {
              return localInput.valueOf() < this.clone().startOf(units).valueOf();
          }
      }

      function isBefore (input, units) {
          var localInput = isMoment(input) ? input : createLocal(input);
          if (!(this.isValid() && localInput.isValid())) {
              return false;
          }
          units = normalizeUnits(units) || 'millisecond';
          if (units === 'millisecond') {
              return this.valueOf() < localInput.valueOf();
          } else {
              return this.clone().endOf(units).valueOf() < localInput.valueOf();
          }
      }

      function isBetween (from, to, units, inclusivity) {
          var localFrom = isMoment(from) ? from : createLocal(from),
              localTo = isMoment(to) ? to : createLocal(to);
          if (!(this.isValid() && localFrom.isValid() && localTo.isValid())) {
              return false;
          }
          inclusivity = inclusivity || '()';
          return (inclusivity[0] === '(' ? this.isAfter(localFrom, units) : !this.isBefore(localFrom, units)) &&
              (inclusivity[1] === ')' ? this.isBefore(localTo, units) : !this.isAfter(localTo, units));
      }

      function isSame (input, units) {
          var localInput = isMoment(input) ? input : createLocal(input),
              inputMs;
          if (!(this.isValid() && localInput.isValid())) {
              return false;
          }
          units = normalizeUnits(units) || 'millisecond';
          if (units === 'millisecond') {
              return this.valueOf() === localInput.valueOf();
          } else {
              inputMs = localInput.valueOf();
              return this.clone().startOf(units).valueOf() <= inputMs && inputMs <= this.clone().endOf(units).valueOf();
          }
      }

      function isSameOrAfter (input, units) {
          return this.isSame(input, units) || this.isAfter(input, units);
      }

      function isSameOrBefore (input, units) {
          return this.isSame(input, units) || this.isBefore(input, units);
      }

      function diff (input, units, asFloat) {
          var that,
              zoneDelta,
              output;

          if (!this.isValid()) {
              return NaN;
          }

          that = cloneWithOffset(input, this);

          if (!that.isValid()) {
              return NaN;
          }

          zoneDelta = (that.utcOffset() - this.utcOffset()) * 6e4;

          units = normalizeUnits(units);

          switch (units) {
              case 'year': output = monthDiff(this, that) / 12; break;
              case 'month': output = monthDiff(this, that); break;
              case 'quarter': output = monthDiff(this, that) / 3; break;
              case 'second': output = (this - that) / 1e3; break; // 1000
              case 'minute': output = (this - that) / 6e4; break; // 1000 * 60
              case 'hour': output = (this - that) / 36e5; break; // 1000 * 60 * 60
              case 'day': output = (this - that - zoneDelta) / 864e5; break; // 1000 * 60 * 60 * 24, negate dst
              case 'week': output = (this - that - zoneDelta) / 6048e5; break; // 1000 * 60 * 60 * 24 * 7, negate dst
              default: output = this - that;
          }

          return asFloat ? output : absFloor(output);
      }

      function monthDiff (a, b) {
          // difference in months
          var wholeMonthDiff = ((b.year() - a.year()) * 12) + (b.month() - a.month()),
              // b is in (anchor - 1 month, anchor + 1 month)
              anchor = a.clone().add(wholeMonthDiff, 'months'),
              anchor2, adjust;

          if (b - anchor < 0) {
              anchor2 = a.clone().add(wholeMonthDiff - 1, 'months');
              // linear across the month
              adjust = (b - anchor) / (anchor - anchor2);
          } else {
              anchor2 = a.clone().add(wholeMonthDiff + 1, 'months');
              // linear across the month
              adjust = (b - anchor) / (anchor2 - anchor);
          }

          //check for negative zero, return zero if negative zero
          return -(wholeMonthDiff + adjust) || 0;
      }

      hooks.defaultFormat = 'YYYY-MM-DDTHH:mm:ssZ';
      hooks.defaultFormatUtc = 'YYYY-MM-DDTHH:mm:ss[Z]';

      function toString () {
          return this.clone().locale('en').format('ddd MMM DD YYYY HH:mm:ss [GMT]ZZ');
      }

      function toISOString(keepOffset) {
          if (!this.isValid()) {
              return null;
          }
          var utc = keepOffset !== true;
          var m = utc ? this.clone().utc() : this;
          if (m.year() < 0 || m.year() > 9999) {
              return formatMoment(m, utc ? 'YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYYYY-MM-DD[T]HH:mm:ss.SSSZ');
          }
          if (isFunction(Date.prototype.toISOString)) {
              // native implementation is ~50x faster, use it when we can
              if (utc) {
                  return this.toDate().toISOString();
              } else {
                  return new Date(this.valueOf() + this.utcOffset() * 60 * 1000).toISOString().replace('Z', formatMoment(m, 'Z'));
              }
          }
          return formatMoment(m, utc ? 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]' : 'YYYY-MM-DD[T]HH:mm:ss.SSSZ');
      }

      /**
       * Return a human readable representation of a moment that can
       * also be evaluated to get a new moment which is the same
       *
       * @link https://nodejs.org/dist/latest/docs/api/util.html#util_custom_inspect_function_on_objects
       */
      function inspect () {
          if (!this.isValid()) {
              return 'moment.invalid(/* ' + this._i + ' */)';
          }
          var func = 'moment';
          var zone = '';
          if (!this.isLocal()) {
              func = this.utcOffset() === 0 ? 'moment.utc' : 'moment.parseZone';
              zone = 'Z';
          }
          var prefix = '[' + func + '("]';
          var year = (0 <= this.year() && this.year() <= 9999) ? 'YYYY' : 'YYYYYY';
          var datetime = '-MM-DD[T]HH:mm:ss.SSS';
          var suffix = zone + '[")]';

          return this.format(prefix + year + datetime + suffix);
      }

      function format (inputString) {
          if (!inputString) {
              inputString = this.isUtc() ? hooks.defaultFormatUtc : hooks.defaultFormat;
          }
          var output = formatMoment(this, inputString);
          return this.localeData().postformat(output);
      }

      function from (time, withoutSuffix) {
          if (this.isValid() &&
                  ((isMoment(time) && time.isValid()) ||
                   createLocal(time).isValid())) {
              return createDuration({to: this, from: time}).locale(this.locale()).humanize(!withoutSuffix);
          } else {
              return this.localeData().invalidDate();
          }
      }

      function fromNow (withoutSuffix) {
          return this.from(createLocal(), withoutSuffix);
      }

      function to (time, withoutSuffix) {
          if (this.isValid() &&
                  ((isMoment(time) && time.isValid()) ||
                   createLocal(time).isValid())) {
              return createDuration({from: this, to: time}).locale(this.locale()).humanize(!withoutSuffix);
          } else {
              return this.localeData().invalidDate();
          }
      }

      function toNow (withoutSuffix) {
          return this.to(createLocal(), withoutSuffix);
      }

      // If passed a locale key, it will set the locale for this
      // instance.  Otherwise, it will return the locale configuration
      // variables for this instance.
      function locale (key) {
          var newLocaleData;

          if (key === undefined) {
              return this._locale._abbr;
          } else {
              newLocaleData = getLocale(key);
              if (newLocaleData != null) {
                  this._locale = newLocaleData;
              }
              return this;
          }
      }

      var lang = deprecate(
          'moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.',
          function (key) {
              if (key === undefined) {
                  return this.localeData();
              } else {
                  return this.locale(key);
              }
          }
      );

      function localeData () {
          return this._locale;
      }

      var MS_PER_SECOND = 1000;
      var MS_PER_MINUTE = 60 * MS_PER_SECOND;
      var MS_PER_HOUR = 60 * MS_PER_MINUTE;
      var MS_PER_400_YEARS = (365 * 400 + 97) * 24 * MS_PER_HOUR;

      // actual modulo - handles negative numbers (for dates before 1970):
      function mod$1(dividend, divisor) {
          return (dividend % divisor + divisor) % divisor;
      }

      function localStartOfDate(y, m, d) {
          // the date constructor remaps years 0-99 to 1900-1999
          if (y < 100 && y >= 0) {
              // preserve leap years using a full 400 year cycle, then reset
              return new Date(y + 400, m, d) - MS_PER_400_YEARS;
          } else {
              return new Date(y, m, d).valueOf();
          }
      }

      function utcStartOfDate(y, m, d) {
          // Date.UTC remaps years 0-99 to 1900-1999
          if (y < 100 && y >= 0) {
              // preserve leap years using a full 400 year cycle, then reset
              return Date.UTC(y + 400, m, d) - MS_PER_400_YEARS;
          } else {
              return Date.UTC(y, m, d);
          }
      }

      function startOf (units) {
          var time;
          units = normalizeUnits(units);
          if (units === undefined || units === 'millisecond' || !this.isValid()) {
              return this;
          }

          var startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

          switch (units) {
              case 'year':
                  time = startOfDate(this.year(), 0, 1);
                  break;
              case 'quarter':
                  time = startOfDate(this.year(), this.month() - this.month() % 3, 1);
                  break;
              case 'month':
                  time = startOfDate(this.year(), this.month(), 1);
                  break;
              case 'week':
                  time = startOfDate(this.year(), this.month(), this.date() - this.weekday());
                  break;
              case 'isoWeek':
                  time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1));
                  break;
              case 'day':
              case 'date':
                  time = startOfDate(this.year(), this.month(), this.date());
                  break;
              case 'hour':
                  time = this._d.valueOf();
                  time -= mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR);
                  break;
              case 'minute':
                  time = this._d.valueOf();
                  time -= mod$1(time, MS_PER_MINUTE);
                  break;
              case 'second':
                  time = this._d.valueOf();
                  time -= mod$1(time, MS_PER_SECOND);
                  break;
          }

          this._d.setTime(time);
          hooks.updateOffset(this, true);
          return this;
      }

      function endOf (units) {
          var time;
          units = normalizeUnits(units);
          if (units === undefined || units === 'millisecond' || !this.isValid()) {
              return this;
          }

          var startOfDate = this._isUTC ? utcStartOfDate : localStartOfDate;

          switch (units) {
              case 'year':
                  time = startOfDate(this.year() + 1, 0, 1) - 1;
                  break;
              case 'quarter':
                  time = startOfDate(this.year(), this.month() - this.month() % 3 + 3, 1) - 1;
                  break;
              case 'month':
                  time = startOfDate(this.year(), this.month() + 1, 1) - 1;
                  break;
              case 'week':
                  time = startOfDate(this.year(), this.month(), this.date() - this.weekday() + 7) - 1;
                  break;
              case 'isoWeek':
                  time = startOfDate(this.year(), this.month(), this.date() - (this.isoWeekday() - 1) + 7) - 1;
                  break;
              case 'day':
              case 'date':
                  time = startOfDate(this.year(), this.month(), this.date() + 1) - 1;
                  break;
              case 'hour':
                  time = this._d.valueOf();
                  time += MS_PER_HOUR - mod$1(time + (this._isUTC ? 0 : this.utcOffset() * MS_PER_MINUTE), MS_PER_HOUR) - 1;
                  break;
              case 'minute':
                  time = this._d.valueOf();
                  time += MS_PER_MINUTE - mod$1(time, MS_PER_MINUTE) - 1;
                  break;
              case 'second':
                  time = this._d.valueOf();
                  time += MS_PER_SECOND - mod$1(time, MS_PER_SECOND) - 1;
                  break;
          }

          this._d.setTime(time);
          hooks.updateOffset(this, true);
          return this;
      }

      function valueOf () {
          return this._d.valueOf() - ((this._offset || 0) * 60000);
      }

      function unix () {
          return Math.floor(this.valueOf() / 1000);
      }

      function toDate () {
          return new Date(this.valueOf());
      }

      function toArray () {
          var m = this;
          return [m.year(), m.month(), m.date(), m.hour(), m.minute(), m.second(), m.millisecond()];
      }

      function toObject () {
          var m = this;
          return {
              years: m.year(),
              months: m.month(),
              date: m.date(),
              hours: m.hours(),
              minutes: m.minutes(),
              seconds: m.seconds(),
              milliseconds: m.milliseconds()
          };
      }

      function toJSON () {
          // new Date(NaN).toJSON() === null
          return this.isValid() ? this.toISOString() : null;
      }

      function isValid$2 () {
          return isValid(this);
      }

      function parsingFlags () {
          return extend({}, getParsingFlags(this));
      }

      function invalidAt () {
          return getParsingFlags(this).overflow;
      }

      function creationData() {
          return {
              input: this._i,
              format: this._f,
              locale: this._locale,
              isUTC: this._isUTC,
              strict: this._strict
          };
      }

      // FORMATTING

      addFormatToken(0, ['gg', 2], 0, function () {
          return this.weekYear() % 100;
      });

      addFormatToken(0, ['GG', 2], 0, function () {
          return this.isoWeekYear() % 100;
      });

      function addWeekYearFormatToken (token, getter) {
          addFormatToken(0, [token, token.length], 0, getter);
      }

      addWeekYearFormatToken('gggg',     'weekYear');
      addWeekYearFormatToken('ggggg',    'weekYear');
      addWeekYearFormatToken('GGGG',  'isoWeekYear');
      addWeekYearFormatToken('GGGGG', 'isoWeekYear');

      // ALIASES

      addUnitAlias('weekYear', 'gg');
      addUnitAlias('isoWeekYear', 'GG');

      // PRIORITY

      addUnitPriority('weekYear', 1);
      addUnitPriority('isoWeekYear', 1);


      // PARSING

      addRegexToken('G',      matchSigned);
      addRegexToken('g',      matchSigned);
      addRegexToken('GG',     match1to2, match2);
      addRegexToken('gg',     match1to2, match2);
      addRegexToken('GGGG',   match1to4, match4);
      addRegexToken('gggg',   match1to4, match4);
      addRegexToken('GGGGG',  match1to6, match6);
      addRegexToken('ggggg',  match1to6, match6);

      addWeekParseToken(['gggg', 'ggggg', 'GGGG', 'GGGGG'], function (input, week, config, token) {
          week[token.substr(0, 2)] = toInt(input);
      });

      addWeekParseToken(['gg', 'GG'], function (input, week, config, token) {
          week[token] = hooks.parseTwoDigitYear(input);
      });

      // MOMENTS

      function getSetWeekYear (input) {
          return getSetWeekYearHelper.call(this,
                  input,
                  this.week(),
                  this.weekday(),
                  this.localeData()._week.dow,
                  this.localeData()._week.doy);
      }

      function getSetISOWeekYear (input) {
          return getSetWeekYearHelper.call(this,
                  input, this.isoWeek(), this.isoWeekday(), 1, 4);
      }

      function getISOWeeksInYear () {
          return weeksInYear(this.year(), 1, 4);
      }

      function getWeeksInYear () {
          var weekInfo = this.localeData()._week;
          return weeksInYear(this.year(), weekInfo.dow, weekInfo.doy);
      }

      function getSetWeekYearHelper(input, week, weekday, dow, doy) {
          var weeksTarget;
          if (input == null) {
              return weekOfYear(this, dow, doy).year;
          } else {
              weeksTarget = weeksInYear(input, dow, doy);
              if (week > weeksTarget) {
                  week = weeksTarget;
              }
              return setWeekAll.call(this, input, week, weekday, dow, doy);
          }
      }

      function setWeekAll(weekYear, week, weekday, dow, doy) {
          var dayOfYearData = dayOfYearFromWeeks(weekYear, week, weekday, dow, doy),
              date = createUTCDate(dayOfYearData.year, 0, dayOfYearData.dayOfYear);

          this.year(date.getUTCFullYear());
          this.month(date.getUTCMonth());
          this.date(date.getUTCDate());
          return this;
      }

      // FORMATTING

      addFormatToken('Q', 0, 'Qo', 'quarter');

      // ALIASES

      addUnitAlias('quarter', 'Q');

      // PRIORITY

      addUnitPriority('quarter', 7);

      // PARSING

      addRegexToken('Q', match1);
      addParseToken('Q', function (input, array) {
          array[MONTH] = (toInt(input) - 1) * 3;
      });

      // MOMENTS

      function getSetQuarter (input) {
          return input == null ? Math.ceil((this.month() + 1) / 3) : this.month((input - 1) * 3 + this.month() % 3);
      }

      // FORMATTING

      addFormatToken('D', ['DD', 2], 'Do', 'date');

      // ALIASES

      addUnitAlias('date', 'D');

      // PRIORITY
      addUnitPriority('date', 9);

      // PARSING

      addRegexToken('D',  match1to2);
      addRegexToken('DD', match1to2, match2);
      addRegexToken('Do', function (isStrict, locale) {
          // TODO: Remove "ordinalParse" fallback in next major release.
          return isStrict ?
            (locale._dayOfMonthOrdinalParse || locale._ordinalParse) :
            locale._dayOfMonthOrdinalParseLenient;
      });

      addParseToken(['D', 'DD'], DATE);
      addParseToken('Do', function (input, array) {
          array[DATE] = toInt(input.match(match1to2)[0]);
      });

      // MOMENTS

      var getSetDayOfMonth = makeGetSet('Date', true);

      // FORMATTING

      addFormatToken('DDD', ['DDDD', 3], 'DDDo', 'dayOfYear');

      // ALIASES

      addUnitAlias('dayOfYear', 'DDD');

      // PRIORITY
      addUnitPriority('dayOfYear', 4);

      // PARSING

      addRegexToken('DDD',  match1to3);
      addRegexToken('DDDD', match3);
      addParseToken(['DDD', 'DDDD'], function (input, array, config) {
          config._dayOfYear = toInt(input);
      });

      // HELPERS

      // MOMENTS

      function getSetDayOfYear (input) {
          var dayOfYear = Math.round((this.clone().startOf('day') - this.clone().startOf('year')) / 864e5) + 1;
          return input == null ? dayOfYear : this.add((input - dayOfYear), 'd');
      }

      // FORMATTING

      addFormatToken('m', ['mm', 2], 0, 'minute');

      // ALIASES

      addUnitAlias('minute', 'm');

      // PRIORITY

      addUnitPriority('minute', 14);

      // PARSING

      addRegexToken('m',  match1to2);
      addRegexToken('mm', match1to2, match2);
      addParseToken(['m', 'mm'], MINUTE);

      // MOMENTS

      var getSetMinute = makeGetSet('Minutes', false);

      // FORMATTING

      addFormatToken('s', ['ss', 2], 0, 'second');

      // ALIASES

      addUnitAlias('second', 's');

      // PRIORITY

      addUnitPriority('second', 15);

      // PARSING

      addRegexToken('s',  match1to2);
      addRegexToken('ss', match1to2, match2);
      addParseToken(['s', 'ss'], SECOND);

      // MOMENTS

      var getSetSecond = makeGetSet('Seconds', false);

      // FORMATTING

      addFormatToken('S', 0, 0, function () {
          return ~~(this.millisecond() / 100);
      });

      addFormatToken(0, ['SS', 2], 0, function () {
          return ~~(this.millisecond() / 10);
      });

      addFormatToken(0, ['SSS', 3], 0, 'millisecond');
      addFormatToken(0, ['SSSS', 4], 0, function () {
          return this.millisecond() * 10;
      });
      addFormatToken(0, ['SSSSS', 5], 0, function () {
          return this.millisecond() * 100;
      });
      addFormatToken(0, ['SSSSSS', 6], 0, function () {
          return this.millisecond() * 1000;
      });
      addFormatToken(0, ['SSSSSSS', 7], 0, function () {
          return this.millisecond() * 10000;
      });
      addFormatToken(0, ['SSSSSSSS', 8], 0, function () {
          return this.millisecond() * 100000;
      });
      addFormatToken(0, ['SSSSSSSSS', 9], 0, function () {
          return this.millisecond() * 1000000;
      });


      // ALIASES

      addUnitAlias('millisecond', 'ms');

      // PRIORITY

      addUnitPriority('millisecond', 16);

      // PARSING

      addRegexToken('S',    match1to3, match1);
      addRegexToken('SS',   match1to3, match2);
      addRegexToken('SSS',  match1to3, match3);

      var token;
      for (token = 'SSSS'; token.length <= 9; token += 'S') {
          addRegexToken(token, matchUnsigned);
      }

      function parseMs(input, array) {
          array[MILLISECOND] = toInt(('0.' + input) * 1000);
      }

      for (token = 'S'; token.length <= 9; token += 'S') {
          addParseToken(token, parseMs);
      }
      // MOMENTS

      var getSetMillisecond = makeGetSet('Milliseconds', false);

      // FORMATTING

      addFormatToken('z',  0, 0, 'zoneAbbr');
      addFormatToken('zz', 0, 0, 'zoneName');

      // MOMENTS

      function getZoneAbbr () {
          return this._isUTC ? 'UTC' : '';
      }

      function getZoneName () {
          return this._isUTC ? 'Coordinated Universal Time' : '';
      }

      var proto = Moment.prototype;

      proto.add               = add;
      proto.calendar          = calendar$1;
      proto.clone             = clone;
      proto.diff              = diff;
      proto.endOf             = endOf;
      proto.format            = format;
      proto.from              = from;
      proto.fromNow           = fromNow;
      proto.to                = to;
      proto.toNow             = toNow;
      proto.get               = stringGet;
      proto.invalidAt         = invalidAt;
      proto.isAfter           = isAfter;
      proto.isBefore          = isBefore;
      proto.isBetween         = isBetween;
      proto.isSame            = isSame;
      proto.isSameOrAfter     = isSameOrAfter;
      proto.isSameOrBefore    = isSameOrBefore;
      proto.isValid           = isValid$2;
      proto.lang              = lang;
      proto.locale            = locale;
      proto.localeData        = localeData;
      proto.max               = prototypeMax;
      proto.min               = prototypeMin;
      proto.parsingFlags      = parsingFlags;
      proto.set               = stringSet;
      proto.startOf           = startOf;
      proto.subtract          = subtract;
      proto.toArray           = toArray;
      proto.toObject          = toObject;
      proto.toDate            = toDate;
      proto.toISOString       = toISOString;
      proto.inspect           = inspect;
      proto.toJSON            = toJSON;
      proto.toString          = toString;
      proto.unix              = unix;
      proto.valueOf           = valueOf;
      proto.creationData      = creationData;
      proto.year       = getSetYear;
      proto.isLeapYear = getIsLeapYear;
      proto.weekYear    = getSetWeekYear;
      proto.isoWeekYear = getSetISOWeekYear;
      proto.quarter = proto.quarters = getSetQuarter;
      proto.month       = getSetMonth;
      proto.daysInMonth = getDaysInMonth;
      proto.week           = proto.weeks        = getSetWeek;
      proto.isoWeek        = proto.isoWeeks     = getSetISOWeek;
      proto.weeksInYear    = getWeeksInYear;
      proto.isoWeeksInYear = getISOWeeksInYear;
      proto.date       = getSetDayOfMonth;
      proto.day        = proto.days             = getSetDayOfWeek;
      proto.weekday    = getSetLocaleDayOfWeek;
      proto.isoWeekday = getSetISODayOfWeek;
      proto.dayOfYear  = getSetDayOfYear;
      proto.hour = proto.hours = getSetHour;
      proto.minute = proto.minutes = getSetMinute;
      proto.second = proto.seconds = getSetSecond;
      proto.millisecond = proto.milliseconds = getSetMillisecond;
      proto.utcOffset            = getSetOffset;
      proto.utc                  = setOffsetToUTC;
      proto.local                = setOffsetToLocal;
      proto.parseZone            = setOffsetToParsedOffset;
      proto.hasAlignedHourOffset = hasAlignedHourOffset;
      proto.isDST                = isDaylightSavingTime;
      proto.isLocal              = isLocal;
      proto.isUtcOffset          = isUtcOffset;
      proto.isUtc                = isUtc;
      proto.isUTC                = isUtc;
      proto.zoneAbbr = getZoneAbbr;
      proto.zoneName = getZoneName;
      proto.dates  = deprecate('dates accessor is deprecated. Use date instead.', getSetDayOfMonth);
      proto.months = deprecate('months accessor is deprecated. Use month instead', getSetMonth);
      proto.years  = deprecate('years accessor is deprecated. Use year instead', getSetYear);
      proto.zone   = deprecate('moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/', getSetZone);
      proto.isDSTShifted = deprecate('isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information', isDaylightSavingTimeShifted);

      function createUnix (input) {
          return createLocal(input * 1000);
      }

      function createInZone () {
          return createLocal.apply(null, arguments).parseZone();
      }

      function preParsePostFormat (string) {
          return string;
      }

      var proto$1 = Locale.prototype;

      proto$1.calendar        = calendar;
      proto$1.longDateFormat  = longDateFormat;
      proto$1.invalidDate     = invalidDate;
      proto$1.ordinal         = ordinal;
      proto$1.preparse        = preParsePostFormat;
      proto$1.postformat      = preParsePostFormat;
      proto$1.relativeTime    = relativeTime;
      proto$1.pastFuture      = pastFuture;
      proto$1.set             = set;

      proto$1.months            =        localeMonths;
      proto$1.monthsShort       =        localeMonthsShort;
      proto$1.monthsParse       =        localeMonthsParse;
      proto$1.monthsRegex       = monthsRegex;
      proto$1.monthsShortRegex  = monthsShortRegex;
      proto$1.week = localeWeek;
      proto$1.firstDayOfYear = localeFirstDayOfYear;
      proto$1.firstDayOfWeek = localeFirstDayOfWeek;

      proto$1.weekdays       =        localeWeekdays;
      proto$1.weekdaysMin    =        localeWeekdaysMin;
      proto$1.weekdaysShort  =        localeWeekdaysShort;
      proto$1.weekdaysParse  =        localeWeekdaysParse;

      proto$1.weekdaysRegex       =        weekdaysRegex;
      proto$1.weekdaysShortRegex  =        weekdaysShortRegex;
      proto$1.weekdaysMinRegex    =        weekdaysMinRegex;

      proto$1.isPM = localeIsPM;
      proto$1.meridiem = localeMeridiem;

      function get$1 (format, index, field, setter) {
          var locale = getLocale();
          var utc = createUTC().set(setter, index);
          return locale[field](utc, format);
      }

      function listMonthsImpl (format, index, field) {
          if (isNumber(format)) {
              index = format;
              format = undefined;
          }

          format = format || '';

          if (index != null) {
              return get$1(format, index, field, 'month');
          }

          var i;
          var out = [];
          for (i = 0; i < 12; i++) {
              out[i] = get$1(format, i, field, 'month');
          }
          return out;
      }

      // ()
      // (5)
      // (fmt, 5)
      // (fmt)
      // (true)
      // (true, 5)
      // (true, fmt, 5)
      // (true, fmt)
      function listWeekdaysImpl (localeSorted, format, index, field) {
          if (typeof localeSorted === 'boolean') {
              if (isNumber(format)) {
                  index = format;
                  format = undefined;
              }

              format = format || '';
          } else {
              format = localeSorted;
              index = format;
              localeSorted = false;

              if (isNumber(format)) {
                  index = format;
                  format = undefined;
              }

              format = format || '';
          }

          var locale = getLocale(),
              shift = localeSorted ? locale._week.dow : 0;

          if (index != null) {
              return get$1(format, (index + shift) % 7, field, 'day');
          }

          var i;
          var out = [];
          for (i = 0; i < 7; i++) {
              out[i] = get$1(format, (i + shift) % 7, field, 'day');
          }
          return out;
      }

      function listMonths (format, index) {
          return listMonthsImpl(format, index, 'months');
      }

      function listMonthsShort (format, index) {
          return listMonthsImpl(format, index, 'monthsShort');
      }

      function listWeekdays (localeSorted, format, index) {
          return listWeekdaysImpl(localeSorted, format, index, 'weekdays');
      }

      function listWeekdaysShort (localeSorted, format, index) {
          return listWeekdaysImpl(localeSorted, format, index, 'weekdaysShort');
      }

      function listWeekdaysMin (localeSorted, format, index) {
          return listWeekdaysImpl(localeSorted, format, index, 'weekdaysMin');
      }

      getSetGlobalLocale('en', {
          dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
          ordinal : function (number) {
              var b = number % 10,
                  output = (toInt(number % 100 / 10) === 1) ? 'th' :
                  (b === 1) ? 'st' :
                  (b === 2) ? 'nd' :
                  (b === 3) ? 'rd' : 'th';
              return number + output;
          }
      });

      // Side effect imports

      hooks.lang = deprecate('moment.lang is deprecated. Use moment.locale instead.', getSetGlobalLocale);
      hooks.langData = deprecate('moment.langData is deprecated. Use moment.localeData instead.', getLocale);

      var mathAbs = Math.abs;

      function abs () {
          var data           = this._data;

          this._milliseconds = mathAbs(this._milliseconds);
          this._days         = mathAbs(this._days);
          this._months       = mathAbs(this._months);

          data.milliseconds  = mathAbs(data.milliseconds);
          data.seconds       = mathAbs(data.seconds);
          data.minutes       = mathAbs(data.minutes);
          data.hours         = mathAbs(data.hours);
          data.months        = mathAbs(data.months);
          data.years         = mathAbs(data.years);

          return this;
      }

      function addSubtract$1 (duration, input, value, direction) {
          var other = createDuration(input, value);

          duration._milliseconds += direction * other._milliseconds;
          duration._days         += direction * other._days;
          duration._months       += direction * other._months;

          return duration._bubble();
      }

      // supports only 2.0-style add(1, 's') or add(duration)
      function add$1 (input, value) {
          return addSubtract$1(this, input, value, 1);
      }

      // supports only 2.0-style subtract(1, 's') or subtract(duration)
      function subtract$1 (input, value) {
          return addSubtract$1(this, input, value, -1);
      }

      function absCeil (number) {
          if (number < 0) {
              return Math.floor(number);
          } else {
              return Math.ceil(number);
          }
      }

      function bubble () {
          var milliseconds = this._milliseconds;
          var days         = this._days;
          var months       = this._months;
          var data         = this._data;
          var seconds, minutes, hours, years, monthsFromDays;

          // if we have a mix of positive and negative values, bubble down first
          // check: https://github.com/moment/moment/issues/2166
          if (!((milliseconds >= 0 && days >= 0 && months >= 0) ||
                  (milliseconds <= 0 && days <= 0 && months <= 0))) {
              milliseconds += absCeil(monthsToDays(months) + days) * 864e5;
              days = 0;
              months = 0;
          }

          // The following code bubbles up values, see the tests for
          // examples of what that means.
          data.milliseconds = milliseconds % 1000;

          seconds           = absFloor(milliseconds / 1000);
          data.seconds      = seconds % 60;

          minutes           = absFloor(seconds / 60);
          data.minutes      = minutes % 60;

          hours             = absFloor(minutes / 60);
          data.hours        = hours % 24;

          days += absFloor(hours / 24);

          // convert days to months
          monthsFromDays = absFloor(daysToMonths(days));
          months += monthsFromDays;
          days -= absCeil(monthsToDays(monthsFromDays));

          // 12 months -> 1 year
          years = absFloor(months / 12);
          months %= 12;

          data.days   = days;
          data.months = months;
          data.years  = years;

          return this;
      }

      function daysToMonths (days) {
          // 400 years have 146097 days (taking into account leap year rules)
          // 400 years have 12 months === 4800
          return days * 4800 / 146097;
      }

      function monthsToDays (months) {
          // the reverse of daysToMonths
          return months * 146097 / 4800;
      }

      function as (units) {
          if (!this.isValid()) {
              return NaN;
          }
          var days;
          var months;
          var milliseconds = this._milliseconds;

          units = normalizeUnits(units);

          if (units === 'month' || units === 'quarter' || units === 'year') {
              days = this._days + milliseconds / 864e5;
              months = this._months + daysToMonths(days);
              switch (units) {
                  case 'month':   return months;
                  case 'quarter': return months / 3;
                  case 'year':    return months / 12;
              }
          } else {
              // handle milliseconds separately because of floating point math errors (issue #1867)
              days = this._days + Math.round(monthsToDays(this._months));
              switch (units) {
                  case 'week'   : return days / 7     + milliseconds / 6048e5;
                  case 'day'    : return days         + milliseconds / 864e5;
                  case 'hour'   : return days * 24    + milliseconds / 36e5;
                  case 'minute' : return days * 1440  + milliseconds / 6e4;
                  case 'second' : return days * 86400 + milliseconds / 1000;
                  // Math.floor prevents floating point math errors here
                  case 'millisecond': return Math.floor(days * 864e5) + milliseconds;
                  default: throw new Error('Unknown unit ' + units);
              }
          }
      }

      // TODO: Use this.as('ms')?
      function valueOf$1 () {
          if (!this.isValid()) {
              return NaN;
          }
          return (
              this._milliseconds +
              this._days * 864e5 +
              (this._months % 12) * 2592e6 +
              toInt(this._months / 12) * 31536e6
          );
      }

      function makeAs (alias) {
          return function () {
              return this.as(alias);
          };
      }

      var asMilliseconds = makeAs('ms');
      var asSeconds      = makeAs('s');
      var asMinutes      = makeAs('m');
      var asHours        = makeAs('h');
      var asDays         = makeAs('d');
      var asWeeks        = makeAs('w');
      var asMonths       = makeAs('M');
      var asQuarters     = makeAs('Q');
      var asYears        = makeAs('y');

      function clone$1 () {
          return createDuration(this);
      }

      function get$2 (units) {
          units = normalizeUnits(units);
          return this.isValid() ? this[units + 's']() : NaN;
      }

      function makeGetter(name) {
          return function () {
              return this.isValid() ? this._data[name] : NaN;
          };
      }

      var milliseconds = makeGetter('milliseconds');
      var seconds      = makeGetter('seconds');
      var minutes      = makeGetter('minutes');
      var hours        = makeGetter('hours');
      var days         = makeGetter('days');
      var months       = makeGetter('months');
      var years        = makeGetter('years');

      function weeks () {
          return absFloor(this.days() / 7);
      }

      var round = Math.round;
      var thresholds = {
          ss: 44,         // a few seconds to seconds
          s : 45,         // seconds to minute
          m : 45,         // minutes to hour
          h : 22,         // hours to day
          d : 26,         // days to month
          M : 11          // months to year
      };

      // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
      function substituteTimeAgo(string, number, withoutSuffix, isFuture, locale) {
          return locale.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
      }

      function relativeTime$1 (posNegDuration, withoutSuffix, locale) {
          var duration = createDuration(posNegDuration).abs();
          var seconds  = round(duration.as('s'));
          var minutes  = round(duration.as('m'));
          var hours    = round(duration.as('h'));
          var days     = round(duration.as('d'));
          var months   = round(duration.as('M'));
          var years    = round(duration.as('y'));

          var a = seconds <= thresholds.ss && ['s', seconds]  ||
                  seconds < thresholds.s   && ['ss', seconds] ||
                  minutes <= 1             && ['m']           ||
                  minutes < thresholds.m   && ['mm', minutes] ||
                  hours   <= 1             && ['h']           ||
                  hours   < thresholds.h   && ['hh', hours]   ||
                  days    <= 1             && ['d']           ||
                  days    < thresholds.d   && ['dd', days]    ||
                  months  <= 1             && ['M']           ||
                  months  < thresholds.M   && ['MM', months]  ||
                  years   <= 1             && ['y']           || ['yy', years];

          a[2] = withoutSuffix;
          a[3] = +posNegDuration > 0;
          a[4] = locale;
          return substituteTimeAgo.apply(null, a);
      }

      // This function allows you to set the rounding function for relative time strings
      function getSetRelativeTimeRounding (roundingFunction) {
          if (roundingFunction === undefined) {
              return round;
          }
          if (typeof(roundingFunction) === 'function') {
              round = roundingFunction;
              return true;
          }
          return false;
      }

      // This function allows you to set a threshold for relative time strings
      function getSetRelativeTimeThreshold (threshold, limit) {
          if (thresholds[threshold] === undefined) {
              return false;
          }
          if (limit === undefined) {
              return thresholds[threshold];
          }
          thresholds[threshold] = limit;
          if (threshold === 's') {
              thresholds.ss = limit - 1;
          }
          return true;
      }

      function humanize (withSuffix) {
          if (!this.isValid()) {
              return this.localeData().invalidDate();
          }

          var locale = this.localeData();
          var output = relativeTime$1(this, !withSuffix, locale);

          if (withSuffix) {
              output = locale.pastFuture(+this, output);
          }

          return locale.postformat(output);
      }

      var abs$1 = Math.abs;

      function sign(x) {
          return ((x > 0) - (x < 0)) || +x;
      }

      function toISOString$1() {
          // for ISO strings we do not use the normal bubbling rules:
          //  * milliseconds bubble up until they become hours
          //  * days do not bubble at all
          //  * months bubble up until they become years
          // This is because there is no context-free conversion between hours and days
          // (think of clock changes)
          // and also not between days and months (28-31 days per month)
          if (!this.isValid()) {
              return this.localeData().invalidDate();
          }

          var seconds = abs$1(this._milliseconds) / 1000;
          var days         = abs$1(this._days);
          var months       = abs$1(this._months);
          var minutes, hours, years;

          // 3600 seconds -> 60 minutes -> 1 hour
          minutes           = absFloor(seconds / 60);
          hours             = absFloor(minutes / 60);
          seconds %= 60;
          minutes %= 60;

          // 12 months -> 1 year
          years  = absFloor(months / 12);
          months %= 12;


          // inspired by https://github.com/dordille/moment-isoduration/blob/master/moment.isoduration.js
          var Y = years;
          var M = months;
          var D = days;
          var h = hours;
          var m = minutes;
          var s = seconds ? seconds.toFixed(3).replace(/\.?0+$/, '') : '';
          var total = this.asSeconds();

          if (!total) {
              // this is the same as C#'s (Noda) and python (isodate)...
              // but not other JS (goog.date)
              return 'P0D';
          }

          var totalSign = total < 0 ? '-' : '';
          var ymSign = sign(this._months) !== sign(total) ? '-' : '';
          var daysSign = sign(this._days) !== sign(total) ? '-' : '';
          var hmsSign = sign(this._milliseconds) !== sign(total) ? '-' : '';

          return totalSign + 'P' +
              (Y ? ymSign + Y + 'Y' : '') +
              (M ? ymSign + M + 'M' : '') +
              (D ? daysSign + D + 'D' : '') +
              ((h || m || s) ? 'T' : '') +
              (h ? hmsSign + h + 'H' : '') +
              (m ? hmsSign + m + 'M' : '') +
              (s ? hmsSign + s + 'S' : '');
      }

      var proto$2 = Duration.prototype;

      proto$2.isValid        = isValid$1;
      proto$2.abs            = abs;
      proto$2.add            = add$1;
      proto$2.subtract       = subtract$1;
      proto$2.as             = as;
      proto$2.asMilliseconds = asMilliseconds;
      proto$2.asSeconds      = asSeconds;
      proto$2.asMinutes      = asMinutes;
      proto$2.asHours        = asHours;
      proto$2.asDays         = asDays;
      proto$2.asWeeks        = asWeeks;
      proto$2.asMonths       = asMonths;
      proto$2.asQuarters     = asQuarters;
      proto$2.asYears        = asYears;
      proto$2.valueOf        = valueOf$1;
      proto$2._bubble        = bubble;
      proto$2.clone          = clone$1;
      proto$2.get            = get$2;
      proto$2.milliseconds   = milliseconds;
      proto$2.seconds        = seconds;
      proto$2.minutes        = minutes;
      proto$2.hours          = hours;
      proto$2.days           = days;
      proto$2.weeks          = weeks;
      proto$2.months         = months;
      proto$2.years          = years;
      proto$2.humanize       = humanize;
      proto$2.toISOString    = toISOString$1;
      proto$2.toString       = toISOString$1;
      proto$2.toJSON         = toISOString$1;
      proto$2.locale         = locale;
      proto$2.localeData     = localeData;

      proto$2.toIsoString = deprecate('toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)', toISOString$1);
      proto$2.lang = lang;

      // Side effect imports

      // FORMATTING

      addFormatToken('X', 0, 0, 'unix');
      addFormatToken('x', 0, 0, 'valueOf');

      // PARSING

      addRegexToken('x', matchSigned);
      addRegexToken('X', matchTimestamp);
      addParseToken('X', function (input, array, config) {
          config._d = new Date(parseFloat(input, 10) * 1000);
      });
      addParseToken('x', function (input, array, config) {
          config._d = new Date(toInt(input));
      });

      // Side effect imports


      hooks.version = '2.24.0';

      setHookCallback(createLocal);

      hooks.fn                    = proto;
      hooks.min                   = min;
      hooks.max                   = max;
      hooks.now                   = now;
      hooks.utc                   = createUTC;
      hooks.unix                  = createUnix;
      hooks.months                = listMonths;
      hooks.isDate                = isDate;
      hooks.locale                = getSetGlobalLocale;
      hooks.invalid               = createInvalid;
      hooks.duration              = createDuration;
      hooks.isMoment              = isMoment;
      hooks.weekdays              = listWeekdays;
      hooks.parseZone             = createInZone;
      hooks.localeData            = getLocale;
      hooks.isDuration            = isDuration;
      hooks.monthsShort           = listMonthsShort;
      hooks.weekdaysMin           = listWeekdaysMin;
      hooks.defineLocale          = defineLocale;
      hooks.updateLocale          = updateLocale;
      hooks.locales               = listLocales;
      hooks.weekdaysShort         = listWeekdaysShort;
      hooks.normalizeUnits        = normalizeUnits;
      hooks.relativeTimeRounding  = getSetRelativeTimeRounding;
      hooks.relativeTimeThreshold = getSetRelativeTimeThreshold;
      hooks.calendarFormat        = getCalendarFormat;
      hooks.prototype             = proto;

      // currently HTML5 input type only supports 24-hour formats
      hooks.HTML5_FMT = {
          DATETIME_LOCAL: 'YYYY-MM-DDTHH:mm',             // <input type="datetime-local" />
          DATETIME_LOCAL_SECONDS: 'YYYY-MM-DDTHH:mm:ss',  // <input type="datetime-local" step="1" />
          DATETIME_LOCAL_MS: 'YYYY-MM-DDTHH:mm:ss.SSS',   // <input type="datetime-local" step="0.001" />
          DATE: 'YYYY-MM-DD',                             // <input type="date" />
          TIME: 'HH:mm',                                  // <input type="time" />
          TIME_SECONDS: 'HH:mm:ss',                       // <input type="time" step="1" />
          TIME_MS: 'HH:mm:ss.SSS',                        // <input type="time" step="0.001" />
          WEEK: 'GGGG-[W]WW',                             // <input type="week" />
          MONTH: 'YYYY-MM'                                // <input type="month" />
      };

      return hooks;

  })));
  });

  var cs = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
      typeof commonjsRequire === 'function' ? factory(moment) :
     
     factory(global.moment);
  }(commonjsGlobal, (function (moment) {

      var months = 'leden_únor_březen_duben_květen_červen_červenec_srpen_září_říjen_listopad_prosinec'.split('_'),
          monthsShort = 'led_úno_bře_dub_kvě_čvn_čvc_srp_zář_říj_lis_pro'.split('_');

      var monthsParse = [/^led/i, /^úno/i, /^bře/i, /^dub/i, /^kvě/i, /^(čvn|červen$|června)/i, /^(čvc|červenec|července)/i, /^srp/i, /^zář/i, /^říj/i, /^lis/i, /^pro/i];
      // NOTE: 'červen' is substring of 'červenec'; therefore 'červenec' must precede 'červen' in the regex to be fully matched.
      // Otherwise parser matches '1. červenec' as '1. červen' + 'ec'.
      var monthsRegex = /^(leden|únor|březen|duben|květen|červenec|července|červen|června|srpen|září|říjen|listopad|prosinec|led|úno|bře|dub|kvě|čvn|čvc|srp|zář|říj|lis|pro)/i;

      function plural(n) {
          return (n > 1) && (n < 5) && (~~(n / 10) !== 1);
      }
      function translate(number, withoutSuffix, key, isFuture) {
          var result = number + ' ';
          switch (key) {
              case 's':  // a few seconds / in a few seconds / a few seconds ago
                  return (withoutSuffix || isFuture) ? 'pár sekund' : 'pár sekundami';
              case 'ss': // 9 seconds / in 9 seconds / 9 seconds ago
                  if (withoutSuffix || isFuture) {
                      return result + (plural(number) ? 'sekundy' : 'sekund');
                  } else {
                      return result + 'sekundami';
                  }
              case 'm':  // a minute / in a minute / a minute ago
                  return withoutSuffix ? 'minuta' : (isFuture ? 'minutu' : 'minutou');
              case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
                  if (withoutSuffix || isFuture) {
                      return result + (plural(number) ? 'minuty' : 'minut');
                  } else {
                      return result + 'minutami';
                  }
              case 'h':  // an hour / in an hour / an hour ago
                  return withoutSuffix ? 'hodina' : (isFuture ? 'hodinu' : 'hodinou');
              case 'hh': // 9 hours / in 9 hours / 9 hours ago
                  if (withoutSuffix || isFuture) {
                      return result + (plural(number) ? 'hodiny' : 'hodin');
                  } else {
                      return result + 'hodinami';
                  }
              case 'd':  // a day / in a day / a day ago
                  return (withoutSuffix || isFuture) ? 'den' : 'dnem';
              case 'dd': // 9 days / in 9 days / 9 days ago
                  if (withoutSuffix || isFuture) {
                      return result + (plural(number) ? 'dny' : 'dní');
                  } else {
                      return result + 'dny';
                  }
              case 'M':  // a month / in a month / a month ago
                  return (withoutSuffix || isFuture) ? 'měsíc' : 'měsícem';
              case 'MM': // 9 months / in 9 months / 9 months ago
                  if (withoutSuffix || isFuture) {
                      return result + (plural(number) ? 'měsíce' : 'měsíců');
                  } else {
                      return result + 'měsíci';
                  }
              case 'y':  // a year / in a year / a year ago
                  return (withoutSuffix || isFuture) ? 'rok' : 'rokem';
              case 'yy': // 9 years / in 9 years / 9 years ago
                  if (withoutSuffix || isFuture) {
                      return result + (plural(number) ? 'roky' : 'let');
                  } else {
                      return result + 'lety';
                  }
          }
      }

      var cs = moment.defineLocale('cs', {
          months : months,
          monthsShort : monthsShort,
          monthsRegex : monthsRegex,
          monthsShortRegex : monthsRegex,
          // NOTE: 'červen' is substring of 'červenec'; therefore 'červenec' must precede 'červen' in the regex to be fully matched.
          // Otherwise parser matches '1. červenec' as '1. červen' + 'ec'.
          monthsStrictRegex : /^(leden|ledna|února|únor|březen|března|duben|dubna|květen|května|červenec|července|červen|června|srpen|srpna|září|říjen|října|listopadu|listopad|prosinec|prosince)/i,
          monthsShortStrictRegex : /^(led|úno|bře|dub|kvě|čvn|čvc|srp|zář|říj|lis|pro)/i,
          monthsParse : monthsParse,
          longMonthsParse : monthsParse,
          shortMonthsParse : monthsParse,
          weekdays : 'neděle_pondělí_úterý_středa_čtvrtek_pátek_sobota'.split('_'),
          weekdaysShort : 'ne_po_út_st_čt_pá_so'.split('_'),
          weekdaysMin : 'ne_po_út_st_čt_pá_so'.split('_'),
          longDateFormat : {
              LT: 'H:mm',
              LTS : 'H:mm:ss',
              L : 'DD.MM.YYYY',
              LL : 'D. MMMM YYYY',
              LLL : 'D. MMMM YYYY H:mm',
              LLLL : 'dddd D. MMMM YYYY H:mm',
              l : 'D. M. YYYY'
          },
          calendar : {
              sameDay: '[dnes v] LT',
              nextDay: '[zítra v] LT',
              nextWeek: function () {
                  switch (this.day()) {
                      case 0:
                          return '[v neděli v] LT';
                      case 1:
                      case 2:
                          return '[v] dddd [v] LT';
                      case 3:
                          return '[ve středu v] LT';
                      case 4:
                          return '[ve čtvrtek v] LT';
                      case 5:
                          return '[v pátek v] LT';
                      case 6:
                          return '[v sobotu v] LT';
                  }
              },
              lastDay: '[včera v] LT',
              lastWeek: function () {
                  switch (this.day()) {
                      case 0:
                          return '[minulou neděli v] LT';
                      case 1:
                      case 2:
                          return '[minulé] dddd [v] LT';
                      case 3:
                          return '[minulou středu v] LT';
                      case 4:
                      case 5:
                          return '[minulý] dddd [v] LT';
                      case 6:
                          return '[minulou sobotu v] LT';
                  }
              },
              sameElse: 'L'
          },
          relativeTime : {
              future : 'za %s',
              past : 'před %s',
              s : translate,
              ss : translate,
              m : translate,
              mm : translate,
              h : translate,
              hh : translate,
              d : translate,
              dd : translate,
              M : translate,
              MM : translate,
              y : translate,
              yy : translate
          },
          dayOfMonthOrdinalParse : /\d{1,2}\./,
          ordinal : '%d.',
          week : {
              dow : 1, // Monday is the first day of the week.
              doy : 4  // The week that contains Jan 4th is the first week of the year.
          }
      });

      return cs;

  })));
  });

  var de = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
      typeof commonjsRequire === 'function' ? factory(moment) :
     
     factory(global.moment);
  }(commonjsGlobal, (function (moment) {

      function processRelativeTime(number, withoutSuffix, key, isFuture) {
          var format = {
              'm': ['eine Minute', 'einer Minute'],
              'h': ['eine Stunde', 'einer Stunde'],
              'd': ['ein Tag', 'einem Tag'],
              'dd': [number + ' Tage', number + ' Tagen'],
              'M': ['ein Monat', 'einem Monat'],
              'MM': [number + ' Monate', number + ' Monaten'],
              'y': ['ein Jahr', 'einem Jahr'],
              'yy': [number + ' Jahre', number + ' Jahren']
          };
          return withoutSuffix ? format[key][0] : format[key][1];
      }

      var de = moment.defineLocale('de', {
          months : 'Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember'.split('_'),
          monthsShort : 'Jan._Feb._März_Apr._Mai_Juni_Juli_Aug._Sep._Okt._Nov._Dez.'.split('_'),
          monthsParseExact : true,
          weekdays : 'Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag'.split('_'),
          weekdaysShort : 'So._Mo._Di._Mi._Do._Fr._Sa.'.split('_'),
          weekdaysMin : 'So_Mo_Di_Mi_Do_Fr_Sa'.split('_'),
          weekdaysParseExact : true,
          longDateFormat : {
              LT: 'HH:mm',
              LTS: 'HH:mm:ss',
              L : 'DD.MM.YYYY',
              LL : 'D. MMMM YYYY',
              LLL : 'D. MMMM YYYY HH:mm',
              LLLL : 'dddd, D. MMMM YYYY HH:mm'
          },
          calendar : {
              sameDay: '[heute um] LT [Uhr]',
              sameElse: 'L',
              nextDay: '[morgen um] LT [Uhr]',
              nextWeek: 'dddd [um] LT [Uhr]',
              lastDay: '[gestern um] LT [Uhr]',
              lastWeek: '[letzten] dddd [um] LT [Uhr]'
          },
          relativeTime : {
              future : 'in %s',
              past : 'vor %s',
              s : 'ein paar Sekunden',
              ss : '%d Sekunden',
              m : processRelativeTime,
              mm : '%d Minuten',
              h : processRelativeTime,
              hh : '%d Stunden',
              d : processRelativeTime,
              dd : processRelativeTime,
              M : processRelativeTime,
              MM : processRelativeTime,
              y : processRelativeTime,
              yy : processRelativeTime
          },
          dayOfMonthOrdinalParse: /\d{1,2}\./,
          ordinal : '%d.',
          week : {
              dow : 1, // Monday is the first day of the week.
              doy : 4  // The week that contains Jan 4th is the first week of the year.
          }
      });

      return de;

  })));
  });

  var fr = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
      typeof commonjsRequire === 'function' ? factory(moment) :
     
     factory(global.moment);
  }(commonjsGlobal, (function (moment) {

      var fr = moment.defineLocale('fr', {
          months : 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
          monthsShort : 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
          monthsParseExact : true,
          weekdays : 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
          weekdaysShort : 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
          weekdaysMin : 'di_lu_ma_me_je_ve_sa'.split('_'),
          weekdaysParseExact : true,
          longDateFormat : {
              LT : 'HH:mm',
              LTS : 'HH:mm:ss',
              L : 'DD/MM/YYYY',
              LL : 'D MMMM YYYY',
              LLL : 'D MMMM YYYY HH:mm',
              LLLL : 'dddd D MMMM YYYY HH:mm'
          },
          calendar : {
              sameDay : '[Aujourd’hui à] LT',
              nextDay : '[Demain à] LT',
              nextWeek : 'dddd [à] LT',
              lastDay : '[Hier à] LT',
              lastWeek : 'dddd [dernier à] LT',
              sameElse : 'L'
          },
          relativeTime : {
              future : 'dans %s',
              past : 'il y a %s',
              s : 'quelques secondes',
              ss : '%d secondes',
              m : 'une minute',
              mm : '%d minutes',
              h : 'une heure',
              hh : '%d heures',
              d : 'un jour',
              dd : '%d jours',
              M : 'un mois',
              MM : '%d mois',
              y : 'un an',
              yy : '%d ans'
          },
          dayOfMonthOrdinalParse: /\d{1,2}(er|)/,
          ordinal : function (number, period) {
              switch (period) {
                  // TODO: Return 'e' when day of month > 1. Move this case inside
                  // block for masculine words below.
                  // See https://github.com/moment/moment/issues/3375
                  case 'D':
                      return number + (number === 1 ? 'er' : '');

                  // Words with masculine grammatical gender: mois, trimestre, jour
                  default:
                  case 'M':
                  case 'Q':
                  case 'DDD':
                  case 'd':
                      return number + (number === 1 ? 'er' : 'e');

                  // Words with feminine grammatical gender: semaine
                  case 'w':
                  case 'W':
                      return number + (number === 1 ? 're' : 'e');
              }
          },
          week : {
              dow : 1, // Monday is the first day of the week.
              doy : 4  // The week that contains Jan 4th is the first week of the year.
          }
      });

      return fr;

  })));
  });

  var it = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
      typeof commonjsRequire === 'function' ? factory(moment) :
     
     factory(global.moment);
  }(commonjsGlobal, (function (moment) {

      var it = moment.defineLocale('it', {
          months : 'gennaio_febbraio_marzo_aprile_maggio_giugno_luglio_agosto_settembre_ottobre_novembre_dicembre'.split('_'),
          monthsShort : 'gen_feb_mar_apr_mag_giu_lug_ago_set_ott_nov_dic'.split('_'),
          weekdays : 'domenica_lunedì_martedì_mercoledì_giovedì_venerdì_sabato'.split('_'),
          weekdaysShort : 'dom_lun_mar_mer_gio_ven_sab'.split('_'),
          weekdaysMin : 'do_lu_ma_me_gi_ve_sa'.split('_'),
          longDateFormat : {
              LT : 'HH:mm',
              LTS : 'HH:mm:ss',
              L : 'DD/MM/YYYY',
              LL : 'D MMMM YYYY',
              LLL : 'D MMMM YYYY HH:mm',
              LLLL : 'dddd D MMMM YYYY HH:mm'
          },
          calendar : {
              sameDay: '[Oggi alle] LT',
              nextDay: '[Domani alle] LT',
              nextWeek: 'dddd [alle] LT',
              lastDay: '[Ieri alle] LT',
              lastWeek: function () {
                  switch (this.day()) {
                      case 0:
                          return '[la scorsa] dddd [alle] LT';
                      default:
                          return '[lo scorso] dddd [alle] LT';
                  }
              },
              sameElse: 'L'
          },
          relativeTime : {
              future : function (s) {
                  return ((/^[0-9].+$/).test(s) ? 'tra' : 'in') + ' ' + s;
              },
              past : '%s fa',
              s : 'alcuni secondi',
              ss : '%d secondi',
              m : 'un minuto',
              mm : '%d minuti',
              h : 'un\'ora',
              hh : '%d ore',
              d : 'un giorno',
              dd : '%d giorni',
              M : 'un mese',
              MM : '%d mesi',
              y : 'un anno',
              yy : '%d anni'
          },
          dayOfMonthOrdinalParse : /\d{1,2}º/,
          ordinal: '%dº',
          week : {
              dow : 1, // Monday is the first day of the week.
              doy : 4  // The week that contains Jan 4th is the first week of the year.
          }
      });

      return it;

  })));
  });

  var nl = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
      typeof commonjsRequire === 'function' ? factory(moment) :
     
     factory(global.moment);
  }(commonjsGlobal, (function (moment) {

      var monthsShortWithDots = 'jan._feb._mrt._apr._mei_jun._jul._aug._sep._okt._nov._dec.'.split('_'),
          monthsShortWithoutDots = 'jan_feb_mrt_apr_mei_jun_jul_aug_sep_okt_nov_dec'.split('_');

      var monthsParse = [/^jan/i, /^feb/i, /^maart|mrt.?$/i, /^apr/i, /^mei$/i, /^jun[i.]?$/i, /^jul[i.]?$/i, /^aug/i, /^sep/i, /^okt/i, /^nov/i, /^dec/i];
      var monthsRegex = /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december|jan\.?|feb\.?|mrt\.?|apr\.?|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i;

      var nl = moment.defineLocale('nl', {
          months : 'januari_februari_maart_april_mei_juni_juli_augustus_september_oktober_november_december'.split('_'),
          monthsShort : function (m, format) {
              if (!m) {
                  return monthsShortWithDots;
              } else if (/-MMM-/.test(format)) {
                  return monthsShortWithoutDots[m.month()];
              } else {
                  return monthsShortWithDots[m.month()];
              }
          },

          monthsRegex: monthsRegex,
          monthsShortRegex: monthsRegex,
          monthsStrictRegex: /^(januari|februari|maart|april|mei|ju[nl]i|augustus|september|oktober|november|december)/i,
          monthsShortStrictRegex: /^(jan\.?|feb\.?|mrt\.?|apr\.?|mei|ju[nl]\.?|aug\.?|sep\.?|okt\.?|nov\.?|dec\.?)/i,

          monthsParse : monthsParse,
          longMonthsParse : monthsParse,
          shortMonthsParse : monthsParse,

          weekdays : 'zondag_maandag_dinsdag_woensdag_donderdag_vrijdag_zaterdag'.split('_'),
          weekdaysShort : 'zo._ma._di._wo._do._vr._za.'.split('_'),
          weekdaysMin : 'zo_ma_di_wo_do_vr_za'.split('_'),
          weekdaysParseExact : true,
          longDateFormat : {
              LT : 'HH:mm',
              LTS : 'HH:mm:ss',
              L : 'DD-MM-YYYY',
              LL : 'D MMMM YYYY',
              LLL : 'D MMMM YYYY HH:mm',
              LLLL : 'dddd D MMMM YYYY HH:mm'
          },
          calendar : {
              sameDay: '[vandaag om] LT',
              nextDay: '[morgen om] LT',
              nextWeek: 'dddd [om] LT',
              lastDay: '[gisteren om] LT',
              lastWeek: '[afgelopen] dddd [om] LT',
              sameElse: 'L'
          },
          relativeTime : {
              future : 'over %s',
              past : '%s geleden',
              s : 'een paar seconden',
              ss : '%d seconden',
              m : 'één minuut',
              mm : '%d minuten',
              h : 'één uur',
              hh : '%d uur',
              d : 'één dag',
              dd : '%d dagen',
              M : 'één maand',
              MM : '%d maanden',
              y : 'één jaar',
              yy : '%d jaar'
          },
          dayOfMonthOrdinalParse: /\d{1,2}(ste|de)/,
          ordinal : function (number) {
              return number + ((number === 1 || number === 8 || number >= 20) ? 'ste' : 'de');
          },
          week : {
              dow : 1, // Monday is the first day of the week.
              doy : 4  // The week that contains Jan 4th is the first week of the year.
          }
      });

      return nl;

  })));
  });

  var ru = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
      typeof commonjsRequire === 'function' ? factory(moment) :
     
     factory(global.moment);
  }(commonjsGlobal, (function (moment) {

      function plural(word, num) {
          var forms = word.split('_');
          return num % 10 === 1 && num % 100 !== 11 ? forms[0] : (num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) ? forms[1] : forms[2]);
      }
      function relativeTimeWithPlural(number, withoutSuffix, key) {
          var format = {
              'ss': withoutSuffix ? 'секунда_секунды_секунд' : 'секунду_секунды_секунд',
              'mm': withoutSuffix ? 'минута_минуты_минут' : 'минуту_минуты_минут',
              'hh': 'час_часа_часов',
              'dd': 'день_дня_дней',
              'MM': 'месяц_месяца_месяцев',
              'yy': 'год_года_лет'
          };
          if (key === 'm') {
              return withoutSuffix ? 'минута' : 'минуту';
          }
          else {
              return number + ' ' + plural(format[key], +number);
          }
      }
      var monthsParse = [/^янв/i, /^фев/i, /^мар/i, /^апр/i, /^ма[йя]/i, /^июн/i, /^июл/i, /^авг/i, /^сен/i, /^окт/i, /^ноя/i, /^дек/i];

      // http://new.gramota.ru/spravka/rules/139-prop : § 103
      // Сокращения месяцев: http://new.gramota.ru/spravka/buro/search-answer?s=242637
      // CLDR data:          http://www.unicode.org/cldr/charts/28/summary/ru.html#1753
      var ru = moment.defineLocale('ru', {
          months : {
              format: 'января_февраля_марта_апреля_мая_июня_июля_августа_сентября_октября_ноября_декабря'.split('_'),
              standalone: 'январь_февраль_март_апрель_май_июнь_июль_август_сентябрь_октябрь_ноябрь_декабрь'.split('_')
          },
          monthsShort : {
              // по CLDR именно "июл." и "июн.", но какой смысл менять букву на точку ?
              format: 'янв._февр._мар._апр._мая_июня_июля_авг._сент._окт._нояб._дек.'.split('_'),
              standalone: 'янв._февр._март_апр._май_июнь_июль_авг._сент._окт._нояб._дек.'.split('_')
          },
          weekdays : {
              standalone: 'воскресенье_понедельник_вторник_среда_четверг_пятница_суббота'.split('_'),
              format: 'воскресенье_понедельник_вторник_среду_четверг_пятницу_субботу'.split('_'),
              isFormat: /\[ ?[Вв] ?(?:прошлую|следующую|эту)? ?\] ?dddd/
          },
          weekdaysShort : 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
          weekdaysMin : 'вс_пн_вт_ср_чт_пт_сб'.split('_'),
          monthsParse : monthsParse,
          longMonthsParse : monthsParse,
          shortMonthsParse : monthsParse,

          // полные названия с падежами, по три буквы, для некоторых, по 4 буквы, сокращения с точкой и без точки
          monthsRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,

          // копия предыдущего
          monthsShortRegex: /^(январ[ья]|янв\.?|феврал[ья]|февр?\.?|марта?|мар\.?|апрел[ья]|апр\.?|ма[йя]|июн[ья]|июн\.?|июл[ья]|июл\.?|августа?|авг\.?|сентябр[ья]|сент?\.?|октябр[ья]|окт\.?|ноябр[ья]|нояб?\.?|декабр[ья]|дек\.?)/i,

          // полные названия с падежами
          monthsStrictRegex: /^(январ[яь]|феврал[яь]|марта?|апрел[яь]|ма[яй]|июн[яь]|июл[яь]|августа?|сентябр[яь]|октябр[яь]|ноябр[яь]|декабр[яь])/i,

          // Выражение, которое соотвествует только сокращённым формам
          monthsShortStrictRegex: /^(янв\.|февр?\.|мар[т.]|апр\.|ма[яй]|июн[ья.]|июл[ья.]|авг\.|сент?\.|окт\.|нояб?\.|дек\.)/i,
          longDateFormat : {
              LT : 'H:mm',
              LTS : 'H:mm:ss',
              L : 'DD.MM.YYYY',
              LL : 'D MMMM YYYY г.',
              LLL : 'D MMMM YYYY г., H:mm',
              LLLL : 'dddd, D MMMM YYYY г., H:mm'
          },
          calendar : {
              sameDay: '[Сегодня, в] LT',
              nextDay: '[Завтра, в] LT',
              lastDay: '[Вчера, в] LT',
              nextWeek: function (now) {
                  if (now.week() !== this.week()) {
                      switch (this.day()) {
                          case 0:
                              return '[В следующее] dddd, [в] LT';
                          case 1:
                          case 2:
                          case 4:
                              return '[В следующий] dddd, [в] LT';
                          case 3:
                          case 5:
                          case 6:
                              return '[В следующую] dddd, [в] LT';
                      }
                  } else {
                      if (this.day() === 2) {
                          return '[Во] dddd, [в] LT';
                      } else {
                          return '[В] dddd, [в] LT';
                      }
                  }
              },
              lastWeek: function (now) {
                  if (now.week() !== this.week()) {
                      switch (this.day()) {
                          case 0:
                              return '[В прошлое] dddd, [в] LT';
                          case 1:
                          case 2:
                          case 4:
                              return '[В прошлый] dddd, [в] LT';
                          case 3:
                          case 5:
                          case 6:
                              return '[В прошлую] dddd, [в] LT';
                      }
                  } else {
                      if (this.day() === 2) {
                          return '[Во] dddd, [в] LT';
                      } else {
                          return '[В] dddd, [в] LT';
                      }
                  }
              },
              sameElse: 'L'
          },
          relativeTime : {
              future : 'через %s',
              past : '%s назад',
              s : 'несколько секунд',
              ss : relativeTimeWithPlural,
              m : relativeTimeWithPlural,
              mm : relativeTimeWithPlural,
              h : 'час',
              hh : relativeTimeWithPlural,
              d : 'день',
              dd : relativeTimeWithPlural,
              M : 'месяц',
              MM : relativeTimeWithPlural,
              y : 'год',
              yy : relativeTimeWithPlural
          },
          meridiemParse: /ночи|утра|дня|вечера/i,
          isPM : function (input) {
              return /^(дня|вечера)$/.test(input);
          },
          meridiem : function (hour, minute, isLower) {
              if (hour < 4) {
                  return 'ночи';
              } else if (hour < 12) {
                  return 'утра';
              } else if (hour < 17) {
                  return 'дня';
              } else {
                  return 'вечера';
              }
          },
          dayOfMonthOrdinalParse: /\d{1,2}-(й|го|я)/,
          ordinal: function (number, period) {
              switch (period) {
                  case 'M':
                  case 'd':
                  case 'DDD':
                      return number + '-й';
                  case 'D':
                      return number + '-го';
                  case 'w':
                  case 'W':
                      return number + '-я';
                  default:
                      return number;
              }
          },
          week : {
              dow : 1, // Monday is the first day of the week.
              doy : 4  // The week that contains Jan 4th is the first week of the year.
          }
      });

      return ru;

  })));
  });

  const BASE_PATH_WEATHER = 'https://tourism.opendatahub.bz.it/api/Weather';

  async function basic_weather_request() {
    let language =
      this.language_translation === 'en' || this.language_translation === 'it' || this.language_translation === 'de'
        ? this.language_translation
        : 'en';
    let request = await fetch(this.base_url + `?language=${language}`, {
      method: 'GET',
      headers: new Headers({
        Accept: 'application/json',
        Authorization: `Bearer ${this.token}`
      })
    });

    const response = await request.json();
    this.weather_data = response;
    return response;
  }

  async function districts_details_api_call() {
    this.is_loading = true;
    let language =
      this.language_translation === 'en' || this.language_translation === 'it' || this.language_translation === 'de'
        ? this.language_translation
        : 'en';
    let tmp_districs_details = [];
    for (let i = 1; i < 8; i++) {
      let request = await fetch(`${BASE_PATH_WEATHER}/District?language=${language}&locfilter=${i}`, {
        method: 'GET',
        headers: new Headers({
          Accept: 'application/json',
          Authorization: `Bearer ${this.token}`
        })
      });
      const response = await request.json();
      tmp_districs_details = [...tmp_districs_details, response];
    }
    this.districts_details = [...tmp_districs_details];
    return [...tmp_districs_details];
  }

  /**
   * All translations mapped
   */
  const p = {
    weather_in_south_tyrol: {
      en: 'Weather in South Tyrol',
      de: 'Das aktuelle Wetter in Südtirol',
      it: 'Meteo Alto Adige',
      nl: 'Weer',
      cs: 'Počasí',
      pl: 'Pogoda',
      fr: 'Météo',
      ru: 'Погода'
    },
    today: {
      en: 'today',
      de: 'heute',
      it: 'oggi',
      nl: 'today',
      cs: 'today',
      pl: 'today',
      fr: 'today',
      ru: 'today'
    },
    dolomiti: {
      en: 'Dolomiti',
      de: 'Dolomiten',
      it: 'Dolomiti',
      nl: 'Dolomiti',
      cs: 'Dolomiti',
      pl: 'Dolomiti',
      fr: 'Dolomiti',
      ru: 'Dolomiti'
    }
  };

  const placeholder_places = [
    {
      Id: 1,
      CityName: 'Silandro',
      WeatherCode: 'a',
      MinTemp: -7,
      Maxtemp: 2
    },
    {
      Id: 2,
      CityName: 'Merano',
      WeatherCode: 'b',
      MinTemp: -6,
      Maxtemp: 5
    },
    {
      Id: 3,
      CityName: 'Bolzano',
      WeatherCode: 'b',
      MinTemp: -5,
      Maxtemp: 5
    },
    {
      Id: 4,
      CityName: 'Vipiteno',
      WeatherCode: 'a',
      MinTemp: -13,
      Maxtemp: -1
    },
    {
      Id: 5,
      CityName: 'Bressanone',
      WeatherCode: 'b',
      MinTemp: -7,
      Maxtemp: 3
    },
    {
      Id: 6,
      CityName: 'Brunico',
      WeatherCode: 'b',
      MinTemp: -15,
      Maxtemp: -1
    },
    {
      Id: 7,
      CityName: 'Dolomiten',
      WeatherCode: 'b',
      MinTemp: -15,
      Maxtemp: -1
    }
  ];
  function render__placehoder(custom_class) {
    return html`
    <div class="loader__placeholder ${custom_class}"><div class="line"></div></div>
  `;
  }

  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this,
        args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }

  const district_city_assoc = {
    1: 3,
    2: 2,
    3: 1,
    4: 5,
    5: 4,
    6: 6
  };

  function render__carousel__card(header_img_src, location, today, today_string, language) {
    return html`
    <li class="glide__slide">
      <div class="carousel__card">
        <div class="carousel__card__header_img" style="background-image: url('${header_img_src}');"></div>
        <div class="carousel__card__body">
          ${today && today.WeatherCode
            ? html`
                <div class="carousel__card__body__weather_icon">
                  <img
                    style=""
                    src=${`https://www.suedtirol.info/static/img/weatherIcons/${today ? today.WeatherCode : ''}.svg`}
                  />
                </div>
              `
            : null}
          <div
            class="carousel__card__body__text_container"
            style="${today && !today.WeatherCode ? 'margin-left: 8px;' : ''}"
          >
            <div class="carousel__card__body__v_align_middle">
              <p class="carousel__card__body__location">${location}</p>
              ${today && today.temp_string
                ? html`
                    <p>${today.temp_string}</p>
                  `
                : ''}
              ${today && `${today.MaxTemp}` && !today.temp_string
                ? html`
                    <div class="temp-color-max"><span>${today.MaxTemp}</span>°C</div>
                  `
                : null}
              ${today && `${today.MinTemp}` && !today.temp_string
                ? html`
                    <div class="temp-color-min">${' '}/ ${today.MinTemp}°C</div>
                  `
                : null}
            </div>
          </div>
          <div class="carousel__card__body__date">
            <p>
              ${today_string},
              ${today
                ? moment(today.date).format(language === 'de' ? 'dddd DD.MM.YYYY' : 'dddd DD/MM/YYYY')
                : // .toLocaleLowerCase()
                  ''}
            </p>
          </div>
        </div>
      </div>
    </li>
  `;
  }

  function render__carousel(localities_today) {
    if (!this.districts_details || !this.weather_data || !localities_today.length) {
      return render__placehoder('map__slider');
    }

    moment.locale(this.language_translation);
    let today_string = p.today[this.language_translation];
    let bolzano_for_suedtirol = this.districts_details[0];

    let placeholder_image =
      'https://img-aws.ehowcdn.com/877x500p/s3-us-west-1.amazonaws.com/contentlab.studiod/getty/f24b4a7bf9f24d1ba5f899339e6949f3';

    return html`
    <div id="district_slider">
      <div id="main_slider" class="glide">
        <div class="glide__track" data-glide-el="track">
          <ul class="glide__slides">
            ${bolzano_for_suedtirol
              ? render__carousel__card(
                  placeholder_image,
                  'Südtirol',
                  bolzano_for_suedtirol.BezirksForecast[0],
                  today_string,
                  this.language_translation
                )
              : null}
            ${this.districts_details.map(o => {
              const { BezirksForecast } = o;

              const city = localities_today.filter(c => c.Id === district_city_assoc[o.Id]);
              let city_name = '';
              if (city.length) {
                city_name = city[0].CityName.split('/')[0];
              } else {
                city_name = p.dolomiti[this.language_translation];
              }

              return html`
                ${render__carousel__card(placeholder_image, city_name, BezirksForecast[0], today_string)}
              `;
            })}
          </ul>
        </div>
        <div class="glide__arrows" data-glide-el="controls">
          <button class="glide__arrow glide__arrow--left" data-glide-dir="<">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 501.5 501.5">
              <g>
                <path
                  fill="#2E435A"
                  d="M302.67 90.877l55.77 55.508L254.575 250.75 358.44 355.116l-55.77 55.506L143.56 250.75z"
                />
              </g>
            </svg>
          </button>
          <button class="glide__arrow glide__arrow--right" data-glide-dir=">">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 501.5 501.5">
              <g>
                <path
                  fill="#2E435A"
                  d="M199.33 410.622l-55.77-55.508L247.425 250.75 143.56 146.384l55.77-55.507L358.44 250.75z"
                />
              </g>
            </svg>
          </button>
        </div>
      </div>
    </div>
  `;
  }

  // <div class="glide__bullets" data-glide-el="controls[nav]">
  //   <button class="glide__bullet" data-glide-dir="=0"></button> ${this.districts_details.map((o, i) => {
  //     return html`
  //       <button class="glide__bullet" data-glide-dir="=${i + 1}"></button>
  //     `;
  //   })}
  // </div>

  function render__location(location, name, max_temp, min_temp, weather_code, placeholder_mod) {
    let class__weather__icon = `weather-map-new__icon weather-map-new__icon--${location}`;
    return html`
    <a class="weather-map-new__info" href="#">
      ${placeholder_mod
        ? html`
            <div class="${class__weather__icon}">
              ${render__placehoder('loader__placeholder__super_small map__icon')}
            </div>
          `
        : html`
            <img
              src="https://www.suedtirol.info/static/img/weatherIcons/${weather_code}.svg"
              class="${class__weather__icon}"
            />
          `}
      <div class="weather-map-new__temp weather-map-new__temp--${location}">
        <div class="temp-color-max">
          ${placeholder_mod ? render__placehoder('loader__placeholder__super_small map__temp') : max_temp + '°'}
        </div>
        <div class="temp-color-min">${placeholder_mod ? null : min_temp + '°'}</div>
      </div>
      <div class="weather-map-new__town weather-map-new__town--${location}">
        ${placeholder_mod ? render__placehoder('map__town') : name}
      </div>
    </a>
  `;
  }

  var style__carousel_card = "@media only screen and (min-width: 320px) {\n  .carousel__card {\n    width: 100%;\n  }\n\n  .carousel__card__header_img {\n    height: 264px;\n    background-size: cover;\n  }\n\n  .carousel__card__body {\n    height: 200px;\n    background-color: #fff;\n    display: flex;\n    flex-wrap: wrap;\n  }\n\n  .carousel__card__body__weather_icon {\n    width: 110px;\n    padding: 8px 16px 8px 8px;\n    flex: initial;\n  }\n\n  .carousel__card__body__weather_icon img {\n    width: 100%;\n  }\n\n  .carousel__card__body__location {\n    font-size: 22px;\n    margin: 0 0 8px 0;\n  }\n\n  .carousel__card .temp-color-max,\n  .carousel__card .temp-color-min {\n    font-size: 20px;\n    display: inline-block;\n  }\n\n  .carousel__card .temp-color-max span {\n    font-size: 30px;\n  }\n\n  .carousel__card__body__v_align_middle {\n    position: relative;\n    top: 50%;\n    transform: translateY(-50%);\n    padding-right: 8px;\n  }\n\n  .carousel__card__body__date {\n    flex: 0 0 100%;\n    line-height: 30px;\n    font-size: 14px;\n    font-weight: 400;\n    padding: 0 8px;\n  }\n  .carousel__card__body__date p {\n    margin: 0;\n  }\n\n  .carousel__card__body__text_container {\n    height: 160px;\n    flex: 2;\n    font-family: 'Suedtirol', 'KievitWebPro', sans-serif;\n  }\n\n  /* WALLOP CUSTOM CODE */\n  .Wallop-buttonNext,\n  .Wallop-buttonPrevious {\n    border: none;\n    background: hsla(0, 0%, 100%, 0.7);\n    width: 40px;\n    height: 40px;\n    border-radius: 20px;\n    position: absolute;\n    top: 40%;\n    -webkit-transform: translateY(-50%);\n    transform: translateY(-50%);\n    z-index: 3;\n    padding: 0;\n  }\n  .Wallop-buttonNext:focus,\n  .Wallop-buttonPrevious:focus {\n    outline: none;\n  }\n  .Wallop-buttonPrevious {\n    left: 1pc;\n    padding-right: 2px;\n  }\n  .Wallop-buttonNext {\n    right: 1pc;\n    padding-left: 2px;\n  }\n}\n\n@media only screen and (min-width: 1024px) {\n  .carousel__card__body__location {\n    font-size: 2rem;\n  }\n  .carousel__card__body__weather_icon {\n    width: 130px;\n  }\n  .carousel__card .temp-color-max,\n  .carousel__card .temp-color-min {\n    font-size: 1.625rem;\n  }\n  .carousel__card .temp-color-max span {\n    font-size: 3.5rem;\n  }\n}\n";

  var style_glide_theme = "@media only screen and (min-width: 320px) {\n  .glide__arrow {\n    display: none;\n    position: absolute;\n    top: 42%;\n    z-index: 2;\n    color: white;\n    border: 0;\n    background-color: #f1f3f4;\n    padding: 11px 12px;\n    cursor: pointer;\n    opacity: 0.6;\n  }\n  .glide__arrow:focus {\n    outline: none;\n  }\n  .glide__arrow:hover {\n    border-color: white;\n  }\n  .glide__arrow--left {\n    left: 16px;\n  }\n  .glide__arrow--right {\n    right: 16px;\n  }\n\n  .glide__arrow--left svg {\n    margin-right: 4px;\n  }\n  .glide__arrow--right svg {\n    margin-left: 4px;\n  }\n\n  .glide__arrow--disabled {\n    opacity: 0.33;\n  }\n\n  .glide__bullets {\n    position: absolute;\n    z-index: 2;\n    bottom: -8px;\n    left: 50%;\n    display: inline-flex;\n    list-style: none;\n    transform: translateX(-50%);\n  }\n\n  .glide__bullet {\n    background-color: #c7ced2;\n    width: 16px;\n    height: 16px;\n    padding: 0;\n    border-radius: 50%;\n    border: 2px solid transparent;\n    transition: all 100ms ease-in-out;\n    cursor: pointer;\n    line-height: 0;\n    margin: 0 0.25em;\n  }\n  .glide__bullet:focus {\n    outline: none;\n  }\n\n  .glide__bullet--active {\n    background-color: #b31939;\n  }\n\n  .glide--swipeable {\n    cursor: grab;\n    cursor: -moz-grab;\n    cursor: -webkit-grab;\n  }\n\n  .glide--dragging {\n    cursor: grabbing;\n    cursor: -moz-grabbing;\n    cursor: -webkit-grabbing;\n  }\n}\n@media only screen and (min-width: 768px) {\n  .glide__arrow {\n    display: block;\n  }\n}\n@media only screen and (min-width: 1024px) {\n}\n";

  var style_glide_core = ".glide {\n  position: relative;\n  width: 100%;\n  box-sizing: border-box; }\n  .glide * {\n    box-sizing: inherit; }\n  .glide__track {\n    overflow: hidden; }\n  .glide__slides {\n    position: relative;\n    width: 100%;\n    list-style: none;\n    backface-visibility: hidden;\n    transform-style: preserve-3d;\n    touch-action: pan-Y;\n    overflow: hidden;\n    padding: 0;\n    white-space: nowrap;\n    display: flex;\n    flex-wrap: nowrap;\n    will-change: transform; }\n    .glide__slides--dragging {\n      user-select: none; }\n  .glide__slide {\n    width: 100%;\n    height: 100%;\n    flex-shrink: 0;\n    white-space: normal;\n    user-select: none;\n    -webkit-touch-callout: none;\n    -webkit-tap-highlight-color: transparent; }\n    .glide__slide a {\n      user-select: none;\n      -webkit-user-drag: none;\n      -moz-user-select: none;\n      -ms-user-select: none; }\n  .glide__arrows {\n    -webkit-touch-callout: none;\n    user-select: none; }\n  .glide__bullets {\n    -webkit-touch-callout: none;\n    user-select: none; }\n  .glide--rtl {\n    direction: rtl; }\n";

  var main = "@media only screen and (min-width: 320px) {\n  .meteo_widget {\n    font-family: 'Suedtirol', 'KievitWebPro', sans-serif;\n    position: relative;\n  }\n\n  .meteo_widget__map_container__responsive_manger {\n    width: 100%;\n  }\n\n  .meteo_widget__map_container {\n    width: calc(100% - 16px);\n    position: relative;\n    margin-bottom: 36px;\n    padding: 8px;\n  }\n\n  /* General absolute sytle */\n  .weather-map-new__info {\n    pointer-events: none;\n  }\n  .weather-map-new__icon {\n    display: none;\n  }\n\n  .weather-map-new__temp {\n    display: none;\n  }\n\n  .weather-map-new__town {\n    display: inline-block;\n    position: absolute;\n    line-height: 1.1;\n    -webkit-transform: translateX(-50%);\n    font-family: 'Suedtirol', 'KievitWebPro', sans-serif;\n    color: #50742f;\n    -ms-transform: translateX(-50%);\n    transform: translateX(-50%);\n    text-align: center;\n    font-size: 12px;\n    pointer-events: none;\n    font-weight: 300;\n  }\n\n  .temp-color-max {\n    color: #b31939;\n  }\n  /* Loaders */\n  .loader__placeholder.map__town {\n    width: 80px;\n    height: 14px;\n    box-shadow: rgba(0, 0, 0, 0.08) 0 3px 13px 1px;\n  }\n  .loader__placeholder.map__slider {\n    width: 90%;\n    height: 464px;\n    box-shadow: rgba(0, 0, 0, 0.08) 0 3px 13px 1px;\n    margin: 0 auto;\n  }\n\n  #txt_DT_dolo_regionen_ .weather-map-town {\n    pointer-events: none;\n  }\n}\n\n@media only screen and (min-width: 768px) {\n}\n\n@media only screen and (min-width: 1024px) {\n  .loader__placeholder.map__town {\n    width: 80px;\n    height: 14px;\n    box-shadow: rgba(0, 0, 0, 0.08) 0 3px 13px 1px;\n  }\n  .loader__placeholder.map__temp {\n    width: 18px;\n    height: 32px;\n    box-shadow: rgba(0, 0, 0, 0.08) 0 3px 13px 1px;\n  }\n  .loader__placeholder.map__icon {\n    width: 40px;\n    height: 40px;\n    box-shadow: rgba(0, 0, 0, 0.08) 0 3px 13px 1px;\n  }\n  .loader__placeholder.map__slider {\n    width: 90%;\n    height: 464px;\n    box-shadow: rgba(0, 0, 0, 0.08) 0 3px 13px 1px;\n  }\n}\n\n@media only screen and (min-width: 1200px) {\n  .meteo_widget__content {\n    display: flex;\n    justify-content: space-between;\n  }\n\n  .meteo_widget__overlay {\n    position: absolute;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    right: 0;\n    z-index: 4;\n  }\n\n  .meteo_widget__map_container__responsive_manger {\n    width: calc(100% - 200px);\n    padding: 0;\n  }\n\n  .meteo_widget__map_container {\n    padding: 0;\n  }\n\n  .meteo_date_title {\n    text-align: center;\n  }\n\n  /* General absolute sytle*/\n  .weather-map-new__icon {\n    position: absolute;\n    width: 6.69%;\n    height: 7.7689%;\n    width: 40px;\n    height: 40px;\n    pointer-events: none;\n    display: block;\n  }\n\n  .weather-map-new__temp {\n    position: absolute;\n    font-weight: 600;\n    line-height: 1;\n    color: #333;\n    font-size: 18px;\n    pointer-events: none;\n    font-family: 'Suedtirol', 'KievitWebPro', sans-serif;\n    display: block;\n  }\n\n  .weather-map-new__town {\n    font-size: 16px;\n  }\n\n  .meteo_widget__map_container__responsive_manger {\n    overflow-x: hidden;\n  }\n\n  /* Loaders */\n  .loader__placeholder.map__slider {\n    width: 392px;\n    margin-right: 0;\n  }\n}\n\n/* ################## */\n/* FORECAST */\n/* ################## */\n\n@media only screen and (min-width: 320px) {\n  #district_slider {\n    width: 90%;\n    margin: 0 auto;\n  }\n  .forecast {\n    display: flex;\n    flex-direction: row;\n    flex-wrap: wrap;\n    margin-top: 16px;\n  }\n\n  .forecast__item {\n    width: 50%;\n    text-align: center;\n    margin-top: 32px;\n  }\n\n  .forecast__item__day {\n    margin-bottom: 16px;\n  }\n\n  .forecast__item__icon {\n    width: 60px;\n    display: table;\n    margin: 0 auto;\n  }\n\n  .forecast__item__temp {\n    font-size: 18px;\n    font-weight: 400;\n    color: #333;\n    font-size: 24px;\n    line-height: 34px;\n    margin-top: 10px;\n  }\n\n  .forecast__item__temp span:first-child {\n    color: #b31939;\n  }\n\n  .forecast__item__temp span:last-child {\n    margin-left: 8px;\n  }\n\n  .forecast__item__rain_icon {\n    display: inline-block;\n    width: 30px;\n    vertical-align: baseline;\n  }\n  /* Loaders */\n  .forecast__date {\n    width: 100px;\n    height: 20px;\n    box-shadow: rgba(0, 0, 0, 0.08) 0 3px 13px 1px;\n    margin: 0 auto;\n    margin-bottom: 24px;\n  }\n  .forecast__icon {\n    width: 60px;\n    height: 60px;\n    box-shadow: rgba(0, 0, 0, 0.08) 0 3px 13px 1px;\n    margin: 0 auto;\n    margin-bottom: 24px;\n  }\n  .forecast__rain {\n    width: 100px;\n    height: 20px;\n    box-shadow: rgba(0, 0, 0, 0.08) 0 3px 13px 1px;\n    margin: 0 auto;\n  }\n}\n\n@media only screen and (min-width: 768px) {\n  .forecast__item__icon {\n    width: 120px;\n  }\n  /* Loaders */\n  .forecast__icon {\n    width: 120px;\n    height: 120px;\n    margin-bottom: 24px;\n  }\n  .forecast__rain {\n    width: 100px;\n    height: 40px;\n  }\n}\n@media only screen and (min-width: 1024px) {\n  .forecast {\n    align-items: center;\n    justify-content: center;\n  }\n  /* Loaders */\n  .forecast__date {\n    width: 100px;\n    height: 20px;\n    box-shadow: rgba(0, 0, 0, 0.08) 0 3px 13px 1px;\n    margin: 0 auto;\n    margin-bottom: 24px;\n  }\n  .forecast__icon {\n    width: 120px;\n    height: 120px;\n    box-shadow: rgba(0, 0, 0, 0.08) 0 3px 13px 1px;\n    margin: 0 auto;\n    margin-bottom: 24px;\n  }\n  .forecast__rain {\n    width: 100px;\n    height: 20px;\n    box-shadow: rgba(0, 0, 0, 0.08) 0 3px 13px 1px;\n    margin: 0 auto;\n  }\n}\n\n@media only screen and (min-width: 1200px) {\n  #district_slider {\n    width: 392px;\n    margin-right: 0;\n  }\n\n  .forecast {\n    display: flex;\n    flex-direction: row;\n  }\n  .forecast__item {\n    width: 25%;\n    margin-top: 0;\n  }\n  .forecast__item p {\n    margin-bottom: 24px;\n  }\n  .forecast__item__icon {\n    width: 120px;\n    display: table;\n    margin: 0 auto;\n  }\n  .forecast__item__temp {\n    font-size: 18px;\n    color: #333;\n    font-size: 24px;\n    line-height: 34px;\n  }\n  .forecast__item__temp span:first-child {\n    color: #b31939;\n  }\n  .forecast__item__temp span:last-child {\n    margin-left: 8px;\n  }\n  /* Loaders */\n  .forecast__date {\n    width: 100px;\n    height: 20px;\n    margin-bottom: 24px;\n  }\n  .forecast__icon {\n    width: 120px;\n    height: 120px;\n    margin-bottom: 24px;\n  }\n  .forecast__rain {\n    width: 100px;\n    height: 20px;\n  }\n}\n";

  var style__placeholder_loading = ".loader__placeholder {\n  position: relative;\n  -webkit-animation: placeHolderSwept 2.5s infinite linear forwards;\n  -moz-animation: placeHolderSwept 2.5s infinite linear forwards;\n  -o-animation: placeHolderSwept 2.5s infinite linear forwards;\n  animation: placeHolderSwept 2.5s infinite linear forwards;\n  background: #ebebec;\n  background-image: linear-gradient(to right, #ebebec 0%, #e0e0e2 20%, #ebebec 40%, #ebebec 100%);\n  background-repeat: no-repeat;\n  -webkit-border-radius: 4px;\n  -moz-border-radius: 4px;\n  border-radius: 4px;\n}\n\n@-webkit-keyframes placeHolderSwept {\n  0% {\n    background-position: -400px 0;\n  }\n  100% {\n    background-position: 400px 0;\n  }\n}\n@-moz-keyframes placeHolderSwept {\n  0% {\n    background-position: -400px 0;\n  }\n  100% {\n    background-position: 400px 0;\n  }\n}\n@-o-keyframes placeHolderSwept {\n  0% {\n    background-position: -400px 0;\n  }\n  100% {\n    background-position: 400px 0;\n  }\n}\n@keyframes placeHolderSwept {\n  0% {\n    background-position: -400px 0;\n  }\n  100% {\n    background-position: 400px 0;\n  }\n}\n\n/* EXP FOR SMALLER */\n.loader__placeholder.loader__placeholder__super_small {\n  -webkit-animation: placeHolderSwept__super_small 1.8s infinite linear forwards;\n  -moz-animation: placeHolderSwept__super_small 1.8s infinite linear forwards;\n  -o-animation: placeHolderSwept__super_small 1.8s infinite linear forwards;\n  animation: placeHolderSwept__super_small 1.8s infinite linear forwards;\n}\n\n@-webkit-keyframes placeHolderSwept__super_small {\n  0% {\n    background-position: -32px 0;\n  }\n  100% {\n    background-position: 32px 0;\n  }\n}\n@-moz-keyframes placeHolderSwept__super_small {\n  0% {\n    background-position: -32px 0;\n  }\n  100% {\n    background-position: 32px 0;\n  }\n}\n@-o-keyframes placeHolderSwept__super_small {\n  0% {\n    background-position: -32px 0;\n  }\n  100% {\n    background-position: 32px 0;\n  }\n}\n@keyframes placeHolderSwept__super_small {\n  0% {\n    background-position: -32px 0;\n  }\n  100% {\n    background-position: 32px 0;\n  }\n}\n";

  var style__towns = "@media only screen and (min-width: 320px) {\n  /* Brunico */\n  .weather-map-new__icon--bruneck {\n    bottom: 71%;\n    right: 21.8%;\n  }\n  .weather-map-new__temp--bruneck {\n    left: 80%;\n    bottom: 66.5%;\n  }\n  .weather-map-new__town--bruneck {\n    top: 29%;\n    left: 67%;\n    text-align: left;\n    -webkit-transform: none;\n    -ms-transform: none;\n    transform: none;\n  }\n  /* Bressanone */\n  .weather-map-new__icon--brixen {\n    bottom: 58%;\n    right: 38%;\n  }\n  .weather-map-new__temp--brixen {\n    left: 63.5%;\n    bottom: 56.8%;\n  }\n  .weather-map-new__town--brixen {\n    top: 44%;\n    left: 61.3%;\n  }\n  /* Vipiteno */\n  .weather-map-new__town--sterzing {\n    top: 25%;\n    left: 50.1%;\n  }\n  .weather-map-new__temp--sterzing {\n    left: 52.3%;\n    bottom: 79.3%;\n  }\n  .weather-map-new__icon--sterzing {\n    top: 15%;\n    right: 52%;\n  }\n  /* Bolzano */\n  .weather-map-new__icon--bozen {\n    bottom: 34.8%;\n    right: 50.8%;\n  }\n  .weather-map-new__temp--bozen {\n    right: 55%;\n    bottom: 19%;\n  }\n  .weather-map-new__town--bozen {\n    top: 70.3%;\n    left: 43.9%;\n  }\n  /* Merano */\n  .weather-map-new__town--meran {\n    top: 51.4%;\n    right: 63.6%;\n    -webkit-transform: translateX(50%);\n    -ms-transform: translateX(50%);\n    transform: translateX(50%);\n    text-align: center;\n  }\n  .weather-map-new__temp--meran {\n    left: 36.5%;\n    bottom: 53%;\n  }\n  .weather-map-new__icon--meran {\n    bottom: 52%;\n    left: 30%;\n  }\n  /* Schlanders */\n  .weather-map-new__icon--schlanders {\n    right: 83%;\n    top: 43.6%;\n  }\n  .weather-map-new__temp--schlanders {\n    right: 85.5%;\n    top: 52.1%;\n  }\n  .weather-map-new__town--schlanders {\n    top: 53.9%;\n    left: 18.5%;\n  }\n  /* Dolomiten */\n  .weather-map-new__icon--dolomiten {\n    left: 83%;\n    top: 40%;\n  }\n  .weather-map-new__temp--dolomiten {\n    left: 90%;\n    top: 40%;\n  }\n  .weather-map-new__town--dolomiten {\n    top: 53.9%;\n    left: 18.5%;\n    display: none;\n  }\n}\n\n@media only screen and (min-width: 768px) {\n  /* Brunico */\n  .weather-map-new__icon--bruneck {\n    bottom: 71%;\n    right: 21.8%;\n  }\n  .weather-map-new__temp--bruneck {\n    left: 80%;\n    bottom: 66.5%;\n  }\n  .weather-map-new__town--bruneck {\n    top: 31%;\n    left: 70%;\n    text-align: left;\n    -webkit-transform: none;\n    -ms-transform: none;\n    transform: none;\n  }\n  /* Bressanone */\n  .weather-map-new__icon--brixen {\n    bottom: 58%;\n    right: 38%;\n  }\n  .weather-map-new__temp--brixen {\n    left: 63.5%;\n    bottom: 56.8%;\n  }\n  .weather-map-new__town--brixen {\n    top: 40%;\n    left: 61.3%;\n  }\n  /* Vipiteno */\n  .weather-map-new__town--sterzing {\n    top: 25%;\n    left: 50.1%;\n  }\n  .weather-map-new__temp--sterzing {\n    left: 52.3%;\n    bottom: 79.3%;\n  }\n  .weather-map-new__icon--sterzing {\n    top: 15%;\n    right: 52%;\n  }\n  /* Bolzano */\n  .weather-map-new__icon--bozen {\n    bottom: 34.8%;\n    right: 50.8%;\n  }\n  .weather-map-new__temp--bozen {\n    right: 55%;\n    bottom: 19%;\n  }\n  .weather-map-new__town--bozen {\n    top: 70.3%;\n    left: 43.9%;\n  }\n  /* Merano */\n  .weather-map-new__town--meran {\n    top: 51.4%;\n    right: 63.6%;\n    -webkit-transform: translateX(50%);\n    -ms-transform: translateX(50%);\n    transform: translateX(50%);\n    text-align: center;\n  }\n  .weather-map-new__temp--meran {\n    left: 36.5%;\n    bottom: 53%;\n  }\n  .weather-map-new__icon--meran {\n    bottom: 52%;\n    left: 30%;\n  }\n  /* Schlanders */\n  .weather-map-new__icon--schlanders {\n    right: 83%;\n    top: 43.6%;\n  }\n  .weather-map-new__temp--schlanders {\n    right: 85.5%;\n    top: 52.1%;\n  }\n  .weather-map-new__town--schlanders {\n    top: 53.9%;\n    left: 18.5%;\n  }\n}\n\n@media only screen and (min-width: 1024px) {\n  /* Dolomiten */\n  .weather-map-new__icon--dolomiten {\n    left: 83%;\n    top: 42%;\n  }\n  .weather-map-new__temp--dolomiten {\n    left: 90%;\n    top: 40%;\n  }\n  .weather-map-new__town--dolomiten {\n    top: 53.9%;\n    left: 18.5%;\n    display: none;\n  }\n}\n\n@media only screen and (min-width: 1200px) {\n  /* Brunico */\n  .weather-map-new__icon--bruneck {\n    bottom: 71%;\n    right: 21.8%;\n  }\n  .weather-map-new__temp--bruneck {\n    left: 80%;\n    bottom: 71%;\n  }\n  .weather-map-new__town--bruneck {\n    top: 33.3%;\n    left: 73%;\n    text-align: left;\n    -webkit-transform: none;\n    -ms-transform: none;\n    transform: none;\n  }\n  /* Bressanone */\n  .weather-map-new__icon--brixen {\n    bottom: 58%;\n    right: 38%;\n  }\n  .weather-map-new__temp--brixen {\n    left: 63.5%;\n    bottom: 58%;\n  }\n  .weather-map-new__town--brixen {\n    top: 44%;\n    left: 61.3%;\n  }\n  /* Vipiteno */\n  .weather-map-new__icon--sterzing {\n    left: 58%;\n    bottom: 78.3%;\n    top: auto;\n  }\n  .weather-map-new__temp--sterzing {\n    left: 53.3%;\n    bottom: 77.3%;\n  }\n  .weather-map-new__town--sterzing {\n    top: 24%;\n    left: 50.1%;\n  }\n  /* Bolzano */\n  .weather-map-new__icon--bozen {\n    bottom: 34.8%;\n    right: 54%;\n  }\n  .weather-map-new__temp--bozen {\n    right: 50%;\n    bottom: 35%;\n  }\n  .weather-map-new__town--bozen {\n    top: 70.3%;\n    left: 43.9%;\n  }\n  /* Merano */\n  .weather-map-new__town--meran {\n    top: 51.4%;\n    right: 63.6%;\n    -webkit-transform: translateX(50%);\n    -ms-transform: translateX(50%);\n    transform: translateX(50%);\n    text-align: center;\n  }\n  .weather-map-new__temp--meran {\n    left: 36.5%;\n    bottom: 53%;\n  }\n  .weather-map-new__icon--meran {\n    bottom: 52%;\n    left: 30%;\n  }\n  /* Schlanders */\n  .weather-map-new__icon--schlanders {\n    right: 83%;\n    top: 43.6%;\n  }\n  .weather-map-new__temp--schlanders {\n    right: 89%;\n    top: 44%;\n  }\n  .weather-map-new__town--schlanders {\n    top: 53.9%;\n    left: 18.5%;\n  }\n}\n";

  var style__typography = "@media only screen and (min-width: 320px) {\n  h1,\n  h2,\n  h3 {\n    margin: 0 0 16px 0;\n    color: #333;\n    font-family: 'Suedtirol', 'KievitWebPro', monospace;\n    /* color: #50742f; */\n    text-align: center;\n  }\n\n  h1 {\n    color: #80909c;\n    font-size: 42px;\n    margin-bottom: 42px;\n    font-family: 'Suedtirol', 'KievitWebPro', sans-serif;\n  }\n  p {\n    margin: 0;\n  }\n}\n@media only screen and (min-width: 1024px) {\n  h1,\n  h2,\n  h3 {\n    margin: 0 0 16px 0;\n  }\n\n  h1 {\n    font-size: 48px;\n    font-weight: 500;\n  }\n}\n";

  const new_suedtirol_map = language => {
    return language === 'it'
      ? html`
        <svg
          class="embed-responsive-item svg-map"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 228.83 139.63"
          xml:space="preserve"
        >
          <style type="text/css">
            .weather-map-default {
              fill: #dce0e4;
              stroke: #fff;
              stroke-width: 0.36;
              stroke-miterlimit: 10;
              transition: fill 0.3s ease;
            }
            .weather-map-active {
              fill: #a9bf00;
              stroke: #fff;
              stroke-width: 0.36;
              stroke-miterlimit: 10;
              transition: fill 0.3s ease;
            }
            .weather-map-town {
              fill: #50742f;
            }
            .weather-map-dolomiten {
              fill: #758592;
            }
          </style>
          <!-- MAP -->
          <g id="main_map" data-region="Ebene 2">
            <g id="inactive">
              <polyline
                id="bozen"
                class="weather-map-default"
                points="119.94 116.52 117.76 119.66 111.35 122.23 111.19 124.55 107.56 126.32 109.46 128.08 111.35 131.15 109.73 132.57 106.02 131.89 106.02 129.86 104.56 128.63 104.56 126.45 101.98 129.04 100.75 132.71 98.3 132.17 94.78 137.61 89.59 139.42 86.47 136.25 89.59 133.25 85.25 132.17 82.37 128.22 85.86 127.54 89.59 120.64 88.1 115.97 90 114.62 90.28 105.91 91.77 101.55 90.55 95.7 88.37 92.83 90.55 90.93 92.96 89.51 92.96 87.95 90.28 84.41 92.11 82.98 90.82 80.67 92.96 79.68 95.65 76.99 97.96 76.45 99.26 74.74 100.21 71.62 99.94 69.99 98.37 66.79 99.8 64.14 98.17 62.44 98.1 60.87 98.85 59.3 97.96 57.74 99.19 54.75 101.16 53.93 100.82 52.64 102.86 48.37 105.58 48.01 107.83 47.13 108.64 46.31 111.36 46.79 113.41 44.15 115.51 43.31 117.62 44.15 118.71 45.9 120.69 45.57 122.32 49.85 121.23 50.94 121.64 53.93 123.54 55.29 123.66 56.95 123.68 58.43 124.3 59.1 121.91 61.89 121.91 63.52 117.13 67.28 115.17 66.56 114.08 69.1 112.86 69.8 115.04 72.3 115.11 74.99 117.13 73.8 118.44 73.32 117.3 75.84 117.13 77.95 119.46 79.68 121.5 79.68 123 81.38 125.38 81.69 124.02 85.23 122.72 88.87 121.43 89.37 121.57 90.67 117.13 94.82 115.92 95.64 114.42 96.44 112.93 95.57 110.69 95.17 111.19 96.44 113.61 100.99 112.79 102.03 111.77 102.03 111.19 101.42 109.73 102.78 109.12 104.06 107.62 107.42 107.62 108.9 105.24 110.13 107.62 111.29 109.94 113.12 111.98 112.17 115.79 114.27 118.51 114.68 119.94 116.52"
                data-district_id="1"
              ></polyline>
              <polygon
                id="meran"
                class="weather-map-default"
                points="85.25 95.84 81.7 97.26 79.44 95.17 76.94 94.34 76.67 89.44 74.21 91.76 71.77 92.03 75.05 99.24 76.26 102.92 75.05 104 72.18 103.05 68.37 98.1 65.64 96.44 63.06 98.83 60.75 99.51 59.66 101.83 58.03 104.14 55.24 102.45 51.77 104.28 45.37 103.73 41.56 96.44 43.33 95.17 43.47 94.05 44.7 93.93 47.28 89.72 49.12 89.05 50.27 87.59 52.31 87.47 54.22 85.91 54.9 84.96 57.48 83.58 59.8 82.91 63.47 82.27 65.1 80.87 64.56 77.73 63.74 73.45 64.08 71.62 65.24 71.21 65.1 70.32 63.2 69.44 61.16 67.28 59.05 67.54 57.69 68.15 56.26 67.28 54.63 67.95 53.47 68.9 50.14 68.63 48.98 68.29 48.98 65.63 46.73 65.14 46.06 62.91 46.53 62.16 44.76 61.54 42.99 59.04 40.61 59.44 38.71 58.03 39.12 55.29 38.58 51.76 38.98 50.67 38.46 49.85 38.44 48.37 41.29 48.75 44.29 47.13 48.64 50.67 50 49.28 55.62 52.44 59.8 50.53 67.55 51.62 69.46 51.08 70.14 52.16 72.18 45.91 76.53 43.31 75.75 37.74 78.71 32.43 78.61 28.63 79.8 28.08 79.92 25.9 83.21 26.18 86.46 23.73 88.1 24.81 89.73 25.5 90.21 26.58 89.94 26.99 90.41 30.66 89.94 32.03 91.16 34.75 90.75 36.45 90.95 37.67 93.81 39.03 94.77 40.12 101.02 40.36 103 40.12 104.36 41.21 106.02 42.16 108.64 46.31 107.83 47.13 105.58 48.01 102.86 48.37 100.82 52.64 101.16 53.93 99.19 54.75 97.96 57.74 98.85 59.31 98.1 60.87 98.17 62.44 99.8 64.14 98.37 66.79 99.94 69.99 100.21 71.62 99.25 74.74 97.96 76.45 95.65 77 92.96 79.68 90.82 80.67 92.11 82.98 90.28 84.41 92.96 87.95 92.96 89.51 90.55 90.92 88.37 92.83 85.25 95.84"
                data-district_id="2"
              ></polygon>
              <polygon
                id="schlanders"
                class="weather-map-default"
                points="38.46 49.85 38.98 50.67 38.58 51.75 39.11 55.29 38.71 58.03 40.61 59.44 42.99 59.03 44.76 61.54 46.53 62.16 46.05 62.91 46.73 65.14 48.98 65.63 48.98 68.29 50.14 68.63 53.47 68.9 54.63 67.94 56.26 67.28 57.69 68.15 59.05 67.54 61.16 67.28 63.2 69.44 65.1 70.31 65.24 71.21 64.08 71.62 63.74 73.45 64.56 77.73 65.1 80.87 63.47 82.27 59.8 82.91 57.48 83.58 54.9 84.95 54.22 85.91 52.31 87.47 50.27 87.59 49.12 89.05 47.28 89.72 44.69 93.93 43.47 94.05 43.33 95.17 41.56 96.44 38.71 97.25 36.18 100.33 32.18 102.45 27.68 102.45 23.33 99.24 20.48 97.9 18.3 95.17 9.73 94.34 8.23 91.62 8.09 87.47 10 87.47 11.09 81.38 12.31 75.36 7.55 71.21 2.51 72.3 0.2 64.68 2.81 61.54 3.93 59.37 2.06 56.79 6.87 53.25 6.19 49.85 4.55 47.53 7 46.04 8.77 41.14 10.54 36.92 11.72 36.92 16.12 39.1 19.24 38.83 19.24 40.1 24.69 36.92 29.59 36.11 31.63 34.47 34.9 36.92 35.58 38.96 42.24 42.37 39.52 45.9 37.89 47.13 38.44 48.37 38.46 49.85"
                data-district_id="3"
              ></polygon>
              <polygon
                id="brixen"
                class="weather-map-default"
                points="154.9,67.7 151.8,67.8 149.6,68.4 147.9,67.4 145,67.9 142.2,69.4 140.2,68.2
137.6,66.9 135.6,68.4 134.8,68.4 134.2,69.6 133.1,69.7 135.4,71.4 137.5,71.9 138.1,74.1 138.1,74.9 139.2,75 140.6,76.5
140.6,77.9 140.6,77.9 139.7,78 138.3,82.2 136.7,80.1 135.4,79.2 130.7,79.7 129.1,79.7 126.9,80.1 126.4,81.6 125.4,81.7
123,81.4 121.5,79.7 119.5,79.7 117.1,78 117.3,75.8 118.4,73.3 117.1,73.8 115.1,75 115,72.3 112.9,69.8 114.1,69.1 115.2,66.6
117.1,67.3 121.9,63.5 121.9,61.9 124.3,59.1 123.7,58.4 123.7,57 123.5,55.3 121.6,53.9 121.2,50.9 122.3,49.9 120.7,45.6
120.7,45.6 123.1,43.5 126.6,43 133.8,44.6 137.7,45.5 141.4,44.5 144.2,41.7 148.4,39.1 148.4,39.1 148,40.8 147.9,43.3
151.8,44.2 152.9,43.6 153.5,45.3 151.9,47.5 154.3,48 154.6,50.1 156.2,52 157.1,52.8 158,55.3 158.3,56.5 159.5,58.8
159.6,60.9 157.7,62.9 156.3,63 154.6,66 154.9,67.7"
                data-district_id="4"
              ></polygon>
              <polygon
                id="sterzing"
                class="weather-map-default"
                points="120.72 45.58 123.11 43.48 126.61 42.98 133.81 44.58 137.72 45.48 141.41 44.48 144.22 41.68 148.41 39.08 148.41 39.08 148.31 37.48 150.72 35.28 152.12 35.18 152.31 34.18 151.51 31.88 149.72 30.98 148.51 29.18 148.91 24.18 148.22 21.58 148.91 20.08 145.12 15.98 140.12 16.18 135.62 12.38 130.72 15.28 126.11 17.18 124.02 14.48 120.11 13.08 118.81 15.98 117.11 16.08 111.81 20.68 109.52 19.18 107.02 16.98 104.61 17.08 99.42 17.18 95.22 19.48 90.72 20.58 88.92 19.68 87.11 20.58 85.92 20.68 86.52 23.68 88.11 24.78 89.72 25.48 90.22 26.58 89.92 26.98 90.42 30.68 89.92 31.98 91.22 34.78 90.81 36.48 91.02 37.68 93.81 38.98 94.81 40.08 101.02 40.38 103.02 40.08 104.42 41.18 106.02 42.18 108.61 46.28 111.42 46.78 113.42 44.18 115.52 43.28 117.61 44.18 118.72 45.88 120.72 45.58"
                data-district_id="5"
              ></polygon>
              <polygon
                id="bruneck"
                class="weather-map-default"
                points="158.88 57.61 158.88 57.61 158.88 57.61 161.5 57.61 162.18 57.44 163.95 55.77 164.84 55.65 166.06 55.53 166.47 55.84 167.39 55.4 168.24 55.84 169.8 55.27 171.37 55.29 172.39 56.44 174.16 58.15 174.02 58.7 175.11 58.56 175.86 59.03 174.84 60.53 175.72 61.01 176.74 61.13 177.69 61.82 178.1 60.87 178.92 60.87 179.04 60.4 180.96 60.4 183.48 60.26 183.48 60.27 185.25 59.52 185.72 57.49 188.17 56.52 190.43 57.26 191.91 56.66 191.38 53.14 196.07 52.9 200.91 52.44 201.03 50.67 204.47 49.28 206.13 47.47 207.15 47.82 207.16 47.81 208.79 46.59 207.97 44.15 210.42 40.12 207.14 35.57 207.02 33.12 203.26 31.48 200.44 34.48 197.9 29.71 194.91 29.71 192.32 28.09 194.63 24.95 194.23 22.64 191.38 20.46 191.38 17.34 190.43 13.39 192.46 10.94 194.36 11.62 199.26 9.58 200.44 5.5 203.07 3.73 200.9 1.55 196.07 0.19 189.87 2.78 186.61 2.51 184.29 4.83 181.44 4.95 179.53 7.3 171.37 7.95 164.97 12.29 158.31 16.24 152.59 16.24 148.92 20.05 148.17 21.55 148.93 24.21 148.51 29.17 149.69 31.01 151.5 31.9 152.32 34.21 152.12 35.16 150.69 35.28 148.31 37.47 148.44 39.11 148.03 40.81 147.9 43.31 151.84 44.15 152.93 43.6 153.46 45.3 151.91 47.47 154.29 48 154.64 50.06 156.2 52.03 157.15 52.78 158 55.3 158.31 56.52 158.88 57.61"
                data-district_id="6"
              ></polygon>
              <path
                id="dolomiten"
                class="weather-map-default"
                d="M156.81,89.38l1.63,3.45,9.12-3.49,3.81-.12L175,87.47l2,1.58,4.82-7.67-.14-4,2.45-5.22.82-5.72,4.21,3.28L193.14,73l5.17,1.5.13,4.49,2-2,3.05-1.43L205.38,74l4,1.34,2.72-2h2.31l2.45,1.56,2.45-.87-.41-2.81,2.59.14,2.86-4.07,4.33-2.14-.12-1L225,63.32l-6-4-2.86-9.11-4.9-1.51-3.26.53-.82-1.47-1-.34-1.66,1.81L201,50.67l-.12,1.77-4.84.45-4.69.24.53,3.52-1.48.6-2.26-.73-2.45,1-.47,2-1.77.75L181,60.4H179l-.12.47h-.82l-.41,1-.95-.69-1-.12-.88-.48,1-1.5-.75-.47-1.09.13.14-.54-1.77-1.71-1-1.15-1.57,0-1.56.57-.85-.44-.92.44-.41-.31-1.22.12-.89.12-1.77,1.66-.68.18h-2.62l.65,1.22.12,2-2,2-1.36.12-1.69,3,.24,1.76-3.1.07-2.17.61-1.71-1-2.93.45-2.79,1.59-2-1.3-2.65-1.29-1.93,1.5-.86.06-.62,1.16-1.08.13,2.38,1.71,2,.47.65,2.18v.82l1.05.12,1.43,1.44v1.49h0l-1,.08-1.35,4.15-1.65-2.06-1.29-.87-4.69.44h-1.64l-2.17.43-.48,1.51-1,.07L124,85.23l-1.29,3.64-1.3.51.14,1.29-4.44,4.15h0l-1.21.82-1.5.81-1.49-.88-2.25-.39.51,1.27,2.42,4.54-.82,1h-1l-.58-.61-1.46,1.36-.61,1.28-1.5,3.36v1.49l-2.37,1.22,2.37,1.17,2.32,1.82,2-1,3.81,2.11,2.72.41,1.43,1.83,5.3,1.23,2.72,1.07,1.36-5,4-.68,2.18-9h0l.67-4.9,2.87-2-2.32-2.66,4.9-.12,4.49-1.64h0l2.18.69,6.4-1.91,2.17-2.25m-18.49-7.2h0"
                data-district_id="7"
              ></path>
            </g>

            <!-- TEXT -->
            <g id="txt_DT_dolo_regionen_" data-name="txt_DT (+dolo_regionen)">
              <path
                class="weather-map-town"
                d="M165,49.48a1.28,1.28,0,0,1-.74.24.34.34,0,0,1-.25-.07,1.38,1.38,0,0,1-.25-.77c0-.14,0-.18.08-.24a1.28,1.28,0,0,1,.74-.24.34.34,0,0,1,.25.07,1.38,1.38,0,0,1,.25.77C165.05,49.38,165,49.42,165,49.48Z"
              ></path>
              <path
                class="weather-map-town"
                d="M116,31.79a1.24,1.24,0,0,1-.73.24A.34.34,0,0,1,115,32a1.32,1.32,0,0,1-.25-.76c0-.14,0-.18.08-.24a1.28,1.28,0,0,1,.74-.24.37.37,0,0,1,.25.07,1.42,1.42,0,0,1,.24.76C116.06,31.7,116.05,31.74,116,31.79Z"
              ></path>
              <path
                class="weather-map-town"
                d="M86.05,71.25a1.28,1.28,0,0,1-.74.24.34.34,0,0,1-.25-.07,1.38,1.38,0,0,1-.25-.77c0-.14,0-.18.08-.24a1.28,1.28,0,0,1,.74-.24.34.34,0,0,1,.25.07,1.38,1.38,0,0,1,.25.77C86.13,71.15,86.11,71.19,86.05,71.25Z"
              ></path>
              <path
                class="weather-map-town"
                d="M43.05,74.5a1.28,1.28,0,0,1-.74.24.34.34,0,0,1-.25-.07,1.38,1.38,0,0,1-.25-.77c0-.14,0-.18.08-.24a1.28,1.28,0,0,1,.74-.24.34.34,0,0,1,.25.07,1.38,1.38,0,0,1,.25.77C43.13,74.4,43.11,74.44,43.05,74.5Z"
              ></path>
              <path
                class="weather-map-town"
                d="M141.16,61.66a1.28,1.28,0,0,1-.74.24.34.34,0,0,1-.25-.07,1.38,1.38,0,0,1-.25-.77c0-.14,0-.18.08-.24a1.28,1.28,0,0,1,.74-.24.34.34,0,0,1,.25.07,1.38,1.38,0,0,1,.25.77C141.24,61.56,141.22,61.6,141.16,61.66Z"
              ></path>
              <path
                class="weather-map-town"
                d="M105.79,97.8a1.28,1.28,0,0,1-.74.24.34.34,0,0,1-.25-.07,1.38,1.38,0,0,1-.25-.77c0-.14,0-.18.08-.24a1.28,1.28,0,0,1,.74-.24.34.34,0,0,1,.25.07,1.38,1.38,0,0,1,.25.77C105.87,97.7,105.85,97.74,105.79,97.8Z"
              ></path>
              <!-- Dolomiten -->
              <path
                class="weather-map-dolomiten"
                d="M147.51,81a7.53,7.53,0,0,0-1,.52L148.15,85a5.47,5.47,0,0,0,.93-.36,2,2,0,0,0,1.24-2.85C149.76,80.62,148.76,80.41,147.51,81Zm1.33,3.24-.32.12-1.22-2.67a3.34,3.34,0,0,1,.45-.24,1.37,1.37,0,0,1,2,.69C150.18,83.05,149.87,83.76,148.84,84.23Z"
              ></path>
              <path
                class="weather-map-dolomiten"
                d="M151.79,80.19a1.36,1.36,0,0,0-.65,1.94,1.32,1.32,0,0,0,1.79.85,1.4,1.4,0,0,0,.64-2A1.3,1.3,0,0,0,151.79,80.19Zm1,2.32c-.4.18-.81,0-1.09-.64s-.16-1,.24-1.22.8,0,1.08.62S153.18,82.32,152.78,82.51Z"
              ></path>
              <path
                class="weather-map-dolomiten"
                d="M153.19,78.35,154.86,82l.55-.25L153.69,78A2.57,2.57,0,0,0,153.19,78.35Z"
              >
                <path
                  class="weather-map-dolomiten"
                  d="M151.79,80.19a1.36,1.36,0,0,0-.65,1.94,1.32,1.32,0,0,0,1.79.85,1.4,1.4,0,0,0,.64-2A1.3,1.3,0,0,0,151.79,80.19Zm1,2.32c-.4.18-.81,0-1.09-.64s-.16-1,.24-1.22.8,0,1.08.62S153.18,82.32,152.78,82.51Z"
                ></path>
              </path>
              <path
                class="weather-map-dolomiten"
                d="M151.79,80.19a1.36,1.36,0,0,0-.65,1.94,1.32,1.32,0,0,0,1.79.85,1.4,1.4,0,0,0,.64-2A1.3,1.3,0,0,0,151.79,80.19Zm1,2.32c-.4.18-.81,0-1.09-.64s-.16-1,.24-1.22.8,0,1.08.62S153.18,82.32,152.78,82.51Z"
              ></path>
              <path
                class="weather-map-dolomiten"
                d="M156.15,78.19a1.38,1.38,0,0,0-.65,1.94,1.33,1.33,0,0,0,1.8.85,1.38,1.38,0,0,0,.63-2A1.3,1.3,0,0,0,156.15,78.19Zm1,2.32c-.4.19-.81,0-1.09-.63s-.17-1,.24-1.23.8,0,1.08.62S157.55,80.33,157.15,80.51Z"
              ></path>
              <path
                class="weather-map-dolomiten"
                d="M160.88,76a.93.93,0,0,0-.63.86h0a.7.7,0,0,0-.89-.17.9.9,0,0,0-.59.93h0l-.24-.52a1.33,1.33,0,0,0-.45.32L159.22,80l.55-.25-.66-1.44a.76.76,0,0,1,.27-1.06c.29-.13.48.08.6.35l.78,1.7.54-.25-.66-1.44a.76.76,0,0,1,.28-1.06c.29-.13.47.08.59.35l.78,1.7.55-.25L162,76.6C161.8,76.08,161.41,75.79,160.88,76Z"
              ></path>
              <path
                class="weather-map-dolomiten"
                d="M162.28,74.8a.22.22,0,0,0,.15,0,.7.7,0,0,0,.33-.3s0-.07,0-.15a.87.87,0,0,0-.33-.37.19.19,0,0,0-.16,0,.67.67,0,0,0-.32.3.16.16,0,0,0,0,.15A.92.92,0,0,0,162.28,74.8Z"
              ></path>
              <path
                class="weather-map-dolomiten"
                d="M162.5,75.43,163.66,78l.55-.25L163,75.08A1.83,1.83,0,0,0,162.5,75.43Z"
              ></path>
              <path
                class="weather-map-dolomiten"
                d="M166.27,76.16a.72.72,0,0,1-.35.31c-.2.09-.39.1-.59-.33l-.58-1.27a4.44,4.44,0,0,0,.71-.39,1.48,1.48,0,0,0-.15-.44,6.42,6.42,0,0,1-.76.41l-.26-.57a2.18,2.18,0,0,0-.5.34l.22.48-.36.16a.69.69,0,0,0,.07.3.5.5,0,0,0,.09.14l.39-.18.59,1.28c.38.84.9.73,1.2.59a1.11,1.11,0,0,0,.55-.47A.85.85,0,0,0,166.27,76.16Z"
              ></path>
              <path
                class="weather-map-dolomiten"
                d="M165.77,73.2s.08,0,.15,0a.67.67,0,0,0,.32-.3.16.16,0,0,0,0-.15.92.92,0,0,0-.34-.38.22.22,0,0,0-.15,0,.7.7,0,0,0-.33.3.21.21,0,0,0,0,.15A.83.83,0,0,0,165.77,73.2Z"
              ></path>
              <path class="weather-map-dolomiten" d="M166.48,73.49a2.18,2.18,0,0,0-.5.34l1.17,2.55.54-.25Z"></path>
            </g>
          </g>
        </svg>
      `
      : html`
        <svg
          class="embed-responsive-item svg-map"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          viewBox="0 0 228.83 139.63"
          xml:space="preserve"
        >
          <style type="text/css">
            .weather-map-default {
              fill: #dce0e4;
              stroke: #fff;
              stroke-width: 0.36;
              stroke-miterlimit: 10;
              transition: fill 0.3s ease;
            }
            .weather-map-active {
              fill: #a9bf00;
              stroke: #fff;
              stroke-width: 0.36;
              stroke-miterlimit: 10;
              transition: fill 0.3s ease;
            }
            .weather-map-town {
              fill: #50742f;
            }
            .weather-map-dolomiten {
              fill: #758592;
            }
          </style>
          <!-- MAP -->
          <g id="main_map" data-region="Ebene 2">
            <g id="inactive">
              <polyline
                id="bozen"
                class="weather-map-default"
                points="119.94 116.52 117.76 119.66 111.35 122.23 111.19 124.55 107.56 126.32 109.46 128.08 111.35 131.15 109.73 132.57 106.02 131.89 106.02 129.86 104.56 128.63 104.56 126.45 101.98 129.04 100.75 132.71 98.3 132.17 94.78 137.61 89.59 139.42 86.47 136.25 89.59 133.25 85.25 132.17 82.37 128.22 85.86 127.54 89.59 120.64 88.1 115.97 90 114.62 90.28 105.91 91.77 101.55 90.55 95.7 88.37 92.83 90.55 90.93 92.96 89.51 92.96 87.95 90.28 84.41 92.11 82.98 90.82 80.67 92.96 79.68 95.65 76.99 97.96 76.45 99.26 74.74 100.21 71.62 99.94 69.99 98.37 66.79 99.8 64.14 98.17 62.44 98.1 60.87 98.85 59.3 97.96 57.74 99.19 54.75 101.16 53.93 100.82 52.64 102.86 48.37 105.58 48.01 107.83 47.13 108.64 46.31 111.36 46.79 113.41 44.15 115.51 43.31 117.62 44.15 118.71 45.9 120.69 45.57 122.32 49.85 121.23 50.94 121.64 53.93 123.54 55.29 123.66 56.95 123.68 58.43 124.3 59.1 121.91 61.89 121.91 63.52 117.13 67.28 115.17 66.56 114.08 69.1 112.86 69.8 115.04 72.3 115.11 74.99 117.13 73.8 118.44 73.32 117.3 75.84 117.13 77.95 119.46 79.68 121.5 79.68 123 81.38 125.38 81.69 124.02 85.23 122.72 88.87 121.43 89.37 121.57 90.67 117.13 94.82 115.92 95.64 114.42 96.44 112.93 95.57 110.69 95.17 111.19 96.44 113.61 100.99 112.79 102.03 111.77 102.03 111.19 101.42 109.73 102.78 109.12 104.06 107.62 107.42 107.62 108.9 105.24 110.13 107.62 111.29 109.94 113.12 111.98 112.17 115.79 114.27 118.51 114.68 119.94 116.52"
                data-district_id="1"
              ></polyline>
              <polygon
                id="meran"
                class="weather-map-default"
                points="85.25 95.84 81.7 97.26 79.44 95.17 76.94 94.34 76.67 89.44 74.21 91.76 71.77 92.03 75.05 99.24 76.26 102.92 75.05 104 72.18 103.05 68.37 98.1 65.64 96.44 63.06 98.83 60.75 99.51 59.66 101.83 58.03 104.14 55.24 102.45 51.77 104.28 45.37 103.73 41.56 96.44 43.33 95.17 43.47 94.05 44.7 93.93 47.28 89.72 49.12 89.05 50.27 87.59 52.31 87.47 54.22 85.91 54.9 84.96 57.48 83.58 59.8 82.91 63.47 82.27 65.1 80.87 64.56 77.73 63.74 73.45 64.08 71.62 65.24 71.21 65.1 70.32 63.2 69.44 61.16 67.28 59.05 67.54 57.69 68.15 56.26 67.28 54.63 67.95 53.47 68.9 50.14 68.63 48.98 68.29 48.98 65.63 46.73 65.14 46.06 62.91 46.53 62.16 44.76 61.54 42.99 59.04 40.61 59.44 38.71 58.03 39.12 55.29 38.58 51.76 38.98 50.67 38.46 49.85 38.44 48.37 41.29 48.75 44.29 47.13 48.64 50.67 50 49.28 55.62 52.44 59.8 50.53 67.55 51.62 69.46 51.08 70.14 52.16 72.18 45.91 76.53 43.31 75.75 37.74 78.71 32.43 78.61 28.63 79.8 28.08 79.92 25.9 83.21 26.18 86.46 23.73 88.1 24.81 89.73 25.5 90.21 26.58 89.94 26.99 90.41 30.66 89.94 32.03 91.16 34.75 90.75 36.45 90.95 37.67 93.81 39.03 94.77 40.12 101.02 40.36 103 40.12 104.36 41.21 106.02 42.16 108.64 46.31 107.83 47.13 105.58 48.01 102.86 48.37 100.82 52.64 101.16 53.93 99.19 54.75 97.96 57.74 98.85 59.31 98.1 60.87 98.17 62.44 99.8 64.14 98.37 66.79 99.94 69.99 100.21 71.62 99.25 74.74 97.96 76.45 95.65 77 92.96 79.68 90.82 80.67 92.11 82.98 90.28 84.41 92.96 87.95 92.96 89.51 90.55 90.92 88.37 92.83 85.25 95.84"
                data-district_id="2"
              ></polygon>
              <polygon
                id="schlanders"
                class="weather-map-default"
                points="38.46 49.85 38.98 50.67 38.58 51.75 39.11 55.29 38.71 58.03 40.61 59.44 42.99 59.03 44.76 61.54 46.53 62.16 46.05 62.91 46.73 65.14 48.98 65.63 48.98 68.29 50.14 68.63 53.47 68.9 54.63 67.94 56.26 67.28 57.69 68.15 59.05 67.54 61.16 67.28 63.2 69.44 65.1 70.31 65.24 71.21 64.08 71.62 63.74 73.45 64.56 77.73 65.1 80.87 63.47 82.27 59.8 82.91 57.48 83.58 54.9 84.95 54.22 85.91 52.31 87.47 50.27 87.59 49.12 89.05 47.28 89.72 44.69 93.93 43.47 94.05 43.33 95.17 41.56 96.44 38.71 97.25 36.18 100.33 32.18 102.45 27.68 102.45 23.33 99.24 20.48 97.9 18.3 95.17 9.73 94.34 8.23 91.62 8.09 87.47 10 87.47 11.09 81.38 12.31 75.36 7.55 71.21 2.51 72.3 0.2 64.68 2.81 61.54 3.93 59.37 2.06 56.79 6.87 53.25 6.19 49.85 4.55 47.53 7 46.04 8.77 41.14 10.54 36.92 11.72 36.92 16.12 39.1 19.24 38.83 19.24 40.1 24.69 36.92 29.59 36.11 31.63 34.47 34.9 36.92 35.58 38.96 42.24 42.37 39.52 45.9 37.89 47.13 38.44 48.37 38.46 49.85"
                data-district_id="3"
              ></polygon>
              <polygon
                id="brixen"
                class="weather-map-default"
                points="154.9,67.7 151.8,67.8 149.6,68.4 147.9,67.4 145,67.9 142.2,69.4 140.2,68.2
137.6,66.9 135.6,68.4 134.8,68.4 134.2,69.6 133.1,69.7 135.4,71.4 137.5,71.9 138.1,74.1 138.1,74.9 139.2,75 140.6,76.5
140.6,77.9 140.6,77.9 139.7,78 138.3,82.2 136.7,80.1 135.4,79.2 130.7,79.7 129.1,79.7 126.9,80.1 126.4,81.6 125.4,81.7
123,81.4 121.5,79.7 119.5,79.7 117.1,78 117.3,75.8 118.4,73.3 117.1,73.8 115.1,75 115,72.3 112.9,69.8 114.1,69.1 115.2,66.6
117.1,67.3 121.9,63.5 121.9,61.9 124.3,59.1 123.7,58.4 123.7,57 123.5,55.3 121.6,53.9 121.2,50.9 122.3,49.9 120.7,45.6
120.7,45.6 123.1,43.5 126.6,43 133.8,44.6 137.7,45.5 141.4,44.5 144.2,41.7 148.4,39.1 148.4,39.1 148,40.8 147.9,43.3
151.8,44.2 152.9,43.6 153.5,45.3 151.9,47.5 154.3,48 154.6,50.1 156.2,52 157.1,52.8 158,55.3 158.3,56.5 159.5,58.8
159.6,60.9 157.7,62.9 156.3,63 154.6,66 154.9,67.7"
                data-district_id="4"
              ></polygon>
              <polygon
                id="sterzing"
                class="weather-map-default"
                points="120.72 45.58 123.11 43.48 126.61 42.98 133.81 44.58 137.72 45.48 141.41 44.48 144.22 41.68 148.41 39.08 148.41 39.08 148.31 37.48 150.72 35.28 152.12 35.18 152.31 34.18 151.51 31.88 149.72 30.98 148.51 29.18 148.91 24.18 148.22 21.58 148.91 20.08 145.12 15.98 140.12 16.18 135.62 12.38 130.72 15.28 126.11 17.18 124.02 14.48 120.11 13.08 118.81 15.98 117.11 16.08 111.81 20.68 109.52 19.18 107.02 16.98 104.61 17.08 99.42 17.18 95.22 19.48 90.72 20.58 88.92 19.68 87.11 20.58 85.92 20.68 86.52 23.68 88.11 24.78 89.72 25.48 90.22 26.58 89.92 26.98 90.42 30.68 89.92 31.98 91.22 34.78 90.81 36.48 91.02 37.68 93.81 38.98 94.81 40.08 101.02 40.38 103.02 40.08 104.42 41.18 106.02 42.18 108.61 46.28 111.42 46.78 113.42 44.18 115.52 43.28 117.61 44.18 118.72 45.88 120.72 45.58"
                data-district_id="5"
              ></polygon>
              <polygon
                id="bruneck"
                class="weather-map-default"
                points="158.88 57.61 158.88 57.61 158.88 57.61 161.5 57.61 162.18 57.44 163.95 55.77 164.84 55.65 166.06 55.53 166.47 55.84 167.39 55.4 168.24 55.84 169.8 55.27 171.37 55.29 172.39 56.44 174.16 58.15 174.02 58.7 175.11 58.56 175.86 59.03 174.84 60.53 175.72 61.01 176.74 61.13 177.69 61.82 178.1 60.87 178.92 60.87 179.04 60.4 180.96 60.4 183.48 60.26 183.48 60.27 185.25 59.52 185.72 57.49 188.17 56.52 190.43 57.26 191.91 56.66 191.38 53.14 196.07 52.9 200.91 52.44 201.03 50.67 204.47 49.28 206.13 47.47 207.15 47.82 207.16 47.81 208.79 46.59 207.97 44.15 210.42 40.12 207.14 35.57 207.02 33.12 203.26 31.48 200.44 34.48 197.9 29.71 194.91 29.71 192.32 28.09 194.63 24.95 194.23 22.64 191.38 20.46 191.38 17.34 190.43 13.39 192.46 10.94 194.36 11.62 199.26 9.58 200.44 5.5 203.07 3.73 200.9 1.55 196.07 0.19 189.87 2.78 186.61 2.51 184.29 4.83 181.44 4.95 179.53 7.3 171.37 7.95 164.97 12.29 158.31 16.24 152.59 16.24 148.92 20.05 148.17 21.55 148.93 24.21 148.51 29.17 149.69 31.01 151.5 31.9 152.32 34.21 152.12 35.16 150.69 35.28 148.31 37.47 148.44 39.11 148.03 40.81 147.9 43.31 151.84 44.15 152.93 43.6 153.46 45.3 151.91 47.47 154.29 48 154.64 50.06 156.2 52.03 157.15 52.78 158 55.3 158.31 56.52 158.88 57.61"
                data-district_id="6"
              ></polygon>
              <path
                id="dolomiten"
                class="weather-map-default"
                d="M156.81,89.38l1.63,3.45,9.12-3.49,3.81-.12L175,87.47l2,1.58,4.82-7.67-.14-4,2.45-5.22.82-5.72,4.21,3.28L193.14,73l5.17,1.5.13,4.49,2-2,3.05-1.43L205.38,74l4,1.34,2.72-2h2.31l2.45,1.56,2.45-.87-.41-2.81,2.59.14,2.86-4.07,4.33-2.14-.12-1L225,63.32l-6-4-2.86-9.11-4.9-1.51-3.26.53-.82-1.47-1-.34-1.66,1.81L201,50.67l-.12,1.77-4.84.45-4.69.24.53,3.52-1.48.6-2.26-.73-2.45,1-.47,2-1.77.75L181,60.4H179l-.12.47h-.82l-.41,1-.95-.69-1-.12-.88-.48,1-1.5-.75-.47-1.09.13.14-.54-1.77-1.71-1-1.15-1.57,0-1.56.57-.85-.44-.92.44-.41-.31-1.22.12-.89.12-1.77,1.66-.68.18h-2.62l.65,1.22.12,2-2,2-1.36.12-1.69,3,.24,1.76-3.1.07-2.17.61-1.71-1-2.93.45-2.79,1.59-2-1.3-2.65-1.29-1.93,1.5-.86.06-.62,1.16-1.08.13,2.38,1.71,2,.47.65,2.18v.82l1.05.12,1.43,1.44v1.49h0l-1,.08-1.35,4.15-1.65-2.06-1.29-.87-4.69.44h-1.64l-2.17.43-.48,1.51-1,.07L124,85.23l-1.29,3.64-1.3.51.14,1.29-4.44,4.15h0l-1.21.82-1.5.81-1.49-.88-2.25-.39.51,1.27,2.42,4.54-.82,1h-1l-.58-.61-1.46,1.36-.61,1.28-1.5,3.36v1.49l-2.37,1.22,2.37,1.17,2.32,1.82,2-1,3.81,2.11,2.72.41,1.43,1.83,5.3,1.23,2.72,1.07,1.36-5,4-.68,2.18-9h0l.67-4.9,2.87-2-2.32-2.66,4.9-.12,4.49-1.64h0l2.18.69,6.4-1.91,2.17-2.25m-18.49-7.2h0"
                data-district_id="7"
              ></path>
            </g>

            <!-- TEXT -->
            <g id="txt_DT_dolo_regionen_" data-name="txt_DT (+dolo_regionen)">
              <path
                class="weather-map-town"
                d="M165,49.48a1.28,1.28,0,0,1-.74.24.34.34,0,0,1-.25-.07,1.38,1.38,0,0,1-.25-.77c0-.14,0-.18.08-.24a1.28,1.28,0,0,1,.74-.24.34.34,0,0,1,.25.07,1.38,1.38,0,0,1,.25.77C165.05,49.38,165,49.42,165,49.48Z"
              ></path>
              <path
                class="weather-map-town"
                d="M116,31.79a1.24,1.24,0,0,1-.73.24A.34.34,0,0,1,115,32a1.32,1.32,0,0,1-.25-.76c0-.14,0-.18.08-.24a1.28,1.28,0,0,1,.74-.24.37.37,0,0,1,.25.07,1.42,1.42,0,0,1,.24.76C116.06,31.7,116.05,31.74,116,31.79Z"
              ></path>
              <path
                class="weather-map-town"
                d="M86.05,71.25a1.28,1.28,0,0,1-.74.24.34.34,0,0,1-.25-.07,1.38,1.38,0,0,1-.25-.77c0-.14,0-.18.08-.24a1.28,1.28,0,0,1,.74-.24.34.34,0,0,1,.25.07,1.38,1.38,0,0,1,.25.77C86.13,71.15,86.11,71.19,86.05,71.25Z"
              ></path>
              <path
                class="weather-map-town"
                d="M43.05,74.5a1.28,1.28,0,0,1-.74.24.34.34,0,0,1-.25-.07,1.38,1.38,0,0,1-.25-.77c0-.14,0-.18.08-.24a1.28,1.28,0,0,1,.74-.24.34.34,0,0,1,.25.07,1.38,1.38,0,0,1,.25.77C43.13,74.4,43.11,74.44,43.05,74.5Z"
              ></path>
              <path
                class="weather-map-town"
                d="M141.16,61.66a1.28,1.28,0,0,1-.74.24.34.34,0,0,1-.25-.07,1.38,1.38,0,0,1-.25-.77c0-.14,0-.18.08-.24a1.28,1.28,0,0,1,.74-.24.34.34,0,0,1,.25.07,1.38,1.38,0,0,1,.25.77C141.24,61.56,141.22,61.6,141.16,61.66Z"
              ></path>
              <path
                class="weather-map-town"
                d="M105.79,97.8a1.28,1.28,0,0,1-.74.24.34.34,0,0,1-.25-.07,1.38,1.38,0,0,1-.25-.77c0-.14,0-.18.08-.24a1.28,1.28,0,0,1,.74-.24.34.34,0,0,1,.25.07,1.38,1.38,0,0,1,.25.77C105.87,97.7,105.85,97.74,105.79,97.8Z"
              ></path>
              <!-- Dolomiten -->
              <path
                class="weather-map-dolomiten"
                d="M148.42,80.3c1.24-.57,2.25-.36,2.81.85A2.05,2.05,0,0,1,150,84a5.1,5.1,0,0,1-.94.36l-1.61-3.53A7.26,7.26,0,0,1,148.42,80.3Zm1.32,3.25q1.55-.72.93-2.1a1.37,1.37,0,0,0-2-.69,2.65,2.65,0,0,0-.46.24l1.22,2.67Z"
              ></path>
              <path
                class="weather-map-dolomiten"
                d="M154.48,80.33a1.4,1.4,0,0,1-.64,2,1.34,1.34,0,0,1-1.8-.85,1.37,1.37,0,0,1,.65-1.94A1.31,1.31,0,0,1,154.48,80.33ZM152.84,80c-.41.18-.52.61-.24,1.22s.69.82,1.09.64.51-.62.23-1.24S153.24,79.78,152.84,80Z"
              ></path>
              <path class="weather-map-dolomiten" d="M156.31,81.07l-.54.25-1.67-3.65a1.83,1.83,0,0,1,.5-.35Z"></path>
              <path
                class="weather-map-dolomiten"
                d="M158.84,78.34a1.38,1.38,0,0,1-.64,2,1.32,1.32,0,0,1-1.79-.85,1.37,1.37,0,0,1,.65-1.94A1.3,1.3,0,0,1,158.84,78.34ZM157.2,78c-.4.19-.51.61-.23,1.22s.68.83,1.09.64.51-.62.23-1.24S157.61,77.79,157.2,78Z"
              ></path>
              <path
                class="weather-map-dolomiten"
                d="M161.15,76.21h0a.93.93,0,0,1,.63-.86c.53-.24.91.05,1.15.57l.8,1.75-.54.25-.78-1.7c-.12-.27-.31-.48-.6-.35a.76.76,0,0,0-.27,1.06l.66,1.44-.55.25-.77-1.7c-.13-.27-.31-.48-.6-.35a.76.76,0,0,0-.27,1.06l.66,1.44-.55.25L159,76.78a1.58,1.58,0,0,1,.44-.33l.25.53h0a.88.88,0,0,1,.59-.92A.72.72,0,0,1,161.15,76.21Z"
              ></path>
              <path
                class="weather-map-dolomiten"
                d="M163.66,73.79a.63.63,0,0,1-.32.3.23.23,0,0,1-.15,0,.92.92,0,0,1-.34-.38c0-.08,0-.1,0-.15a.63.63,0,0,1,.32-.3.17.17,0,0,1,.15,0,.83.83,0,0,1,.34.37C163.68,73.72,163.68,73.74,163.66,73.79ZM165.11,77l-.54.25-1.17-2.54a2.2,2.2,0,0,1,.5-.35Z"
              ></path>
              <path
                class="weather-map-dolomiten"
                d="M164.63,74.48a.69.69,0,0,1-.07-.3l.36-.16-.22-.48a2.07,2.07,0,0,1,.5-.35l.26.58a7.43,7.43,0,0,0,.76-.41,2.5,2.5,0,0,1,.15.44,4.44,4.44,0,0,1-.71.39l.58,1.27c.19.43.39.42.59.33a.72.72,0,0,0,.35-.32,1,1,0,0,1,.26.36,1.08,1.08,0,0,1-.54.48c-.31.14-.82.25-1.2-.59l-.59-1.28-.39.18A.5.5,0,0,1,164.63,74.48Z"
              ></path>

              <path
                class="weather-map-dolomiten"
                d="M168,74.53a.65.65,0,0,0,.89.31,1.31,1.31,0,0,0,.62-.53,1,1,0,0,1,.28.38,1.42,1.42,0,0,1-.73.61,1.24,1.24,0,0,1-1.76-.78,1.4,1.4,0,0,1,.59-2,.82.82,0,0,1,1.19.35C169.34,73.42,169.14,73.86,168,74.53Zm-.19-.38c.7-.45.85-.72.73-1a.33.33,0,0,0-.48-.15C167.72,73.18,167.63,73.61,167.84,74.15Z"
              ></path>
              <path
                class="weather-map-dolomiten"
                d="M172,71.78l.8,1.76-.54.25-.78-1.71c-.12-.26-.31-.47-.62-.33a.77.77,0,0,0-.3,1.07l.66,1.44-.55.25L169.49,72a1.58,1.58,0,0,1,.44-.33l.24.53h0a.93.93,0,0,1,.61-.94C171.35,71,171.75,71.26,172,71.78Z"
              ></path>
            </g>
          </g>
        </svg>
      `;
  };

  /** City id */
  const localities_class = {
    7: 'dolomiten',
    6: 'bruneck',
    5: 'brixen',
    3: 'bozen',
    4: 'sterzing',
    2: 'meran',
    1: 'schlanders'
  };

  const WEATHER_ICON_PATH = 'https://www.suedtirol.info/static/img/weatherIcons';

  class Meteo extends LitElement {
    constructor() {
      super();
      this.language_translation = 'en';
      this.weather_data = {};
      this.token = `iJ9gIQJ-LFaNT2m-R_dazqCf2XoXO8trlqZsgN6ENAMD9lrWsdKKxoOYkHdNQt9UAUJlMosEiF-njEUtoNwT3V6AtIt08bxrLa0DKLJYroj54I_C1kCPiWV69KR1IXUZj18av-nuofuYDzpE8jRYL02SI97jHEGWfnRLNOfLyEsp3pAp17rm-p6hst-t7Z0bYJkIqFvERMd4QHshaRvAb89EUPb_zEHj1JwgBUOwFIHf0e8Bm-1-nL8d9o9AIEGGDAIiJfvjGmNT-54vteKx1E_r7liUDuXfL0pctOpu5w5Mb_yBmnJsDGFjq7YHVL9dIqZzUvXnRXq1x4novqquK0jiEXRI3XxQN-qKuMpYQ8XqsXQWTjWqoGqgqbIGYpRXMcAUvO-6Y7SSKKvtMLvXGZjlC_IA0TMvF2r8JQbfluFk2XzKs7sqIu6OCxWT4Xxn8U2NWFtKXK4RkfXP9zOMP4FtTfz-X3kgwwgWuUnFvbufk9xRF8nNwqsxgwedNtnw0ouzarOI3zUFRg0dBKJse1z-_rGkF4QvTWwzGG17LPs`;
      this.base_url = `https://tourism.opendatahub.bz.it/api/Weather`;
      this.slider = {};
      this.is_loading = true;
      this.selected_district_id = 0;
      this.forecast_days = 5;

      // binded actions
      this.render__carousel = render__carousel.bind(this);
      this.basic_weather_request = basic_weather_request.bind(this);
      this.districts_details_api_call = districts_details_api_call.bind(this);
      this.render__location = render__location.bind(this);
    }

    // weather_data: { type: Object },
    // districts_details: { type: Array },
    static get properties() {
      return {
        language_translation: { type: String },
        is_loading: { type: Boolean },
        forecast_days: { type: Number },
        selected_district_id: { type: Number }
      };
    }

    async firstUpdated() {
      await this.districts_details_api_call();
      await this.basic_weather_request();
      await this.requestUpdate();

      const main_slider_element = this.shadowRoot.getElementById('main_slider');
      this.slider = new Glide$1(main_slider_element, {
        type: 'carousel',
        animationDuration: 300
      });

      let main_map_target = this.shadowRoot.getElementById('main_map');

      let map_bozen = this.shadowRoot.getElementById('bozen');
      let map_meran = this.shadowRoot.getElementById('meran');
      let map_schlanders = this.shadowRoot.getElementById('schlanders');
      let map_brixen = this.shadowRoot.getElementById('brixen');
      let map_sterzing = this.shadowRoot.getElementById('sterzing');
      let map_bruneck = this.shadowRoot.getElementById('bruneck');
      let map_dolomiten = this.shadowRoot.getElementById('dolomiten');

      let array_districts_getted_elements = [
        map_bozen,
        map_meran,
        map_schlanders,
        map_brixen,
        map_sterzing,
        map_bruneck,
        map_dolomiten
      ];

      let debounced_manage_map_events = debounce(function(event) {
        switch (event.type) {
          case 'mouseleave':
            if (event.path && event.path[0].id === 'main_map') {
              this.slider.go('=0');
            }
            if (event.explicitOriginalTarget && event.explicitOriginalTarget.firstElementChild.id === 'main_map') {
              this.slider.go('=0');
            }
            break;
          case 'mouseenter':
            let target = {};
            if (event.path) {
              target = event.path[0];
            }
            if (event.explicitOriginalTarget) {
              target = event.explicitOriginalTarget;
            }
            let district = parseInt(target.getAttribute('data-district_id'));
            target.classList.remove('weather-map-default');
            target.classList.add('weather-map-active');
            this.slider.go(`=${district}`);
            break;
        }
      }, 300).bind(this);

      this.slider.on(['run.after'], e => {
        const index = this.slider.index;
        array_districts_getted_elements.map(o => {
          o.classList.remove('weather-map-active');
          o.classList.add('weather-map-default');
        });
        if (index) {
          let target = array_districts_getted_elements[index - 1];
          target.classList.remove('weather-map-default');
          target.classList.add('weather-map-active');
        }
        this.selected_district_id = index;
      });

      main_map_target.onmouseleave = debounced_manage_map_events;

      array_districts_getted_elements.map(o => {
        o.onmouseenter = debounced_manage_map_events;
        o.onmouseleave = debounced_manage_map_events;
      });
      this.slider.mount();
      if (this.selected_district_id) {
        this.slider.go(`=${this.selected_district_id}`);
      }
    }

    render() {
      const { Stationdata, Forecast } = this.weather_data;

      /** The first six records are about today */
      let localities_today = Stationdata ? Stationdata.slice(0, 6) : [];
      let current_forecast = this.districts_details
        ? this.districts_details.filter(o => o.Id === this.selected_district_id)
        : [];
      const placeholder_mod = !localities_today.length;

      if (this.districts_details) {
        const { MaxTemp } = this.districts_details[6].BezirksForecast[0];

        localities_today = [
          ...localities_today,
          { ...this.districts_details[6].BezirksForecast[0], CityName: 'dolomiten', Id: 7, Maxtemp: MaxTemp }
        ];
      }

      return html`
      <style>
        ${style_glide_theme}
        ${style_glide_core}
        ${style__placeholder_loading}
        ${main}
        ${style__typography}
        ${style__towns}
        ${style__carousel_card}
      </style>
      <div class="meteo_widget">
        <h1>${p.weather_in_south_tyrol[this.language_translation]}</h1>
        <div class="meteo_widget__content">
          <div class="meteo_widget__map_container__responsive_manger">
            <div class="meteo_widget__map_container">
              ${new_suedtirol_map(this.language_translation)}
              ${placeholder_mod
                ? placeholder_places.map(({ Id, CityName, Maxtemp, MinTemp, WeatherCode }) => {
                    return this.render__location(
                      localities_class[Id],
                      CityName.split('/')[0],
                      Maxtemp,
                      MinTemp,
                      WeatherCode,
                      placeholder_mod
                    );
                  })
                : localities_today.map(({ Id, CityName, Maxtemp, MinTemp, WeatherCode }) => {
                    return this.render__location(
                      localities_class[Id],
                      CityName.split('/')[0],
                      Maxtemp,
                      MinTemp,
                      WeatherCode
                    );
                  })}
            </div>
          </div>
          ${this.render__carousel(localities_today)}
        </div>
        <div class="forecast">
          ${Forecast && this.selected_district_id === 0
            ? Forecast.slice(0, this.forecast_days).map(({ date, Weathercode, TempMinmin, TempMaxmax }) => {
                let weather_icon = `${WEATHER_ICON_PATH}/${Weathercode}.svg`;
                return html`
                  <div class="forecast__item">
                    <p class="forecast__item__day">${moment(date).format('dddd')}</p>
                    <img src=${weather_icon} class="forecast__item__icon" />
                    <p class="forecast__item__temp"><span>${TempMaxmax}</span> / ${TempMinmin}°C</p>
                  </div>
                `;
              })
            : [0, 1, 2, 3].slice(0, this.forecast_days).map(() => {
                if (this.selected_district_id === 0) {
                  return html`
                    <div class="forecast__item">
                      ${['forecast__date', 'forecast__icon', 'forecast__rain'].map(o => render__placehoder(o))}
                    </div>
                  `;
                }
              })}
          ${current_forecast.length && this.selected_district_id !== 0
            ? current_forecast.map(({ BezirksForecast }) => {
                let slice_of_bezirksforecast = BezirksForecast.slice(1, this.forecast_days + 1);
                return slice_of_bezirksforecast.map(
                  ({ date, WeatherCode, MinTemp, MaxTemp, RainFrom, RainTo, Part1, Part2, Part3, Part4 }) => {
                    // let rain_icon_path = rain_level_icons[render__rain_number(Part1, Part2, Part3, Part4)];
                    return html`
                      <div class="forecast__item">
                        <p class="forecast__item__day">${moment(date).format('dddd')}</p>
                        <img src="${WEATHER_ICON_PATH}/${WeatherCode}.svg" class="forecast__item__icon" />
                        <p class="forecast__item__temp"><span>${MaxTemp}</span> / ${MinTemp}°C</p>
                      </div>
                    `;
                  }
                );
              })
            : [0, 1, 2, 3].slice(0, this.forecast_days).map(() => {
                if (this.selected_district_id !== 0) {
                  return html`
                    <div class="forecast__item">
                      ${['forecast__date', 'forecast__icon', 'forecast__rain'].map(o => render__placehoder(o))}
                    </div>
                  `;
                }
              })}
        </div>
      </div>
    `;
    }
  }

  if (!window.customElements.get('meteo-widget')) {
    window.customElements.define('meteo-widget', Meteo);
  }

}());
