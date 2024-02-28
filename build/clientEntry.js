var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);

// node_modules/react/cjs/react.development.js
var require_react_development = __commonJS((exports, module) => {
  if (true) {
    (function() {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart === "function") {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error);
      }
      var ReactVersion = "18.3.0-next-3706edb81-20230308";
      var REACT_ELEMENT_TYPE = Symbol.for("react.element");
      var REACT_PORTAL_TYPE = Symbol.for("react.portal");
      var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
      var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
      var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
      var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
      var REACT_CONTEXT_TYPE = Symbol.for("react.context");
      var REACT_SERVER_CONTEXT_TYPE = Symbol.for("react.server_context");
      var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
      var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
      var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
      var REACT_MEMO_TYPE = Symbol.for("react.memo");
      var REACT_LAZY_TYPE = Symbol.for("react.lazy");
      var REACT_OFFSCREEN_TYPE = Symbol.for("react.offscreen");
      var REACT_CACHE_TYPE = Symbol.for("react.cache");
      var REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED = Symbol.for("react.default_value");
      var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = "@@iterator";
      function getIteratorFn(maybeIterable) {
        if (maybeIterable === null || typeof maybeIterable !== "object") {
          return null;
        }
        var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
        if (typeof maybeIterator === "function") {
          return maybeIterator;
        }
        return null;
      }
      var ReactCurrentDispatcher$1 = {
        current: null
      };
      var ReactCurrentCache = {
        current: null
      };
      var ReactCurrentBatchConfig = {
        transition: null
      };
      var ReactCurrentActQueue = {
        current: null,
        isBatchingLegacy: false,
        didScheduleLegacyUpdate: false,
        didUsePromise: false
      };
      var ReactCurrentOwner = {
        current: null
      };
      var ReactDebugCurrentFrame$1 = {};
      var currentExtraStackFrame = null;
      function setExtraStackFrame(stack) {
        {
          currentExtraStackFrame = stack;
        }
      }
      {
        ReactDebugCurrentFrame$1.setExtraStackFrame = function(stack) {
          {
            currentExtraStackFrame = stack;
          }
        };
        ReactDebugCurrentFrame$1.getCurrentStack = null;
        ReactDebugCurrentFrame$1.getStackAddendum = function() {
          var stack = "";
          if (currentExtraStackFrame) {
            stack += currentExtraStackFrame;
          }
          var impl = ReactDebugCurrentFrame$1.getCurrentStack;
          if (impl) {
            stack += impl() || "";
          }
          return stack;
        };
      }
      var enableScopeAPI = false;
      var enableCacheElement = false;
      var enableTransitionTracing = false;
      var enableLegacyHidden = false;
      var enableDebugTracing = false;
      var ContextRegistry$1 = {};
      var ReactSharedInternals = {
        ReactCurrentDispatcher: ReactCurrentDispatcher$1,
        ReactCurrentCache,
        ReactCurrentBatchConfig,
        ReactCurrentOwner
      };
      {
        ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame$1;
        ReactSharedInternals.ReactCurrentActQueue = ReactCurrentActQueue;
      }
      {
        ReactSharedInternals.ContextRegistry = ContextRegistry$1;
      }
      function warn(format) {
        {
          {
            for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1;_key < _len; _key++) {
              args[_key - 1] = arguments[_key];
            }
            printWarning("warn", format, args);
          }
        }
      }
      function error(format) {
        {
          {
            for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1;_key2 < _len2; _key2++) {
              args[_key2 - 1] = arguments[_key2];
            }
            printWarning("error", format, args);
          }
        }
      }
      function printWarning(level, format, args) {
        {
          var ReactDebugCurrentFrame2 = ReactSharedInternals.ReactDebugCurrentFrame;
          var stack = ReactDebugCurrentFrame2.getStackAddendum();
          if (stack !== "") {
            format += "%s";
            args = args.concat([stack]);
          }
          var argsWithFormat = args.map(function(item) {
            return String(item);
          });
          argsWithFormat.unshift("Warning: " + format);
          Function.prototype.apply.call(console[level], console, argsWithFormat);
        }
      }
      var didWarnStateUpdateForUnmountedComponent = {};
      function warnNoop(publicInstance, callerName) {
        {
          var _constructor = publicInstance.constructor;
          var componentName = _constructor && (_constructor.displayName || _constructor.name) || "ReactClass";
          var warningKey = componentName + "." + callerName;
          if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
            return;
          }
          error("Can't call %s on a component that is not yet mounted. This is a no-op, but it might indicate a bug in your application. Instead, assign to `this.state` directly or define a `state = {};` class property with the desired state in the %s component.", callerName, componentName);
          didWarnStateUpdateForUnmountedComponent[warningKey] = true;
        }
      }
      var ReactNoopUpdateQueue = {
        isMounted: function(publicInstance) {
          return false;
        },
        enqueueForceUpdate: function(publicInstance, callback, callerName) {
          warnNoop(publicInstance, "forceUpdate");
        },
        enqueueReplaceState: function(publicInstance, completeState, callback, callerName) {
          warnNoop(publicInstance, "replaceState");
        },
        enqueueSetState: function(publicInstance, partialState, callback, callerName) {
          warnNoop(publicInstance, "setState");
        }
      };
      var assign = Object.assign;
      var emptyObject = {};
      {
        Object.freeze(emptyObject);
      }
      function Component(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      Component.prototype.isReactComponent = {};
      Component.prototype.setState = function(partialState, callback) {
        if (typeof partialState !== "object" && typeof partialState !== "function" && partialState != null) {
          throw new Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");
        }
        this.updater.enqueueSetState(this, partialState, callback, "setState");
      };
      Component.prototype.forceUpdate = function(callback) {
        this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
      };
      {
        var deprecatedAPIs = {
          isMounted: ["isMounted", "Instead, make sure to clean up subscriptions and pending requests in componentWillUnmount to prevent memory leaks."],
          replaceState: ["replaceState", "Refactor your code to use setState instead (see https://github.com/facebook/react/issues/3236)."]
        };
        var defineDeprecationWarning = function(methodName, info) {
          Object.defineProperty(Component.prototype, methodName, {
            get: function() {
              warn("%s(...) is deprecated in plain JavaScript React classes. %s", info[0], info[1]);
              return;
            }
          });
        };
        for (var fnName in deprecatedAPIs) {
          if (deprecatedAPIs.hasOwnProperty(fnName)) {
            defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
          }
        }
      }
      function ComponentDummy() {
      }
      ComponentDummy.prototype = Component.prototype;
      function PureComponent(props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = emptyObject;
        this.updater = updater || ReactNoopUpdateQueue;
      }
      var pureComponentPrototype = PureComponent.prototype = new ComponentDummy;
      pureComponentPrototype.constructor = PureComponent;
      assign(pureComponentPrototype, Component.prototype);
      pureComponentPrototype.isPureReactComponent = true;
      function createRef() {
        var refObject = {
          current: null
        };
        {
          Object.seal(refObject);
        }
        return refObject;
      }
      var isArrayImpl = Array.isArray;
      function isArray(a) {
        return isArrayImpl(a);
      }
      function typeName(value) {
        {
          var hasToStringTag = typeof Symbol === "function" && Symbol.toStringTag;
          var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
          return type;
        }
      }
      function willCoercionThrow(value) {
        {
          try {
            testStringCoercion(value);
            return false;
          } catch (e) {
            return true;
          }
        }
      }
      function testStringCoercion(value) {
        return "" + value;
      }
      function checkKeyStringCoercion(value) {
        {
          if (willCoercionThrow(value)) {
            error("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", typeName(value));
            return testStringCoercion(value);
          }
        }
      }
      function getWrappedName(outerType, innerType, wrapperName) {
        var displayName = outerType.displayName;
        if (displayName) {
          return displayName;
        }
        var functionName = innerType.displayName || innerType.name || "";
        return functionName !== "" ? wrapperName + "(" + functionName + ")" : wrapperName;
      }
      function getContextName(type) {
        return type.displayName || "Context";
      }
      function getComponentNameFromType(type) {
        if (type == null) {
          return null;
        }
        {
          if (typeof type.tag === "number") {
            error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue.");
          }
        }
        if (typeof type === "function") {
          return type.displayName || type.name || null;
        }
        if (typeof type === "string") {
          return type;
        }
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return "Fragment";
          case REACT_PORTAL_TYPE:
            return "Portal";
          case REACT_PROFILER_TYPE:
            return "Profiler";
          case REACT_STRICT_MODE_TYPE:
            return "StrictMode";
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
          case REACT_CACHE_TYPE: {
            return "Cache";
          }
        }
        if (typeof type === "object") {
          switch (type.$$typeof) {
            case REACT_CONTEXT_TYPE:
              var context = type;
              return getContextName(context) + ".Consumer";
            case REACT_PROVIDER_TYPE:
              var provider = type;
              return getContextName(provider._context) + ".Provider";
            case REACT_FORWARD_REF_TYPE:
              return getWrappedName(type, type.render, "ForwardRef");
            case REACT_MEMO_TYPE:
              var outerName = type.displayName || null;
              if (outerName !== null) {
                return outerName;
              }
              return getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE: {
              var lazyComponent = type;
              var payload = lazyComponent._payload;
              var init = lazyComponent._init;
              try {
                return getComponentNameFromType(init(payload));
              } catch (x) {
                return null;
              }
            }
            case REACT_SERVER_CONTEXT_TYPE: {
              var context2 = type;
              return (context2.displayName || context2._globalName) + ".Provider";
            }
          }
        }
        return null;
      }
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var RESERVED_PROPS = {
        key: true,
        ref: true,
        __self: true,
        __source: true
      };
      var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;
      {
        didWarnAboutStringRefs = {};
      }
      function hasValidRef(config) {
        {
          if (hasOwnProperty.call(config, "ref")) {
            var getter = Object.getOwnPropertyDescriptor(config, "ref").get;
            if (getter && getter.isReactWarning) {
              return false;
            }
          }
        }
        return config.ref !== undefined;
      }
      function hasValidKey(config) {
        {
          if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) {
              return false;
            }
          }
        }
        return config.key !== undefined;
      }
      function defineKeyPropWarningGetter(props, displayName) {
        var warnAboutAccessingKey = function() {
          {
            if (!specialPropKeyWarningShown) {
              specialPropKeyWarningShown = true;
              error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
            }
          }
        };
        warnAboutAccessingKey.isReactWarning = true;
        Object.defineProperty(props, "key", {
          get: warnAboutAccessingKey,
          configurable: true
        });
      }
      function defineRefPropWarningGetter(props, displayName) {
        var warnAboutAccessingRef = function() {
          {
            if (!specialPropRefWarningShown) {
              specialPropRefWarningShown = true;
              error("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", displayName);
            }
          }
        };
        warnAboutAccessingRef.isReactWarning = true;
        Object.defineProperty(props, "ref", {
          get: warnAboutAccessingRef,
          configurable: true
        });
      }
      function warnIfStringRefCannotBeAutoConverted(config) {
        {
          if (typeof config.ref === "string" && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
            var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);
            if (!didWarnAboutStringRefs[componentName]) {
              error('Component "%s" contains the string ref "%s". Support for string refs will be removed in a future major release. This case cannot be automatically converted to an arrow function. We ask you to manually fix this case by using useRef() or createRef() instead. Learn more about using refs safely here: https://reactjs.org/link/strict-mode-string-ref', componentName, config.ref);
              didWarnAboutStringRefs[componentName] = true;
            }
          }
        }
      }
      var ReactElement = function(type, key, ref, self, source, owner, props) {
        var element = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          ref,
          props,
          _owner: owner
        };
        {
          element._store = {};
          Object.defineProperty(element._store, "validated", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: false
          });
          Object.defineProperty(element, "_self", {
            configurable: false,
            enumerable: false,
            writable: false,
            value: self
          });
          Object.defineProperty(element, "_source", {
            configurable: false,
            enumerable: false,
            writable: false,
            value: source
          });
          if (Object.freeze) {
            Object.freeze(element.props);
            Object.freeze(element);
          }
        }
        return element;
      };
      function createElement$1(type, config, children) {
        var propName;
        var props = {};
        var key = null;
        var ref = null;
        var self = null;
        var source = null;
        if (config != null) {
          if (hasValidRef(config)) {
            ref = config.ref;
            {
              warnIfStringRefCannotBeAutoConverted(config);
            }
          }
          if (hasValidKey(config)) {
            {
              checkKeyStringCoercion(config.key);
            }
            key = "" + config.key;
          }
          self = config.__self === undefined ? null : config.__self;
          source = config.__source === undefined ? null : config.__source;
          for (propName in config) {
            if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
              props[propName] = config[propName];
            }
          }
        }
        var childrenLength = arguments.length - 2;
        if (childrenLength === 1) {
          props.children = children;
        } else if (childrenLength > 1) {
          var childArray = Array(childrenLength);
          for (var i = 0;i < childrenLength; i++) {
            childArray[i] = arguments[i + 2];
          }
          {
            if (Object.freeze) {
              Object.freeze(childArray);
            }
          }
          props.children = childArray;
        }
        if (type && type.defaultProps) {
          var defaultProps = type.defaultProps;
          for (propName in defaultProps) {
            if (props[propName] === undefined) {
              props[propName] = defaultProps[propName];
            }
          }
        }
        {
          if (key || ref) {
            var displayName = typeof type === "function" ? type.displayName || type.name || "Unknown" : type;
            if (key) {
              defineKeyPropWarningGetter(props, displayName);
            }
            if (ref) {
              defineRefPropWarningGetter(props, displayName);
            }
          }
        }
        return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
      }
      function cloneAndReplaceKey(oldElement, newKey) {
        var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
        return newElement;
      }
      function cloneElement$1(element, config, children) {
        if (element === null || element === undefined) {
          throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + element + ".");
        }
        var propName;
        var props = assign({}, element.props);
        var key = element.key;
        var ref = element.ref;
        var self = element._self;
        var source = element._source;
        var owner = element._owner;
        if (config != null) {
          if (hasValidRef(config)) {
            ref = config.ref;
            owner = ReactCurrentOwner.current;
          }
          if (hasValidKey(config)) {
            {
              checkKeyStringCoercion(config.key);
            }
            key = "" + config.key;
          }
          var defaultProps;
          if (element.type && element.type.defaultProps) {
            defaultProps = element.type.defaultProps;
          }
          for (propName in config) {
            if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
              if (config[propName] === undefined && defaultProps !== undefined) {
                props[propName] = defaultProps[propName];
              } else {
                props[propName] = config[propName];
              }
            }
          }
        }
        var childrenLength = arguments.length - 2;
        if (childrenLength === 1) {
          props.children = children;
        } else if (childrenLength > 1) {
          var childArray = Array(childrenLength);
          for (var i = 0;i < childrenLength; i++) {
            childArray[i] = arguments[i + 2];
          }
          props.children = childArray;
        }
        return ReactElement(element.type, key, ref, self, source, owner, props);
      }
      function isValidElement(object) {
        return typeof object === "object" && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
      }
      var SEPARATOR = ".";
      var SUBSEPARATOR = ":";
      function escape(key) {
        var escapeRegex = /[=:]/g;
        var escaperLookup = {
          "=": "=0",
          ":": "=2"
        };
        var escapedString = key.replace(escapeRegex, function(match) {
          return escaperLookup[match];
        });
        return "$" + escapedString;
      }
      var didWarnAboutMaps = false;
      var userProvidedKeyEscapeRegex = /\/+/g;
      function escapeUserProvidedKey(text) {
        return text.replace(userProvidedKeyEscapeRegex, "$&/");
      }
      function getElementKey(element, index) {
        if (typeof element === "object" && element !== null && element.key != null) {
          {
            checkKeyStringCoercion(element.key);
          }
          return escape("" + element.key);
        }
        return index.toString(36);
      }
      function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
        var type = typeof children;
        if (type === "undefined" || type === "boolean") {
          children = null;
        }
        var invokeCallback = false;
        if (children === null) {
          invokeCallback = true;
        } else {
          switch (type) {
            case "string":
            case "number":
              invokeCallback = true;
              break;
            case "object":
              switch (children.$$typeof) {
                case REACT_ELEMENT_TYPE:
                case REACT_PORTAL_TYPE:
                  invokeCallback = true;
              }
          }
        }
        if (invokeCallback) {
          var _child = children;
          var mappedChild = callback(_child);
          var childKey = nameSoFar === "" ? SEPARATOR + getElementKey(_child, 0) : nameSoFar;
          if (isArray(mappedChild)) {
            var escapedChildKey = "";
            if (childKey != null) {
              escapedChildKey = escapeUserProvidedKey(childKey) + "/";
            }
            mapIntoArray(mappedChild, array, escapedChildKey, "", function(c) {
              return c;
            });
          } else if (mappedChild != null) {
            if (isValidElement(mappedChild)) {
              {
                if (mappedChild.key && (!_child || _child.key !== mappedChild.key)) {
                  checkKeyStringCoercion(mappedChild.key);
                }
              }
              mappedChild = cloneAndReplaceKey(mappedChild, escapedPrefix + (mappedChild.key && (!_child || _child.key !== mappedChild.key) ? escapeUserProvidedKey("" + mappedChild.key) + "/" : "") + childKey);
            }
            array.push(mappedChild);
          }
          return 1;
        }
        var child;
        var nextName;
        var subtreeCount = 0;
        var nextNamePrefix = nameSoFar === "" ? SEPARATOR : nameSoFar + SUBSEPARATOR;
        if (isArray(children)) {
          for (var i = 0;i < children.length; i++) {
            child = children[i];
            nextName = nextNamePrefix + getElementKey(child, i);
            subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
          }
        } else {
          var iteratorFn = getIteratorFn(children);
          if (typeof iteratorFn === "function") {
            var iterableChildren = children;
            {
              if (iteratorFn === iterableChildren.entries) {
                if (!didWarnAboutMaps) {
                  warn("Using Maps as children is not supported. Use an array of keyed ReactElements instead.");
                }
                didWarnAboutMaps = true;
              }
            }
            var iterator = iteratorFn.call(iterableChildren);
            var step;
            var ii = 0;
            while (!(step = iterator.next()).done) {
              child = step.value;
              nextName = nextNamePrefix + getElementKey(child, ii++);
              subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
            }
          } else if (type === "object") {
            var childrenString = String(children);
            throw new Error("Objects are not valid as a React child (found: " + (childrenString === "[object Object]" ? "object with keys {" + Object.keys(children).join(", ") + "}" : childrenString) + "). If you meant to render a collection of children, use an array instead.");
          }
        }
        return subtreeCount;
      }
      function mapChildren(children, func, context) {
        if (children == null) {
          return children;
        }
        var result = [];
        var count = 0;
        mapIntoArray(children, result, "", "", function(child) {
          return func.call(context, child, count++);
        });
        return result;
      }
      function countChildren(children) {
        var n = 0;
        mapChildren(children, function() {
          n++;
        });
        return n;
      }
      function forEachChildren(children, forEachFunc, forEachContext) {
        mapChildren(children, function() {
          forEachFunc.apply(this, arguments);
        }, forEachContext);
      }
      function toArray(children) {
        return mapChildren(children, function(child) {
          return child;
        }) || [];
      }
      function onlyChild(children) {
        if (!isValidElement(children)) {
          throw new Error("React.Children.only expected to receive a single React element child.");
        }
        return children;
      }
      function createContext(defaultValue) {
        var context = {
          $$typeof: REACT_CONTEXT_TYPE,
          _currentValue: defaultValue,
          _currentValue2: defaultValue,
          _threadCount: 0,
          Provider: null,
          Consumer: null,
          _defaultValue: null,
          _globalName: null
        };
        context.Provider = {
          $$typeof: REACT_PROVIDER_TYPE,
          _context: context
        };
        var hasWarnedAboutUsingNestedContextConsumers = false;
        var hasWarnedAboutUsingConsumerProvider = false;
        var hasWarnedAboutDisplayNameOnConsumer = false;
        {
          var Consumer = {
            $$typeof: REACT_CONTEXT_TYPE,
            _context: context
          };
          Object.defineProperties(Consumer, {
            Provider: {
              get: function() {
                if (!hasWarnedAboutUsingConsumerProvider) {
                  hasWarnedAboutUsingConsumerProvider = true;
                  error("Rendering <Context.Consumer.Provider> is not supported and will be removed in a future major release. Did you mean to render <Context.Provider> instead?");
                }
                return context.Provider;
              },
              set: function(_Provider) {
                context.Provider = _Provider;
              }
            },
            _currentValue: {
              get: function() {
                return context._currentValue;
              },
              set: function(_currentValue) {
                context._currentValue = _currentValue;
              }
            },
            _currentValue2: {
              get: function() {
                return context._currentValue2;
              },
              set: function(_currentValue2) {
                context._currentValue2 = _currentValue2;
              }
            },
            _threadCount: {
              get: function() {
                return context._threadCount;
              },
              set: function(_threadCount) {
                context._threadCount = _threadCount;
              }
            },
            Consumer: {
              get: function() {
                if (!hasWarnedAboutUsingNestedContextConsumers) {
                  hasWarnedAboutUsingNestedContextConsumers = true;
                  error("Rendering <Context.Consumer.Consumer> is not supported and will be removed in a future major release. Did you mean to render <Context.Consumer> instead?");
                }
                return context.Consumer;
              }
            },
            displayName: {
              get: function() {
                return context.displayName;
              },
              set: function(displayName) {
                if (!hasWarnedAboutDisplayNameOnConsumer) {
                  warn("Setting `displayName` on Context.Consumer has no effect. You should set it directly on the context with Context.displayName = '%s'.", displayName);
                  hasWarnedAboutDisplayNameOnConsumer = true;
                }
              }
            }
          });
          context.Consumer = Consumer;
        }
        {
          context._currentRenderer = null;
          context._currentRenderer2 = null;
        }
        return context;
      }
      var Uninitialized = -1;
      var Pending = 0;
      var Resolved = 1;
      var Rejected = 2;
      function lazyInitializer(payload) {
        if (payload._status === Uninitialized) {
          var ctor = payload._result;
          var thenable = ctor();
          thenable.then(function(moduleObject2) {
            if (payload._status === Pending || payload._status === Uninitialized) {
              var resolved = payload;
              resolved._status = Resolved;
              resolved._result = moduleObject2;
            }
          }, function(error2) {
            if (payload._status === Pending || payload._status === Uninitialized) {
              var rejected = payload;
              rejected._status = Rejected;
              rejected._result = error2;
            }
          });
          if (payload._status === Uninitialized) {
            var pending = payload;
            pending._status = Pending;
            pending._result = thenable;
          }
        }
        if (payload._status === Resolved) {
          var moduleObject = payload._result;
          {
            if (moduleObject === undefined) {
              error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))\n\nDid you accidentally put curly braces around the import?", moduleObject);
            }
          }
          {
            if (!("default" in moduleObject)) {
              error("lazy: Expected the result of a dynamic import() call. Instead received: %s\n\nYour code should look like: \n  const MyComponent = lazy(() => import('./MyComponent'))", moduleObject);
            }
          }
          return moduleObject.default;
        } else {
          throw payload._result;
        }
      }
      function lazy(ctor) {
        var payload = {
          _status: Uninitialized,
          _result: ctor
        };
        var lazyType = {
          $$typeof: REACT_LAZY_TYPE,
          _payload: payload,
          _init: lazyInitializer
        };
        {
          var defaultProps;
          var propTypes;
          Object.defineProperties(lazyType, {
            defaultProps: {
              configurable: true,
              get: function() {
                return defaultProps;
              },
              set: function(newDefaultProps) {
                error("React.lazy(...): It is not supported to assign `defaultProps` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it.");
                defaultProps = newDefaultProps;
                Object.defineProperty(lazyType, "defaultProps", {
                  enumerable: true
                });
              }
            },
            propTypes: {
              configurable: true,
              get: function() {
                return propTypes;
              },
              set: function(newPropTypes) {
                error("React.lazy(...): It is not supported to assign `propTypes` to a lazy component import. Either specify them where the component is defined, or create a wrapping component around it.");
                propTypes = newPropTypes;
                Object.defineProperty(lazyType, "propTypes", {
                  enumerable: true
                });
              }
            }
          });
        }
        return lazyType;
      }
      function forwardRef(render) {
        {
          if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
            error("forwardRef requires a render function but received a `memo` component. Instead of forwardRef(memo(...)), use memo(forwardRef(...)).");
          } else if (typeof render !== "function") {
            error("forwardRef requires a render function but was given %s.", render === null ? "null" : typeof render);
          } else {
            if (render.length !== 0 && render.length !== 2) {
              error("forwardRef render functions accept exactly two parameters: props and ref. %s", render.length === 1 ? "Did you forget to use the ref parameter?" : "Any additional parameter will be undefined.");
            }
          }
          if (render != null) {
            if (render.defaultProps != null || render.propTypes != null) {
              error("forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?");
            }
          }
        }
        var elementType = {
          $$typeof: REACT_FORWARD_REF_TYPE,
          render
        };
        {
          var ownName;
          Object.defineProperty(elementType, "displayName", {
            enumerable: false,
            configurable: true,
            get: function() {
              return ownName;
            },
            set: function(name) {
              ownName = name;
              if (!render.name && !render.displayName) {
                render.displayName = name;
              }
            }
          });
        }
        return elementType;
      }
      var REACT_CLIENT_REFERENCE$1 = Symbol.for("react.client.reference");
      function isValidElementType(type) {
        if (typeof type === "string" || typeof type === "function") {
          return true;
        }
        if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
          return true;
        }
        if (typeof type === "object" && type !== null) {
          if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_CLIENT_REFERENCE$1 || type.getModuleId !== undefined) {
            return true;
          }
        }
        return false;
      }
      function memo(type, compare) {
        {
          if (!isValidElementType(type)) {
            error("memo: The first argument must be a component. Instead received: %s", type === null ? "null" : typeof type);
          }
        }
        var elementType = {
          $$typeof: REACT_MEMO_TYPE,
          type,
          compare: compare === undefined ? null : compare
        };
        {
          var ownName;
          Object.defineProperty(elementType, "displayName", {
            enumerable: false,
            configurable: true,
            get: function() {
              return ownName;
            },
            set: function(name) {
              ownName = name;
              if (!type.name && !type.displayName) {
                type.displayName = name;
              }
            }
          });
        }
        return elementType;
      }
      var UNTERMINATED = 0;
      var TERMINATED = 1;
      var ERRORED = 2;
      function createCacheRoot() {
        return new WeakMap;
      }
      function createCacheNode() {
        return {
          s: UNTERMINATED,
          v: undefined,
          o: null,
          p: null
        };
      }
      function cache(fn) {
        return function() {
          var dispatcher = ReactCurrentCache.current;
          if (!dispatcher) {
            return fn.apply(null, arguments);
          }
          var fnMap = dispatcher.getCacheForType(createCacheRoot);
          var fnNode = fnMap.get(fn);
          var cacheNode;
          if (fnNode === undefined) {
            cacheNode = createCacheNode();
            fnMap.set(fn, cacheNode);
          } else {
            cacheNode = fnNode;
          }
          for (var i = 0, l = arguments.length;i < l; i++) {
            var arg = arguments[i];
            if (typeof arg === "function" || typeof arg === "object" && arg !== null) {
              var objectCache = cacheNode.o;
              if (objectCache === null) {
                cacheNode.o = objectCache = new WeakMap;
              }
              var objectNode = objectCache.get(arg);
              if (objectNode === undefined) {
                cacheNode = createCacheNode();
                objectCache.set(arg, cacheNode);
              } else {
                cacheNode = objectNode;
              }
            } else {
              var primitiveCache = cacheNode.p;
              if (primitiveCache === null) {
                cacheNode.p = primitiveCache = new Map;
              }
              var primitiveNode = primitiveCache.get(arg);
              if (primitiveNode === undefined) {
                cacheNode = createCacheNode();
                primitiveCache.set(arg, cacheNode);
              } else {
                cacheNode = primitiveNode;
              }
            }
          }
          if (cacheNode.s === TERMINATED) {
            return cacheNode.v;
          }
          if (cacheNode.s === ERRORED) {
            throw cacheNode.v;
          }
          try {
            var result = fn.apply(null, arguments);
            var terminatedNode = cacheNode;
            terminatedNode.s = TERMINATED;
            terminatedNode.v = result;
            return result;
          } catch (error2) {
            var erroredNode = cacheNode;
            erroredNode.s = ERRORED;
            erroredNode.v = error2;
            throw error2;
          }
        };
      }
      function resolveDispatcher() {
        var dispatcher = ReactCurrentDispatcher$1.current;
        {
          if (dispatcher === null) {
            error("Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:\n1. You might have mismatching versions of React and the renderer (such as React DOM)\n2. You might be breaking the Rules of Hooks\n3. You might have more than one copy of React in the same app\nSee https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.");
          }
        }
        return dispatcher;
      }
      function useContext(Context) {
        var dispatcher = resolveDispatcher();
        {
          if (Context._context !== undefined) {
            var realContext = Context._context;
            if (realContext.Consumer === Context) {
              error("Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be removed in a future major release. Did you mean to call useContext(Context) instead?");
            } else if (realContext.Provider === Context) {
              error("Calling useContext(Context.Provider) is not supported. Did you mean to call useContext(Context) instead?");
            }
          }
        }
        return dispatcher.useContext(Context);
      }
      function useState(initialState) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useState(initialState);
      }
      function useReducer(reducer, initialArg, init) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useReducer(reducer, initialArg, init);
      }
      function useRef(initialValue) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useRef(initialValue);
      }
      function useEffect(create, deps) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useEffect(create, deps);
      }
      function useInsertionEffect(create, deps) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useInsertionEffect(create, deps);
      }
      function useLayoutEffect(create, deps) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useLayoutEffect(create, deps);
      }
      function useCallback(callback, deps) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useCallback(callback, deps);
      }
      function useMemo(create, deps) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useMemo(create, deps);
      }
      function useImperativeHandle(ref, create, deps) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useImperativeHandle(ref, create, deps);
      }
      function useDebugValue(value, formatterFn) {
        {
          var dispatcher = resolveDispatcher();
          return dispatcher.useDebugValue(value, formatterFn);
        }
      }
      function useTransition() {
        var dispatcher = resolveDispatcher();
        return dispatcher.useTransition();
      }
      function useDeferredValue(value) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useDeferredValue(value);
      }
      function useId() {
        var dispatcher = resolveDispatcher();
        return dispatcher.useId();
      }
      function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
        var dispatcher = resolveDispatcher();
        return dispatcher.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
      }
      function useCacheRefresh() {
        var dispatcher = resolveDispatcher();
        return dispatcher.useCacheRefresh();
      }
      function use(usable) {
        var dispatcher = resolveDispatcher();
        return dispatcher.use(usable);
      }
      var disabledDepth = 0;
      var prevLog;
      var prevInfo;
      var prevWarn;
      var prevError;
      var prevGroup;
      var prevGroupCollapsed;
      var prevGroupEnd;
      function disabledLog() {
      }
      disabledLog.__reactDisabledLog = true;
      function disableLogs() {
        {
          if (disabledDepth === 0) {
            prevLog = console.log;
            prevInfo = console.info;
            prevWarn = console.warn;
            prevError = console.error;
            prevGroup = console.group;
            prevGroupCollapsed = console.groupCollapsed;
            prevGroupEnd = console.groupEnd;
            var props = {
              configurable: true,
              enumerable: true,
              value: disabledLog,
              writable: true
            };
            Object.defineProperties(console, {
              info: props,
              log: props,
              warn: props,
              error: props,
              group: props,
              groupCollapsed: props,
              groupEnd: props
            });
          }
          disabledDepth++;
        }
      }
      function reenableLogs() {
        {
          disabledDepth--;
          if (disabledDepth === 0) {
            var props = {
              configurable: true,
              enumerable: true,
              writable: true
            };
            Object.defineProperties(console, {
              log: assign({}, props, {
                value: prevLog
              }),
              info: assign({}, props, {
                value: prevInfo
              }),
              warn: assign({}, props, {
                value: prevWarn
              }),
              error: assign({}, props, {
                value: prevError
              }),
              group: assign({}, props, {
                value: prevGroup
              }),
              groupCollapsed: assign({}, props, {
                value: prevGroupCollapsed
              }),
              groupEnd: assign({}, props, {
                value: prevGroupEnd
              })
            });
          }
          if (disabledDepth < 0) {
            error("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
          }
        }
      }
      var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
      var prefix;
      function describeBuiltInComponentFrame(name, source, ownerFn) {
        {
          if (prefix === undefined) {
            try {
              throw Error();
            } catch (x) {
              var match = x.stack.trim().match(/\n( *(at )?)/);
              prefix = match && match[1] || "";
            }
          }
          return "\n" + prefix + name;
        }
      }
      var reentry = false;
      var componentFrameCache;
      {
        var PossiblyWeakMap = typeof WeakMap === "function" ? WeakMap : Map;
        componentFrameCache = new PossiblyWeakMap;
      }
      function describeNativeComponentFrame(fn, construct) {
        if (!fn || reentry) {
          return "";
        }
        {
          var frame = componentFrameCache.get(fn);
          if (frame !== undefined) {
            return frame;
          }
        }
        var control;
        reentry = true;
        var previousPrepareStackTrace = Error.prepareStackTrace;
        Error.prepareStackTrace = undefined;
        var previousDispatcher;
        {
          previousDispatcher = ReactCurrentDispatcher.current;
          ReactCurrentDispatcher.current = null;
          disableLogs();
        }
        try {
          if (construct) {
            var Fake = function() {
              throw Error();
            };
            Object.defineProperty(Fake.prototype, "props", {
              set: function() {
                throw Error();
              }
            });
            if (typeof Reflect === "object" && Reflect.construct) {
              try {
                Reflect.construct(Fake, []);
              } catch (x) {
                control = x;
              }
              Reflect.construct(fn, [], Fake);
            } else {
              try {
                Fake.call();
              } catch (x) {
                control = x;
              }
              fn.call(Fake.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (x) {
              control = x;
            }
            fn();
          }
        } catch (sample) {
          if (sample && control && typeof sample.stack === "string") {
            var sampleLines = sample.stack.split("\n");
            var controlLines = control.stack.split("\n");
            var s = sampleLines.length - 1;
            var c = controlLines.length - 1;
            while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
              c--;
            }
            for (;s >= 1 && c >= 0; s--, c--) {
              if (sampleLines[s] !== controlLines[c]) {
                if (s !== 1 || c !== 1) {
                  do {
                    s--;
                    c--;
                    if (c < 0 || sampleLines[s] !== controlLines[c]) {
                      var _frame = "\n" + sampleLines[s].replace(" at new ", " at ");
                      if (fn.displayName && _frame.includes("<anonymous>")) {
                        _frame = _frame.replace("<anonymous>", fn.displayName);
                      }
                      {
                        if (typeof fn === "function") {
                          componentFrameCache.set(fn, _frame);
                        }
                      }
                      return _frame;
                    }
                  } while (s >= 1 && c >= 0);
                }
                break;
              }
            }
          }
        } finally {
          reentry = false;
          {
            ReactCurrentDispatcher.current = previousDispatcher;
            reenableLogs();
          }
          Error.prepareStackTrace = previousPrepareStackTrace;
        }
        var name = fn ? fn.displayName || fn.name : "";
        var syntheticFrame = name ? describeBuiltInComponentFrame(name) : "";
        {
          if (typeof fn === "function") {
            componentFrameCache.set(fn, syntheticFrame);
          }
        }
        return syntheticFrame;
      }
      function describeFunctionComponentFrame(fn, source, ownerFn) {
        {
          return describeNativeComponentFrame(fn, false);
        }
      }
      function shouldConstruct(Component2) {
        var prototype = Component2.prototype;
        return !!(prototype && prototype.isReactComponent);
      }
      function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
        if (type == null) {
          return "";
        }
        if (typeof type === "function") {
          {
            return describeNativeComponentFrame(type, shouldConstruct(type));
          }
        }
        if (typeof type === "string") {
          return describeBuiltInComponentFrame(type);
        }
        switch (type) {
          case REACT_SUSPENSE_TYPE:
            return describeBuiltInComponentFrame("Suspense");
          case REACT_SUSPENSE_LIST_TYPE:
            return describeBuiltInComponentFrame("SuspenseList");
        }
        if (typeof type === "object") {
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
              return describeFunctionComponentFrame(type.render);
            case REACT_MEMO_TYPE:
              return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
            case REACT_LAZY_TYPE: {
              var lazyComponent = type;
              var payload = lazyComponent._payload;
              var init = lazyComponent._init;
              try {
                return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
              } catch (x) {
              }
            }
          }
        }
        return "";
      }
      var loggedTypeFailures = {};
      var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      function setCurrentlyValidatingElement$1(element) {
        {
          if (element) {
            var owner = element._owner;
            var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
            ReactDebugCurrentFrame.setExtraStackFrame(stack);
          } else {
            ReactDebugCurrentFrame.setExtraStackFrame(null);
          }
        }
      }
      function checkPropTypes(typeSpecs, values, location, componentName, element) {
        {
          var has = Function.call.bind(hasOwnProperty);
          for (var typeSpecName in typeSpecs) {
            if (has(typeSpecs, typeSpecName)) {
              var error$1 = undefined;
              try {
                if (typeof typeSpecs[typeSpecName] !== "function") {
                  var err = Error((componentName || "React class") + ": " + location + " type `" + typeSpecName + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof typeSpecs[typeSpecName] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                  err.name = "Invariant Violation";
                  throw err;
                }
                error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
              } catch (ex) {
                error$1 = ex;
              }
              if (error$1 && !(error$1 instanceof Error)) {
                setCurrentlyValidatingElement$1(element);
                error("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", componentName || "React class", location, typeSpecName, typeof error$1);
                setCurrentlyValidatingElement$1(null);
              }
              if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                loggedTypeFailures[error$1.message] = true;
                setCurrentlyValidatingElement$1(element);
                error("Failed %s type: %s", location, error$1.message);
                setCurrentlyValidatingElement$1(null);
              }
            }
          }
        }
      }
      var REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference");
      function setCurrentlyValidatingElement(element) {
        {
          if (element) {
            var owner = element._owner;
            var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
            setExtraStackFrame(stack);
          } else {
            setExtraStackFrame(null);
          }
        }
      }
      var propTypesMisspellWarningShown;
      {
        propTypesMisspellWarningShown = false;
      }
      function getDeclarationErrorAddendum() {
        if (ReactCurrentOwner.current) {
          var name = getComponentNameFromType(ReactCurrentOwner.current.type);
          if (name) {
            return "\n\nCheck the render method of `" + name + "`.";
          }
        }
        return "";
      }
      function getSourceInfoErrorAddendum(source) {
        if (source !== undefined) {
          var fileName = source.fileName.replace(/^.*[\\\/]/, "");
          var lineNumber = source.lineNumber;
          return "\n\nCheck your code at " + fileName + ":" + lineNumber + ".";
        }
        return "";
      }
      function getSourceInfoErrorAddendumForProps(elementProps) {
        if (elementProps !== null && elementProps !== undefined) {
          return getSourceInfoErrorAddendum(elementProps.__source);
        }
        return "";
      }
      var ownerHasKeyUseWarning = {};
      function getCurrentComponentErrorInfo(parentType) {
        var info = getDeclarationErrorAddendum();
        if (!info) {
          var parentName = typeof parentType === "string" ? parentType : parentType.displayName || parentType.name;
          if (parentName) {
            info = "\n\nCheck the top-level render call using <" + parentName + ">.";
          }
        }
        return info;
      }
      function validateExplicitKey(element, parentType) {
        if (!element._store || element._store.validated || element.key != null) {
          return;
        }
        element._store.validated = true;
        var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
        if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
          return;
        }
        ownerHasKeyUseWarning[currentComponentErrorInfo] = true;
        var childOwner = "";
        if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
          childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
        }
        {
          setCurrentlyValidatingElement(element);
          error('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);
          setCurrentlyValidatingElement(null);
        }
      }
      function validateChildKeys(node, parentType) {
        if (typeof node !== "object" || !node) {
          return;
        }
        if (node.$$typeof === REACT_CLIENT_REFERENCE)
          ;
        else if (isArray(node)) {
          for (var i = 0;i < node.length; i++) {
            var child = node[i];
            if (isValidElement(child)) {
              validateExplicitKey(child, parentType);
            }
          }
        } else if (isValidElement(node)) {
          if (node._store) {
            node._store.validated = true;
          }
        } else {
          var iteratorFn = getIteratorFn(node);
          if (typeof iteratorFn === "function") {
            if (iteratorFn !== node.entries) {
              var iterator = iteratorFn.call(node);
              var step;
              while (!(step = iterator.next()).done) {
                if (isValidElement(step.value)) {
                  validateExplicitKey(step.value, parentType);
                }
              }
            }
          }
        }
      }
      function validatePropTypes(element) {
        {
          var type = element.type;
          if (type === null || type === undefined || typeof type === "string") {
            return;
          }
          if (type.$$typeof === REACT_CLIENT_REFERENCE) {
            return;
          }
          var propTypes;
          if (typeof type === "function") {
            propTypes = type.propTypes;
          } else if (typeof type === "object" && (type.$$typeof === REACT_FORWARD_REF_TYPE || type.$$typeof === REACT_MEMO_TYPE)) {
            propTypes = type.propTypes;
          } else {
            return;
          }
          if (propTypes) {
            var name = getComponentNameFromType(type);
            checkPropTypes(propTypes, element.props, "prop", name, element);
          } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
            propTypesMisspellWarningShown = true;
            var _name = getComponentNameFromType(type);
            error("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", _name || "Unknown");
          }
          if (typeof type.getDefaultProps === "function" && !type.getDefaultProps.isReactClassApproved) {
            error("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
          }
        }
      }
      function validateFragmentProps(fragment) {
        {
          var keys = Object.keys(fragment.props);
          for (var i = 0;i < keys.length; i++) {
            var key = keys[i];
            if (key !== "children" && key !== "key") {
              setCurrentlyValidatingElement(fragment);
              error("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", key);
              setCurrentlyValidatingElement(null);
              break;
            }
          }
          if (fragment.ref !== null) {
            setCurrentlyValidatingElement(fragment);
            error("Invalid attribute `ref` supplied to `React.Fragment`.");
            setCurrentlyValidatingElement(null);
          }
        }
      }
      function createElementWithValidation(type, props, children) {
        var validType = isValidElementType(type);
        if (!validType) {
          var info = "";
          if (type === undefined || typeof type === "object" && type !== null && Object.keys(type).length === 0) {
            info += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.";
          }
          var sourceInfo = getSourceInfoErrorAddendumForProps(props);
          if (sourceInfo) {
            info += sourceInfo;
          } else {
            info += getDeclarationErrorAddendum();
          }
          var typeString;
          if (type === null) {
            typeString = "null";
          } else if (isArray(type)) {
            typeString = "array";
          } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
            typeString = "<" + (getComponentNameFromType(type.type) || "Unknown") + " />";
            info = " Did you accidentally export a JSX literal instead of a component?";
          } else {
            typeString = typeof type;
          }
          {
            error("React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", typeString, info);
          }
        }
        var element = createElement$1.apply(this, arguments);
        if (element == null) {
          return element;
        }
        if (validType) {
          for (var i = 2;i < arguments.length; i++) {
            validateChildKeys(arguments[i], type);
          }
        }
        if (type === REACT_FRAGMENT_TYPE) {
          validateFragmentProps(element);
        } else {
          validatePropTypes(element);
        }
        return element;
      }
      var didWarnAboutDeprecatedCreateFactory = false;
      function createFactoryWithValidation(type) {
        var validatedFactory = createElementWithValidation.bind(null, type);
        validatedFactory.type = type;
        {
          if (!didWarnAboutDeprecatedCreateFactory) {
            didWarnAboutDeprecatedCreateFactory = true;
            warn("React.createFactory() is deprecated and will be removed in a future major release. Consider using JSX or use React.createElement() directly instead.");
          }
          Object.defineProperty(validatedFactory, "type", {
            enumerable: false,
            get: function() {
              warn("Factory.type is deprecated. Access the class directly before passing it to createFactory.");
              Object.defineProperty(this, "type", {
                value: type
              });
              return type;
            }
          });
        }
        return validatedFactory;
      }
      function cloneElementWithValidation(element, props, children) {
        var newElement = cloneElement$1.apply(this, arguments);
        for (var i = 2;i < arguments.length; i++) {
          validateChildKeys(arguments[i], newElement.type);
        }
        validatePropTypes(newElement);
        return newElement;
      }
      var ContextRegistry = ReactSharedInternals.ContextRegistry;
      function createServerContext(globalName, defaultValue) {
        var wasDefined = true;
        if (!ContextRegistry[globalName]) {
          wasDefined = false;
          var _context = {
            $$typeof: REACT_SERVER_CONTEXT_TYPE,
            _currentValue: defaultValue,
            _currentValue2: defaultValue,
            _defaultValue: defaultValue,
            _threadCount: 0,
            Provider: null,
            Consumer: null,
            _globalName: globalName
          };
          _context.Provider = {
            $$typeof: REACT_PROVIDER_TYPE,
            _context
          };
          {
            var hasWarnedAboutUsingConsumer;
            _context._currentRenderer = null;
            _context._currentRenderer2 = null;
            Object.defineProperties(_context, {
              Consumer: {
                get: function() {
                  if (!hasWarnedAboutUsingConsumer) {
                    error("Consumer pattern is not supported by ReactServerContext");
                    hasWarnedAboutUsingConsumer = true;
                  }
                  return null;
                }
              }
            });
          }
          ContextRegistry[globalName] = _context;
        }
        var context = ContextRegistry[globalName];
        if (context._defaultValue === REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED) {
          context._defaultValue = defaultValue;
          if (context._currentValue === REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED) {
            context._currentValue = defaultValue;
          }
          if (context._currentValue2 === REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED) {
            context._currentValue2 = defaultValue;
          }
        } else if (wasDefined) {
          throw new Error("ServerContext: " + globalName + " already defined");
        }
        return context;
      }
      function startTransition(scope, options) {
        var prevTransition = ReactCurrentBatchConfig.transition;
        ReactCurrentBatchConfig.transition = {};
        var currentTransition = ReactCurrentBatchConfig.transition;
        {
          ReactCurrentBatchConfig.transition._updatedFibers = new Set;
        }
        try {
          scope();
        } finally {
          ReactCurrentBatchConfig.transition = prevTransition;
          {
            if (prevTransition === null && currentTransition._updatedFibers) {
              var updatedFibersCount = currentTransition._updatedFibers.size;
              currentTransition._updatedFibers.clear();
              if (updatedFibersCount > 10) {
                warn("Detected a large number of updates inside startTransition. If this is due to a subscription please re-write it to use React provided hooks. Otherwise concurrent mode guarantees are off the table.");
              }
            }
          }
        }
      }
      var didWarnAboutMessageChannel = false;
      var enqueueTaskImpl = null;
      function enqueueTask(task) {
        if (enqueueTaskImpl === null) {
          try {
            var requireString = ("require" + Math.random()).slice(0, 7);
            var nodeRequire = module && module[requireString];
            enqueueTaskImpl = nodeRequire.call(module, "timers").setImmediate;
          } catch (_err) {
            enqueueTaskImpl = function(callback) {
              {
                if (didWarnAboutMessageChannel === false) {
                  didWarnAboutMessageChannel = true;
                  if (typeof MessageChannel === "undefined") {
                    error("This browser does not have a MessageChannel implementation, so enqueuing tasks via await act(async () => ...) will fail. Please file an issue at https://github.com/facebook/react/issues if you encounter this warning.");
                  }
                }
              }
              var channel = new MessageChannel;
              channel.port1.onmessage = callback;
              channel.port2.postMessage(undefined);
            };
          }
        }
        return enqueueTaskImpl(task);
      }
      var actScopeDepth = 0;
      var didWarnNoAwaitAct = false;
      function act(callback) {
        {
          var prevIsBatchingLegacy = ReactCurrentActQueue.isBatchingLegacy;
          var prevActQueue = ReactCurrentActQueue.current;
          var prevActScopeDepth = actScopeDepth;
          actScopeDepth++;
          var queue = ReactCurrentActQueue.current = prevActQueue !== null ? prevActQueue : [];
          ReactCurrentActQueue.isBatchingLegacy = true;
          var result;
          var didAwaitActCall = false;
          try {
            ReactCurrentActQueue.didScheduleLegacyUpdate = false;
            result = callback();
            var didScheduleLegacyUpdate = ReactCurrentActQueue.didScheduleLegacyUpdate;
            if (!prevIsBatchingLegacy && didScheduleLegacyUpdate) {
              flushActQueue(queue);
            }
            ReactCurrentActQueue.isBatchingLegacy = prevIsBatchingLegacy;
          } catch (error2) {
            ReactCurrentActQueue.isBatchingLegacy = prevIsBatchingLegacy;
            popActScope(prevActQueue, prevActScopeDepth);
            throw error2;
          }
          if (result !== null && typeof result === "object" && typeof result.then === "function") {
            var thenable = result;
            queueSeveralMicrotasks(function() {
              if (!didAwaitActCall && !didWarnNoAwaitAct) {
                didWarnNoAwaitAct = true;
                error("You called act(async () => ...) without await. This could lead to unexpected testing behaviour, interleaving multiple act calls and mixing their scopes. You should - await act(async () => ...);");
              }
            });
            return {
              then: function(resolve, reject) {
                didAwaitActCall = true;
                thenable.then(function(returnValue2) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  if (prevActScopeDepth === 0) {
                    try {
                      flushActQueue(queue);
                      enqueueTask(function() {
                        return recursivelyFlushAsyncActWork(returnValue2, resolve, reject);
                      });
                    } catch (error2) {
                      reject(error2);
                    }
                  } else {
                    resolve(returnValue2);
                  }
                }, function(error2) {
                  popActScope(prevActQueue, prevActScopeDepth);
                  reject(error2);
                });
              }
            };
          } else {
            var returnValue = result;
            popActScope(prevActQueue, prevActScopeDepth);
            if (prevActScopeDepth === 0) {
              flushActQueue(queue);
              if (queue.length !== 0) {
                queueSeveralMicrotasks(function() {
                  if (!didAwaitActCall && !didWarnNoAwaitAct) {
                    didWarnNoAwaitAct = true;
                    error("A component suspended inside an `act` scope, but the `act` call was not awaited. When testing React components that depend on asynchronous data, you must await the result:\n\nawait act(() => ...)");
                  }
                });
              }
              ReactCurrentActQueue.current = null;
            }
            return {
              then: function(resolve, reject) {
                didAwaitActCall = true;
                if (prevActScopeDepth === 0) {
                  ReactCurrentActQueue.current = queue;
                  enqueueTask(function() {
                    return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                  });
                } else {
                  resolve(returnValue);
                }
              }
            };
          }
        }
      }
      function popActScope(prevActQueue, prevActScopeDepth) {
        {
          if (prevActScopeDepth !== actScopeDepth - 1) {
            error("You seem to have overlapping act() calls, this is not supported. Be sure to await previous act() calls before making a new one. ");
          }
          actScopeDepth = prevActScopeDepth;
        }
      }
      function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
        {
          var queue = ReactCurrentActQueue.current;
          if (queue !== null) {
            if (queue.length !== 0) {
              try {
                flushActQueue(queue);
                enqueueTask(function() {
                  return recursivelyFlushAsyncActWork(returnValue, resolve, reject);
                });
              } catch (error2) {
                reject(error2);
              }
            } else {
              ReactCurrentActQueue.current = null;
              resolve(returnValue);
            }
          } else {
            resolve(returnValue);
          }
        }
      }
      var isFlushing = false;
      function flushActQueue(queue) {
        {
          if (!isFlushing) {
            isFlushing = true;
            var i = 0;
            try {
              for (;i < queue.length; i++) {
                var callback = queue[i];
                do {
                  ReactCurrentActQueue.didUsePromise = false;
                  var continuation = callback(false);
                  if (continuation !== null) {
                    if (ReactCurrentActQueue.didUsePromise) {
                      queue[i] = callback;
                      queue.splice(0, i);
                      return;
                    }
                    callback = continuation;
                  } else {
                    break;
                  }
                } while (true);
              }
              queue.length = 0;
            } catch (error2) {
              queue.splice(0, i + 1);
              throw error2;
            } finally {
              isFlushing = false;
            }
          }
        }
      }
      var queueSeveralMicrotasks = typeof queueMicrotask === "function" ? function(callback) {
        queueMicrotask(function() {
          return queueMicrotask(callback);
        });
      } : enqueueTask;
      var createElement = createElementWithValidation;
      var cloneElement = cloneElementWithValidation;
      var createFactory = createFactoryWithValidation;
      var Children = {
        map: mapChildren,
        forEach: forEachChildren,
        count: countChildren,
        toArray,
        only: onlyChild
      };
      exports.Children = Children;
      exports.Component = Component;
      exports.Fragment = REACT_FRAGMENT_TYPE;
      exports.Profiler = REACT_PROFILER_TYPE;
      exports.PureComponent = PureComponent;
      exports.StrictMode = REACT_STRICT_MODE_TYPE;
      exports.Suspense = REACT_SUSPENSE_TYPE;
      exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals;
      exports.cache = cache;
      exports.cloneElement = cloneElement;
      exports.createContext = createContext;
      exports.createElement = createElement;
      exports.createFactory = createFactory;
      exports.createRef = createRef;
      exports.createServerContext = createServerContext;
      exports.forwardRef = forwardRef;
      exports.isValidElement = isValidElement;
      exports.lazy = lazy;
      exports.memo = memo;
      exports.startTransition = startTransition;
      exports.unstable_act = act;
      exports.unstable_useCacheRefresh = useCacheRefresh;
      exports.use = use;
      exports.useCallback = useCallback;
      exports.useContext = useContext;
      exports.useDebugValue = useDebugValue;
      exports.useDeferredValue = useDeferredValue;
      exports.useEffect = useEffect;
      exports.useId = useId;
      exports.useImperativeHandle = useImperativeHandle;
      exports.useInsertionEffect = useInsertionEffect;
      exports.useLayoutEffect = useLayoutEffect;
      exports.useMemo = useMemo;
      exports.useReducer = useReducer;
      exports.useRef = useRef;
      exports.useState = useState;
      exports.useSyncExternalStore = useSyncExternalStore;
      exports.useTransition = useTransition;
      exports.version = ReactVersion;
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== "undefined" && typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop === "function") {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error);
      }
    })();
  }
});

// node_modules/react/index.js
var require_react = __commonJS((exports, module) => {
  var react_development = __toESM(require_react_development(), 1);
  if (false) {
  } else {
    module.exports = react_development;
  }
});

// node_modules/react-server-dom-webpack/cjs/react-server-dom-webpack-client.browser.development.js
var require_react_server_dom_webpack_client_browser_development = __commonJS((exports) => {
  var React2 = __toESM(require_react(), 1);
  if (true) {
    (function() {
      function createStringDecoder() {
        return new TextDecoder;
      }
      var decoderOptions = {
        stream: true
      };
      function readPartialStringChunk(decoder, buffer) {
        return decoder.decode(buffer, decoderOptions);
      }
      function readFinalStringChunk(decoder, buffer) {
        return decoder.decode(buffer);
      }
      function parseModel(response, json) {
        return JSON.parse(json, response._fromJSON);
      }
      function resolveClientReference(bundlerConfig, metadata) {
        if (bundlerConfig) {
          var resolvedModuleData = bundlerConfig[metadata.id][metadata.name];
          if (metadata.async) {
            return {
              id: resolvedModuleData.id,
              chunks: resolvedModuleData.chunks,
              name: resolvedModuleData.name,
              async: true
            };
          } else {
            return resolvedModuleData;
          }
        }
        return metadata;
      }
      var chunkCache = new Map;
      var asyncModuleCache = new Map;
      function ignoreReject() {
      }
      function preloadModule(metadata) {
        var chunks = metadata.chunks;
        var promises = [];
        for (var i = 0;i < chunks.length; i++) {
          var chunkId = chunks[i];
          var entry = chunkCache.get(chunkId);
          if (entry === undefined) {
            var thenable = __webpack_chunk_load__(chunkId);
            promises.push(thenable);
            var resolve = chunkCache.set.bind(chunkCache, chunkId, null);
            thenable.then(resolve, ignoreReject);
            chunkCache.set(chunkId, thenable);
          } else if (entry !== null) {
            promises.push(entry);
          }
        }
        if (metadata.async) {
          var existingPromise = asyncModuleCache.get(metadata.id);
          if (existingPromise) {
            if (existingPromise.status === "fulfilled") {
              return null;
            }
            return existingPromise;
          } else {
            var modulePromise = Promise.all(promises).then(function() {
              return __webpack_require__(metadata.id);
            });
            modulePromise.then(function(value) {
              var fulfilledThenable = modulePromise;
              fulfilledThenable.status = "fulfilled";
              fulfilledThenable.value = value;
            }, function(reason) {
              var rejectedThenable = modulePromise;
              rejectedThenable.status = "rejected";
              rejectedThenable.reason = reason;
            });
            asyncModuleCache.set(metadata.id, modulePromise);
            return modulePromise;
          }
        } else if (promises.length > 0) {
          return Promise.all(promises);
        } else {
          return null;
        }
      }
      function requireModule(metadata) {
        var moduleExports;
        if (metadata.async) {
          var promise = asyncModuleCache.get(metadata.id);
          if (promise.status === "fulfilled") {
            moduleExports = promise.value;
          } else {
            throw promise.reason;
          }
        } else {
          moduleExports = __webpack_require__(metadata.id);
        }
        if (metadata.name === "*") {
          return moduleExports;
        }
        if (metadata.name === "") {
          return moduleExports.__esModule ? moduleExports.default : moduleExports;
        }
        return moduleExports[metadata.name];
      }
      var knownServerReferences = new WeakMap;
      var REACT_ELEMENT_TYPE = Symbol.for("react.element");
      var REACT_PROVIDER_TYPE = Symbol.for("react.provider");
      var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
      var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
      var REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list");
      var REACT_MEMO_TYPE = Symbol.for("react.memo");
      var REACT_LAZY_TYPE = Symbol.for("react.lazy");
      var REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED = Symbol.for("react.default_value");
      var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = "@@iterator";
      function getIteratorFn(maybeIterable) {
        if (maybeIterable === null || typeof maybeIterable !== "object") {
          return null;
        }
        var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
        if (typeof maybeIterator === "function") {
          return maybeIterator;
        }
        return null;
      }
      var ReactSharedInternals = React2.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      var ContextRegistry = ReactSharedInternals.ContextRegistry;
      function getOrCreateServerContext(globalName) {
        if (!ContextRegistry[globalName]) {
          ContextRegistry[globalName] = React2.createServerContext(globalName, REACT_SERVER_CONTEXT_DEFAULT_VALUE_NOT_LOADED);
        }
        return ContextRegistry[globalName];
      }
      var PENDING = "pending";
      var BLOCKED = "blocked";
      var RESOLVED_MODEL = "resolved_model";
      var RESOLVED_MODULE = "resolved_module";
      var INITIALIZED = "fulfilled";
      var ERRORED = "rejected";
      function Chunk(status, value, reason, response) {
        this.status = status;
        this.value = value;
        this.reason = reason;
        this._response = response;
      }
      Chunk.prototype = Object.create(Promise.prototype);
      Chunk.prototype.then = function(resolve, reject) {
        var chunk = this;
        switch (chunk.status) {
          case RESOLVED_MODEL:
            initializeModelChunk(chunk);
            break;
          case RESOLVED_MODULE:
            initializeModuleChunk(chunk);
            break;
        }
        switch (chunk.status) {
          case INITIALIZED:
            resolve(chunk.value);
            break;
          case PENDING:
          case BLOCKED:
            if (resolve) {
              if (chunk.value === null) {
                chunk.value = [];
              }
              chunk.value.push(resolve);
            }
            if (reject) {
              if (chunk.reason === null) {
                chunk.reason = [];
              }
              chunk.reason.push(reject);
            }
            break;
          default:
            reject(chunk.reason);
            break;
        }
      };
      function readChunk(chunk) {
        switch (chunk.status) {
          case RESOLVED_MODEL:
            initializeModelChunk(chunk);
            break;
          case RESOLVED_MODULE:
            initializeModuleChunk(chunk);
            break;
        }
        switch (chunk.status) {
          case INITIALIZED:
            return chunk.value;
          case PENDING:
          case BLOCKED:
            throw chunk;
          default:
            throw chunk.reason;
        }
      }
      function getRoot(response) {
        var chunk = getChunk(response, 0);
        return chunk;
      }
      function createPendingChunk(response) {
        return new Chunk(PENDING, null, null, response);
      }
      function createBlockedChunk(response) {
        return new Chunk(BLOCKED, null, null, response);
      }
      function createErrorChunk(response, error2) {
        return new Chunk(ERRORED, null, error2, response);
      }
      function wakeChunk(listeners, value) {
        for (var i = 0;i < listeners.length; i++) {
          var listener = listeners[i];
          listener(value);
        }
      }
      function wakeChunkIfInitialized(chunk, resolveListeners, rejectListeners) {
        switch (chunk.status) {
          case INITIALIZED:
            wakeChunk(resolveListeners, chunk.value);
            break;
          case PENDING:
          case BLOCKED:
            chunk.value = resolveListeners;
            chunk.reason = rejectListeners;
            break;
          case ERRORED:
            if (rejectListeners) {
              wakeChunk(rejectListeners, chunk.reason);
            }
            break;
        }
      }
      function triggerErrorOnChunk(chunk, error2) {
        if (chunk.status !== PENDING && chunk.status !== BLOCKED) {
          return;
        }
        var listeners = chunk.reason;
        var erroredChunk = chunk;
        erroredChunk.status = ERRORED;
        erroredChunk.reason = error2;
        if (listeners !== null) {
          wakeChunk(listeners, error2);
        }
      }
      function createResolvedModelChunk(response, value) {
        return new Chunk(RESOLVED_MODEL, value, null, response);
      }
      function createResolvedModuleChunk(response, value) {
        return new Chunk(RESOLVED_MODULE, value, null, response);
      }
      function resolveModelChunk(chunk, value) {
        if (chunk.status !== PENDING) {
          return;
        }
        var resolveListeners = chunk.value;
        var rejectListeners = chunk.reason;
        var resolvedChunk = chunk;
        resolvedChunk.status = RESOLVED_MODEL;
        resolvedChunk.value = value;
        if (resolveListeners !== null) {
          initializeModelChunk(resolvedChunk);
          wakeChunkIfInitialized(chunk, resolveListeners, rejectListeners);
        }
      }
      function resolveModuleChunk(chunk, value) {
        if (chunk.status !== PENDING && chunk.status !== BLOCKED) {
          return;
        }
        var resolveListeners = chunk.value;
        var rejectListeners = chunk.reason;
        var resolvedChunk = chunk;
        resolvedChunk.status = RESOLVED_MODULE;
        resolvedChunk.value = value;
        if (resolveListeners !== null) {
          initializeModuleChunk(resolvedChunk);
          wakeChunkIfInitialized(chunk, resolveListeners, rejectListeners);
        }
      }
      var initializingChunk = null;
      var initializingChunkBlockedModel = null;
      function initializeModelChunk(chunk) {
        var prevChunk = initializingChunk;
        var prevBlocked = initializingChunkBlockedModel;
        initializingChunk = chunk;
        initializingChunkBlockedModel = null;
        try {
          var value = parseModel(chunk._response, chunk.value);
          if (initializingChunkBlockedModel !== null && initializingChunkBlockedModel.deps > 0) {
            initializingChunkBlockedModel.value = value;
            var blockedChunk = chunk;
            blockedChunk.status = BLOCKED;
            blockedChunk.value = null;
            blockedChunk.reason = null;
          } else {
            var initializedChunk = chunk;
            initializedChunk.status = INITIALIZED;
            initializedChunk.value = value;
          }
        } catch (error2) {
          var erroredChunk = chunk;
          erroredChunk.status = ERRORED;
          erroredChunk.reason = error2;
        } finally {
          initializingChunk = prevChunk;
          initializingChunkBlockedModel = prevBlocked;
        }
      }
      function initializeModuleChunk(chunk) {
        try {
          var value = requireModule(chunk.value);
          var initializedChunk = chunk;
          initializedChunk.status = INITIALIZED;
          initializedChunk.value = value;
        } catch (error2) {
          var erroredChunk = chunk;
          erroredChunk.status = ERRORED;
          erroredChunk.reason = error2;
        }
      }
      function reportGlobalError(response, error2) {
        response._chunks.forEach(function(chunk) {
          if (chunk.status === PENDING) {
            triggerErrorOnChunk(chunk, error2);
          }
        });
      }
      function createElement(type, key, props) {
        var element = {
          $$typeof: REACT_ELEMENT_TYPE,
          type,
          key,
          ref: null,
          props,
          _owner: null
        };
        {
          element._store = {};
          Object.defineProperty(element._store, "validated", {
            configurable: false,
            enumerable: false,
            writable: true,
            value: true
          });
          Object.defineProperty(element, "_self", {
            configurable: false,
            enumerable: false,
            writable: false,
            value: null
          });
          Object.defineProperty(element, "_source", {
            configurable: false,
            enumerable: false,
            writable: false,
            value: null
          });
        }
        return element;
      }
      function createLazyChunkWrapper(chunk) {
        var lazyType = {
          $$typeof: REACT_LAZY_TYPE,
          _payload: chunk,
          _init: readChunk
        };
        return lazyType;
      }
      function getChunk(response, id) {
        var chunks = response._chunks;
        var chunk = chunks.get(id);
        if (!chunk) {
          chunk = createPendingChunk(response);
          chunks.set(id, chunk);
        }
        return chunk;
      }
      function createModelResolver(chunk, parentObject, key) {
        var blocked;
        if (initializingChunkBlockedModel) {
          blocked = initializingChunkBlockedModel;
          blocked.deps++;
        } else {
          blocked = initializingChunkBlockedModel = {
            deps: 1,
            value: null
          };
        }
        return function(value) {
          parentObject[key] = value;
          blocked.deps--;
          if (blocked.deps === 0) {
            if (chunk.status !== BLOCKED) {
              return;
            }
            var resolveListeners = chunk.value;
            var initializedChunk = chunk;
            initializedChunk.status = INITIALIZED;
            initializedChunk.value = blocked.value;
            if (resolveListeners !== null) {
              wakeChunk(resolveListeners, blocked.value);
            }
          }
        };
      }
      function createModelReject(chunk) {
        return function(error2) {
          return triggerErrorOnChunk(chunk, error2);
        };
      }
      function createServerReferenceProxy(response, metaData) {
        var callServer = response._callServer;
        var proxy = function() {
          var args = Array.prototype.slice.call(arguments);
          var p = metaData.bound;
          if (!p) {
            return callServer(metaData.id, args);
          }
          if (p.status === INITIALIZED) {
            var bound = p.value;
            return callServer(metaData.id, bound.concat(args));
          }
          return Promise.resolve(p).then(function(bound2) {
            return callServer(metaData.id, bound2.concat(args));
          });
        };
        knownServerReferences.set(proxy, metaData);
        return proxy;
      }
      function parseModelString(response, parentObject, key, value) {
        if (value[0] === "$") {
          if (value === "$") {
            return REACT_ELEMENT_TYPE;
          }
          switch (value[1]) {
            case "$": {
              return value.substring(1);
            }
            case "L": {
              var id = parseInt(value.substring(2), 16);
              var chunk = getChunk(response, id);
              return createLazyChunkWrapper(chunk);
            }
            case "@": {
              var _id = parseInt(value.substring(2), 16);
              var _chunk = getChunk(response, _id);
              return _chunk;
            }
            case "S": {
              return Symbol.for(value.substring(2));
            }
            case "P": {
              return getOrCreateServerContext(value.substring(2)).Provider;
            }
            case "F": {
              var _id2 = parseInt(value.substring(2), 16);
              var _chunk2 = getChunk(response, _id2);
              switch (_chunk2.status) {
                case RESOLVED_MODEL:
                  initializeModelChunk(_chunk2);
                  break;
              }
              switch (_chunk2.status) {
                case INITIALIZED: {
                  var metadata = _chunk2.value;
                  return createServerReferenceProxy(response, metadata);
                }
                default:
                  throw _chunk2.reason;
              }
            }
            case "u": {
              return;
            }
            default: {
              var _id3 = parseInt(value.substring(1), 16);
              var _chunk3 = getChunk(response, _id3);
              switch (_chunk3.status) {
                case RESOLVED_MODEL:
                  initializeModelChunk(_chunk3);
                  break;
                case RESOLVED_MODULE:
                  initializeModuleChunk(_chunk3);
                  break;
              }
              switch (_chunk3.status) {
                case INITIALIZED:
                  return _chunk3.value;
                case PENDING:
                case BLOCKED:
                  var parentChunk = initializingChunk;
                  _chunk3.then(createModelResolver(parentChunk, parentObject, key), createModelReject(parentChunk));
                  return null;
                default:
                  throw _chunk3.reason;
              }
            }
          }
        }
        return value;
      }
      function parseModelTuple(response, value) {
        var tuple = value;
        if (tuple[0] === REACT_ELEMENT_TYPE) {
          return createElement(tuple[1], tuple[2], tuple[3]);
        }
        return value;
      }
      function missingCall() {
        throw new Error('Trying to call a function from "use server" but the callServer option was not implemented in your router runtime.');
      }
      function createResponse$1(bundlerConfig, callServer) {
        var chunks = new Map;
        var response = {
          _bundlerConfig: bundlerConfig,
          _callServer: callServer !== undefined ? callServer : missingCall,
          _chunks: chunks
        };
        return response;
      }
      function resolveModel(response, id, model) {
        var chunks = response._chunks;
        var chunk = chunks.get(id);
        if (!chunk) {
          chunks.set(id, createResolvedModelChunk(response, model));
        } else {
          resolveModelChunk(chunk, model);
        }
      }
      function resolveModule(response, id, model) {
        var chunks = response._chunks;
        var chunk = chunks.get(id);
        var clientReferenceMetadata = parseModel(response, model);
        var clientReference = resolveClientReference(response._bundlerConfig, clientReferenceMetadata);
        var promise = preloadModule(clientReference);
        if (promise) {
          var blockedChunk;
          if (!chunk) {
            blockedChunk = createBlockedChunk(response);
            chunks.set(id, blockedChunk);
          } else {
            blockedChunk = chunk;
            blockedChunk.status = BLOCKED;
          }
          promise.then(function() {
            return resolveModuleChunk(blockedChunk, clientReference);
          }, function(error2) {
            return triggerErrorOnChunk(blockedChunk, error2);
          });
        } else {
          if (!chunk) {
            chunks.set(id, createResolvedModuleChunk(response, clientReference));
          } else {
            resolveModuleChunk(chunk, clientReference);
          }
        }
      }
      function resolveErrorDev(response, id, digest, message, stack) {
        var error2 = new Error(message || "An error occurred in the Server Components render but no message was provided");
        error2.stack = stack;
        error2.digest = digest;
        var errorWithDigest = error2;
        var chunks = response._chunks;
        var chunk = chunks.get(id);
        if (!chunk) {
          chunks.set(id, createErrorChunk(response, errorWithDigest));
        } else {
          triggerErrorOnChunk(chunk, errorWithDigest);
        }
      }
      function close(response) {
        reportGlobalError(response, new Error("Connection closed."));
      }
      function processFullRow(response, row) {
        if (row === "") {
          return;
        }
        var colon = row.indexOf(":", 0);
        var id = parseInt(row.substring(0, colon), 16);
        var tag = row[colon + 1];
        switch (tag) {
          case "I": {
            resolveModule(response, id, row.substring(colon + 2));
            return;
          }
          case "E": {
            var errorInfo = JSON.parse(row.substring(colon + 2));
            {
              resolveErrorDev(response, id, errorInfo.digest, errorInfo.message, errorInfo.stack);
            }
            return;
          }
          default: {
            resolveModel(response, id, row.substring(colon + 1));
            return;
          }
        }
      }
      function processStringChunk(response, chunk, offset) {
        var linebreak = chunk.indexOf("\n", offset);
        while (linebreak > -1) {
          var fullrow = response._partialRow + chunk.substring(offset, linebreak);
          processFullRow(response, fullrow);
          response._partialRow = "";
          offset = linebreak + 1;
          linebreak = chunk.indexOf("\n", offset);
        }
        response._partialRow += chunk.substring(offset);
      }
      function processBinaryChunk(response, chunk) {
        var stringDecoder = response._stringDecoder;
        var linebreak = chunk.indexOf(10);
        while (linebreak > -1) {
          var fullrow = response._partialRow + readFinalStringChunk(stringDecoder, chunk.subarray(0, linebreak));
          processFullRow(response, fullrow);
          response._partialRow = "";
          chunk = chunk.subarray(linebreak + 1);
          linebreak = chunk.indexOf(10);
        }
        response._partialRow += readPartialStringChunk(stringDecoder, chunk);
      }
      function createFromJSONCallback(response) {
        return function(key, value) {
          if (typeof value === "string") {
            return parseModelString(response, this, key, value);
          }
          if (typeof value === "object" && value !== null) {
            return parseModelTuple(response, value);
          }
          return value;
        };
      }
      function createResponse(bundlerConfig, callServer) {
        var stringDecoder = createStringDecoder();
        var response = createResponse$1(bundlerConfig, callServer);
        response._partialRow = "";
        {
          response._stringDecoder = stringDecoder;
        }
        response._fromJSON = createFromJSONCallback(response);
        return response;
      }
      function error(format) {
        {
          {
            for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1;_key2 < _len2; _key2++) {
              args[_key2 - 1] = arguments[_key2];
            }
            printWarning("error", format, args);
          }
        }
      }
      function printWarning(level, format, args) {
        {
          var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
          var stack = ReactDebugCurrentFrame.getStackAddendum();
          if (stack !== "") {
            format += "%s";
            args = args.concat([stack]);
          }
          var argsWithFormat = args.map(function(item) {
            return String(item);
          });
          argsWithFormat.unshift("Warning: " + format);
          Function.prototype.apply.call(console[level], console, argsWithFormat);
        }
      }
      var isArrayImpl = Array.isArray;
      function isArray(a) {
        return isArrayImpl(a);
      }
      var jsxPropsParents = new WeakMap;
      var jsxChildrenParents = new WeakMap;
      function isObjectPrototype(object) {
        if (!object) {
          return false;
        }
        var ObjectPrototype = Object.prototype;
        if (object === ObjectPrototype) {
          return true;
        }
        if (Object.getPrototypeOf(object)) {
          return false;
        }
        var names = Object.getOwnPropertyNames(object);
        for (var i = 0;i < names.length; i++) {
          if (!(names[i] in ObjectPrototype)) {
            return false;
          }
        }
        return true;
      }
      function isSimpleObject(object) {
        if (!isObjectPrototype(Object.getPrototypeOf(object))) {
          return false;
        }
        var names = Object.getOwnPropertyNames(object);
        for (var i = 0;i < names.length; i++) {
          var descriptor = Object.getOwnPropertyDescriptor(object, names[i]);
          if (!descriptor) {
            return false;
          }
          if (!descriptor.enumerable) {
            if ((names[i] === "key" || names[i] === "ref") && typeof descriptor.get === "function") {
              continue;
            }
            return false;
          }
        }
        return true;
      }
      function objectName(object) {
        var name = Object.prototype.toString.call(object);
        return name.replace(/^\[object (.*)\]$/, function(m, p0) {
          return p0;
        });
      }
      function describeKeyForErrorMessage(key) {
        var encodedKey = JSON.stringify(key);
        return '"' + key + '"' === encodedKey ? key : encodedKey;
      }
      function describeValueForErrorMessage(value) {
        switch (typeof value) {
          case "string": {
            return JSON.stringify(value.length <= 10 ? value : value.substr(0, 10) + "...");
          }
          case "object": {
            if (isArray(value)) {
              return "[...]";
            }
            var name = objectName(value);
            if (name === "Object") {
              return "{...}";
            }
            return name;
          }
          case "function":
            return "function";
          default:
            return String(value);
        }
      }
      function describeElementType(type) {
        if (typeof type === "string") {
          return type;
        }
        switch (type) {
          case REACT_SUSPENSE_TYPE:
            return "Suspense";
          case REACT_SUSPENSE_LIST_TYPE:
            return "SuspenseList";
        }
        if (typeof type === "object") {
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
              return describeElementType(type.render);
            case REACT_MEMO_TYPE:
              return describeElementType(type.type);
            case REACT_LAZY_TYPE: {
              var lazyComponent = type;
              var payload = lazyComponent._payload;
              var init = lazyComponent._init;
              try {
                return describeElementType(init(payload));
              } catch (x) {
              }
            }
          }
        }
        return "";
      }
      function describeObjectForErrorMessage(objectOrArray, expandedName) {
        var objKind = objectName(objectOrArray);
        if (objKind !== "Object" && objKind !== "Array") {
          return objKind;
        }
        var str = "";
        var start = -1;
        var length = 0;
        if (isArray(objectOrArray)) {
          if (jsxChildrenParents.has(objectOrArray)) {
            var type = jsxChildrenParents.get(objectOrArray);
            str = "<" + describeElementType(type) + ">";
            var array = objectOrArray;
            for (var i = 0;i < array.length; i++) {
              var value = array[i];
              var substr = undefined;
              if (typeof value === "string") {
                substr = value;
              } else if (typeof value === "object" && value !== null) {
                substr = "{" + describeObjectForErrorMessage(value) + "}";
              } else {
                substr = "{" + describeValueForErrorMessage(value) + "}";
              }
              if ("" + i === expandedName) {
                start = str.length;
                length = substr.length;
                str += substr;
              } else if (substr.length < 15 && str.length + substr.length < 40) {
                str += substr;
              } else {
                str += "{...}";
              }
            }
            str += "</" + describeElementType(type) + ">";
          } else {
            str = "[";
            var _array = objectOrArray;
            for (var _i = 0;_i < _array.length; _i++) {
              if (_i > 0) {
                str += ", ";
              }
              var _value = _array[_i];
              var _substr = undefined;
              if (typeof _value === "object" && _value !== null) {
                _substr = describeObjectForErrorMessage(_value);
              } else {
                _substr = describeValueForErrorMessage(_value);
              }
              if ("" + _i === expandedName) {
                start = str.length;
                length = _substr.length;
                str += _substr;
              } else if (_substr.length < 10 && str.length + _substr.length < 40) {
                str += _substr;
              } else {
                str += "...";
              }
            }
            str += "]";
          }
        } else {
          if (objectOrArray.$$typeof === REACT_ELEMENT_TYPE) {
            str = "<" + describeElementType(objectOrArray.type) + "/>";
          } else if (jsxPropsParents.has(objectOrArray)) {
            var _type = jsxPropsParents.get(objectOrArray);
            str = "<" + (describeElementType(_type) || "...");
            var object = objectOrArray;
            var names = Object.keys(object);
            for (var _i2 = 0;_i2 < names.length; _i2++) {
              str += " ";
              var name = names[_i2];
              str += describeKeyForErrorMessage(name) + "=";
              var _value2 = object[name];
              var _substr2 = undefined;
              if (name === expandedName && typeof _value2 === "object" && _value2 !== null) {
                _substr2 = describeObjectForErrorMessage(_value2);
              } else {
                _substr2 = describeValueForErrorMessage(_value2);
              }
              if (typeof _value2 !== "string") {
                _substr2 = "{" + _substr2 + "}";
              }
              if (name === expandedName) {
                start = str.length;
                length = _substr2.length;
                str += _substr2;
              } else if (_substr2.length < 10 && str.length + _substr2.length < 40) {
                str += _substr2;
              } else {
                str += "...";
              }
            }
            str += ">";
          } else {
            str = "{";
            var _object = objectOrArray;
            var _names = Object.keys(_object);
            for (var _i3 = 0;_i3 < _names.length; _i3++) {
              if (_i3 > 0) {
                str += ", ";
              }
              var _name = _names[_i3];
              str += describeKeyForErrorMessage(_name) + ": ";
              var _value3 = _object[_name];
              var _substr3 = undefined;
              if (typeof _value3 === "object" && _value3 !== null) {
                _substr3 = describeObjectForErrorMessage(_value3);
              } else {
                _substr3 = describeValueForErrorMessage(_value3);
              }
              if (_name === expandedName) {
                start = str.length;
                length = _substr3.length;
                str += _substr3;
              } else if (_substr3.length < 10 && str.length + _substr3.length < 40) {
                str += _substr3;
              } else {
                str += "...";
              }
            }
            str += "}";
          }
        }
        if (expandedName === undefined) {
          return str;
        }
        if (start > -1 && length > 0) {
          var highlight = " ".repeat(start) + "^".repeat(length);
          return "\n  " + str + "\n  " + highlight;
        }
        return "\n  " + str;
      }
      function serializePromiseID(id) {
        return "$@" + id.toString(16);
      }
      function serializeServerReferenceID(id) {
        return "$F" + id.toString(16);
      }
      function serializeSymbolReference(name) {
        return "$S" + name;
      }
      function serializeUndefined() {
        return "$undefined";
      }
      function escapeStringValue(value) {
        if (value[0] === "$") {
          return "$" + value;
        } else {
          return value;
        }
      }
      function processReply(root, resolve, reject) {
        var nextPartId = 1;
        var pendingParts = 0;
        var formData = null;
        function resolveToJSON(key, value) {
          var parent = this;
          {
            var originalValue = this[key];
            if (typeof originalValue === "object" && originalValue !== value) {
              if (objectName(originalValue) !== "Object") {
                error("Only plain objects can be passed to Server Functions from the Client. %s objects are not supported.%s", objectName(originalValue), describeObjectForErrorMessage(parent, key));
              } else {
                error("Only plain objects can be passed to Server Functions from the Client. Objects with toJSON methods are not supported. Convert it manually to a simple value before passing it to props.%s", describeObjectForErrorMessage(parent, key));
              }
            }
          }
          if (value === null) {
            return null;
          }
          if (typeof value === "object") {
            if (typeof value.then === "function") {
              if (formData === null) {
                formData = new FormData;
              }
              pendingParts++;
              var promiseId = nextPartId++;
              var thenable = value;
              thenable.then(function(partValue) {
                var partJSON = JSON.stringify(partValue, resolveToJSON);
                var data = formData;
                data.append("" + promiseId, partJSON);
                pendingParts--;
                if (pendingParts === 0) {
                  resolve(data);
                }
              }, function(reason) {
                reject(reason);
              });
              return serializePromiseID(promiseId);
            }
            if (!isArray(value)) {
              var iteratorFn = getIteratorFn(value);
              if (iteratorFn) {
                return Array.from(value);
              }
            }
            {
              if (value !== null && !isArray(value)) {
                if (value.$$typeof === REACT_ELEMENT_TYPE) {
                  error("React Element cannot be passed to Server Functions from the Client.%s", describeObjectForErrorMessage(parent, key));
                } else if (value.$$typeof === REACT_LAZY_TYPE) {
                  error("React Lazy cannot be passed to Server Functions from the Client.%s", describeObjectForErrorMessage(parent, key));
                } else if (value.$$typeof === REACT_PROVIDER_TYPE) {
                  error("React Context Providers cannot be passed to Server Functions from the Client.%s", describeObjectForErrorMessage(parent, key));
                } else if (objectName(value) !== "Object") {
                  error("Only plain objects can be passed to Client Components from Server Components. %s objects are not supported.%s", objectName(value), describeObjectForErrorMessage(parent, key));
                } else if (!isSimpleObject(value)) {
                  error("Only plain objects can be passed to Client Components from Server Components. Classes or other objects with methods are not supported.%s", describeObjectForErrorMessage(parent, key));
                } else if (Object.getOwnPropertySymbols) {
                  var symbols = Object.getOwnPropertySymbols(value);
                  if (symbols.length > 0) {
                    error("Only plain objects can be passed to Client Components from Server Components. Objects with symbol properties like %s are not supported.%s", symbols[0].description, describeObjectForErrorMessage(parent, key));
                  }
                }
              }
            }
            return value;
          }
          if (typeof value === "string") {
            return escapeStringValue(value);
          }
          if (typeof value === "boolean" || typeof value === "number") {
            return value;
          }
          if (typeof value === "undefined") {
            return serializeUndefined();
          }
          if (typeof value === "function") {
            var metaData = knownServerReferences.get(value);
            if (metaData !== undefined) {
              var metaDataJSON = JSON.stringify(metaData, resolveToJSON);
              if (formData === null) {
                formData = new FormData;
              }
              var refId = nextPartId++;
              formData.set("" + refId, metaDataJSON);
              return serializeServerReferenceID(refId);
            }
            throw new Error("Client Functions cannot be passed directly to Server Functions. Only Functions passed from the Server can be passed back again.");
          }
          if (typeof value === "symbol") {
            var name = value.description;
            if (Symbol.for(name) !== value) {
              throw new Error("Only global symbols received from Symbol.for(...) can be passed to Server Functions. " + ("The symbol Symbol.for(" + value.description + ") cannot be found among global symbols."));
            }
            return serializeSymbolReference(name);
          }
          if (typeof value === "bigint") {
            throw new Error("BigInt (" + value + ") is not yet supported as an argument to a Server Function.");
          }
          throw new Error("Type " + typeof value + " is not supported as an argument to a Server Function.");
        }
        var json = JSON.stringify(root, resolveToJSON);
        if (formData === null) {
          resolve(json);
        } else {
          formData.set("0", json);
          if (pendingParts === 0) {
            resolve(formData);
          }
        }
      }
      function createResponseFromOptions(options) {
        return createResponse(null, options && options.callServer ? options.callServer : undefined);
      }
      function startReadingFromStream(response, stream) {
        var reader = stream.getReader();
        function progress(_ref) {
          var { done, value } = _ref;
          if (done) {
            close(response);
            return;
          }
          var buffer = value;
          processBinaryChunk(response, buffer);
          return reader.read().then(progress).catch(error2);
        }
        function error2(e) {
          reportGlobalError(response, e);
        }
        reader.read().then(progress).catch(error2);
      }
      function createFromReadableStream(stream, options) {
        var response = createResponseFromOptions(options);
        startReadingFromStream(response, stream);
        return getRoot(response);
      }
      function createFromFetch(promiseForResponse, options) {
        var response = createResponseFromOptions(options);
        promiseForResponse.then(function(r) {
          startReadingFromStream(response, r.body);
        }, function(e) {
          reportGlobalError(response, e);
        });
        return getRoot(response);
      }
      function createFromXHR(request, options) {
        var response = createResponseFromOptions(options);
        var processedLength = 0;
        function progress(e) {
          var chunk = request.responseText;
          processStringChunk(response, chunk, processedLength);
          processedLength = chunk.length;
        }
        function load(e) {
          progress();
          close(response);
        }
        function error2(e) {
          reportGlobalError(response, new TypeError("Network error"));
        }
        request.addEventListener("progress", progress);
        request.addEventListener("load", load);
        request.addEventListener("error", error2);
        request.addEventListener("abort", error2);
        request.addEventListener("timeout", error2);
        return getRoot(response);
      }
      function encodeReply(value) {
        return new Promise(function(resolve, reject) {
          processReply(value, resolve, reject);
        });
      }
      exports.createFromFetch = createFromFetch;
      exports.createFromReadableStream = createFromReadableStream;
      exports.createFromXHR = createFromXHR;
      exports.encodeReply = encodeReply;
    })();
  }
});

// node_modules/react-server-dom-webpack/client.browser.js
var require_client_browser = __commonJS((exports, module) => {
  if (false) {
  } else {
    module.exports = require_react_server_dom_webpack_client_browser_development();
  }
});

// build/clientEntry.js
var client = __toESM(require_client_browser(), 1);

// node_modules/rsc-html-stream/client.js
var encoder = new TextEncoder;
var streamController;
var rscStream = new ReadableStream({
  start(controller) {
    if (typeof window === "undefined") {
      return;
    }
    let handleChunk = (chunk) => {
      if (typeof chunk === "string") {
        controller.enqueue(encoder.encode(chunk));
      } else {
        controller.enqueue(chunk);
      }
    };
    window.__FLIGHT_DATA ||= [];
    window.__FLIGHT_DATA.forEach(handleChunk);
    window.__FLIGHT_DATA.push = (chunk) => {
      handleChunk(chunk);
    };
    streamController = controller;
  }
});
if (typeof document !== "undefined" && document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    streamController?.close();
  });
} else {
  streamController?.close();
}

// build/clientEntry.js
var Content = function() {
  data ??= client.default.createFromReadableStream(rscStream);
  console.log(data);
  return React.use(data);
};
console.log(client.default);
var data;
Content();
