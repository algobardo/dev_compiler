var _js_helper;
(function(_js_helper) {
  'use strict';
  class _Patch extends dart.Object {
    _Patch() {
    }
  }
  let patch = new _Patch();
  class InternalMap extends dart.Object {
  }
  // Function requiresPreamble: () → dynamic
  function requiresPreamble() {
  }
  // Function isJsIndexable: (dynamic, dynamic) → bool
  function isJsIndexable(object, record) {
    if (record !== null) {
      let result = _interceptors.dispatchRecordIndexability(record);
      if (result !== null)
        return dart.as(result, core.bool);
    }
    return dart.is(object, JavaScriptIndexingBehavior);
  }
  // Function S: (dynamic) → String
  function S(value) {
    if (typeof value == string)
      return dart.as(value, core.String);
    if (dart.is(value, core.num)) {
      if (!dart.equals(value, 0)) {
        return dart.as(_foreign_helper.JS('String', '"" + (#)', value), core.String);
      }
    } else if (true === value) {
      return 'true';
    } else if (false === value) {
      return 'false';
    } else if (value === null) {
      return 'null';
    }
    let res = dart.dinvoke(value, 'toString');
    if (!(typeof res == string))
      throw new core.ArgumentError(value);
    return dart.as(res, core.String);
  }
  // Function createInvocationMirror: (String, dynamic, dynamic, dynamic, dynamic) → dynamic
  function createInvocationMirror(name, internalName, kind, arguments, argumentNames) {
    return new JSInvocationMirror(name, dart.as(internalName, core.String), dart.as(kind, core.int), dart.as(arguments, core.List), dart.as(argumentNames, core.List));
  }
  // Function createUnmangledInvocationMirror: (Symbol, dynamic, dynamic, dynamic, dynamic) → dynamic
  function createUnmangledInvocationMirror(symbol, internalName, kind, arguments, argumentNames) {
    return new JSInvocationMirror(symbol, dart.as(internalName, core.String), dart.as(kind, core.int), dart.as(arguments, core.List), dart.as(argumentNames, core.List));
  }
  // Function throwInvalidReflectionError: (String) → void
  function throwInvalidReflectionError(memberName) {
    throw new core.UnsupportedError(`Can't use '${memberName}' in reflection ` + "because it is not included in a @MirrorsUsed annotation.");
  }
  // Function traceHelper: (String) → void
  function traceHelper(method) {
    if (_foreign_helper.JS('bool', '!this.cache')) {
      _foreign_helper.JS('', 'this.cache = Object.create(null)');
    }
    if (_foreign_helper.JS('bool', '!this.cache[#]', method)) {
      _foreign_helper.JS('', 'console.log(#)', method);
      _foreign_helper.JS('', 'this.cache[#] = true', method);
    }
  }
  class JSInvocationMirror extends dart.Object {
    JSInvocationMirror(_memberName, _internalName, _kind, _arguments, _namedArgumentNames) {
      this._memberName = _memberName;
      this._internalName = _internalName;
      this._kind = _kind;
      this._arguments = _arguments;
      this._namedArgumentNames = _namedArgumentNames;
      this._namedIndices = null;
    }
    get memberName() {
      if (dart.is(this._memberName, core.Symbol))
        return dart.as(this._memberName, core.Symbol);
      let name = dart.as(this._memberName, core.String);
      let unmangledName = _js_names.mangledNames.get(name);
      if (unmangledName !== null) {
        name = unmangledName.split(':').get(0);
      } else {
        if (_js_names.mangledNames.get(this._internalName) === null) {
          core.print(`Warning: '${name}' is used reflectively but not in MirrorsUsed. ` + "This will break minified code.");
        }
      }
      this._memberName = new _internal.Symbol.unvalidated(name);
      return dart.as(this._memberName, core.Symbol);
    }
    get isMethod() {
      return this._kind === METHOD;
    }
    get isGetter() {
      return this._kind === GETTER;
    }
    get isSetter() {
      return this._kind === SETTER;
    }
    get isAccessor() {
      return this._kind !== METHOD;
    }
    get positionalArguments() {
      if (this.isGetter)
        return /* Unimplemented const */new List.from([]);
      let argumentCount = this._arguments.length - this._namedArgumentNames.length;
      if (argumentCount === 0)
        return /* Unimplemented const */new List.from([]);
      let list = new List.from([]);
      for (let index = 0; index < argumentCount; index++) {
        list.add(this._arguments.get(index));
      }
      return dart.as(makeLiteralListConst(list), core.List);
    }
    get namedArguments() {
      if (this.isAccessor)
        return dart.map();
      let namedArgumentCount = this._namedArgumentNames.length;
      let namedArgumentsStartIndex = this._arguments.length - namedArgumentCount;
      if (namedArgumentCount === 0)
        return dart.map();
      let map = new core.Map();
      for (let i = 0; i < namedArgumentCount; i++) {
        map.set(new _internal.Symbol.unvalidated(dart.as(this._namedArgumentNames.get(i), core.String)), this._arguments.get(namedArgumentsStartIndex + i));
      }
      return map;
    }
    _getCachedInvocation(object) {
      let interceptor = _interceptors.getInterceptor(object);
      let receiver = object;
      let name = this._internalName;
      let arguments = this._arguments;
      let interceptedNames = _foreign_helper.JS_EMBEDDED_GLOBAL('', dart.as(_js_embedded_names.INTERCEPTED_NAMES, core.String));
      let isIntercepted = dart.as(_foreign_helper.JS("bool", 'Object.prototype.hasOwnProperty.call(#, #)', interceptedNames, name), core.bool);
      if (isIntercepted) {
        receiver = interceptor;
        if (_foreign_helper.JS('bool', '# === #', object, interceptor)) {
          interceptor = null;
        }
      } else {
        interceptor = null;
      }
      let isCatchAll = false;
      let method = _foreign_helper.JS('var', '#[#]', receiver, name);
      if (_foreign_helper.JS('bool', 'typeof # != "function"', method)) {
        let baseName = _internal.Symbol.getName(dart.as(this.memberName, _internal.Symbol));
        method = _foreign_helper.JS('', '#[# + "*"]', receiver, baseName);
        if (method === null) {
          interceptor = _interceptors.getInterceptor(object);
          method = _foreign_helper.JS('', '#[# + "*"]', interceptor, baseName);
          if (method !== null) {
            isIntercepted = true;
            receiver = interceptor;
          } else {
            interceptor = null;
          }
        }
        isCatchAll = true;
      }
      if (_foreign_helper.JS('bool', 'typeof # == "function"', method)) {
        if (isCatchAll) {
          return new CachedCatchAllInvocation(name, method, isIntercepted, dart.as(interceptor, _interceptors.Interceptor));
        } else {
          return new CachedInvocation(name, method, isIntercepted, dart.as(interceptor, _interceptors.Interceptor));
        }
      } else {
        return new CachedNoSuchMethodInvocation(interceptor);
      }
    }
    static invokeFromMirror(invocation, victim) {
      let cached = invocation._getCachedInvocation(victim);
      if (dart.dload(cached, 'isNoSuchMethod')) {
        return dart.dinvoke(cached, 'invokeOn', victim, invocation);
      } else {
        return dart.dinvoke(cached, 'invokeOn', victim, invocation._arguments);
      }
    }
    static getCachedInvocation(invocation, victim) {
      return invocation._getCachedInvocation(victim);
    }
  }
  JSInvocationMirror.METHOD = 0;
  JSInvocationMirror.GETTER = 1;
  JSInvocationMirror.SETTER = 2;
  class CachedInvocation extends dart.Object {
    CachedInvocation(mangledName, jsFunction, isIntercepted, cachedInterceptor) {
      this.mangledName = mangledName;
      this.jsFunction = jsFunction;
      this.isIntercepted = isIntercepted;
      this.cachedInterceptor = cachedInterceptor;
    }
    get isNoSuchMethod() {
      return false;
    }
    get isGetterStub() {
      return dart.as(_foreign_helper.JS("bool", "!!#.$getterStub", this.jsFunction), core.bool);
    }
    invokeOn(victim, arguments) {
      let receiver = victim;
      if (!dart.notNull(this.isIntercepted)) {
        if (!dart.is(arguments, _interceptors.JSArray))
          arguments = new core.List.from(arguments);
      } else {
        arguments = new List.from([victim]);
        arguments.addAll(arguments);
        if (this.cachedInterceptor !== null)
          receiver = this.cachedInterceptor;
      }
      return _foreign_helper.JS("var", "#.apply(#, #)", this.jsFunction, receiver, arguments);
    }
  }
  class CachedCatchAllInvocation extends CachedInvocation {
    CachedCatchAllInvocation(name, jsFunction, isIntercepted, cachedInterceptor) {
      this.info = new ReflectionInfo(jsFunction);
      super.CachedInvocation(name, jsFunction, isIntercepted, cachedInterceptor);
    }
    get isGetterStub() {
      return false;
    }
    invokeOn(victim, arguments) {
      let receiver = victim;
      let providedArgumentCount = null;
      let fullParameterCount = this.info.requiredParameterCount + this.info.optionalParameterCount;
      if (!dart.notNull(this.isIntercepted)) {
        if (dart.is(arguments, _interceptors.JSArray)) {
          providedArgumentCount = arguments.length;
          if (providedArgumentCount < fullParameterCount) {
            arguments = new core.List.from(arguments);
          }
        } else {
          arguments = new core.List.from(arguments);
          providedArgumentCount = arguments.length;
        }
      } else {
        arguments = new List.from([victim]);
        arguments.addAll(arguments);
        if (this.cachedInterceptor !== null)
          receiver = this.cachedInterceptor;
        providedArgumentCount = arguments.length - 1;
      }
      if (dart.notNull(this.info.areOptionalParametersNamed) && dart.notNull(providedArgumentCount > this.info.requiredParameterCount)) {
        throw new UnimplementedNoSuchMethodError(`Invocation of unstubbed method '${this.info.reflectionName}'` + ` with ${arguments.length} arguments.`);
      } else if (providedArgumentCount < this.info.requiredParameterCount) {
        throw new UnimplementedNoSuchMethodError(`Invocation of unstubbed method '${this.info.reflectionName}'` + ` with ${providedArgumentCount} arguments (too few).`);
      } else if (providedArgumentCount > fullParameterCount) {
        throw new UnimplementedNoSuchMethodError(`Invocation of unstubbed method '${this.info.reflectionName}'` + ` with ${providedArgumentCount} arguments (too many).`);
      }
      for (let i = providedArgumentCount; i < fullParameterCount; i++) {
        arguments.add(getMetadata(this.info.defaultValue(i)));
      }
      return _foreign_helper.JS("var", "#.apply(#, #)", this.jsFunction, receiver, arguments);
    }
  }
  class CachedNoSuchMethodInvocation extends dart.Object {
    CachedNoSuchMethodInvocation(interceptor) {
      this.interceptor = interceptor;
    }
    get isNoSuchMethod() {
      return true;
    }
    get isGetterStub() {
      return false;
    }
    invokeOn(victim, invocation) {
      let receiver = this.interceptor === null ? victim : this.interceptor;
      return dart.dinvoke(receiver, 'noSuchMethod', invocation);
    }
  }
  class ReflectionInfo extends dart.Object {
    ReflectionInfo$internal(jsFunction, data, isAccessor, requiredParameterCount, optionalParameterCount, areOptionalParametersNamed, functionType) {
      this.jsFunction = jsFunction;
      this.data = data;
      this.isAccessor = isAccessor;
      this.requiredParameterCount = requiredParameterCount;
      this.optionalParameterCount = optionalParameterCount;
      this.areOptionalParametersNamed = areOptionalParametersNamed;
      this.functionType = functionType;
      this.cachedSortedIndices = null;
    }
    ReflectionInfo(jsFunction) {
      let data = dart.as(_foreign_helper.JS('JSExtendableArray|Null', '#.$reflectionInfo', jsFunction), core.List);
      if (data === null)
        return null;
      data = _interceptors.JSArray.markFixedList(data);
      let requiredParametersInfo = dart.as(_foreign_helper.JS('int', '#[#]', data, REQUIRED_PARAMETERS_INFO), core.int);
      let requiredParameterCount = dart.as(_foreign_helper.JS('int', '# >> 1', requiredParametersInfo), core.int);
      let isAccessor = (requiredParametersInfo & 1) === 1;
      let optionalParametersInfo = dart.as(_foreign_helper.JS('int', '#[#]', data, OPTIONAL_PARAMETERS_INFO), core.int);
      let optionalParameterCount = dart.as(_foreign_helper.JS('int', '# >> 1', optionalParametersInfo), core.int);
      let areOptionalParametersNamed = (optionalParametersInfo & 1) === 1;
      let functionType = _foreign_helper.JS('', '#[#]', data, FUNCTION_TYPE_INDEX);
      return new ReflectionInfo.internal(jsFunction, data, isAccessor, requiredParameterCount, optionalParameterCount, areOptionalParametersNamed, functionType);
    }
    parameterName(parameter) {
      let metadataIndex = null;
      if (_foreign_helper.JS_GET_FLAG('MUST_RETAIN_METADATA')) {
        metadataIndex = dart.as(_foreign_helper.JS('int', '#[2 * # + # + #]', this.data, parameter, this.optionalParameterCount, FIRST_DEFAULT_ARGUMENT), core.int);
      } else {
        metadataIndex = dart.as(_foreign_helper.JS('int', '#[# + # + #]', this.data, parameter, this.optionalParameterCount, FIRST_DEFAULT_ARGUMENT), core.int);
      }
      let metadata = _foreign_helper.JS_EMBEDDED_GLOBAL('', dart.as(_js_embedded_names.METADATA, core.String));
      return dart.as(_foreign_helper.JS('String', '#[#]', metadata, metadataIndex), core.String);
    }
    parameterMetadataAnnotations(parameter) {
      if (!dart.notNull(_foreign_helper.JS_GET_FLAG('MUST_RETAIN_METADATA'))) {
        throw new core.StateError('metadata has not been preserved');
      } else {
        return dart.as(_foreign_helper.JS('', '#[2 * # + # + # + 1]', this.data, parameter, this.optionalParameterCount, FIRST_DEFAULT_ARGUMENT), core.List$(core.int));
      }
    }
    defaultValue(parameter) {
      if (parameter < this.requiredParameterCount)
        return dart.as(null, core.int);
      return dart.as(_foreign_helper.JS('int', '#[# + # - #]', this.data, FIRST_DEFAULT_ARGUMENT, parameter, this.requiredParameterCount), core.int);
    }
    defaultValueInOrder(parameter) {
      if (parameter < this.requiredParameterCount)
        return dart.as(null, core.int);
      if (dart.notNull(!dart.notNull(this.areOptionalParametersNamed)) || dart.notNull(this.optionalParameterCount === 1)) {
        return this.defaultValue(parameter);
      }
      let index = this.sortedIndex(parameter - this.requiredParameterCount);
      return this.defaultValue(index);
    }
    parameterNameInOrder(parameter) {
      if (parameter < this.requiredParameterCount)
        return null;
      if (dart.notNull(!dart.notNull(this.areOptionalParametersNamed)) || dart.notNull(this.optionalParameterCount === 1)) {
        return this.parameterName(parameter);
      }
      let index = this.sortedIndex(parameter - this.requiredParameterCount);
      return this.parameterName(index);
    }
    sortedIndex(unsortedIndex) {
      if (this.cachedSortedIndices === null) {
        this.cachedSortedIndices = new core.List(this.optionalParameterCount);
        let positions = dart.map();
        for (let i = 0; i < this.optionalParameterCount; i++) {
          let index = this.requiredParameterCount + i;
          positions.set(this.parameterName(index), index);
        }
        let index = 0;
        ((_) => {
          _.sort();
          return _;
        }).bind(this)(positions.keys.toList()).forEach(((name) => {
          this.cachedSortedIndices.set(index++, positions.get(name));
        }).bind(this));
      }
      return dart.as(this.cachedSortedIndices.get(unsortedIndex), core.int);
    }
    computeFunctionRti(jsConstructor) {
      if (_foreign_helper.JS('bool', 'typeof # == "number"', this.functionType)) {
        return getMetadata(dart.as(this.functionType, core.int));
      } else if (_foreign_helper.JS('bool', 'typeof # == "function"', this.functionType)) {
        let fakeInstance = _foreign_helper.JS('', 'new #()', jsConstructor);
        setRuntimeTypeInfo(fakeInstance, _foreign_helper.JS('JSExtendableArray', '#["<>"]', fakeInstance));
        return _foreign_helper.JS('=Object|Null', '#.apply({$receiver:#})', this.functionType, fakeInstance);
      } else {
        throw new RuntimeError('Unexpected function type');
      }
    }
    get reflectionName() {
      return dart.as(_foreign_helper.JS('String', '#.$reflectionName', this.jsFunction), core.String);
    }
  }
  dart.defineNamedConstructor(ReflectionInfo, 'internal');
  ReflectionInfo.REQUIRED_PARAMETERS_INFO = 0;
  ReflectionInfo.OPTIONAL_PARAMETERS_INFO = 1;
  ReflectionInfo.FUNCTION_TYPE_INDEX = 2;
  ReflectionInfo.FIRST_DEFAULT_ARGUMENT = 3;
  // Function getMetadata: (int) → dynamic
  function getMetadata(index) {
    let metadata = _foreign_helper.JS_EMBEDDED_GLOBAL('', dart.as(_js_embedded_names.METADATA, core.String));
    return _foreign_helper.JS('', '#[#]', metadata, index);
  }
  class Primitives extends dart.Object {
    static initializeStatics(id) {
      mirrorFunctionCacheName = `_${id}`;
      mirrorInvokeCacheName = `_${id}`;
    }
    static objectHashCode(object) {
      let hash = dart.as(_foreign_helper.JS('int|Null', '#.$identityHash', object), core.int);
      if (hash === null) {
        hash = dart.as(_foreign_helper.JS('int', '(Math.random() * 0x3fffffff) | 0'), core.int);
        _foreign_helper.JS('void', '#.$identityHash = #', object, hash);
      }
      return dart.as(_foreign_helper.JS('int', '#', hash), core.int);
    }
    static _throwFormatException(string) {
      throw new core.FormatException(string);
    }
    static parseInt(source, radix, handleError) {
      if (handleError === null)
        handleError = dart.as(_throwFormatException, dart.throw_("Unimplemented type (String) → int"));
      checkString(source);
      let match = _foreign_helper.JS('JSExtendableArray|Null', '/^\\s*[+-]?((0x[a-f0-9]+)|(\\d+)|([a-z0-9]+))\\s*$/i.exec(#)', source);
      let digitsIndex = 1;
      let hexIndex = 2;
      let decimalIndex = 3;
      let nonDecimalHexIndex = 4;
      if (radix === null) {
        radix = 10;
        if (match !== null) {
          if (dart.dindex(match, hexIndex) !== null) {
            return dart.as(_foreign_helper.JS('num', 'parseInt(#, 16)', source), core.int);
          }
          if (dart.dindex(match, decimalIndex) !== null) {
            return dart.as(_foreign_helper.JS('num', 'parseInt(#, 10)', source), core.int);
          }
          return handleError(source);
        }
      } else {
        if (!(typeof radix == number))
          throw new core.ArgumentError("Radix is not an integer");
        if (dart.notNull(radix < 2) || dart.notNull(radix > 36)) {
          throw new core.RangeError(`Radix ${radix} not in range 2..36`);
        }
        if (match !== null) {
          if (dart.notNull(radix === 10) && dart.notNull(dart.dindex(match, decimalIndex) !== null)) {
            return dart.as(_foreign_helper.JS('num', 'parseInt(#, 10)', source), core.int);
          }
          if (dart.notNull(radix < 10) || dart.notNull(dart.dindex(match, decimalIndex) === null)) {
            let maxCharCode = null;
            if (radix <= 10) {
              maxCharCode = 48 + radix - 1;
            } else {
              maxCharCode = 97 + radix - 10 - 1;
            }
            let digitsPart = dart.as(dart.dindex(match, digitsIndex), core.String);
            for (let i = 0; i < digitsPart.length; i++) {
              let characterCode = digitsPart.codeUnitAt(0) | 32;
              if (digitsPart.codeUnitAt(i) > maxCharCode) {
                return handleError(source);
              }
            }
          }
        }
      }
      if (match === null)
        return handleError(source);
      return dart.as(_foreign_helper.JS('num', 'parseInt(#, #)', source, radix), core.int);
    }
    static parseDouble(source, handleError) {
      checkString(source);
      if (handleError === null)
        handleError = dart.as(_throwFormatException, dart.throw_("Unimplemented type (String) → double"));
      if (dart.throw_("Unimplemented PrefixExpression: !JS('bool', r'/^\\s*[+-]?(?:Infinity|NaN|' r'(?:\\.\\d+|\\d+(?:\\.\\d*)?)(?:[eE][+-]?\\d+)?)\\s*$/.test(#)', source)")) {
        return handleError(source);
      }
      let result = _foreign_helper.JS('num', 'parseFloat(#)', source);
      if (dart.dload(result, 'isNaN')) {
        let trimmed = source.trim();
        if (dart.notNull(dart.notNull(dart.equals(trimmed, 'NaN')) || dart.notNull(dart.equals(trimmed, '+NaN'))) || dart.notNull(dart.equals(trimmed, '-NaN'))) {
          return dart.as(result, core.double);
        }
        return handleError(source);
      }
      return dart.as(result, core.double);
    }
    static formatType(className, typeArguments) {
      return _js_names.unmangleAllIdentifiersIfPreservedAnyways(`${className}${joinArguments(typeArguments, 0)}`);
    }
    static objectTypeName(object) {
      let name = constructorNameFallback(_interceptors.getInterceptor(object));
      if (dart.equals(name, 'Object')) {
        let decompiled = _foreign_helper.JS('var', '#.match(/^\\s*function\\s*(\\S*)\\s*\\(/)[1]', _foreign_helper.JS('var', 'String(#.constructor)', object));
        if (typeof decompiled == string)
          if (_foreign_helper.JS('bool', '/^\\w+$/.test(#)', decompiled))
            name = dart.as(decompiled, core.String);
      }
      if (dart.notNull(name.length > 1) && dart.notNull(core.identical(name.codeUnitAt(0), DOLLAR_CHAR_VALUE))) {
        name = name.substring(1);
      }
      return formatType(name, dart.as(getRuntimeTypeInfo(object), core.List));
    }
    static objectToString(object) {
      let name = objectTypeName(object);
      return `Instance of '${name}'`;
    }
    static dateNow() {
      return dart.as(_foreign_helper.JS('int', 'Date.now()'), core.num);
    }
    static initTicker() {
      if (timerFrequency !== null)
        return;
      timerFrequency = 1000;
      timerTicks = dateNow;
      if (_foreign_helper.JS('bool', 'typeof window == "undefined"'))
        return;
      let window = _foreign_helper.JS('var', 'window');
      if (window === null)
        return;
      let performance = _foreign_helper.JS('var', '#.performance', window);
      if (performance === null)
        return;
      if (_foreign_helper.JS('bool', 'typeof #.now != "function"', performance))
        return;
      timerFrequency = 1000000;
      timerTicks = (() => 1000['*'](_foreign_helper.JS('num', '#.now()', performance)).floor()).bind(this);
    }
    static get isD8() {
      return dart.as(_foreign_helper.JS('bool', 'typeof version == "function"' + ' && typeof os == "object" && "system" in os'), core.bool);
    }
    static get isJsshell() {
      return dart.as(_foreign_helper.JS('bool', 'typeof version == "function" && typeof system == "function"'), core.bool);
    }
    static currentUri() {
      requiresPreamble();
      if (_foreign_helper.JS('bool', '!!self.location')) {
        return dart.as(_foreign_helper.JS('String', 'self.location.href'), core.String);
      }
      return null;
    }
    static _fromCharCodeApply(array) {
      let result = "";
      let kMaxApply = 500;
      let end = array.length;
      for (let i = 0; i < end; i = kMaxApply) {
        let subarray = null;
        if (end <= kMaxApply) {
          subarray = array;
        } else {
          subarray = _foreign_helper.JS('JSExtendableArray', '#.slice(#, #)', array, i, i + kMaxApply < end ? i + kMaxApply : end);
        }
        result = dart.as(_foreign_helper.JS('String', '# + String.fromCharCode.apply(#, #)', result, null, subarray), core.String);
      }
      return result;
    }
    static stringFromCodePoints(codePoints) {
      let a = new List.from([]);
      for (let i of codePoints) {
        if (!(typeof i == number))
          throw new core.ArgumentError(i);
        if (dart.dbinary(i, '<=', 65535)) {
          a.add(dart.as(i, core.int));
        } else if (dart.dbinary(i, '<=', 1114111)) {
          a.add(dart.notNull(55296['+'](dart.dbinary(dart.dbinary(dart.dbinary(i, '-', 65536), '>>', 10), '&', 1023))));
          a.add(dart.notNull(56320['+'](dart.dbinary(i, '&', 1023))));
        } else {
          throw new core.ArgumentError(i);
        }
      }
      return _fromCharCodeApply(a);
    }
    static stringFromCharCodes(charCodes) {
      for (let i of charCodes) {
        if (!(typeof i == number))
          throw new core.ArgumentError(i);
        if (dart.dbinary(i, '<', 0))
          throw new core.ArgumentError(i);
        if (dart.dbinary(i, '>', 65535))
          return stringFromCodePoints(charCodes);
      }
      return _fromCharCodeApply(dart.as(charCodes, core.List$(core.int)));
    }
    static stringFromCharCode(charCode) {
      if (0['<='](charCode)) {
        if (dart.dbinary(charCode, '<=', 65535)) {
          return dart.as(_foreign_helper.JS('String', 'String.fromCharCode(#)', charCode), core.String);
        }
        if (dart.dbinary(charCode, '<=', 1114111)) {
          let bits = dart.dbinary(charCode, '-', 65536);
          let low = 56320['|'](dart.dbinary(bits, '&', 1023));
          let high = 55296['|'](dart.dbinary(bits, '>>', 10));
          return dart.as(_foreign_helper.JS('String', 'String.fromCharCode(#, #)', high, low), core.String);
        }
      }
      throw new core.RangeError.range(dart.as(charCode, core.num), 0, 1114111);
    }
    static stringConcatUnchecked(string1, string2) {
      return _foreign_helper.JS_STRING_CONCAT(string1, string2);
    }
    static flattenString(str) {
      return dart.as(_foreign_helper.JS('String', "#.charCodeAt(0) == 0 ? # : #", str, str, str), core.String);
    }
    static getTimeZoneName(receiver) {
      let d = lazyAsJsDate(receiver);
      let match = dart.as(_foreign_helper.JS('JSArray|Null', '/\\((.*)\\)/.exec(#.toString())', d), core.List);
      if (match !== null)
        return dart.as(match.get(1), core.String);
      match = dart.as(_foreign_helper.JS('JSArray|Null', '/^[A-Z,a-z]{3}\\s' + '[A-Z,a-z]{3}\\s\\d+\\s' + '\\d{2}:\\d{2}:\\d{2}\\s' + '([A-Z]{3,5})\\s' + '\\d{4}$/' + '.exec(#.toString())', d), core.List);
      if (match !== null)
        return dart.as(match.get(1), core.String);
      match = dart.as(_foreign_helper.JS('JSArray|Null', '/(?:GMT|UTC)[+-]\\d{4}/.exec(#.toString())', d), core.List);
      if (match !== null)
        return dart.as(match.get(0), core.String);
      return "";
    }
    static getTimeZoneOffsetInMinutes(receiver) {
      return dart.as(dart.throw_("Unimplemented PrefixExpression: -JS('int', r'#.getTimezoneOffset()', lazyAsJsDate(receiver))"), core.int);
    }
    static valueFromDecomposedDate(years, month, day, hours, minutes, seconds, milliseconds, isUtc) {
      let MAX_MILLISECONDS_SINCE_EPOCH = 8640000000000000;
      checkInt(years);
      checkInt(month);
      checkInt(day);
      checkInt(hours);
      checkInt(minutes);
      checkInt(seconds);
      checkInt(milliseconds);
      checkBool(isUtc);
      let jsMonth = dart.dbinary(month, '-', 1);
      let value = null;
      if (isUtc) {
        value = _foreign_helper.JS('num', 'Date.UTC(#, #, #, #, #, #, #)', years, jsMonth, day, hours, minutes, seconds, milliseconds);
      } else {
        value = _foreign_helper.JS('num', 'new Date(#, #, #, #, #, #, #).valueOf()', years, jsMonth, day, hours, minutes, seconds, milliseconds);
      }
      if (core.bool['||'](dart.dbinary(dart.dload(value, 'isNaN'), '||', dart.dbinary(value, '<', -MAX_MILLISECONDS_SINCE_EPOCH)), dart.dbinary(value, '>', MAX_MILLISECONDS_SINCE_EPOCH))) {
        return null;
      }
      if (dart.dbinary(dart.dbinary(years, '<=', 0), '||', dart.dbinary(years, '<', 100)))
        return patchUpY2K(value, years, isUtc);
      return value;
    }
    static patchUpY2K(value, years, isUtc) {
      let date = _foreign_helper.JS('', 'new Date(#)', value);
      if (isUtc) {
        _foreign_helper.JS('num', '#.setUTCFullYear(#)', date, years);
      } else {
        _foreign_helper.JS('num', '#.setFullYear(#)', date, years);
      }
      return _foreign_helper.JS('num', '#.valueOf()', date);
    }
    static lazyAsJsDate(receiver) {
      if (_foreign_helper.JS('bool', '#.date === (void 0)', receiver)) {
        _foreign_helper.JS('void', '#.date = new Date(#)', receiver, dart.dload(receiver, 'millisecondsSinceEpoch'));
      }
      return _foreign_helper.JS('var', '#.date', receiver);
    }
    static getYear(receiver) {
      return dart.dload(receiver, 'isUtc') ? _foreign_helper.JS('int', '(#.getUTCFullYear() + 0)', lazyAsJsDate(receiver)) : _foreign_helper.JS('int', '(#.getFullYear() + 0)', lazyAsJsDate(receiver));
    }
    static getMonth(receiver) {
      return dart.dload(receiver, 'isUtc') ? _foreign_helper.JS('int', '#.getUTCMonth() + 1', lazyAsJsDate(receiver)) : _foreign_helper.JS('int', '#.getMonth() + 1', lazyAsJsDate(receiver));
    }
    static getDay(receiver) {
      return dart.dload(receiver, 'isUtc') ? _foreign_helper.JS('int', '(#.getUTCDate() + 0)', lazyAsJsDate(receiver)) : _foreign_helper.JS('int', '(#.getDate() + 0)', lazyAsJsDate(receiver));
    }
    static getHours(receiver) {
      return dart.dload(receiver, 'isUtc') ? _foreign_helper.JS('int', '(#.getUTCHours() + 0)', lazyAsJsDate(receiver)) : _foreign_helper.JS('int', '(#.getHours() + 0)', lazyAsJsDate(receiver));
    }
    static getMinutes(receiver) {
      return dart.dload(receiver, 'isUtc') ? _foreign_helper.JS('int', '(#.getUTCMinutes() + 0)', lazyAsJsDate(receiver)) : _foreign_helper.JS('int', '(#.getMinutes() + 0)', lazyAsJsDate(receiver));
    }
    static getSeconds(receiver) {
      return dart.dload(receiver, 'isUtc') ? _foreign_helper.JS('int', '(#.getUTCSeconds() + 0)', lazyAsJsDate(receiver)) : _foreign_helper.JS('int', '(#.getSeconds() + 0)', lazyAsJsDate(receiver));
    }
    static getMilliseconds(receiver) {
      return dart.dload(receiver, 'isUtc') ? _foreign_helper.JS('int', '(#.getUTCMilliseconds() + 0)', lazyAsJsDate(receiver)) : _foreign_helper.JS('int', '(#.getMilliseconds() + 0)', lazyAsJsDate(receiver));
    }
    static getWeekday(receiver) {
      let weekday = dart.as(dart.dload(receiver, 'isUtc') ? _foreign_helper.JS('int', '#.getUTCDay() + 0', lazyAsJsDate(receiver)) : _foreign_helper.JS('int', '#.getDay() + 0', lazyAsJsDate(receiver)), core.int);
      return (weekday + 6) % 7 + 1;
    }
    static valueFromDateString(str) {
      if (!(typeof str == string))
        throw new core.ArgumentError(str);
      let value = _foreign_helper.JS('num', 'Date.parse(#)', str);
      if (dart.dload(value, 'isNaN'))
        throw new core.ArgumentError(str);
      return value;
    }
    static getProperty(object, key) {
      if (dart.notNull(dart.notNull(dart.notNull(object === null) || dart.notNull(typeof object == boolean)) || dart.notNull(dart.is(object, core.num))) || dart.notNull(typeof object == string)) {
        throw new core.ArgumentError(object);
      }
      return _foreign_helper.JS('var', '#[#]', object, key);
    }
    static setProperty(object, key, value) {
      if (dart.notNull(dart.notNull(dart.notNull(object === null) || dart.notNull(typeof object == boolean)) || dart.notNull(dart.is(object, core.num))) || dart.notNull(typeof object == string)) {
        throw new core.ArgumentError(object);
      }
      _foreign_helper.JS('void', '#[#] = #', object, key, value);
    }
    static functionNoSuchMethod(function, positionalArguments, namedArguments) {
      let argumentCount = 0;
      let arguments = new List.from([]);
      let namedArgumentList = new List.from([]);
      if (positionalArguments !== null) {
        argumentCount = positionalArguments.length;
        arguments.addAll(positionalArguments);
      }
      let names = '';
      if (dart.notNull(namedArguments !== null) && dart.notNull(!dart.notNull(namedArguments.isEmpty))) {
        namedArguments.forEach(((name, argument) => {
          names = `${names}$${name}`;
          namedArgumentList.add(name);
          arguments.add(argument);
          argumentCount++;
        }).bind(this));
      }
      let selectorName = `${_foreign_helper.JS_GET_NAME("CALL_PREFIX")}$${argumentCount}${names}`;
      return dart.dinvoke(function, 'noSuchMethod', createUnmangledInvocationMirror(dart.throw_("Unimplemented SymbolLiteral: #call"), selectorName, JSInvocationMirror.METHOD, arguments, namedArgumentList));
    }
    static applyFunction(function, positionalArguments, namedArguments) {
      return namedArguments === null ? applyFunctionWithPositionalArguments(function, positionalArguments) : applyFunctionWithNamedArguments(function, positionalArguments, namedArguments);
    }
    static applyFunctionWithPositionalArguments(function, positionalArguments) {
      let argumentCount = 0;
      let arguments = null;
      if (positionalArguments !== null) {
        if (_foreign_helper.JS('bool', '# instanceof Array', positionalArguments)) {
          arguments = positionalArguments;
        } else {
          arguments = new core.List.from(positionalArguments);
        }
        argumentCount = dart.as(_foreign_helper.JS('int', '#.length', arguments), core.int);
      } else {
        arguments = new List.from([]);
      }
      let selectorName = `${_foreign_helper.JS_GET_NAME("CALL_PREFIX")}$${argumentCount}`;
      let jsFunction = _foreign_helper.JS('var', '#[#]', function, selectorName);
      if (jsFunction === null) {
        return functionNoSuchMethod(function, positionalArguments, null);
      }
      return _foreign_helper.JS('var', '#.apply(#, #)', jsFunction, function, arguments);
    }
    static applyFunctionWithNamedArguments(function, positionalArguments, namedArguments) {
      if (namedArguments.isEmpty) {
        return applyFunctionWithPositionalArguments(function, positionalArguments);
      }
      let interceptor = _interceptors.getInterceptor(function);
      let jsFunction = _foreign_helper.JS('', '#["call*"]', interceptor);
      if (jsFunction === null) {
        return functionNoSuchMethod(function, positionalArguments, namedArguments);
      }
      let info = new ReflectionInfo(jsFunction);
      if (dart.notNull(info === null) || dart.notNull(!dart.notNull(info.areOptionalParametersNamed))) {
        return functionNoSuchMethod(function, positionalArguments, namedArguments);
      }
      if (positionalArguments !== null) {
        positionalArguments = new core.List.from(positionalArguments);
      } else {
        positionalArguments = new List.from([]);
      }
      if (info.requiredParameterCount !== positionalArguments.length) {
        return functionNoSuchMethod(function, positionalArguments, namedArguments);
      }
      let defaultArguments = new core.Map();
      for (let i = 0; i < info.optionalParameterCount; i++) {
        let index = i + info.requiredParameterCount;
        let parameterName = info.parameterNameInOrder(index);
        let value = info.defaultValueInOrder(index);
        let defaultValue = getMetadata(value);
        defaultArguments.set(parameterName, defaultValue);
      }
      let bad = false;
      namedArguments.forEach(((parameter, value) => {
        if (defaultArguments.containsKey(parameter)) {
          defaultArguments.set(parameter, value);
        } else {
          bad = true;
        }
      }).bind(this));
      if (bad) {
        return functionNoSuchMethod(function, positionalArguments, namedArguments);
      }
      positionalArguments.addAll(defaultArguments.values);
      return _foreign_helper.JS('', '#.apply(#, #)', jsFunction, function, positionalArguments);
    }
    static _mangledNameMatchesType(mangledName, type) {
      return _foreign_helper.JS('bool', '# == #', mangledName, type._typeName);
    }
    static identicalImplementation(a, b) {
      return dart.as(_foreign_helper.JS('bool', '# == null', a) ? _foreign_helper.JS('bool', '# == null', b) : _foreign_helper.JS('bool', '# === #', a, b), core.bool);
    }
    static extractStackTrace(error) {
      return getTraceFromException(_foreign_helper.JS('', '#.$thrownJsError', error));
    }
  }
  Primitives.mirrorFunctionCacheName = '$cachedFunction';
  Primitives.mirrorInvokeCacheName = '$cachedInvocation';
  Primitives.DOLLAR_CHAR_VALUE = 36;
  Primitives.timerFrequency = null;
  Primitives.timerTicks = null;
  class JsCache extends dart.Object {
    static allocate() {
      let result = _foreign_helper.JS('=Object', 'Object.create(null)');
      _foreign_helper.JS('void', '#.x=0', result);
      _foreign_helper.JS('void', 'delete #.x', result);
      return result;
    }
    static fetch(cache, key) {
      return _foreign_helper.JS('', '#[#]', cache, key);
    }
    static update(cache, key, value) {
      _foreign_helper.JS('void', '#[#] = #', cache, key, value);
    }
  }
  // Function iae: (dynamic) → dynamic
  function iae(argument) {
    throw new core.ArgumentError(argument);
  }
  // Function ioore: (dynamic, dynamic) → dynamic
  function ioore(receiver, index) {
    if (receiver === null)
      dart.dload(receiver, 'length');
    if (!(typeof index == number))
      iae(index);
    throw new core.RangeError.value(dart.as(index, core.num));
  }
  // Function stringLastIndexOfUnchecked: (dynamic, dynamic, dynamic) → dynamic
  function stringLastIndexOfUnchecked(receiver, element, start) {
    return _foreign_helper.JS('int', '#.lastIndexOf(#, #)', receiver, element, start);
  }
  // Function checkNull: (dynamic) → dynamic
  function checkNull(object) {
    if (object === null)
      throw new core.ArgumentError(null);
    return object;
  }
  // Function checkNum: (dynamic) → dynamic
  function checkNum(value) {
    if (!dart.is(value, core.num)) {
      throw new core.ArgumentError(value);
    }
    return value;
  }
  // Function checkInt: (dynamic) → dynamic
  function checkInt(value) {
    if (!(typeof value == number)) {
      throw new core.ArgumentError(value);
    }
    return value;
  }
  // Function checkBool: (dynamic) → dynamic
  function checkBool(value) {
    if (!(typeof value == boolean)) {
      throw new core.ArgumentError(value);
    }
    return value;
  }
  // Function checkString: (dynamic) → dynamic
  function checkString(value) {
    if (!(typeof value == string)) {
      throw new core.ArgumentError(value);
    }
    return value;
  }
  // Function wrapException: (dynamic) → dynamic
  function wrapException(ex) {
    if (ex === null)
      ex = new core.NullThrownError();
    let wrapper = _foreign_helper.JS('', 'new Error()');
    _foreign_helper.JS('void', '#.dartException = #', wrapper, ex);
    if (_foreign_helper.JS('bool', '"defineProperty" in Object')) {
      _foreign_helper.JS('void', 'Object.defineProperty(#, "message", { get: # })', wrapper, _foreign_helper.DART_CLOSURE_TO_JS(toStringWrapper));
      _foreign_helper.JS('void', '#.name = ""', wrapper);
    } else {
      _foreign_helper.JS('void', '#.toString = #', wrapper, _foreign_helper.DART_CLOSURE_TO_JS(toStringWrapper));
    }
    return wrapper;
  }
  // Function toStringWrapper: () → dynamic
  function toStringWrapper() {
    return dart.dinvoke(_foreign_helper.JS('', 'this.dartException'), 'toString');
  }
  // Function throwExpression: (dynamic) → dynamic
  function throwExpression(ex) {
    _foreign_helper.JS('void', 'throw #', wrapException(ex));
  }
  // Function makeLiteralListConst: (dynamic) → dynamic
  function makeLiteralListConst(list) {
    _foreign_helper.JS('bool', '#.immutable$list = #', list, true);
    _foreign_helper.JS('bool', '#.fixed$length = #', list, true);
    return list;
  }
  // Function throwRuntimeError: (dynamic) → dynamic
  function throwRuntimeError(message) {
    throw new RuntimeError(message);
  }
  // Function throwAbstractClassInstantiationError: (dynamic) → dynamic
  function throwAbstractClassInstantiationError(className) {
    throw new core.AbstractClassInstantiationError(dart.as(className, core.String));
  }
  class TypeErrorDecoder extends dart.Object {
    TypeErrorDecoder(_arguments, _argumentsExpr, _expr, _method, _receiver, _pattern) {
      this._arguments = _arguments;
      this._argumentsExpr = _argumentsExpr;
      this._expr = _expr;
      this._method = _method;
      this._receiver = _receiver;
      this._pattern = _pattern;
    }
    matchTypeError(message) {
      let match = _foreign_helper.JS('JSExtendableArray|Null', 'new RegExp(#).exec(#)', this._pattern, message);
      if (match === null)
        return null;
      let result = _foreign_helper.JS('', 'Object.create(null)');
      if (this._arguments !== -1) {
        _foreign_helper.JS('', '#.arguments = #[# + 1]', result, match, this._arguments);
      }
      if (this._argumentsExpr !== -1) {
        _foreign_helper.JS('', '#.argumentsExpr = #[# + 1]', result, match, this._argumentsExpr);
      }
      if (this._expr !== -1) {
        _foreign_helper.JS('', '#.expr = #[# + 1]', result, match, this._expr);
      }
      if (this._method !== -1) {
        _foreign_helper.JS('', '#.method = #[# + 1]', result, match, this._method);
      }
      if (this._receiver !== -1) {
        _foreign_helper.JS('', '#.receiver = #[# + 1]', result, match, this._receiver);
      }
      return result;
    }
    static buildJavaScriptObject() {
      return _foreign_helper.JS('', '{ toString: function() { return "$receiver$"; } }');
    }
    static buildJavaScriptObjectWithNonClosure() {
      return _foreign_helper.JS('', '{ $method$: null, ' + 'toString: function() { return "$receiver$"; } }');
    }
    static extractPattern(message) {
      message = dart.as(_foreign_helper.JS('String', "#.replace(String({}), '$receiver$')", message), core.String);
      message = dart.as(_foreign_helper.JS('String', "#.replace(new RegExp(#, 'g'), '\\\\$&')", message, ESCAPE_REGEXP), core.String);
      let match = dart.as(_foreign_helper.JS('JSExtendableArray|Null', "#.match(/\\\\\\$[a-zA-Z]+\\\\\\$/g)", message), core.List$(core.String));
      if (match === null)
        match = dart.as(new List.from([]), core.List$(core.String));
      let arguments = dart.as(_foreign_helper.JS('int', '#.indexOf(#)', match, '\\$arguments\\$'), core.int);
      let argumentsExpr = dart.as(_foreign_helper.JS('int', '#.indexOf(#)', match, '\\$argumentsExpr\\$'), core.int);
      let expr = dart.as(_foreign_helper.JS('int', '#.indexOf(#)', match, '\\$expr\\$'), core.int);
      let method = dart.as(_foreign_helper.JS('int', '#.indexOf(#)', match, '\\$method\\$'), core.int);
      let receiver = dart.as(_foreign_helper.JS('int', '#.indexOf(#)', match, '\\$receiver\\$'), core.int);
      let pattern = dart.as(_foreign_helper.JS('String', "#.replace('\\\\$arguments\\\\$', '((?:x|[^x])*)')" + ".replace('\\\\$argumentsExpr\\\\$',  '((?:x|[^x])*)')" + ".replace('\\\\$expr\\\\$',  '((?:x|[^x])*)')" + ".replace('\\\\$method\\\\$',  '((?:x|[^x])*)')" + ".replace('\\\\$receiver\\\\$',  '((?:x|[^x])*)')", message), core.String);
      return new TypeErrorDecoder(arguments, argumentsExpr, expr, method, receiver, pattern);
    }
    static provokeCallErrorOn(expression) {
      let function = _foreign_helper.JS('', "function($expr$) {\n  var $argumentsExpr$ = '$arguments$';\n  try {\n    $expr$.$method$($argumentsExpr$);\n  } catch (e) {\n    return e.message;\n  }\n}");
      return dart.as(_foreign_helper.JS('String', '(#)(#)', function, expression), core.String);
    }
    static provokeCallErrorOnNull() {
      let function = _foreign_helper.JS('', "function() {\n  var $argumentsExpr$ = '$arguments$';\n  try {\n    null.$method$($argumentsExpr$);\n  } catch (e) {\n    return e.message;\n  }\n}");
      return dart.as(_foreign_helper.JS('String', '(#)()', function), core.String);
    }
    static provokeCallErrorOnUndefined() {
      let function = _foreign_helper.JS('', "function() {\n  var $argumentsExpr$ = '$arguments$';\n  try {\n    (void 0).$method$($argumentsExpr$);\n  } catch (e) {\n    return e.message;\n  }\n}");
      return dart.as(_foreign_helper.JS('String', '(#)()', function), core.String);
    }
    static provokePropertyErrorOn(expression) {
      let function = _foreign_helper.JS('', "function($expr$) {\n  try {\n    $expr$.$method$;\n  } catch (e) {\n    return e.message;\n  }\n}");
      return dart.as(_foreign_helper.JS('String', '(#)(#)', function, expression), core.String);
    }
    static provokePropertyErrorOnNull() {
      let function = _foreign_helper.JS('', "function() {\n  try {\n    null.$method$;\n  } catch (e) {\n    return e.message;\n  }\n}");
      return dart.as(_foreign_helper.JS('String', '(#)()', function), core.String);
    }
    static provokePropertyErrorOnUndefined() {
      let function = _foreign_helper.JS('', "function() {\n  try {\n    (void 0).$method$;\n  } catch (e) {\n    return e.message;\n  }\n}");
      return dart.as(_foreign_helper.JS('String', '(#)()', function), core.String);
    }
  }
  dart.defineLazyProperties(TypeErrorDecoder, {
    get noSuchMethodPattern() {
      return dart.as(extractPattern(provokeCallErrorOn(buildJavaScriptObject())), TypeErrorDecoder);
    },
    get notClosurePattern() {
      return dart.as(extractPattern(provokeCallErrorOn(buildJavaScriptObjectWithNonClosure())), TypeErrorDecoder);
    },
    get nullCallPattern() {
      return dart.as(extractPattern(provokeCallErrorOn(_foreign_helper.JS('', 'null'))), TypeErrorDecoder);
    },
    get nullLiteralCallPattern() {
      return dart.as(extractPattern(provokeCallErrorOnNull()), TypeErrorDecoder);
    },
    get undefinedCallPattern() {
      return dart.as(extractPattern(provokeCallErrorOn(_foreign_helper.JS('', 'void 0'))), TypeErrorDecoder);
    },
    get undefinedLiteralCallPattern() {
      return dart.as(extractPattern(provokeCallErrorOnUndefined()), TypeErrorDecoder);
    },
    get nullPropertyPattern() {
      return dart.as(extractPattern(provokePropertyErrorOn(_foreign_helper.JS('', 'null'))), TypeErrorDecoder);
    },
    get nullLiteralPropertyPattern() {
      return dart.as(extractPattern(provokePropertyErrorOnNull()), TypeErrorDecoder);
    },
    get undefinedPropertyPattern() {
      return dart.as(extractPattern(provokePropertyErrorOn(_foreign_helper.JS('', 'void 0'))), TypeErrorDecoder);
    },
    get undefinedLiteralPropertyPattern() {
      return dart.as(extractPattern(provokePropertyErrorOnUndefined()), TypeErrorDecoder);
    }
  });
  class NullError extends core.Error {
    NullError(_message, match) {
      this._message = _message;
      this._method = dart.as(match === null ? null : _foreign_helper.JS('', '#.method', match), core.String);
      super.Error();
    }
    toString() {
      if (this._method === null)
        return `NullError: ${this._message}`;
      return `NullError: Cannot call "${this._method}" on null`;
    }
  }
  class JsNoSuchMethodError extends core.Error {
    JsNoSuchMethodError(_message, match) {
      this._message = _message;
      this._method = dart.as(match === null ? null : _foreign_helper.JS('String|Null', '#.method', match), core.String);
      this._receiver = dart.as(match === null ? null : _foreign_helper.JS('String|Null', '#.receiver', match), core.String);
      super.Error();
    }
    toString() {
      if (this._method === null)
        return `NoSuchMethodError: ${this._message}`;
      if (this._receiver === null) {
        return `NoSuchMethodError: Cannot call "${this._method}" (${this._message})`;
      }
      return `NoSuchMethodError: Cannot call "${this._method}" on "${this._receiver}" ` + `(${this._message})`;
    }
  }
  class UnknownJsTypeError extends core.Error {
    UnknownJsTypeError(_message) {
      this._message = _message;
      super.Error();
    }
    toString() {
      return this._message.isEmpty ? 'Error' : `Error: ${this._message}`;
    }
  }
  // Function unwrapException: (dynamic) → dynamic
  function unwrapException(ex) {
    // Function saveStackTrace: (dynamic) → dynamic
    function saveStackTrace(error) {
      if (dart.is(error, core.Error)) {
        let thrownStackTrace = _foreign_helper.JS('', '#.$thrownJsError', error);
        if (thrownStackTrace === null) {
          _foreign_helper.JS('void', '#.$thrownJsError = #', error, ex);
        }
      }
      return error;
    }
    if (ex === null)
      return null;
    if (_foreign_helper.JS('bool', 'typeof # !== "object"', ex))
      return ex;
    if (_foreign_helper.JS('bool', '"dartException" in #', ex)) {
      return saveStackTrace(_foreign_helper.JS('', '#.dartException', ex));
    } else if (dart.throw_("Unimplemented PrefixExpression: !JS('bool', r'\"message\" in #', ex)")) {
      return ex;
    }
    let message = _foreign_helper.JS('var', '#.message', ex);
    if (dart.dbinary(_foreign_helper.JS('bool', '"number" in #', ex), '&&', _foreign_helper.JS('bool', 'typeof #.number == "number"', ex))) {
      let number = dart.as(_foreign_helper.JS('int', '#.number', ex), core.int);
      let ieErrorCode = number & 65535;
      let ieFacilityNumber = number >> 16 & 8191;
      if (ieFacilityNumber === 10) {
        switch (ieErrorCode) {
          case 438:
            return saveStackTrace(new JsNoSuchMethodError(`${message} (Error ${ieErrorCode})`, null));
          case 445:
          case 5007:
            return saveStackTrace(new NullError(`${message} (Error ${ieErrorCode})`, null));
        }
      }
    }
    if (_foreign_helper.JS('bool', '# instanceof TypeError', ex)) {
      let match = null;
      let nsme = _foreign_helper.JS('TypeErrorDecoder', '#', TypeErrorDecoder.noSuchMethodPattern);
      let notClosure = _foreign_helper.JS('TypeErrorDecoder', '#', TypeErrorDecoder.notClosurePattern);
      let nullCall = _foreign_helper.JS('TypeErrorDecoder', '#', TypeErrorDecoder.nullCallPattern);
      let nullLiteralCall = _foreign_helper.JS('TypeErrorDecoder', '#', TypeErrorDecoder.nullLiteralCallPattern);
      let undefCall = _foreign_helper.JS('TypeErrorDecoder', '#', TypeErrorDecoder.undefinedCallPattern);
      let undefLiteralCall = _foreign_helper.JS('TypeErrorDecoder', '#', TypeErrorDecoder.undefinedLiteralCallPattern);
      let nullProperty = _foreign_helper.JS('TypeErrorDecoder', '#', TypeErrorDecoder.nullPropertyPattern);
      let nullLiteralProperty = _foreign_helper.JS('TypeErrorDecoder', '#', TypeErrorDecoder.nullLiteralPropertyPattern);
      let undefProperty = _foreign_helper.JS('TypeErrorDecoder', '#', TypeErrorDecoder.undefinedPropertyPattern);
      let undefLiteralProperty = _foreign_helper.JS('TypeErrorDecoder', '#', TypeErrorDecoder.undefinedLiteralPropertyPattern);
      if ((match = dart.dinvoke(nsme, 'matchTypeError', message)) !== null) {
        return saveStackTrace(new JsNoSuchMethodError(dart.as(message, core.String), match));
      } else if ((match = dart.dinvoke(notClosure, 'matchTypeError', message)) !== null) {
        _foreign_helper.JS('', '#.method = "call"', match);
        return saveStackTrace(new JsNoSuchMethodError(dart.as(message, core.String), match));
      } else if (dart.notNull(dart.notNull(dart.notNull(dart.notNull(dart.notNull(dart.notNull(dart.notNull((match = dart.dinvoke(nullCall, 'matchTypeError', message)) !== null) || dart.notNull((match = dart.dinvoke(nullLiteralCall, 'matchTypeError', message)) !== null)) || dart.notNull((match = dart.dinvoke(undefCall, 'matchTypeError', message)) !== null)) || dart.notNull((match = dart.dinvoke(undefLiteralCall, 'matchTypeError', message)) !== null)) || dart.notNull((match = dart.dinvoke(nullProperty, 'matchTypeError', message)) !== null)) || dart.notNull((match = dart.dinvoke(nullLiteralCall, 'matchTypeError', message)) !== null)) || dart.notNull((match = dart.dinvoke(undefProperty, 'matchTypeError', message)) !== null)) || dart.notNull((match = dart.dinvoke(undefLiteralProperty, 'matchTypeError', message)) !== null)) {
        return saveStackTrace(new NullError(dart.as(message, core.String), match));
      }
      return saveStackTrace(new UnknownJsTypeError(dart.as(typeof message == string ? message : '', core.String)));
    }
    if (_foreign_helper.JS('bool', '# instanceof RangeError', ex)) {
      if (dart.notNull(typeof message == string) && dart.notNull(contains(dart.as(message, core.String), 'call stack'))) {
        return new core.StackOverflowError();
      }
      return saveStackTrace(new core.ArgumentError());
    }
    if (_foreign_helper.JS('bool', 'typeof InternalError == "function" && # instanceof InternalError', ex)) {
      if (dart.notNull(typeof message == string) && dart.notNull(dart.equals(message, 'too much recursion'))) {
        return new core.StackOverflowError();
      }
    }
    return ex;
  }
  // Function getTraceFromException: (dynamic) → StackTrace
  function getTraceFromException(exception) {
    return new _StackTrace(exception);
  }
  class _StackTrace extends dart.Object {
    _StackTrace(_exception) {
      this._exception = _exception;
      this._trace = null;
    }
    toString() {
      if (this._trace !== null)
        return this._trace;
      let trace = null;
      if (_foreign_helper.JS('bool', 'typeof # === "object"', this._exception)) {
        trace = dart.as(_foreign_helper.JS("String|Null", "#.stack", this._exception), core.String);
      }
      return this._trace = trace === null ? '' : trace;
    }
  }
  // Function objectHashCode: (dynamic) → int
  function objectHashCode(object) {
    if (core.bool['||'](object === null, _foreign_helper.JS('bool', "typeof # != 'object'", object))) {
      return dart.as(dart.dload(object, 'hashCode'), core.int);
    } else {
      return Primitives.objectHashCode(object);
    }
  }
  // Function fillLiteralMap: (dynamic, Map<dynamic, dynamic>) → dynamic
  function fillLiteralMap(keyValuePairs, result) {
    let index = 0;
    let length = getLength(keyValuePairs);
    while (index < length) {
      let key = getIndex(keyValuePairs, index++);
      let value = getIndex(keyValuePairs, index++);
      result.set(key, value);
    }
    return result;
  }
  // Function invokeClosure: (Function, dynamic, int, dynamic, dynamic, dynamic, dynamic) → dynamic
  function invokeClosure(closure, isolate, numberOfArguments, arg1, arg2, arg3, arg4) {
    if (numberOfArguments === 0) {
      return _foreign_helper.JS_CALL_IN_ISOLATE(isolate, () => dart.dinvokef(closure));
    } else if (numberOfArguments === 1) {
      return _foreign_helper.JS_CALL_IN_ISOLATE(isolate, () => dart.dinvokef(closure, arg1));
    } else if (numberOfArguments === 2) {
      return _foreign_helper.JS_CALL_IN_ISOLATE(isolate, () => dart.dinvokef(closure, arg1, arg2));
    } else if (numberOfArguments === 3) {
      return _foreign_helper.JS_CALL_IN_ISOLATE(isolate, () => dart.dinvokef(closure, arg1, arg2, arg3));
    } else if (numberOfArguments === 4) {
      return _foreign_helper.JS_CALL_IN_ISOLATE(isolate, () => dart.dinvokef(closure, arg1, arg2, arg3, arg4));
    } else {
      throw new core.Exception('Unsupported number of arguments for wrapped closure');
    }
  }
  // Function convertDartClosureToJS: (dynamic, int) → dynamic
  function convertDartClosureToJS(closure, arity) {
    if (closure === null)
      return null;
    let function = _foreign_helper.JS('var', '#.$identity', closure);
    if (_foreign_helper.JS('bool', '!!#', function))
      return function;
    function = _foreign_helper.JS('var', '(function(closure, arity, context, invoke) {' + '  return function(a1, a2, a3, a4) {' + '     return invoke(closure, context, arity, a1, a2, a3, a4);' + '  };' + '})(#,#,#,#)', closure, arity, _foreign_helper.JS_CURRENT_ISOLATE_CONTEXT(), _foreign_helper.DART_CLOSURE_TO_JS(invokeClosure));
    _foreign_helper.JS('void', '#.$identity = #', closure, function);
    return function;
  }
  class Closure extends dart.Object {
    Closure() {
    }
    static fromTearOff(receiver, functions, reflectionInfo, isStatic, jsArguments, propertyName) {
      _foreign_helper.JS_EFFECT(() => {
        BoundClosure.receiverOf(dart.as(_foreign_helper.JS('BoundClosure', 'void 0'), BoundClosure));
        BoundClosure.selfOf(dart.as(_foreign_helper.JS('BoundClosure', 'void 0'), BoundClosure));
      });
      let function = _foreign_helper.JS('', '#[#]', functions, 0);
      let name = dart.as(_foreign_helper.JS('String|Null', '#.$stubName', function), core.String);
      let callName = dart.as(_foreign_helper.JS('String|Null', '#.$callName', function), core.String);
      _foreign_helper.JS('', '#.$reflectionInfo = #', function, reflectionInfo);
      let info = new ReflectionInfo(function);
      let functionType = info.functionType;
      let prototype = isStatic ? _foreign_helper.JS('TearOffClosure', 'Object.create(#.constructor.prototype)', new TearOffClosure()) : _foreign_helper.JS('BoundClosure', 'Object.create(#.constructor.prototype)', new BoundClosure(null, null, null, null));
      _foreign_helper.JS('', '#.$initialize = #', prototype, _foreign_helper.JS('', '#.constructor', prototype));
      let constructor = isStatic ? _foreign_helper.JS('', 'function(){this.$initialize()}') : isCsp ? _foreign_helper.JS('', 'function(a,b,c,d) {this.$initialize(a,b,c,d)}') : _foreign_helper.JS('', 'new Function("a","b","c","d",' + '"this.$initialize(a,b,c,d);"+#)', functionCounter++);
      _foreign_helper.JS('', '#.constructor = #', prototype, constructor);
      _foreign_helper.JS('', '#.prototype = #', constructor, prototype);
      let trampoline = function;
      let isIntercepted = false;
      if (!dart.notNull(isStatic)) {
        if (_foreign_helper.JS('bool', '#.length == 1', jsArguments)) {
          isIntercepted = true;
        }
        trampoline = forwardCallTo(receiver, function, isIntercepted);
        _foreign_helper.JS('', '#.$reflectionInfo = #', trampoline, reflectionInfo);
      } else {
        _foreign_helper.JS('', '#.$name = #', prototype, propertyName);
      }
      let signatureFunction = null;
      if (_foreign_helper.JS('bool', 'typeof # == "number"', functionType)) {
        let metadata = _foreign_helper.JS_EMBEDDED_GLOBAL('', dart.as(_js_embedded_names.METADATA, core.String));
        signatureFunction = _foreign_helper.JS('', '(function(s){return function(){return #[s]}})(#)', metadata, functionType);
      } else if (core.bool['&&'](!dart.notNull(isStatic), _foreign_helper.JS('bool', 'typeof # == "function"', functionType))) {
        let getReceiver = isIntercepted ? _foreign_helper.RAW_DART_FUNCTION_REF(BoundClosure.receiverOf) : _foreign_helper.RAW_DART_FUNCTION_REF(BoundClosure.selfOf);
        signatureFunction = _foreign_helper.JS('', 'function(f,r){' + 'return function(){' + 'return f.apply({$receiver:r(this)},arguments)' + '}' + '}(#,#)', functionType, getReceiver);
      } else {
        throw 'Error in reflectionInfo.';
      }
      _foreign_helper.JS('', '#[#] = #', prototype, _foreign_helper.JS_SIGNATURE_NAME(), signatureFunction);
      _foreign_helper.JS('', '#[#] = #', prototype, callName, trampoline);
      for (let i = 1; i < functions.length; i++) {
        let stub = functions.get(i);
        let stubCallName = _foreign_helper.JS('String|Null', '#.$callName', stub);
        if (stubCallName !== null) {
          _foreign_helper.JS('', '#[#] = #', prototype, stubCallName, isStatic ? stub : forwardCallTo(receiver, stub, isIntercepted));
        }
      }
      _foreign_helper.JS('', '#["call*"] = #', prototype, trampoline);
      return constructor;
    }
    static cspForwardCall(arity, isSuperCall, stubName, function) {
      let getSelf = _foreign_helper.RAW_DART_FUNCTION_REF(BoundClosure.selfOf);
      if (isSuperCall)
        arity = -1;
      switch (arity) {
        case 0:
          return _foreign_helper.JS('', 'function(n,S){' + 'return function(){' + 'return S(this)[n]()' + '}' + '}(#,#)', stubName, getSelf);
        case 1:
          return _foreign_helper.JS('', 'function(n,S){' + 'return function(a){' + 'return S(this)[n](a)' + '}' + '}(#,#)', stubName, getSelf);
        case 2:
          return _foreign_helper.JS('', 'function(n,S){' + 'return function(a,b){' + 'return S(this)[n](a,b)' + '}' + '}(#,#)', stubName, getSelf);
        case 3:
          return _foreign_helper.JS('', 'function(n,S){' + 'return function(a,b,c){' + 'return S(this)[n](a,b,c)' + '}' + '}(#,#)', stubName, getSelf);
        case 4:
          return _foreign_helper.JS('', 'function(n,S){' + 'return function(a,b,c,d){' + 'return S(this)[n](a,b,c,d)' + '}' + '}(#,#)', stubName, getSelf);
        case 5:
          return _foreign_helper.JS('', 'function(n,S){' + 'return function(a,b,c,d,e){' + 'return S(this)[n](a,b,c,d,e)' + '}' + '}(#,#)', stubName, getSelf);
        default:
          return _foreign_helper.JS('', 'function(f,s){' + 'return function(){' + 'return f.apply(s(this),arguments)' + '}' + '}(#,#)', function, getSelf);
      }
    }
    static get isCsp() {
      return dart.as(_foreign_helper.JS('bool', 'typeof dart_precompiled == "function"'), core.bool);
    }
    static forwardCallTo(receiver, function, isIntercepted) {
      if (isIntercepted)
        return forwardInterceptedCallTo(receiver, function);
      let stubName = dart.as(_foreign_helper.JS('String|Null', '#.$stubName', function), core.String);
      let arity = dart.as(_foreign_helper.JS('int', '#.length', function), core.int);
      let lookedUpFunction = _foreign_helper.JS("", "#[#]", receiver, stubName);
      let isSuperCall = !dart.notNull(core.identical(function, lookedUpFunction));
      if (dart.notNull(dart.notNull(isCsp) || dart.notNull(isSuperCall)) || dart.notNull(arity >= 27)) {
        return cspForwardCall(arity, isSuperCall, stubName, function);
      }
      if (arity === 0) {
        return _foreign_helper.JS('', '(new Function(#))()', 'return function(){' + `return this.${BoundClosure.selfFieldName()}.${stubName}();` + `${functionCounter++}` + '}');
      }
      dart.assert(dart.notNull(1 <= arity) && dart.notNull(arity < 27));
      let arguments = dart.as(_foreign_helper.JS('String', '"abcdefghijklmnopqrstuvwxyz".split("").splice(0,#).join(",")', arity), core.String);
      return _foreign_helper.JS('', '(new Function(#))()', `return function(${arguments}){` + `return this.${BoundClosure.selfFieldName()}.${stubName}(${arguments});` + `${functionCounter++}` + '}');
    }
    static cspForwardInterceptedCall(arity, isSuperCall, name, function) {
      let getSelf = _foreign_helper.RAW_DART_FUNCTION_REF(BoundClosure.selfOf);
      let getReceiver = _foreign_helper.RAW_DART_FUNCTION_REF(BoundClosure.receiverOf);
      if (isSuperCall)
        arity = -1;
      switch (arity) {
        case 0:
          throw new RuntimeError('Intercepted function with no arguments.');
        case 1:
          return _foreign_helper.JS('', 'function(n,s,r){' + 'return function(){' + 'return s(this)[n](r(this))' + '}' + '}(#,#,#)', name, getSelf, getReceiver);
        case 2:
          return _foreign_helper.JS('', 'function(n,s,r){' + 'return function(a){' + 'return s(this)[n](r(this),a)' + '}' + '}(#,#,#)', name, getSelf, getReceiver);
        case 3:
          return _foreign_helper.JS('', 'function(n,s,r){' + 'return function(a,b){' + 'return s(this)[n](r(this),a,b)' + '}' + '}(#,#,#)', name, getSelf, getReceiver);
        case 4:
          return _foreign_helper.JS('', 'function(n,s,r){' + 'return function(a,b,c){' + 'return s(this)[n](r(this),a,b,c)' + '}' + '}(#,#,#)', name, getSelf, getReceiver);
        case 5:
          return _foreign_helper.JS('', 'function(n,s,r){' + 'return function(a,b,c,d){' + 'return s(this)[n](r(this),a,b,c,d)' + '}' + '}(#,#,#)', name, getSelf, getReceiver);
        case 6:
          return _foreign_helper.JS('', 'function(n,s,r){' + 'return function(a,b,c,d,e){' + 'return s(this)[n](r(this),a,b,c,d,e)' + '}' + '}(#,#,#)', name, getSelf, getReceiver);
        default:
          return _foreign_helper.JS('', 'function(f,s,r,a){' + 'return function(){' + 'a=[r(this)];' + 'Array.prototype.push.apply(a,arguments);' + 'return f.apply(s(this),a)' + '}' + '}(#,#,#)', function, getSelf, getReceiver);
      }
    }
    static forwardInterceptedCallTo(receiver, function) {
      let selfField = BoundClosure.selfFieldName();
      let receiverField = BoundClosure.receiverFieldName();
      let stubName = dart.as(_foreign_helper.JS('String|Null', '#.$stubName', function), core.String);
      let arity = dart.as(_foreign_helper.JS('int', '#.length', function), core.int);
      let isCsp = dart.as(_foreign_helper.JS('bool', 'typeof dart_precompiled == "function"'), core.bool);
      let lookedUpFunction = _foreign_helper.JS("", "#[#]", receiver, stubName);
      let isSuperCall = !dart.notNull(core.identical(function, lookedUpFunction));
      if (dart.notNull(dart.notNull(isCsp) || dart.notNull(isSuperCall)) || dart.notNull(arity >= 28)) {
        return cspForwardInterceptedCall(arity, isSuperCall, stubName, function);
      }
      if (arity === 1) {
        return _foreign_helper.JS('', '(new Function(#))()', 'return function(){' + `return this.${selfField}.${stubName}(this.${receiverField});` + `${functionCounter++}` + '}');
      }
      dart.assert(dart.notNull(1 < arity) && dart.notNull(arity < 28));
      let arguments = dart.as(_foreign_helper.JS('String', '"abcdefghijklmnopqrstuvwxyz".split("").splice(0,#).join(",")', arity - 1), core.String);
      return _foreign_helper.JS('', '(new Function(#))()', `return function(${arguments}){` + `return this.${selfField}.${stubName}(this.${receiverField}, ${arguments});` + `${functionCounter++}` + '}');
    }
    toString() {
      return "Closure";
    }
  }
  Closure.FUNCTION_INDEX = 0;
  Closure.NAME_INDEX = 1;
  Closure.CALL_NAME_INDEX = 2;
  Closure.REQUIRED_PARAMETER_INDEX = 3;
  Closure.OPTIONAL_PARAMETER_INDEX = 4;
  Closure.DEFAULT_ARGUMENTS_INDEX = 5;
  Closure.functionCounter = 0;
  // Function closureFromTearOff: (dynamic, dynamic, dynamic, dynamic, dynamic, dynamic) → dynamic
  function closureFromTearOff(receiver, functions, reflectionInfo, isStatic, jsArguments, name) {
    return Closure.fromTearOff(receiver, _interceptors.JSArray.markFixedList(dart.as(functions, core.List)), _interceptors.JSArray.markFixedList(dart.as(reflectionInfo, core.List)), dart.as(_foreign_helper.JS('bool', '!!#', isStatic), core.bool), jsArguments, dart.as(_foreign_helper.JS('String', '#', name), core.String));
  }
  class TearOffClosure extends Closure {
  }
  class BoundClosure extends TearOffClosure {
    BoundClosure(_self, _target, _receiver, _name) {
      this._self = _self;
      this._target = _target;
      this._receiver = _receiver;
      this._name = _name;
      super.TearOffClosure();
    }
    ['=='](other) {
      if (core.identical(this, other))
        return true;
      if (!dart.is(other, BoundClosure))
        return false;
      return dart.as(_foreign_helper.JS('bool', '# === # && # === # && # === #', this._self, dart.dload(other, '_self'), this._target, dart.dload(other, '_target'), this._receiver, dart.dload(other, '_receiver')), core.bool);
    }
    get hashCode() {
      let receiverHashCode = null;
      if (this._receiver === null) {
        receiverHashCode = Primitives.objectHashCode(this._self);
      } else if (!dart.equals(_foreign_helper.JS('String', 'typeof #', this._receiver), 'object')) {
        receiverHashCode = dart.as(dart.dload(this._receiver, 'hashCode'), core.int);
      } else {
        receiverHashCode = Primitives.objectHashCode(this._receiver);
      }
      return receiverHashCode ^ Primitives.objectHashCode(this._target);
    }
    static selfOf(closure) {
      return closure._self;
    }
    static targetOf(closure) {
      return closure._target;
    }
    static receiverOf(closure) {
      return closure._receiver;
    }
    static nameOf(closure) {
      return closure._name;
    }
    static selfFieldName() {
      if (selfFieldNameCache === null) {
        selfFieldNameCache = computeFieldNamed('self');
      }
      return selfFieldNameCache;
    }
    static receiverFieldName() {
      if (receiverFieldNameCache === null) {
        receiverFieldNameCache = computeFieldNamed('receiver');
      }
      return receiverFieldNameCache;
    }
    static computeFieldNamed(fieldName) {
      let template = new BoundClosure('self', 'target', 'receiver', 'name');
      let names = _interceptors.JSArray.markFixedList(dart.as(_foreign_helper.JS('', 'Object.getOwnPropertyNames(#)', template), core.List));
      for (let i = 0; i < names.length; i++) {
        let name = names.get(i);
        if (_foreign_helper.JS('bool', '#[#] === #', template, name, fieldName)) {
          return dart.as(_foreign_helper.JS('String', '#', name), core.String);
        }
      }
    }
  }
  BoundClosure.selfFieldNameCache = null;
  BoundClosure.receiverFieldNameCache = null;
  // Function jsHasOwnProperty: (dynamic, String) → bool
  function jsHasOwnProperty(jsObject, property) {
    return dart.as(_foreign_helper.JS('bool', '#.hasOwnProperty(#)', jsObject, property), core.bool);
  }
  // Function jsPropertyAccess: (dynamic, String) → dynamic
  function jsPropertyAccess(jsObject, property) {
    return _foreign_helper.JS('var', '#[#]', jsObject, property);
  }
  // Function getFallThroughError: () → dynamic
  function getFallThroughError() {
    return new FallThroughErrorImplementation();
  }
  class Creates extends dart.Object {
    Creates(types) {
      this.types = types;
    }
  }
  class Returns extends dart.Object {
    Returns(types) {
      this.types = types;
    }
  }
  class JSName extends dart.Object {
    JSName(name) {
      this.name = name;
    }
  }
  // Function boolConversionCheck: (dynamic) → dynamic
  function boolConversionCheck(value) {
    if (typeof value == boolean)
      return value;
    boolTypeCheck(value);
    dart.assert(value !== null);
    return false;
  }
  // Function stringTypeCheck: (dynamic) → dynamic
  function stringTypeCheck(value) {
    if (value === null)
      return value;
    if (typeof value == string)
      return value;
    throw new TypeErrorImplementation(value, 'String');
  }
  // Function stringTypeCast: (dynamic) → dynamic
  function stringTypeCast(value) {
    if (dart.notNull(typeof value == string) || dart.notNull(value === null))
      return value;
    throw new CastErrorImplementation(Primitives.objectTypeName(value), 'String');
  }
  // Function doubleTypeCheck: (dynamic) → dynamic
  function doubleTypeCheck(value) {
    if (value === null)
      return value;
    if (typeof value == number)
      return value;
    throw new TypeErrorImplementation(value, 'double');
  }
  // Function doubleTypeCast: (dynamic) → dynamic
  function doubleTypeCast(value) {
    if (dart.notNull(typeof value == number) || dart.notNull(value === null))
      return value;
    throw new CastErrorImplementation(Primitives.objectTypeName(value), 'double');
  }
  // Function numTypeCheck: (dynamic) → dynamic
  function numTypeCheck(value) {
    if (value === null)
      return value;
    if (dart.is(value, core.num))
      return value;
    throw new TypeErrorImplementation(value, 'num');
  }
  // Function numTypeCast: (dynamic) → dynamic
  function numTypeCast(value) {
    if (dart.notNull(dart.is(value, core.num)) || dart.notNull(value === null))
      return value;
    throw new CastErrorImplementation(Primitives.objectTypeName(value), 'num');
  }
  // Function boolTypeCheck: (dynamic) → dynamic
  function boolTypeCheck(value) {
    if (value === null)
      return value;
    if (typeof value == boolean)
      return value;
    throw new TypeErrorImplementation(value, 'bool');
  }
  // Function boolTypeCast: (dynamic) → dynamic
  function boolTypeCast(value) {
    if (dart.notNull(typeof value == boolean) || dart.notNull(value === null))
      return value;
    throw new CastErrorImplementation(Primitives.objectTypeName(value), 'bool');
  }
  // Function intTypeCheck: (dynamic) → dynamic
  function intTypeCheck(value) {
    if (value === null)
      return value;
    if (typeof value == number)
      return value;
    throw new TypeErrorImplementation(value, 'int');
  }
  // Function intTypeCast: (dynamic) → dynamic
  function intTypeCast(value) {
    if (dart.notNull(typeof value == number) || dart.notNull(value === null))
      return value;
    throw new CastErrorImplementation(Primitives.objectTypeName(value), 'int');
  }
  // Function propertyTypeError: (dynamic, dynamic) → void
  function propertyTypeError(value, property) {
    let name = dart.as(dart.dinvoke(property, 'substring', 3, dart.dload(property, 'length')), core.String);
    throw new TypeErrorImplementation(value, name);
  }
  // Function propertyTypeCastError: (dynamic, dynamic) → void
  function propertyTypeCastError(value, property) {
    let actualType = Primitives.objectTypeName(value);
    let expectedType = dart.as(dart.dinvoke(property, 'substring', 3, dart.dload(property, 'length')), core.String);
    throw new CastErrorImplementation(actualType, expectedType);
  }
  // Function propertyTypeCheck: (dynamic, dynamic) → dynamic
  function propertyTypeCheck(value, property) {
    if (value === null)
      return value;
    if (_foreign_helper.JS('bool', '!!#[#]', value, property))
      return value;
    propertyTypeError(value, property);
  }
  // Function propertyTypeCast: (dynamic, dynamic) → dynamic
  function propertyTypeCast(value, property) {
    if (core.bool['||'](value === null, _foreign_helper.JS('bool', '!!#[#]', value, property)))
      return value;
    propertyTypeCastError(value, property);
  }
  // Function interceptedTypeCheck: (dynamic, dynamic) → dynamic
  function interceptedTypeCheck(value, property) {
    if (value === null)
      return value;
    if (core.bool['&&'](core.identical(_foreign_helper.JS('String', 'typeof #', value), 'object'), _foreign_helper.JS('bool', '#[#]', _interceptors.getInterceptor(value), property))) {
      return value;
    }
    propertyTypeError(value, property);
  }
  // Function interceptedTypeCast: (dynamic, dynamic) → dynamic
  function interceptedTypeCast(value, property) {
    if (dart.notNull(value === null) || dart.notNull(dart.dbinary(_foreign_helper.JS('bool', 'typeof # === "object"', value), '&&', _foreign_helper.JS('bool', '#[#]', _interceptors.getInterceptor(value), property)))) {
      return value;
    }
    propertyTypeCastError(value, property);
  }
  // Function numberOrStringSuperTypeCheck: (dynamic, dynamic) → dynamic
  function numberOrStringSuperTypeCheck(value, property) {
    if (value === null)
      return value;
    if (typeof value == string)
      return value;
    if (dart.is(value, core.num))
      return value;
    if (_foreign_helper.JS('bool', '!!#[#]', value, property))
      return value;
    propertyTypeError(value, property);
  }
  // Function numberOrStringSuperTypeCast: (dynamic, dynamic) → dynamic
  function numberOrStringSuperTypeCast(value, property) {
    if (typeof value == string)
      return value;
    if (dart.is(value, core.num))
      return value;
    return propertyTypeCast(value, property);
  }
  // Function numberOrStringSuperNativeTypeCheck: (dynamic, dynamic) → dynamic
  function numberOrStringSuperNativeTypeCheck(value, property) {
    if (value === null)
      return value;
    if (typeof value == string)
      return value;
    if (dart.is(value, core.num))
      return value;
    if (_foreign_helper.JS('bool', '#[#]', _interceptors.getInterceptor(value), property))
      return value;
    propertyTypeError(value, property);
  }
  // Function numberOrStringSuperNativeTypeCast: (dynamic, dynamic) → dynamic
  function numberOrStringSuperNativeTypeCast(value, property) {
    if (value === null)
      return value;
    if (typeof value == string)
      return value;
    if (dart.is(value, core.num))
      return value;
    if (_foreign_helper.JS('bool', '#[#]', _interceptors.getInterceptor(value), property))
      return value;
    propertyTypeCastError(value, property);
  }
  // Function stringSuperTypeCheck: (dynamic, dynamic) → dynamic
  function stringSuperTypeCheck(value, property) {
    if (value === null)
      return value;
    if (typeof value == string)
      return value;
    if (_foreign_helper.JS('bool', '!!#[#]', value, property))
      return value;
    propertyTypeError(value, property);
  }
  // Function stringSuperTypeCast: (dynamic, dynamic) → dynamic
  function stringSuperTypeCast(value, property) {
    if (typeof value == string)
      return value;
    return propertyTypeCast(value, property);
  }
  // Function stringSuperNativeTypeCheck: (dynamic, dynamic) → dynamic
  function stringSuperNativeTypeCheck(value, property) {
    if (value === null)
      return value;
    if (typeof value == string)
      return value;
    if (_foreign_helper.JS('bool', '#[#]', _interceptors.getInterceptor(value), property))
      return value;
    propertyTypeError(value, property);
  }
  // Function stringSuperNativeTypeCast: (dynamic, dynamic) → dynamic
  function stringSuperNativeTypeCast(value, property) {
    if (dart.notNull(typeof value == string) || dart.notNull(value === null))
      return value;
    if (_foreign_helper.JS('bool', '#[#]', _interceptors.getInterceptor(value), property))
      return value;
    propertyTypeCastError(value, property);
  }
  // Function listTypeCheck: (dynamic) → dynamic
  function listTypeCheck(value) {
    if (value === null)
      return value;
    if (dart.is(value, core.List))
      return value;
    throw new TypeErrorImplementation(value, 'List');
  }
  // Function listTypeCast: (dynamic) → dynamic
  function listTypeCast(value) {
    if (dart.notNull(dart.is(value, core.List)) || dart.notNull(value === null))
      return value;
    throw new CastErrorImplementation(Primitives.objectTypeName(value), 'List');
  }
  // Function listSuperTypeCheck: (dynamic, dynamic) → dynamic
  function listSuperTypeCheck(value, property) {
    if (value === null)
      return value;
    if (dart.is(value, core.List))
      return value;
    if (_foreign_helper.JS('bool', '!!#[#]', value, property))
      return value;
    propertyTypeError(value, property);
  }
  // Function listSuperTypeCast: (dynamic, dynamic) → dynamic
  function listSuperTypeCast(value, property) {
    if (dart.is(value, core.List))
      return value;
    return propertyTypeCast(value, property);
  }
  // Function listSuperNativeTypeCheck: (dynamic, dynamic) → dynamic
  function listSuperNativeTypeCheck(value, property) {
    if (value === null)
      return value;
    if (dart.is(value, core.List))
      return value;
    if (_foreign_helper.JS('bool', '#[#]', _interceptors.getInterceptor(value), property))
      return value;
    propertyTypeError(value, property);
  }
  // Function listSuperNativeTypeCast: (dynamic, dynamic) → dynamic
  function listSuperNativeTypeCast(value, property) {
    if (dart.notNull(dart.is(value, core.List)) || dart.notNull(value === null))
      return value;
    if (_foreign_helper.JS('bool', '#[#]', _interceptors.getInterceptor(value), property))
      return value;
    propertyTypeCastError(value, property);
  }
  // Function voidTypeCheck: (dynamic) → dynamic
  function voidTypeCheck(value) {
    if (value === null)
      return value;
    throw new TypeErrorImplementation(value, 'void');
  }
  // Function checkMalformedType: (dynamic, dynamic) → dynamic
  function checkMalformedType(value, message) {
    if (value === null)
      return value;
    throw new TypeErrorImplementation.fromMessage(dart.as(message, core.String));
  }
  // Function checkDeferredIsLoaded: (String, String) → void
  function checkDeferredIsLoaded(loadId, uri) {
    if (!dart.notNull(_js_helper._loadedLibraries.contains(loadId))) {
      throw new DeferredNotLoadedError(uri);
    }
  }
  class JavaScriptIndexingBehavior extends _interceptors.JSMutableIndexable {
  }
  class TypeErrorImplementation extends core.Error {
    TypeErrorImplementation(value, type) {
      this.message = `type '${Primitives.objectTypeName(value)}' is not a subtype ` + `of type '${type}'`;
      super.Error();
    }
    TypeErrorImplementation$fromMessage(message) {
      this.message = message;
      super.Error();
    }
    toString() {
      return this.message;
    }
  }
  dart.defineNamedConstructor(TypeErrorImplementation, 'fromMessage');
  class CastErrorImplementation extends core.Error {
    CastErrorImplementation(actualType, expectedType) {
      this.message = `CastError: Casting value of type ${actualType} to` + ` incompatible type ${expectedType}`;
      super.Error();
    }
    toString() {
      return this.message;
    }
  }
  class FallThroughErrorImplementation extends core.FallThroughError {
    FallThroughErrorImplementation() {
      super.FallThroughError();
    }
    toString() {
      return "Switch case fall-through.";
    }
  }
  // Function assertHelper: (dynamic) → void
  function assertHelper(condition) {
    if (!(typeof condition == boolean)) {
      if (dart.is(condition, core.Function))
        condition = dart.dinvokef(condition);
      if (!(typeof condition == boolean)) {
        throw new TypeErrorImplementation(condition, 'bool');
      }
    }
    if (true !== condition)
      throw new core.AssertionError();
  }
  // Function throwNoSuchMethod: (dynamic, dynamic, dynamic, dynamic) → void
  function throwNoSuchMethod(obj, name, arguments, expectedArgumentNames) {
    let memberName = new _internal.Symbol.unvalidated(dart.as(name, core.String));
    throw new core.NoSuchMethodError(obj, memberName, dart.as(arguments, core.List), new core.Map(), dart.as(expectedArgumentNames, core.List));
  }
  // Function throwCyclicInit: (String) → void
  function throwCyclicInit(staticName) {
    throw new core.CyclicInitializationError(`Cyclic initialization for static ${staticName}`);
  }
  class RuntimeError extends core.Error {
    RuntimeError(message) {
      this.message = message;
      super.Error();
    }
    toString() {
      return `RuntimeError: ${this.message}`;
    }
  }
  class DeferredNotLoadedError extends core.Error {
    DeferredNotLoadedError(libraryName) {
      this.libraryName = libraryName;
      super.Error();
    }
    toString() {
      return `Deferred library ${this.libraryName} was not loaded.`;
    }
  }
  class RuntimeType extends dart.Object {
    RuntimeType() {
    }
  }
  class RuntimeFunctionType extends RuntimeType {
    RuntimeFunctionType(returnType, parameterTypes, optionalParameterTypes, namedParameters) {
      this.returnType = returnType;
      this.parameterTypes = parameterTypes;
      this.optionalParameterTypes = optionalParameterTypes;
      this.namedParameters = namedParameters;
      super.RuntimeType();
    }
    get isVoid() {
      return dart.is(this.returnType, VoidRuntimeType);
    }
    _isTest(expression) {
      let functionTypeObject = this._extractFunctionTypeObjectFrom(expression);
      return functionTypeObject === null ? false : isFunctionSubtype(functionTypeObject, this.toRti());
    }
    _asCheck(expression) {
      return this._check(_foreign_helper.JS('', '#', expression), true);
    }
    _assertCheck(expression) {
      if (inAssert)
        return null;
      inAssert = true;
      try {
        return this._check(_foreign_helper.JS('', '#', expression), false);
      } finally {
        inAssert = false;
      }
    }
    _check(expression, isCast) {
      if (expression === null)
        return null;
      if (this._isTest(expression))
        return expression;
      let self = new FunctionTypeInfoDecoderRing(this.toRti()).toString();
      if (isCast) {
        let functionTypeObject = this._extractFunctionTypeObjectFrom(expression);
        let pretty = null;
        if (functionTypeObject !== null) {
          pretty = new FunctionTypeInfoDecoderRing(functionTypeObject).toString();
        } else {
          pretty = Primitives.objectTypeName(expression);
        }
        throw new CastErrorImplementation(pretty, self);
      } else {
        throw new TypeErrorImplementation(expression, self);
      }
    }
    _extractFunctionTypeObjectFrom(o) {
      let interceptor = _interceptors.getInterceptor(o);
      return _foreign_helper.JS('bool', '# in #', _foreign_helper.JS_SIGNATURE_NAME(), interceptor) ? _foreign_helper.JS('', '#[#]()', interceptor, _foreign_helper.JS_SIGNATURE_NAME()) : null;
    }
    toRti() {
      let result = _foreign_helper.JS('=Object', '{ #: "dynafunc" }', _foreign_helper.JS_FUNCTION_TYPE_TAG());
      if (this.isVoid) {
        _foreign_helper.JS('', '#[#] = true', result, _foreign_helper.JS_FUNCTION_TYPE_VOID_RETURN_TAG());
      } else {
        if (!dart.is(this.returnType, DynamicRuntimeType)) {
          _foreign_helper.JS('', '#[#] = #', result, _foreign_helper.JS_FUNCTION_TYPE_RETURN_TYPE_TAG(), this.returnType.toRti());
        }
      }
      if (dart.notNull(this.parameterTypes !== null) && dart.notNull(!dart.notNull(this.parameterTypes.isEmpty))) {
        _foreign_helper.JS('', '#[#] = #', result, _foreign_helper.JS_FUNCTION_TYPE_REQUIRED_PARAMETERS_TAG(), listToRti(this.parameterTypes));
      }
      if (dart.notNull(this.optionalParameterTypes !== null) && dart.notNull(!dart.notNull(this.optionalParameterTypes.isEmpty))) {
        _foreign_helper.JS('', '#[#] = #', result, _foreign_helper.JS_FUNCTION_TYPE_OPTIONAL_PARAMETERS_TAG(), listToRti(this.optionalParameterTypes));
      }
      if (this.namedParameters !== null) {
        let namedRti = _foreign_helper.JS('=Object', 'Object.create(null)');
        let keys = _js_names.extractKeys(this.namedParameters);
        for (let i = 0; i < keys.length; i++) {
          let name = keys.get(i);
          let rti = dart.dinvoke(_foreign_helper.JS('', '#[#]', this.namedParameters, name), 'toRti');
          _foreign_helper.JS('', '#[#] = #', namedRti, name, rti);
        }
        _foreign_helper.JS('', '#[#] = #', result, _foreign_helper.JS_FUNCTION_TYPE_NAMED_PARAMETERS_TAG(), namedRti);
      }
      return result;
    }
    static listToRti(list) {
      list = _foreign_helper.JS('JSFixedArray', '#', list);
      let result = _foreign_helper.JS('JSExtendableArray', '[]');
      for (let i = 0; i['<'](dart.dload(list, 'length')); i++) {
        _foreign_helper.JS('', '#.push(#)', result, dart.dinvoke(dart.dindex(list, i), 'toRti'));
      }
      return result;
    }
    toString() {
      let result = '(';
      let needsComma = false;
      if (this.parameterTypes !== null) {
        for (let i = 0; i < this.parameterTypes.length; i++) {
          let type = this.parameterTypes.get(i);
          if (needsComma)
            result = ', ';
          result = `${type}`;
          needsComma = true;
        }
      }
      if (dart.notNull(this.optionalParameterTypes !== null) && dart.notNull(!dart.notNull(this.optionalParameterTypes.isEmpty))) {
        if (needsComma)
          result = ', ';
        needsComma = false;
        result = '[';
        for (let i = 0; i < this.optionalParameterTypes.length; i++) {
          let type = this.optionalParameterTypes.get(i);
          if (needsComma)
            result = ', ';
          result = `${type}`;
          needsComma = true;
        }
        result = ']';
      } else if (this.namedParameters !== null) {
        if (needsComma)
          result = ', ';
        needsComma = false;
        result = '{';
        let keys = _js_names.extractKeys(this.namedParameters);
        for (let i = 0; i < keys.length; i++) {
          let name = keys.get(i);
          if (needsComma)
            result = ', ';
          let rti = dart.dinvoke(_foreign_helper.JS('', '#[#]', this.namedParameters, name), 'toRti');
          result = `${rti} ${_foreign_helper.JS("String", "#", name)}`;
          needsComma = true;
        }
        result = '}';
      }
      result = `) -> ${this.returnType}`;
      return result;
    }
  }
  RuntimeFunctionType.inAssert = false;
  // Function buildFunctionType: (dynamic, dynamic, dynamic) → RuntimeFunctionType
  function buildFunctionType(returnType, parameterTypes, optionalParameterTypes) {
    return new RuntimeFunctionType(dart.as(returnType, RuntimeType), dart.as(parameterTypes, core.List$(RuntimeType)), dart.as(optionalParameterTypes, core.List$(RuntimeType)), null);
  }
  // Function buildNamedFunctionType: (dynamic, dynamic, dynamic) → RuntimeFunctionType
  function buildNamedFunctionType(returnType, parameterTypes, namedParameters) {
    return new RuntimeFunctionType(dart.as(returnType, RuntimeType), dart.as(parameterTypes, core.List$(RuntimeType)), null, namedParameters);
  }
  // Function buildInterfaceType: (dynamic, dynamic) → RuntimeType
  function buildInterfaceType(rti, typeArguments) {
    let name = dart.as(_foreign_helper.JS('String|Null', '#.name', rti), core.String);
    if (core.bool['||'](typeArguments === null, dart.dload(typeArguments, 'isEmpty'))) {
      return new RuntimeTypePlain(name);
    }
    return new RuntimeTypeGeneric(name, dart.as(typeArguments, core.List$(RuntimeType)), null);
  }
  class DynamicRuntimeType extends RuntimeType {
    DynamicRuntimeType() {
      super.RuntimeType();
    }
    toString() {
      return 'dynamic';
    }
    toRti() {
      return null;
    }
  }
  // Function getDynamicRuntimeType: () → RuntimeType
  function getDynamicRuntimeType() {
    return new DynamicRuntimeType();
  }
  class VoidRuntimeType extends RuntimeType {
    VoidRuntimeType() {
      super.RuntimeType();
    }
    toString() {
      return 'void';
    }
    toRti() {
      return dart.throw_('internal error');
    }
  }
  // Function getVoidRuntimeType: () → RuntimeType
  function getVoidRuntimeType() {
    return new VoidRuntimeType();
  }
  // Function functionTypeTestMetaHelper: () → dynamic
  function functionTypeTestMetaHelper() {
    let dyn = _foreign_helper.JS('', 'x');
    let dyn2 = _foreign_helper.JS('', 'x');
    let fixedListOrNull = dart.as(_foreign_helper.JS('JSFixedArray|Null', 'x'), core.List);
    let fixedListOrNull2 = dart.as(_foreign_helper.JS('JSFixedArray|Null', 'x'), core.List);
    let fixedList = dart.as(_foreign_helper.JS('JSFixedArray', 'x'), core.List);
    let jsObject = _foreign_helper.JS('=Object', 'x');
    buildFunctionType(dyn, fixedListOrNull, fixedListOrNull2);
    buildNamedFunctionType(dyn, fixedList, jsObject);
    buildInterfaceType(dyn, fixedListOrNull);
    getDynamicRuntimeType();
    getVoidRuntimeType();
    convertRtiToRuntimeType(dyn);
    dart.dinvoke(dyn, '_isTest', dyn2);
    dart.dinvoke(dyn, '_asCheck', dyn2);
    dart.dinvoke(dyn, '_assertCheck', dyn2);
  }
  // Function convertRtiToRuntimeType: (dynamic) → RuntimeType
  function convertRtiToRuntimeType(rti) {
    if (rti === null) {
      return getDynamicRuntimeType();
    } else if (_foreign_helper.JS('bool', 'typeof # == "function"', rti)) {
      return new RuntimeTypePlain(dart.as(_foreign_helper.JS('String', 'rti.name'), core.String));
    } else if (_foreign_helper.JS('bool', '#.constructor == Array', rti)) {
      let list = dart.as(_foreign_helper.JS('JSFixedArray', '#', rti), core.List);
      let name = dart.as(_foreign_helper.JS('String', '#.name', list.get(0)), core.String);
      let arguments = new List.from([]);
      for (let i = 1; i < list.length; i++) {
        arguments.add(convertRtiToRuntimeType(list.get(i)));
      }
      return new RuntimeTypeGeneric(name, dart.as(arguments, core.List$(RuntimeType)), rti);
    } else if (_foreign_helper.JS('bool', '"func" in #', rti)) {
      return new FunctionTypeInfoDecoderRing(rti).toRuntimeType();
    } else {
      throw new RuntimeError("Cannot convert " + `'${_foreign_helper.JS('String', 'JSON.stringify(#)', rti)}' to RuntimeType.`);
    }
  }
  class RuntimeTypePlain extends RuntimeType {
    RuntimeTypePlain(name) {
      this.name = name;
      super.RuntimeType();
    }
    toRti() {
      let allClasses = _foreign_helper.JS_EMBEDDED_GLOBAL('', dart.as(_js_embedded_names.ALL_CLASSES, core.String));
      let rti = _foreign_helper.JS('', '#[#]', allClasses, this.name);
      if (rti === null)
        throw `no type for '${this.name}'`;
      return rti;
    }
    toString() {
      return this.name;
    }
  }
  class RuntimeTypeGeneric extends RuntimeType {
    RuntimeTypeGeneric(name, arguments, rti) {
      this.name = name;
      this.arguments = arguments;
      this.rti = rti;
      super.RuntimeType();
    }
    toRti() {
      if (this.rti !== null)
        return this.rti;
      let allClasses = _foreign_helper.JS_EMBEDDED_GLOBAL('', dart.as(_js_embedded_names.ALL_CLASSES, core.String));
      let result = _foreign_helper.JS('JSExtendableArray', '[#[#]]', allClasses, this.name);
      if (dart.dindex(result, 0) === null) {
        throw `no type for '${this.name}<...>'`;
      }
      for (let argument of this.arguments) {
        _foreign_helper.JS('', '#.push(#)', result, argument.toRti());
      }
      return this.rti = result;
    }
    toString() {
      return `${this.name}<${this.arguments.join(", ")}>`;
    }
  }
  class FunctionTypeInfoDecoderRing extends dart.Object {
    FunctionTypeInfoDecoderRing(_typeData) {
      this._typeData = _typeData;
      this._cachedToString = null;
    }
    get _hasReturnType() {
      return dart.as(_foreign_helper.JS('bool', '"ret" in #', this._typeData), core.bool);
    }
    get _returnType() {
      return _foreign_helper.JS('', '#.ret', this._typeData);
    }
    get _isVoid() {
      return dart.as(_foreign_helper.JS('bool', '!!#.void', this._typeData), core.bool);
    }
    get _hasArguments() {
      return dart.as(_foreign_helper.JS('bool', '"args" in #', this._typeData), core.bool);
    }
    get _arguments() {
      return dart.as(_foreign_helper.JS('JSExtendableArray', '#.args', this._typeData), core.List);
    }
    get _hasOptionalArguments() {
      return dart.as(_foreign_helper.JS('bool', '"opt" in #', this._typeData), core.bool);
    }
    get _optionalArguments() {
      return dart.as(_foreign_helper.JS('JSExtendableArray', '#.opt', this._typeData), core.List);
    }
    get _hasNamedArguments() {
      return dart.as(_foreign_helper.JS('bool', '"named" in #', this._typeData), core.bool);
    }
    get _namedArguments() {
      return _foreign_helper.JS('=Object', '#.named', this._typeData);
    }
    toRuntimeType() {
      return new DynamicRuntimeType();
    }
    _convert(type) {
      let result = runtimeTypeToString(type);
      if (result !== null)
        return result;
      if (_foreign_helper.JS('bool', '"func" in #', type)) {
        return new FunctionTypeInfoDecoderRing(type).toString();
      } else {
        throw 'bad type';
      }
    }
    toString() {
      if (this._cachedToString !== null)
        return this._cachedToString;
      let s = "(";
      let sep = '';
      if (this._hasArguments) {
        for (let argument of this._arguments) {
          s = sep;
          s = this._convert(argument);
          sep = ', ';
        }
      }
      if (this._hasOptionalArguments) {
        s = `${sep}[`;
        sep = '';
        for (let argument of this._optionalArguments) {
          s = sep;
          s = this._convert(argument);
          sep = ', ';
        }
        s = ']';
      }
      if (this._hasNamedArguments) {
        s = `${sep}{`;
        sep = '';
        for (let name of _js_names.extractKeys(this._namedArguments)) {
          s = sep;
          s = `${name}: `;
          s = this._convert(_foreign_helper.JS('', '#[#]', this._namedArguments, name));
          sep = ', ';
        }
        s = '}';
      }
      s = ') -> ';
      if (this._isVoid) {
        s = 'void';
      } else if (this._hasReturnType) {
        s = this._convert(this._returnType);
      } else {
        s = 'dynamic';
      }
      return this._cachedToString = `${s}`;
    }
  }
  class UnimplementedNoSuchMethodError extends core.Error {
    UnimplementedNoSuchMethodError(_message) {
      this._message = _message;
      super.Error();
    }
    toString() {
      return `Unsupported operation: ${this._message}`;
    }
  }
  // Function random64: () → int
  function random64() {
    let int32a = dart.as(_foreign_helper.JS("int", "(Math.random() * 0x100000000) >>> 0"), core.int);
    let int32b = dart.as(_foreign_helper.JS("int", "(Math.random() * 0x100000000) >>> 0"), core.int);
    return int32a + int32b * 4294967296;
  }
  // Function jsonEncodeNative: (String) → String
  function jsonEncodeNative(string) {
    return dart.as(_foreign_helper.JS("String", "JSON.stringify(#)", string), core.String);
  }
  // Function getIsolateAffinityTag: (String) → String
  function getIsolateAffinityTag(name) {
    let isolateTagGetter = _foreign_helper.JS_EMBEDDED_GLOBAL('', dart.as(_js_embedded_names.GET_ISOLATE_TAG, core.String));
    return dart.as(_foreign_helper.JS('String', '#(#)', isolateTagGetter, name), core.String);
  }
  // Function _loadLibraryWrapper: (String) → () → Future<Null>
  function _loadLibraryWrapper(loadId) {
    return () => loadDeferredLibrary(loadId);
  }
  dart.defineLazyProperties(_js_helper, {
    get _loadingLibraries() {
      return dart.map();
    },
    get _loadedLibraries() {
      return new core.Set();
    }
  });
  _js_helper.deferredLoadHook = null;
  // Function loadDeferredLibrary: (String) → Future<Null>
  function loadDeferredLibrary(loadId) {
    let urisMap = _foreign_helper.JS_EMBEDDED_GLOBAL('', dart.as(_js_embedded_names.DEFERRED_LIBRARY_URIS, core.String));
    let uris = dart.as(_foreign_helper.JS('JSExtendableArray|Null', '#[#]', urisMap, loadId), core.List$(core.String));
    let hashesMap = _foreign_helper.JS_EMBEDDED_GLOBAL('', dart.as(_js_embedded_names.DEFERRED_LIBRARY_HASHES, core.String));
    let hashes = dart.as(_foreign_helper.JS('JSExtendableArray|Null', '#[#]', hashesMap, loadId), core.List$(core.String));
    if (uris === null)
      return dart.as(new async.Future.value(null), async.Future$(core.Null));
    let indices = dart.as(new core.List.generate(uris.length, (i) => i), core.List$(core.int));
    let isHunkLoaded = _foreign_helper.JS_EMBEDDED_GLOBAL('', dart.as(_js_embedded_names.IS_HUNK_LOADED, core.String));
    let isHunkInitialized = _foreign_helper.JS_EMBEDDED_GLOBAL('', dart.as(_js_embedded_names.IS_HUNK_INITIALIZED, core.String));
    let indicesToLoad = indices.where((i) => dart.throw_("Unimplemented PrefixExpression: !JS('bool', '#(#)', isHunkLoaded, hashes[i])")).toList();
    return dart.as(async.Future.wait(dart.as(indicesToLoad.map((i) => _loadHunk(uris.get(i))), core.Iterable$(async.Future))).then((_) => {
      let indicesToInitialize = indices.where((i) => dart.throw_("Unimplemented PrefixExpression: !JS('bool', '#(#)', isHunkInitialized, hashes[i])")).toList();
      for (let i of indicesToInitialize) {
        let initializer = _foreign_helper.JS_EMBEDDED_GLOBAL('', dart.as(_js_embedded_names.INITIALIZE_LOADED_HUNK, core.String));
        _foreign_helper.JS('void', '#(#)', initializer, hashes.get(i));
      }
      let updated = _js_helper._loadedLibraries.add(loadId);
      if (dart.notNull(updated) && dart.notNull(_js_helper.deferredLoadHook !== null)) {
        _js_helper.deferredLoadHook();
      }
    }), async.Future$(core.Null));
  }
  // Function _loadHunk: (String) → Future<Null>
  function _loadHunk(hunkName) {
    let future = _js_helper._loadingLibraries.get(hunkName);
    if (future !== null) {
      return dart.as(future.then((_) => null), async.Future$(core.Null));
    }
    let uri = _isolate_helper.IsolateNatives.thisScript;
    let index = uri.lastIndexOf('/');
    uri = `${uri.substring(0, index + 1)}${hunkName}`;
    if (dart.notNull(Primitives.isJsshell) || dart.notNull(Primitives.isD8)) {
      return _js_helper._loadingLibraries.set(hunkName, new async.Future(() => {
        try {
          _foreign_helper.JS('void', '(new Function(#))()', `load("${uri}")`);
        } catch (error) {
          let stackTrace = dart.stackTrace(error);
          throw new async.DeferredLoadException(`Loading ${uri} failed.`);
        }

        return null;
      }));
    } else if (_isolate_helper.isWorker()) {
      return _js_helper._loadingLibraries.set(hunkName, new async.Future(() => {
        let completer = new async.Completer();
        _isolate_helper.enterJsAsync();
        let leavingFuture = dart.as(completer.future.whenComplete(() => {
          _isolate_helper.leaveJsAsync();
        }), async.Future$(core.Null));
        let index = uri.lastIndexOf('/');
        uri = `${uri.substring(0, index + 1)}${hunkName}`;
        let xhr = _foreign_helper.JS('dynamic', 'new XMLHttpRequest()');
        _foreign_helper.JS('void', '#.open("GET", #)', xhr, uri);
        _foreign_helper.JS('void', '#.addEventListener("load", #, false)', xhr, convertDartClosureToJS((event) => {
          if (!dart.equals(_foreign_helper.JS('int', '#.status', xhr), 200)) {
            completer.completeError(new async.DeferredLoadException(`Loading ${uri} failed.`));
            return;
          }
          let code = dart.as(_foreign_helper.JS('String', '#.responseText', xhr), core.String);
          try {
            _foreign_helper.JS('void', '(new Function(#))()', code);
          } catch (error) {
            let stackTrace = dart.stackTrace(error);
            completer.completeError(new async.DeferredLoadException(`Evaluating ${uri} failed.`));
            return;
          }

          completer.complete(null);
        }, 1));
        let fail = convertDartClosureToJS((event) => {
          new async.DeferredLoadException(`Loading ${uri} failed.`);
        }, 1);
        _foreign_helper.JS('void', '#.addEventListener("error", #, false)', xhr, fail);
        _foreign_helper.JS('void', '#.addEventListener("abort", #, false)', xhr, fail);
        _foreign_helper.JS('void', '#.send()', xhr);
        return leavingFuture;
      }));
    }
    return _js_helper._loadingLibraries.set(hunkName, new async.Future(() => {
      let completer = new async.Completer();
      let script = _foreign_helper.JS('', 'document.createElement("script")');
      _foreign_helper.JS('', '#.type = "text/javascript"', script);
      _foreign_helper.JS('', '#.src = #', script, uri);
      _foreign_helper.JS('', '#.addEventListener("load", #, false)', script, convertDartClosureToJS((event) => {
        completer.complete(null);
      }, 1));
      _foreign_helper.JS('', '#.addEventListener("error", #, false)', script, convertDartClosureToJS((event) => {
        completer.completeError(new async.DeferredLoadException(`Loading ${uri} failed.`));
      }, 1));
      _foreign_helper.JS('', 'document.body.appendChild(#)', script);
      return completer.future;
    }));
  }
  class MainError extends core.Error {
    MainError(_message) {
      this._message = _message;
      super.Error();
    }
    toString() {
      return `NoSuchMethodError: ${this._message}`;
    }
  }
  // Function missingMain: () → void
  function missingMain() {
    throw new MainError("No top-level function named 'main'.");
  }
  // Function badMain: () → void
  function badMain() {
    throw new MainError("'main' is not a function.");
  }
  // Function mainHasTooManyParameters: () → void
  function mainHasTooManyParameters() {
    throw new MainError("'main' expects too many parameters.");
  }
  class NoSideEffects extends dart.Object {
    NoSideEffects() {
    }
  }
  class NoThrows extends dart.Object {
    NoThrows() {
    }
  }
  class NoInline extends dart.Object {
    NoInline() {
    }
  }
  class IrRepresentation extends dart.Object {
    IrRepresentation(value) {
      this.value = value;
    }
  }
  class Native extends dart.Object {
    Native(name) {
      this.name = name;
    }
  }
  let ConstantMap$ = dart.generic(function(K, V) {
    class ConstantMap extends dart.Object {
      ConstantMap$_() {
      }
      get isEmpty() {
        return this.length === 0;
      }
      get isNotEmpty() {
        return !dart.notNull(this.isEmpty);
      }
      toString() {
        return collection.Maps.mapToString(this);
      }
      _throwUnmodifiable() {
        throw new core.UnsupportedError("Cannot modify unmodifiable Map");
      }
      set(key, val) {
        return this._throwUnmodifiable();
      }
      putIfAbsent(key, ifAbsent) {
        return dart.as(this._throwUnmodifiable(), V);
      }
      remove(key) {
        return dart.as(this._throwUnmodifiable(), V);
      }
      clear() {
        return this._throwUnmodifiable();
      }
      addAll(other) {
        return this._throwUnmodifiable();
      }
    }
    dart.defineNamedConstructor(ConstantMap, '_');
    return ConstantMap;
  });
  let ConstantMap = ConstantMap$(dynamic, dynamic);
  let ConstantStringMap$ = dart.generic(function(K, V) {
    class ConstantStringMap extends ConstantMap$(K, V) {
      ConstantStringMap$_(length, _jsObject, _keys) {
        this.length = length;
        this._jsObject = _jsObject;
        this._keys = _keys;
        super.ConstantMap$_();
      }
      containsValue(needle) {
        return this.values.any((value) => dart.equals(value, needle));
      }
      containsKey(key) {
        if (!(typeof key == string))
          return false;
        if (dart.equals('__proto__', key))
          return false;
        return jsHasOwnProperty(this._jsObject, dart.as(key, core.String));
      }
      get(key) {
        if (!dart.notNull(this.containsKey(key)))
          return dart.as(null, V);
        return dart.as(this._fetch(key), V);
      }
      _fetch(key) {
        return jsPropertyAccess(this._jsObject, dart.as(key, core.String));
      }
      forEach(f) {
        let keys = _foreign_helper.JS('JSArray', '#', this._keys);
        for (let i = 0; i['<'](dart.dload(keys, 'length')); i++) {
          let key = dart.dindex(keys, i);
          f(dart.as(key, K), dart.as(this._fetch(key), V));
        }
      }
      get keys() {
        return new _ConstantMapKeyIterable(this);
      }
      get values() {
        return new _internal.MappedIterable(this._keys, dart.as(((key) => this._fetch(key)).bind(this), dart.throw_("Unimplemented type (K) → V")));
      }
    }
    dart.defineNamedConstructor(ConstantStringMap, '_');
    return ConstantStringMap;
  });
  let ConstantStringMap = ConstantStringMap$(dynamic, dynamic);
  let ConstantProtoMap$ = dart.generic(function(K, V) {
    class ConstantProtoMap extends ConstantStringMap$(K, V) {
      ConstantProtoMap$_(length, jsObject, keys, _protoValue) {
        this._protoValue = _protoValue;
        super.ConstantStringMap$_(dart.as(length, core.int), jsObject, dart.as(keys, core.List$(K)));
      }
      containsKey(key) {
        if (!(typeof key == string))
          return false;
        if (dart.equals('__proto__', key))
          return true;
        return jsHasOwnProperty(this._jsObject, dart.as(key, core.String));
      }
      _fetch(key) {
        return dart.equals('__proto__', key) ? this._protoValue : jsPropertyAccess(this._jsObject, dart.as(key, core.String));
      }
    }
    dart.defineNamedConstructor(ConstantProtoMap, '_');
    return ConstantProtoMap;
  });
  let ConstantProtoMap = ConstantProtoMap$(dynamic, dynamic);
  let _ConstantMapKeyIterable$ = dart.generic(function(K) {
    class _ConstantMapKeyIterable extends collection.IterableBase$(K) {
      _ConstantMapKeyIterable(_map) {
        this._map = _map;
        super.IterableBase();
      }
      get iterator() {
        return this._map._keys.iterator;
      }
      get length() {
        return this._map._keys.length;
      }
    }
    return _ConstantMapKeyIterable;
  });
  let _ConstantMapKeyIterable = _ConstantMapKeyIterable$(dynamic);
  let GeneralConstantMap$ = dart.generic(function(K, V) {
    class GeneralConstantMap extends ConstantMap$(K, V) {
      GeneralConstantMap(_jsData) {
        this._jsData = _jsData;
        super.ConstantMap$_();
      }
      _getMap() {
        if (_foreign_helper.JS('bool', '!this.$map')) {
          let backingMap = new collection.LinkedHashMap();
          _foreign_helper.JS('', 'this.$map = #', fillLiteralMap(this._jsData, backingMap));
        }
        return dart.as(_foreign_helper.JS('Map', 'this.$map'), core.Map$(K, V));
      }
      containsValue(needle) {
        return this._getMap().containsValue(needle);
      }
      containsKey(key) {
        return this._getMap().containsKey(key);
      }
      get(key) {
        return this._getMap().get(key);
      }
      forEach(f) {
        this._getMap().forEach(f);
      }
      get keys() {
        return this._getMap().keys;
      }
      get values() {
        return this._getMap().values;
      }
      get length() {
        return this._getMap().length;
      }
    }
    return GeneralConstantMap;
  });
  let GeneralConstantMap = GeneralConstantMap$(dynamic, dynamic);
  // Function contains: (String, String) → bool
  function contains(userAgent, name) {
    return !dart.equals(_foreign_helper.JS('int', '#.indexOf(#)', userAgent, name), -1);
  }
  // Function arrayLength: (List<dynamic>) → int
  function arrayLength(array) {
    return dart.as(_foreign_helper.JS('int', '#.length', array), core.int);
  }
  // Function arrayGet: (List<dynamic>, int) → dynamic
  function arrayGet(array, index) {
    return _foreign_helper.JS('var', '#[#]', array, index);
  }
  // Function arraySet: (List<dynamic>, int, dynamic) → void
  function arraySet(array, index, value) {
    _foreign_helper.JS('var', '#[#] = #', array, index, value);
  }
  // Function propertyGet: (dynamic, String) → dynamic
  function propertyGet(object, property) {
    return _foreign_helper.JS('var', '#[#]', object, property);
  }
  // Function callHasOwnProperty: (dynamic, dynamic, String) → bool
  function callHasOwnProperty(function, object, property) {
    return dart.as(_foreign_helper.JS('bool', '#.call(#, #)', function, object, property), core.bool);
  }
  // Function propertySet: (dynamic, String, dynamic) → void
  function propertySet(object, property, value) {
    _foreign_helper.JS('var', '#[#] = #', object, property, value);
  }
  // Function getPropertyFromPrototype: (dynamic, String) → dynamic
  function getPropertyFromPrototype(object, name) {
    return _foreign_helper.JS('var', 'Object.getPrototypeOf(#)[#]', object, name);
  }
  _js_helper.getTagFunction = null;
  _js_helper.alternateTagFunction = null;
  _js_helper.prototypeForTagFunction = null;
  // Function toStringForNativeObject: (dynamic) → String
  function toStringForNativeObject(obj) {
    let name = dart.as(_js_helper.getTagFunction === null ? '<Unknown>' : _foreign_helper.JS('String', '#', dart.dinvokef(_js_helper.getTagFunction, obj)), core.String);
    return `Instance of ${name}`;
  }
  // Function hashCodeForNativeObject: (dynamic) → int
  function hashCodeForNativeObject(object) {
    return Primitives.objectHashCode(object);
  }
  // Function defineProperty: (dynamic, String, dynamic) → void
  function defineProperty(obj, property, value) {
    _foreign_helper.JS('void', 'Object.defineProperty(#, #, ' + '{value: #, enumerable: false, writable: true, configurable: true})', obj, property, value);
  }
  // Function isDartObject: (dynamic) → bool
  function isDartObject(obj) {
    return dart.as(_foreign_helper.JS('bool', '((#) instanceof (#))', obj, _foreign_helper.JS_DART_OBJECT_CONSTRUCTOR()), core.bool);
  }
  dart.copyProperties(_js_helper, {
    get interceptorsByTag() {
      return _foreign_helper.JS_EMBEDDED_GLOBAL('=Object', dart.as(_js_embedded_names.INTERCEPTORS_BY_TAG, core.String));
    },
    get leafTags() {
      return _foreign_helper.JS_EMBEDDED_GLOBAL('=Object', dart.as(_js_embedded_names.LEAF_TAGS, core.String));
    }
  });
  // Function findDispatchTagForInterceptorClass: (dynamic) → String
  function findDispatchTagForInterceptorClass(interceptorClassConstructor) {
    return dart.as(_foreign_helper.JS('', '#.#', interceptorClassConstructor, _js_embedded_names.NATIVE_SUPERCLASS_TAG_NAME), core.String);
  }
  _js_helper.dispatchRecordsForInstanceTags = null;
  _js_helper.interceptorsForUncacheableTags = null;
  // Function lookupInterceptor: (String) → dynamic
  function lookupInterceptor(tag) {
    return propertyGet(_js_helper.interceptorsByTag, tag);
  }
  let UNCACHED_MARK = '~';
  let INSTANCE_CACHED_MARK = '!';
  let LEAF_MARK = '-';
  let INTERIOR_MARK = '+';
  let DISCRIMINATED_MARK = '*';
  // Function lookupAndCacheInterceptor: (dynamic) → dynamic
  function lookupAndCacheInterceptor(obj) {
    dart.assert(!dart.notNull(isDartObject(obj)));
    let tag = dart.as(dart.dinvokef(_js_helper.getTagFunction, obj), core.String);
    let record = propertyGet(_js_helper.dispatchRecordsForInstanceTags, tag);
    if (record !== null)
      return patchInstance(obj, record);
    let interceptor = propertyGet(_js_helper.interceptorsForUncacheableTags, tag);
    if (interceptor !== null)
      return interceptor;
    let interceptorClass = lookupInterceptor(tag);
    if (interceptorClass === null) {
      tag = dart.as(dart.dinvokef(_js_helper.alternateTagFunction, obj, tag), core.String);
      if (tag !== null) {
        record = propertyGet(_js_helper.dispatchRecordsForInstanceTags, tag);
        if (record !== null)
          return patchInstance(obj, record);
        interceptor = propertyGet(_js_helper.interceptorsForUncacheableTags, tag);
        if (interceptor !== null)
          return interceptor;
        interceptorClass = lookupInterceptor(tag);
      }
    }
    if (interceptorClass === null) {
      return null;
    }
    interceptor = _foreign_helper.JS('', '#.prototype', interceptorClass);
    let mark = _foreign_helper.JS('String|Null', '#[0]', tag);
    if (dart.equals(mark, INSTANCE_CACHED_MARK)) {
      record = makeLeafDispatchRecord(interceptor);
      propertySet(_js_helper.dispatchRecordsForInstanceTags, tag, record);
      return patchInstance(obj, record);
    }
    if (dart.equals(mark, UNCACHED_MARK)) {
      propertySet(_js_helper.interceptorsForUncacheableTags, tag, interceptor);
      return interceptor;
    }
    if (dart.equals(mark, LEAF_MARK)) {
      return patchProto(obj, makeLeafDispatchRecord(interceptor));
    }
    if (dart.equals(mark, INTERIOR_MARK)) {
      return patchInteriorProto(obj, interceptor);
    }
    if (dart.equals(mark, DISCRIMINATED_MARK)) {
      throw new core.UnimplementedError(tag);
    }
    let isLeaf = _foreign_helper.JS('bool', '(#[#]) === true', _js_helper.leafTags, tag);
    if (isLeaf) {
      return patchProto(obj, makeLeafDispatchRecord(interceptor));
    } else {
      return patchInteriorProto(obj, interceptor);
    }
  }
  // Function patchInstance: (dynamic, dynamic) → dynamic
  function patchInstance(obj, record) {
    _interceptors.setDispatchProperty(obj, record);
    return _interceptors.dispatchRecordInterceptor(record);
  }
  // Function patchProto: (dynamic, dynamic) → dynamic
  function patchProto(obj, record) {
    _interceptors.setDispatchProperty(_foreign_helper.JS('', 'Object.getPrototypeOf(#)', obj), record);
    return _interceptors.dispatchRecordInterceptor(record);
  }
  // Function patchInteriorProto: (dynamic, dynamic) → dynamic
  function patchInteriorProto(obj, interceptor) {
    let proto = _foreign_helper.JS('', 'Object.getPrototypeOf(#)', obj);
    let record = _interceptors.makeDispatchRecord(interceptor, proto, null, null);
    _interceptors.setDispatchProperty(proto, record);
    return interceptor;
  }
  // Function makeLeafDispatchRecord: (dynamic) → dynamic
  function makeLeafDispatchRecord(interceptor) {
    let fieldName = _foreign_helper.JS_IS_INDEXABLE_FIELD_NAME();
    let indexability = dart.as(_foreign_helper.JS('bool', '!!#[#]', interceptor, fieldName), core.bool);
    return _interceptors.makeDispatchRecord(interceptor, false, null, indexability);
  }
  // Function makeDefaultDispatchRecord: (dynamic, dynamic, dynamic) → dynamic
  function makeDefaultDispatchRecord(tag, interceptorClass, proto) {
    let interceptor = _foreign_helper.JS('', '#.prototype', interceptorClass);
    let isLeaf = _foreign_helper.JS('bool', '(#[#]) === true', _js_helper.leafTags, tag);
    if (isLeaf) {
      return makeLeafDispatchRecord(interceptor);
    } else {
      return _interceptors.makeDispatchRecord(interceptor, proto, null, null);
    }
  }
  // Function setNativeSubclassDispatchRecord: (dynamic, dynamic) → dynamic
  function setNativeSubclassDispatchRecord(proto, interceptor) {
    _interceptors.setDispatchProperty(proto, makeLeafDispatchRecord(interceptor));
  }
  // Function constructorNameFallback: (dynamic) → String
  function constructorNameFallback(object) {
    return dart.as(_foreign_helper.JS('String', '#(#)', _constructorNameFallback, object), core.String);
  }
  _js_helper.initNativeDispatchFlag = null;
  // Function initNativeDispatch: () → void
  function initNativeDispatch() {
    if (true === _js_helper.initNativeDispatchFlag)
      return;
    _js_helper.initNativeDispatchFlag = true;
    initNativeDispatchContinue();
  }
  // Function initNativeDispatchContinue: () → void
  function initNativeDispatchContinue() {
    _js_helper.dispatchRecordsForInstanceTags = _foreign_helper.JS('', 'Object.create(null)');
    _js_helper.interceptorsForUncacheableTags = _foreign_helper.JS('', 'Object.create(null)');
    initHooks();
    let map = _js_helper.interceptorsByTag;
    let tags = _foreign_helper.JS('JSMutableArray', 'Object.getOwnPropertyNames(#)', map);
    if (_foreign_helper.JS('bool', 'typeof window != "undefined"')) {
      let context = _foreign_helper.JS('=Object', 'window');
      let fun = _foreign_helper.JS('=Object', 'function () {}');
      for (let i = 0; i['<'](dart.dload(tags, 'length')); i++) {
        let tag = dart.dindex(tags, i);
        let proto = dart.dinvokef(_js_helper.prototypeForTagFunction, tag);
        if (proto !== null) {
          let interceptorClass = _foreign_helper.JS('', '#[#]', map, tag);
          let record = makeDefaultDispatchRecord(tag, interceptorClass, proto);
          if (record !== null) {
            _interceptors.setDispatchProperty(proto, record);
            _foreign_helper.JS('', '#.prototype = #', fun, proto);
          }
        }
      }
    }
    for (let i = 0; i['<'](dart.dload(tags, 'length')); i++) {
      let tag = _foreign_helper.JS('String', '#[#]', tags, i);
      if (_foreign_helper.JS('bool', '/^[A-Za-z_]/.test(#)', tag)) {
        let interceptorClass = propertyGet(map, dart.as(tag, core.String));
        propertySet(map, dart.as(dart.dbinary(INSTANCE_CACHED_MARK, '+', tag), core.String), interceptorClass);
        propertySet(map, dart.as(dart.dbinary(UNCACHED_MARK, '+', tag), core.String), interceptorClass);
        propertySet(map, dart.as(dart.dbinary(LEAF_MARK, '+', tag), core.String), interceptorClass);
        propertySet(map, dart.as(dart.dbinary(INTERIOR_MARK, '+', tag), core.String), interceptorClass);
        propertySet(map, dart.as(dart.dbinary(DISCRIMINATED_MARK, '+', tag), core.String), interceptorClass);
      }
    }
  }
  // Function initHooks: () → void
  function initHooks() {
    let hooks = _foreign_helper.JS('', '#()', _baseHooks);
    let _fallbackConstructorHooksTransformer = _foreign_helper.JS('', '#(#)', _fallbackConstructorHooksTransformerGenerator, _constructorNameFallback);
    hooks = applyHooksTransformer(_fallbackConstructorHooksTransformer, hooks);
    hooks = applyHooksTransformer(_firefoxHooksTransformer, hooks);
    hooks = applyHooksTransformer(_ieHooksTransformer, hooks);
    hooks = applyHooksTransformer(_operaHooksTransformer, hooks);
    hooks = applyHooksTransformer(_safariHooksTransformer, hooks);
    hooks = applyHooksTransformer(_fixDocumentHooksTransformer, hooks);
    hooks = applyHooksTransformer(_dartExperimentalFixupGetTagHooksTransformer, hooks);
    if (_foreign_helper.JS('bool', 'typeof dartNativeDispatchHooksTransformer != "undefined"')) {
      let transformers = _foreign_helper.JS('', 'dartNativeDispatchHooksTransformer');
      if (_foreign_helper.JS('bool', 'typeof # == "function"', transformers)) {
        transformers = new List.from([transformers]);
      }
      if (_foreign_helper.JS('bool', '#.constructor == Array', transformers)) {
        for (let i = 0; i['<'](_foreign_helper.JS('int', '#.length', transformers)); i++) {
          let transformer = _foreign_helper.JS('', '#[#]', transformers, i);
          if (_foreign_helper.JS('bool', 'typeof # == "function"', transformer)) {
            hooks = applyHooksTransformer(transformer, hooks);
          }
        }
      }
    }
    let getTag = _foreign_helper.JS('', '#.getTag', hooks);
    let getUnknownTag = _foreign_helper.JS('', '#.getUnknownTag', hooks);
    let prototypeForTag = _foreign_helper.JS('', '#.prototypeForTag', hooks);
    _js_helper.getTagFunction = (o) => _foreign_helper.JS('String|Null', '#(#)', getTag, o);
    _js_helper.alternateTagFunction = (o, tag) => _foreign_helper.JS('String|Null', '#(#, #)', getUnknownTag, o, tag);
    _js_helper.prototypeForTagFunction = (tag) => _foreign_helper.JS('', '#(#)', prototypeForTag, tag);
  }
  // Function applyHooksTransformer: (dynamic, dynamic) → dynamic
  function applyHooksTransformer(transformer, hooks) {
    let newHooks = _foreign_helper.JS('=Object|Null', '#(#)', transformer, hooks);
    return _foreign_helper.JS('', '# || #', newHooks, hooks);
  }
  let _baseHooks = new _foreign_helper.JS_CONST('\nfunction() {\n  function typeNameInChrome(o) {\n    var constructor = o.constructor;\n    if (constructor) {\n      var name = constructor.name;\n      if (name) return name;\n    }\n    var s = Object.prototype.toString.call(o);\n    return s.substring(8, s.length - 1);\n  }\n  function getUnknownTag(object, tag) {\n    // This code really belongs in [getUnknownTagGenericBrowser] but having it\n    // here allows [getUnknownTag] to be tested on d8.\n    if (/^HTML[A-Z].*Element$/.test(tag)) {\n      // Check that it is not a simple JavaScript object.\n      var name = Object.prototype.toString.call(object);\n      if (name == "[object Object]") return null;\n      return "HTMLElement";\n    }\n  }\n  function getUnknownTagGenericBrowser(object, tag) {\n    if (self.HTMLElement && object instanceof HTMLElement) return "HTMLElement";\n    return getUnknownTag(object, tag);\n  }\n  function prototypeForTag(tag) {\n    if (typeof window == "undefined") return null;\n    if (typeof window[tag] == "undefined") return null;\n    var constructor = window[tag];\n    if (typeof constructor != "function") return null;\n    return constructor.prototype;\n  }\n  function discriminator(tag) { return null; }\n\n  var isBrowser = typeof navigator == "object";\n\n  return {\n    getTag: typeNameInChrome,\n    getUnknownTag: isBrowser ? getUnknownTagGenericBrowser : getUnknownTag,\n    prototypeForTag: prototypeForTag,\n    discriminator: discriminator };\n}');
  let _constructorNameFallback = new _foreign_helper.JS_CONST('\nfunction getTagFallback(o) {\n  var constructor = o.constructor;\n  if (typeof constructor == "function") {\n    var name = constructor.name;\n    // If the name is a non-empty string, we use that as the type name of this\n    // object.  There are various cases where that does not work, so we have to\n    // detect them and fall through to the toString() based implementation.\n\n    if (typeof name == "string" &&\n\n        // Sometimes the string is empty.  This test also catches minified\n        // shadow dom polyfil wrapper for Window on Firefox where the faked\n        // constructor name does not \'stick\'.  The shortest real DOM object\n        // names have three characters (e.g. URL, CSS).\n        name.length > 2 &&\n\n        // On Firefox we often get "Object" as the constructor name, even for\n        // more specialized DOM objects.\n        name !== "Object" &&\n\n        // This can happen in Opera.\n        name !== "Function.prototype") {\n      return name;\n    }\n  }\n  var s = Object.prototype.toString.call(o);\n  return s.substring(8, s.length - 1);\n}');
  let _fallbackConstructorHooksTransformerGenerator = new _foreign_helper.JS_CONST('\nfunction(getTagFallback) {\n  return function(hooks) {\n    // If we are not in a browser, assume we are in d8.\n    // TODO(sra): Recognize jsshell.\n    if (typeof navigator != "object") return hooks;\n\n    var ua = navigator.userAgent;\n    // TODO(antonm): remove a reference to DumpRenderTree.\n    if (ua.indexOf("DumpRenderTree") >= 0) return hooks;\n    if (ua.indexOf("Chrome") >= 0) {\n      // Confirm constructor name is usable for dispatch.\n      function confirm(p) {\n        return typeof window == "object" && window[p] && window[p].name == p;\n      }\n      if (confirm("Window") && confirm("HTMLElement")) return hooks;\n    }\n\n    hooks.getTag = getTagFallback;\n  };\n}');
  let _ieHooksTransformer = new _foreign_helper.JS_CONST('\nfunction(hooks) {\n  var userAgent = typeof navigator == "object" ? navigator.userAgent : "";\n  if (userAgent.indexOf("Trident/") == -1) return hooks;\n\n  var getTag = hooks.getTag;\n\n  var quickMap = {\n    "BeforeUnloadEvent": "Event",\n    "DataTransfer": "Clipboard",\n    "HTMLDDElement": "HTMLElement",\n    "HTMLDTElement": "HTMLElement",\n    "HTMLPhraseElement": "HTMLElement",\n    "Position": "Geoposition"\n  };\n\n  function getTagIE(o) {\n    var tag = getTag(o);\n    var newTag = quickMap[tag];\n    if (newTag) return newTag;\n    // Patches for types which report themselves as Objects.\n    if (tag == "Object") {\n      if (window.DataView && (o instanceof window.DataView)) return "DataView";\n    }\n    return tag;\n  }\n\n  function prototypeForTagIE(tag) {\n    var constructor = window[tag];\n    if (constructor == null) return null;\n    return constructor.prototype;\n  }\n\n  hooks.getTag = getTagIE;\n  hooks.prototypeForTag = prototypeForTagIE;\n}');
  let _fixDocumentHooksTransformer = new _foreign_helper.JS_CONST('\nfunction(hooks) {\n  var getTag = hooks.getTag;\n  var prototypeForTag = hooks.prototypeForTag;\n  function getTagFixed(o) {\n    var tag = getTag(o);\n    if (tag == "Document") {\n      // Some browsers and the polymer polyfill call both HTML and XML documents\n      // "Document", so we check for the xmlVersion property, which is the empty\n      // string on HTML documents. Since both dart:html classes Document and\n      // HtmlDocument share the same type, we must patch the instances and not\n      // the prototype.\n      if (!!o.xmlVersion) return "!Document";\n      return "!HTMLDocument";\n    }\n    return tag;\n  }\n\n  function prototypeForTagFixed(tag) {\n    if (tag == "Document") return null;  // Do not pre-patch Document.\n    return prototypeForTag(tag);\n  }\n\n  hooks.getTag = getTagFixed;\n  hooks.prototypeForTag = prototypeForTagFixed;\n}');
  let _firefoxHooksTransformer = new _foreign_helper.JS_CONST('\nfunction(hooks) {\n  var userAgent = typeof navigator == "object" ? navigator.userAgent : "";\n  if (userAgent.indexOf("Firefox") == -1) return hooks;\n\n  var getTag = hooks.getTag;\n\n  var quickMap = {\n    "BeforeUnloadEvent": "Event",\n    "DataTransfer": "Clipboard",\n    "GeoGeolocation": "Geolocation",\n    "Location": "!Location",               // Fixes issue 18151\n    "WorkerMessageEvent": "MessageEvent",\n    "XMLDocument": "!Document"};\n\n  function getTagFirefox(o) {\n    var tag = getTag(o);\n    return quickMap[tag] || tag;\n  }\n\n  hooks.getTag = getTagFirefox;\n}');
  let _operaHooksTransformer = new _foreign_helper.JS_CONST('\nfunction(hooks) { return hooks; }\n');
  let _safariHooksTransformer = new _foreign_helper.JS_CONST('\nfunction(hooks) { return hooks; }\n');
  let _dartExperimentalFixupGetTagHooksTransformer = new _foreign_helper.JS_CONST('\nfunction(hooks) {\n  if (typeof dartExperimentalFixupGetTag != "function") return hooks;\n  hooks.getTag = dartExperimentalFixupGetTag(hooks.getTag);\n}');
  // Function regExpGetNative: (JSSyntaxRegExp) → dynamic
  function regExpGetNative(regexp) {
    return regexp._nativeRegExp;
  }
  // Function regExpGetGlobalNative: (JSSyntaxRegExp) → dynamic
  function regExpGetGlobalNative(regexp) {
    let nativeRegexp = regexp._nativeGlobalVersion;
    _foreign_helper.JS("void", "#.lastIndex = 0", nativeRegexp);
    return nativeRegexp;
  }
  // Function regExpCaptureCount: (JSSyntaxRegExp) → int
  function regExpCaptureCount(regexp) {
    let nativeAnchoredRegExp = regexp._nativeAnchoredVersion;
    let match = _foreign_helper.JS('JSExtendableArray', "#.exec('')", nativeAnchoredRegExp);
    return dart.as(dart.dbinary(dart.dload(match, 'length'), '-', 2), core.int);
  }
  class JSSyntaxRegExp extends dart.Object {
    toString() {
      return `RegExp/${this.pattern}/`;
    }
    JSSyntaxRegExp(source, opt$) {
      let multiLine = opt$.multiLine === void 0 ? false : opt$.multiLine;
      let caseSensitive = opt$.caseSensitive === void 0 ? true : opt$.caseSensitive;
      this.pattern = source;
      this._nativeRegExp = makeNative(source, multiLine, caseSensitive, false);
      this._nativeGlobalRegExp = null;
      this._nativeAnchoredRegExp = null;
    }
    get _nativeGlobalVersion() {
      if (this._nativeGlobalRegExp !== null)
        return this._nativeGlobalRegExp;
      return this._nativeGlobalRegExp = makeNative(this.pattern, this._isMultiLine, this._isCaseSensitive, true);
    }
    get _nativeAnchoredVersion() {
      if (this._nativeAnchoredRegExp !== null)
        return this._nativeAnchoredRegExp;
      return this._nativeAnchoredRegExp = makeNative(`${this.pattern}|()`, this._isMultiLine, this._isCaseSensitive, true);
    }
    get _isMultiLine() {
      return dart.as(_foreign_helper.JS("bool", "#.multiline", this._nativeRegExp), core.bool);
    }
    get _isCaseSensitive() {
      return dart.as(_foreign_helper.JS("bool", "!#.ignoreCase", this._nativeRegExp), core.bool);
    }
    static makeNative(source, multiLine, caseSensitive, global) {
      checkString(source);
      let m = multiLine ? 'm' : '';
      let i = caseSensitive ? '' : 'i';
      let g = global ? 'g' : '';
      let regexp = _foreign_helper.JS('', '(function() {' + 'try {' + 'return new RegExp(#, # + # + #);' + '} catch (e) {' + 'return e;' + '}' + '})()', source, m, i, g);
      if (_foreign_helper.JS('bool', '# instanceof RegExp', regexp))
        return regexp;
      let errorMessage = dart.as(_foreign_helper.JS('String', 'String(#)', regexp), core.String);
      throw new core.FormatException(`Illegal RegExp pattern: ${source}, ${errorMessage}`);
    }
    firstMatch(string) {
      let m = dart.as(_foreign_helper.JS('JSExtendableArray|Null', '#.exec(#)', this._nativeRegExp, checkString(string)), core.List$(core.String));
      if (m === null)
        return null;
      return new _MatchImplementation(this, m);
    }
    hasMatch(string) {
      return dart.as(_foreign_helper.JS('bool', '#.test(#)', this._nativeRegExp, checkString(string)), core.bool);
    }
    stringMatch(string) {
      let match = this.firstMatch(string);
      if (match !== null)
        return match.group(0);
      return null;
    }
    allMatches(string, start) {
      if (start === void 0)
        start = 0;
      checkString(string);
      checkInt(start);
      if (dart.notNull(start < 0) || dart.notNull(start > string.length)) {
        throw new core.RangeError.range(start, 0, string.length);
      }
      return new _AllMatchesIterable(this, string, start);
    }
    _execGlobal(string, start) {
      let regexp = this._nativeGlobalVersion;
      _foreign_helper.JS("void", "#.lastIndex = #", regexp, start);
      let match = dart.as(_foreign_helper.JS("JSExtendableArray|Null", "#.exec(#)", regexp, string), core.List);
      if (match === null)
        return null;
      return new _MatchImplementation(this, dart.as(match, core.List$(core.String)));
    }
    _execAnchored(string, start) {
      let regexp = this._nativeAnchoredVersion;
      _foreign_helper.JS("void", "#.lastIndex = #", regexp, start);
      let match = dart.as(_foreign_helper.JS("JSExtendableArray|Null", "#.exec(#)", regexp, string), core.List);
      if (match === null)
        return null;
      if (match.get(match.length - 1) !== null)
        return null;
      match.length = 1;
      return new _MatchImplementation(this, dart.as(match, core.List$(core.String)));
    }
    matchAsPrefix(string, start) {
      if (start === void 0)
        start = 0;
      if (dart.notNull(start < 0) || dart.notNull(start > string.length)) {
        throw new core.RangeError.range(start, 0, string.length);
      }
      return this._execAnchored(string, start);
    }
    get isMultiLine() {
      return this._isMultiLine;
    }
    get isCaseSensitive() {
      return this._isCaseSensitive;
    }
  }
  class _MatchImplementation extends dart.Object {
    _MatchImplementation(pattern, _match) {
      this.pattern = pattern;
      this._match = _match;
      dart.assert(typeof _foreign_helper.JS("var", "#.input", this._match) == string);
      dart.assert(typeof _foreign_helper.JS("var", "#.index", this._match) == number);
    }
    get input() {
      return dart.as(_foreign_helper.JS("String", "#.input", this._match), core.String);
    }
    get start() {
      return dart.as(_foreign_helper.JS("int", "#.index", this._match), core.int);
    }
    get end() {
      return this.start + this._match.get(0).length;
    }
    group(index) {
      return this._match.get(index);
    }
    get(index) {
      return this.group(index);
    }
    get groupCount() {
      return this._match.length - 1;
    }
    groups(groups) {
      let out = dart.as(new List.from([]), core.List$(core.String));
      for (let i of groups) {
        out.add(this.group(i));
      }
      return out;
    }
  }
  class _AllMatchesIterable extends collection.IterableBase$(core.Match) {
    _AllMatchesIterable(_re, _string, _start) {
      this._re = _re;
      this._string = _string;
      this._start = _start;
      super.IterableBase();
    }
    get iterator() {
      return new _AllMatchesIterator(this._re, this._string, this._start);
    }
  }
  class _AllMatchesIterator extends dart.Object {
    _AllMatchesIterator(_regExp, _string, _nextIndex) {
      this._regExp = _regExp;
      this._string = _string;
      this._nextIndex = _nextIndex;
      this._current = null;
    }
    get current() {
      return this._current;
    }
    moveNext() {
      if (this._string === null)
        return false;
      if (this._nextIndex <= this._string.length) {
        let match = this._regExp._execGlobal(this._string, this._nextIndex);
        if (match !== null) {
          this._current = match;
          let nextIndex = match.end;
          if (match.start === nextIndex) {
            nextIndex++;
          }
          this._nextIndex = nextIndex;
          return true;
        }
      }
      this._current = null;
      this._string = null;
      return false;
    }
  }
  // Function firstMatchAfter: (JSSyntaxRegExp, String, int) → Match
  function firstMatchAfter(regExp, string, start) {
    return regExp._execGlobal(string, start);
  }
  class StringMatch extends dart.Object {
    StringMatch(start, input, pattern) {
      this.start = start;
      this.input = input;
      this.pattern = pattern;
    }
    get end() {
      return this.start + this.pattern.length;
    }
    get(g) {
      return this.group(g);
    }
    get groupCount() {
      return 0;
    }
    group(group_) {
      if (group_ !== 0) {
        throw new core.RangeError.value(group_);
      }
      return this.pattern;
    }
    groups(groups_) {
      let result = new core.List();
      for (let g of groups_) {
        result.add(this.group(g));
      }
      return result;
    }
  }
  // Function allMatchesInStringUnchecked: (String, String, int) → List<Match>
  function allMatchesInStringUnchecked(needle, haystack, startIndex) {
    let result = new core.List();
    let length = haystack.length;
    let patternLength = needle.length;
    while (true) {
      let position = haystack.indexOf(needle, startIndex);
      if (position === -1) {
        break;
      }
      result.add(new StringMatch(position, haystack, needle));
      let endIndex = position + patternLength;
      if (endIndex === length) {
        break;
      } else if (position === endIndex) {
        ++startIndex;
      } else {
        startIndex = endIndex;
      }
    }
    return result;
  }
  // Function stringContainsUnchecked: (dynamic, dynamic, dynamic) → dynamic
  function stringContainsUnchecked(receiver, other, startIndex) {
    if (typeof other == string) {
      return !dart.equals(dart.dinvoke(receiver, 'indexOf', other, startIndex), -1);
    } else if (dart.is(other, JSSyntaxRegExp)) {
      return dart.dinvoke(other, 'hasMatch', dart.dinvoke(receiver, 'substring', startIndex));
    } else {
      let substr = dart.dinvoke(receiver, 'substring', startIndex);
      return dart.dload(dart.dinvoke(other, 'allMatches', substr), 'isNotEmpty');
    }
  }
  // Function stringReplaceJS: (dynamic, dynamic, dynamic) → dynamic
  function stringReplaceJS(receiver, replacer, to) {
    to = _foreign_helper.JS('String', '#.replace(/\\$/g, "$$$$")', to);
    return _foreign_helper.JS('String', '#.replace(#, #)', receiver, replacer, to);
  }
  // Function stringReplaceFirstRE: (dynamic, dynamic, dynamic, dynamic) → dynamic
  function stringReplaceFirstRE(receiver, regexp, to, startIndex) {
    let match = dart.dinvoke(regexp, '_execGlobal', receiver, startIndex);
    if (match === null)
      return receiver;
    let start = dart.dload(match, 'start');
    let end = dart.dload(match, 'end');
    return `${dart.dinvoke(receiver, 'substring', 0, start)}${to}${dart.dinvoke(receiver, 'substring', end)}`;
  }
  let ESCAPE_REGEXP = '[[\\]{}()*+?.\\\\^$|]';
  // Function stringReplaceAllUnchecked: (dynamic, dynamic, dynamic) → dynamic
  function stringReplaceAllUnchecked(receiver, from, to) {
    checkString(to);
    if (typeof from == string) {
      if (dart.equals(from, "")) {
        if (dart.equals(receiver, "")) {
          return to;
        } else {
          let result = new core.StringBuffer();
          let length = dart.as(dart.dload(receiver, 'length'), core.int);
          result.write(to);
          for (let i = 0; i < length; i++) {
            result.write(dart.dindex(receiver, i));
            result.write(to);
          }
          return result.toString();
        }
      } else {
        let quoter = _foreign_helper.JS('', "new RegExp(#, 'g')", ESCAPE_REGEXP);
        let quoted = _foreign_helper.JS('String', '#.replace(#, "\\\\$&")', from, quoter);
        let replacer = _foreign_helper.JS('', "new RegExp(#, 'g')", quoted);
        return stringReplaceJS(receiver, replacer, to);
      }
    } else if (dart.is(from, JSSyntaxRegExp)) {
      let re = regExpGetGlobalNative(dart.as(from, JSSyntaxRegExp));
      return stringReplaceJS(receiver, re, to);
    } else {
      checkNull(from);
      throw "String.replaceAll(Pattern) UNIMPLEMENTED";
    }
  }
  // Function _matchString: (Match) → String
  function _matchString(match) {
    return match.get(0);
  }
  // Function _stringIdentity: (String) → String
  function _stringIdentity(string) {
    return string;
  }
  // Function stringReplaceAllFuncUnchecked: (dynamic, dynamic, dynamic, dynamic) → dynamic
  function stringReplaceAllFuncUnchecked(receiver, pattern, onMatch, onNonMatch) {
    if (!dart.is(pattern, core.Pattern)) {
      throw new core.ArgumentError(`${pattern} is not a Pattern`);
    }
    if (onMatch === null)
      onMatch = _matchString;
    if (onNonMatch === null)
      onNonMatch = _stringIdentity;
    if (typeof pattern == string) {
      return stringReplaceAllStringFuncUnchecked(receiver, pattern, onMatch, onNonMatch);
    }
    let buffer = new core.StringBuffer();
    let startIndex = 0;
    for (let match of dart.dinvoke(pattern, 'allMatches', receiver)) {
      buffer.write(dart.dinvokef(onNonMatch, dart.dinvoke(receiver, 'substring', startIndex, match.start)));
      buffer.write(dart.dinvokef(onMatch, match));
      startIndex = match.end;
    }
    buffer.write(dart.dinvokef(onNonMatch, dart.dinvoke(receiver, 'substring', startIndex)));
    return buffer.toString();
  }
  // Function stringReplaceAllEmptyFuncUnchecked: (dynamic, dynamic, dynamic) → dynamic
  function stringReplaceAllEmptyFuncUnchecked(receiver, onMatch, onNonMatch) {
    let buffer = new core.StringBuffer();
    let length = dart.as(dart.dload(receiver, 'length'), core.int);
    let i = 0;
    buffer.write(dart.dinvokef(onNonMatch, ""));
    while (i < length) {
      buffer.write(dart.dinvokef(onMatch, new StringMatch(i, dart.as(receiver, core.String), "")));
      let code = dart.as(dart.dinvoke(receiver, 'codeUnitAt', i), core.int);
      if (dart.notNull((code & ~1023) === 55296) && dart.notNull(length > i + 1)) {
        code = dart.as(dart.dinvoke(receiver, 'codeUnitAt', i + 1), core.int);
        if ((code & ~1023) === 56320) {
          buffer.write(dart.dinvokef(onNonMatch, dart.dinvoke(receiver, 'substring', i, i + 2)));
          i = 2;
          continue;
        }
      }
      buffer.write(dart.dinvokef(onNonMatch, dart.dindex(receiver, i)));
      i++;
    }
    buffer.write(dart.dinvokef(onMatch, new StringMatch(i, dart.as(receiver, core.String), "")));
    buffer.write(dart.dinvokef(onNonMatch, ""));
    return buffer.toString();
  }
  // Function stringReplaceAllStringFuncUnchecked: (dynamic, dynamic, dynamic, dynamic) → dynamic
  function stringReplaceAllStringFuncUnchecked(receiver, pattern, onMatch, onNonMatch) {
    let patternLength = dart.as(dart.dload(pattern, 'length'), core.int);
    if (patternLength === 0) {
      return stringReplaceAllEmptyFuncUnchecked(receiver, onMatch, onNonMatch);
    }
    let length = dart.as(dart.dload(receiver, 'length'), core.int);
    let buffer = new core.StringBuffer();
    let startIndex = 0;
    while (startIndex < length) {
      let position = dart.as(dart.dinvoke(receiver, 'indexOf', pattern, startIndex), core.int);
      if (position === -1) {
        break;
      }
      buffer.write(dart.dinvokef(onNonMatch, dart.dinvoke(receiver, 'substring', startIndex, position)));
      buffer.write(dart.dinvokef(onMatch, new StringMatch(position, dart.as(receiver, core.String), dart.as(pattern, core.String))));
      startIndex = position + patternLength;
    }
    buffer.write(dart.dinvokef(onNonMatch, dart.dinvoke(receiver, 'substring', startIndex)));
    return buffer.toString();
  }
  // Function stringReplaceFirstUnchecked: (dynamic, dynamic, dynamic, [int]) → dynamic
  function stringReplaceFirstUnchecked(receiver, from, to, startIndex) {
    if (startIndex === void 0)
      startIndex = 0;
    if (typeof from == string) {
      let index = dart.dinvoke(receiver, 'indexOf', from, startIndex);
      if (dart.dbinary(index, '<', 0))
        return receiver;
      return `${dart.dinvoke(receiver, 'substring', 0, index)}${to}` + `${dart.dinvoke(receiver, 'substring', dart.dbinary(index, '+', dart.dload(from, 'length')))}`;
    } else if (dart.is(from, JSSyntaxRegExp)) {
      return startIndex === 0 ? stringReplaceJS(receiver, regExpGetNative(dart.as(from, JSSyntaxRegExp)), to) : stringReplaceFirstRE(receiver, from, to, startIndex);
    } else {
      checkNull(from);
      throw "String.replace(Pattern) UNIMPLEMENTED";
    }
  }
  // Function stringJoinUnchecked: (dynamic, dynamic) → dynamic
  function stringJoinUnchecked(array, separator) {
    return _foreign_helper.JS('String', '#.join(#)', array, separator);
  }
  // Function createRuntimeType: (String) → Type
  function createRuntimeType(name) {
    return new TypeImpl(name);
  }
  class TypeImpl extends dart.Object {
    TypeImpl(_typeName) {
      this._typeName = _typeName;
      this._unmangledName = null;
    }
    toString() {
      if (this._unmangledName !== null)
        return this._unmangledName;
      let unmangledName = _js_names.unmangleAllIdentifiersIfPreservedAnyways(this._typeName);
      return this._unmangledName = unmangledName;
    }
    get hashCode() {
      return this._typeName.hashCode;
    }
    ['=='](other) {
      return dart.notNull(dart.is(other, TypeImpl)) && dart.notNull(dart.equals(this._typeName, dart.dload(other, '_typeName')));
    }
  }
  class TypeVariable extends dart.Object {
    TypeVariable(owner, name, bound) {
      this.owner = owner;
      this.name = name;
      this.bound = bound;
    }
  }
  // Function getMangledTypeName: (TypeImpl) → dynamic
  function getMangledTypeName(type) {
    return type._typeName;
  }
  // Function setRuntimeTypeInfo: (Object, dynamic) → Object
  function setRuntimeTypeInfo(target, typeInfo) {
    dart.assert(dart.notNull(typeInfo === null) || dart.notNull(isJsArray(typeInfo)));
    if (target !== null)
      _foreign_helper.JS('var', '#.$builtinTypeInfo = #', target, typeInfo);
    return target;
  }
  // Function getRuntimeTypeInfo: (Object) → dynamic
  function getRuntimeTypeInfo(target) {
    if (target === null)
      return null;
    return _foreign_helper.JS('var', '#.$builtinTypeInfo', target);
  }
  // Function getRuntimeTypeArguments: (dynamic, dynamic) → dynamic
  function getRuntimeTypeArguments(target, substitutionName) {
    let substitution = getField(target, `${_foreign_helper.JS_OPERATOR_AS_PREFIX()}${substitutionName}`);
    return substitute(substitution, getRuntimeTypeInfo(target));
  }
  // Function getRuntimeTypeArgument: (Object, String, int) → dynamic
  function getRuntimeTypeArgument(target, substitutionName, index) {
    let arguments = getRuntimeTypeArguments(target, substitutionName);
    return arguments === null ? null : getIndex(arguments, index);
  }
  // Function getTypeArgumentByIndex: (Object, int) → dynamic
  function getTypeArgumentByIndex(target, index) {
    let rti = getRuntimeTypeInfo(target);
    return rti === null ? null : getIndex(rti, index);
  }
  // Function copyTypeArguments: (Object, Object) → void
  function copyTypeArguments(source, target) {
    _foreign_helper.JS('var', '#.$builtinTypeInfo = #.$builtinTypeInfo', target, source);
  }
  // Function getClassName: (dynamic) → String
  function getClassName(object) {
    return dart.as(_foreign_helper.JS('String', '#.constructor.builtin$cls', _interceptors.getInterceptor(object)), core.String);
  }
  // Function getRuntimeTypeAsString: (dynamic, {onTypeVariable: (int) → String}) → String
  function getRuntimeTypeAsString(runtimeType, opt$) {
    let onTypeVariable = opt$.onTypeVariable === void 0 ? null : opt$.onTypeVariable;
    dart.assert(isJsArray(runtimeType));
    let className = getConstructorName(getIndex(runtimeType, 0));
    return `${className}` + `${joinArguments(runtimeType, 1, {onTypeVariable: onTypeVariable})}`;
  }
  // Function getConstructorName: (dynamic) → String
  function getConstructorName(type) {
    return dart.as(_foreign_helper.JS('String', '#.builtin$cls', type), core.String);
  }
  // Function runtimeTypeToString: (dynamic, {onTypeVariable: (int) → String}) → String
  function runtimeTypeToString(type, opt$) {
    let onTypeVariable = opt$.onTypeVariable === void 0 ? null : opt$.onTypeVariable;
    if (type === null) {
      return 'dynamic';
    } else if (isJsArray(type)) {
      return getRuntimeTypeAsString(type, {onTypeVariable: onTypeVariable});
    } else if (isJsFunction(type)) {
      return getConstructorName(type);
    } else if (typeof type == number) {
      if (onTypeVariable === null) {
        return dart.as(dart.dinvoke(type, 'toString'), core.String);
      } else {
        return onTypeVariable(dart.as(type, core.int));
      }
    } else {
      return null;
    }
  }
  // Function joinArguments: (dynamic, int, {onTypeVariable: (int) → String}) → String
  function joinArguments(types, startIndex, opt$) {
    let onTypeVariable = opt$.onTypeVariable === void 0 ? null : opt$.onTypeVariable;
    if (types === null)
      return '';
    dart.assert(isJsArray(types));
    let firstArgument = true;
    let allDynamic = true;
    let buffer = new core.StringBuffer();
    for (let index = startIndex; index < getLength(types); index++) {
      if (firstArgument) {
        firstArgument = false;
      } else {
        buffer.write(', ');
      }
      let argument = getIndex(types, index);
      if (argument !== null) {
        allDynamic = false;
      }
      buffer.write(runtimeTypeToString(argument, {onTypeVariable: onTypeVariable}));
    }
    return allDynamic ? '' : `<${buffer}>`;
  }
  // Function getRuntimeTypeString: (dynamic) → String
  function getRuntimeTypeString(object) {
    let className = getClassName(object);
    if (object === null)
      return className;
    let typeInfo = _foreign_helper.JS('var', '#.$builtinTypeInfo', object);
    return `${className}${joinArguments(typeInfo, 0)}`;
  }
  // Function getRuntimeType: (dynamic) → Type
  function getRuntimeType(object) {
    let type = getRuntimeTypeString(object);
    return new TypeImpl(type);
  }
  // Function substitute: (dynamic, dynamic) → dynamic
  function substitute(substitution, arguments) {
    dart.assert(dart.notNull(substitution === null) || dart.notNull(isJsFunction(substitution)));
    dart.assert(dart.notNull(arguments === null) || dart.notNull(isJsArray(arguments)));
    if (isJsFunction(substitution)) {
      substitution = invoke(substitution, arguments);
      if (isJsArray(substitution)) {
        arguments = substitution;
      } else if (isJsFunction(substitution)) {
        arguments = invoke(substitution, arguments);
      }
    }
    return arguments;
  }
  // Function checkSubtype: (Object, String, List<dynamic>, String) → bool
  function checkSubtype(object, isField, checks, asField) {
    if (object === null)
      return false;
    let arguments = getRuntimeTypeInfo(object);
    let interceptor = _interceptors.getInterceptor(object);
    let isSubclass = getField(interceptor, isField);
    if (isSubclass === null)
      return false;
    let substitution = getField(interceptor, asField);
    return checkArguments(substitution, arguments, checks);
  }
  // Function computeTypeName: (String, List<dynamic>) → String
  function computeTypeName(isField, arguments) {
    let prefixLength = _foreign_helper.JS_OPERATOR_IS_PREFIX().length;
    return Primitives.formatType(isField.substring(prefixLength, isField.length), arguments);
  }
  // Function subtypeCast: (Object, String, List<dynamic>, String) → Object
  function subtypeCast(object, isField, checks, asField) {
    if (dart.notNull(object !== null) && dart.notNull(!dart.notNull(checkSubtype(object, isField, checks, asField)))) {
      let actualType = Primitives.objectTypeName(object);
      let typeName = computeTypeName(isField, checks);
      throw new CastErrorImplementation(actualType, typeName);
    }
    return object;
  }
  // Function assertSubtype: (Object, String, List<dynamic>, String) → Object
  function assertSubtype(object, isField, checks, asField) {
    if (dart.notNull(object !== null) && dart.notNull(!dart.notNull(checkSubtype(object, isField, checks, asField)))) {
      let typeName = computeTypeName(isField, checks);
      throw new TypeErrorImplementation(object, typeName);
    }
    return object;
  }
  // Function assertIsSubtype: (dynamic, dynamic, String) → dynamic
  function assertIsSubtype(subtype, supertype, message) {
    if (!dart.notNull(isSubtype(subtype, supertype))) {
      throwTypeError(message);
    }
  }
  // Function throwTypeError: (dynamic) → dynamic
  function throwTypeError(message) {
    throw new TypeErrorImplementation.fromMessage(dart.as(message, core.String));
  }
  // Function checkArguments: (dynamic, dynamic, dynamic) → bool
  function checkArguments(substitution, arguments, checks) {
    return areSubtypes(substitute(substitution, arguments), checks);
  }
  // Function areSubtypes: (dynamic, dynamic) → bool
  function areSubtypes(s, t) {
    if (dart.notNull(s === null) || dart.notNull(t === null))
      return true;
    dart.assert(isJsArray(s));
    dart.assert(isJsArray(t));
    dart.assert(getLength(s) === getLength(t));
    let len = getLength(s);
    for (let i = 0; i < len; i++) {
      if (!dart.notNull(isSubtype(getIndex(s, i), getIndex(t, i)))) {
        return false;
      }
    }
    return true;
  }
  // Function computeSignature: (dynamic, dynamic, dynamic) → dynamic
  function computeSignature(signature, context, contextName) {
    let typeArguments = getRuntimeTypeArguments(context, contextName);
    return invokeOn(signature, context, typeArguments);
  }
  // Function isSupertypeOfNull: (dynamic) → bool
  function isSupertypeOfNull(type) {
    return dart.notNull(dart.notNull(type === null) || dart.notNull(dart.equals(getConstructorName(type), _foreign_helper.JS_OBJECT_CLASS_NAME()))) || dart.notNull(dart.equals(getConstructorName(type), _foreign_helper.JS_NULL_CLASS_NAME()));
  }
  // Function checkSubtypeOfRuntimeType: (dynamic, dynamic) → bool
  function checkSubtypeOfRuntimeType(o, t) {
    if (o === null)
      return isSupertypeOfNull(t);
    if (t === null)
      return true;
    let rti = getRuntimeTypeInfo(o);
    o = _interceptors.getInterceptor(o);
    let type = _foreign_helper.JS('', '#.constructor', o);
    if (rti !== null) {
      rti = _foreign_helper.JS('JSExtendableArray', '#.slice()', rti);
      _foreign_helper.JS('', '#.splice(0, 0, #)', rti, type);
      type = rti;
    } else if (hasField(t, `${_foreign_helper.JS_FUNCTION_TYPE_TAG()}`)) {
      let signatureName = `${_foreign_helper.JS_OPERATOR_IS_PREFIX()}_${getField(t, _foreign_helper.JS_FUNCTION_TYPE_TAG())}`;
      if (hasField(o, signatureName))
        return true;
      let targetSignatureFunction = getField(o, `${_foreign_helper.JS_SIGNATURE_NAME()}`);
      if (targetSignatureFunction === null)
        return false;
      type = invokeOn(targetSignatureFunction, o, null);
      return isFunctionSubtype(type, t);
    }
    return isSubtype(type, t);
  }
  // Function subtypeOfRuntimeTypeCast: (Object, dynamic) → Object
  function subtypeOfRuntimeTypeCast(object, type) {
    if (dart.notNull(object !== null) && dart.notNull(!dart.notNull(checkSubtypeOfRuntimeType(object, type)))) {
      let actualType = Primitives.objectTypeName(object);
      throw new CastErrorImplementation(actualType, runtimeTypeToString(type));
    }
    return object;
  }
  // Function assertSubtypeOfRuntimeType: (Object, dynamic) → Object
  function assertSubtypeOfRuntimeType(object, type) {
    if (dart.notNull(object !== null) && dart.notNull(!dart.notNull(checkSubtypeOfRuntimeType(object, type)))) {
      throw new TypeErrorImplementation(object, runtimeTypeToString(type));
    }
    return object;
  }
  // Function getArguments: (dynamic) → dynamic
  function getArguments(type) {
    return isJsArray(type) ? _foreign_helper.JS('var', '#.slice(1)', type) : null;
  }
  // Function isSubtype: (dynamic, dynamic) → bool
  function isSubtype(s, t) {
    if (isIdentical(s, t))
      return true;
    if (dart.notNull(s === null) || dart.notNull(t === null))
      return true;
    if (hasField(t, `${_foreign_helper.JS_FUNCTION_TYPE_TAG()}`)) {
      return isFunctionSubtype(s, t);
    }
    if (hasField(s, `${_foreign_helper.JS_FUNCTION_TYPE_TAG()}`)) {
      return dart.equals(getConstructorName(t), _foreign_helper.JS_FUNCTION_CLASS_NAME());
    }
    let typeOfS = isJsArray(s) ? getIndex(s, 0) : s;
    let typeOfT = isJsArray(t) ? getIndex(t, 0) : t;
    let name = runtimeTypeToString(typeOfT);
    let substitution = null;
    if (isNotIdentical(typeOfT, typeOfS)) {
      let test = `${_foreign_helper.JS_OPERATOR_IS_PREFIX()}${name}`;
      let typeOfSPrototype = _foreign_helper.JS('', '#.prototype', typeOfS);
      if (hasNoField(typeOfSPrototype, test))
        return false;
      let field = `${_foreign_helper.JS_OPERATOR_AS_PREFIX()}${runtimeTypeToString(typeOfT)}`;
      substitution = getField(typeOfSPrototype, field);
    }
    if (dart.notNull(dart.notNull(!dart.notNull(isJsArray(s))) && dart.notNull(substitution === null)) || dart.notNull(!dart.notNull(isJsArray(t)))) {
      return true;
    }
    return checkArguments(substitution, getArguments(s), getArguments(t));
  }
  // Function isAssignable: (dynamic, dynamic) → bool
  function isAssignable(s, t) {
    return dart.notNull(isSubtype(s, t)) || dart.notNull(isSubtype(t, s));
  }
  // Function areAssignable: (List<dynamic>, List, bool) → bool
  function areAssignable(s, t, allowShorter) {
    if (dart.notNull(t === null) && dart.notNull(s === null))
      return true;
    if (t === null)
      return allowShorter;
    if (s === null)
      return false;
    dart.assert(isJsArray(s));
    dart.assert(isJsArray(t));
    let sLength = getLength(s);
    let tLength = getLength(t);
    if (allowShorter) {
      if (sLength < tLength)
        return false;
    } else {
      if (sLength !== tLength)
        return false;
    }
    for (let i = 0; i < tLength; i++) {
      if (!dart.notNull(isAssignable(getIndex(s, i), getIndex(t, i)))) {
        return false;
      }
    }
    return true;
  }
  // Function areAssignableMaps: (dynamic, dynamic) → bool
  function areAssignableMaps(s, t) {
    if (t === null)
      return true;
    if (s === null)
      return false;
    dart.assert(isJsObject(s));
    dart.assert(isJsObject(t));
    let names = _interceptors.JSArray.markFixedList(dart.as(_foreign_helper.JS('', 'Object.getOwnPropertyNames(#)', t), core.List));
    for (let i = 0; i < names.length; i++) {
      let name = names.get(i);
      if (_foreign_helper.JS('bool', '!Object.hasOwnProperty.call(#, #)', s, name)) {
        return false;
      }
      let tType = _foreign_helper.JS('', '#[#]', t, name);
      let sType = _foreign_helper.JS('', '#[#]', s, name);
      if (!dart.notNull(isAssignable(tType, sType)))
        return false;
    }
    return true;
  }
  // Function isFunctionSubtype: (dynamic, dynamic) → bool
  function isFunctionSubtype(s, t) {
    dart.assert(hasField(t, `${_foreign_helper.JS_FUNCTION_TYPE_TAG()}`));
    if (hasNoField(s, `${_foreign_helper.JS_FUNCTION_TYPE_TAG()}`))
      return false;
    if (hasField(s, `${_foreign_helper.JS_FUNCTION_TYPE_VOID_RETURN_TAG()}`)) {
      if (dart.dbinary(hasNoField(t, `${_foreign_helper.JS_FUNCTION_TYPE_VOID_RETURN_TAG()}`), '&&', hasField(t, `${_foreign_helper.JS_FUNCTION_TYPE_RETURN_TYPE_TAG()}`))) {
        return false;
      }
    } else if (hasNoField(t, `${_foreign_helper.JS_FUNCTION_TYPE_VOID_RETURN_TAG()}`)) {
      let sReturnType = getField(s, `${_foreign_helper.JS_FUNCTION_TYPE_RETURN_TYPE_TAG()}`);
      let tReturnType = getField(t, `${_foreign_helper.JS_FUNCTION_TYPE_RETURN_TYPE_TAG()}`);
      if (!dart.notNull(isAssignable(sReturnType, tReturnType)))
        return false;
    }
    let sParameterTypes = getField(s, `${_foreign_helper.JS_FUNCTION_TYPE_REQUIRED_PARAMETERS_TAG()}`);
    let tParameterTypes = getField(t, `${_foreign_helper.JS_FUNCTION_TYPE_REQUIRED_PARAMETERS_TAG()}`);
    let sOptionalParameterTypes = getField(s, `${_foreign_helper.JS_FUNCTION_TYPE_OPTIONAL_PARAMETERS_TAG()}`);
    let tOptionalParameterTypes = getField(t, `${_foreign_helper.JS_FUNCTION_TYPE_OPTIONAL_PARAMETERS_TAG()}`);
    let sParametersLen = sParameterTypes !== null ? getLength(sParameterTypes) : 0;
    let tParametersLen = tParameterTypes !== null ? getLength(tParameterTypes) : 0;
    let sOptionalParametersLen = sOptionalParameterTypes !== null ? getLength(sOptionalParameterTypes) : 0;
    let tOptionalParametersLen = tOptionalParameterTypes !== null ? getLength(tOptionalParameterTypes) : 0;
    if (sParametersLen > tParametersLen) {
      return false;
    }
    if (sParametersLen + sOptionalParametersLen < tParametersLen + tOptionalParametersLen) {
      return false;
    }
    if (sParametersLen === tParametersLen) {
      if (!dart.notNull(areAssignable(dart.as(sParameterTypes, core.List), dart.as(tParameterTypes, core.List), false)))
        return false;
      if (!dart.notNull(areAssignable(dart.as(sOptionalParameterTypes, core.List), dart.as(tOptionalParameterTypes, core.List), true))) {
        return false;
      }
    } else {
      let pos = 0;
      for (; pos < sParametersLen; pos++) {
        if (!dart.notNull(isAssignable(getIndex(sParameterTypes, pos), getIndex(tParameterTypes, pos)))) {
          return false;
        }
      }
      let sPos = 0;
      let tPos = pos;
      for (; tPos < tParametersLen; sPos++, tPos++) {
        if (!dart.notNull(isAssignable(getIndex(sOptionalParameterTypes, sPos), getIndex(tParameterTypes, tPos)))) {
          return false;
        }
      }
      tPos = 0;
      for (; tPos < tOptionalParametersLen; sPos++, tPos++) {
        if (!dart.notNull(isAssignable(getIndex(sOptionalParameterTypes, sPos), getIndex(tOptionalParameterTypes, tPos)))) {
          return false;
        }
      }
    }
    let sNamedParameters = getField(s, `${_foreign_helper.JS_FUNCTION_TYPE_NAMED_PARAMETERS_TAG()}`);
    let tNamedParameters = getField(t, `${_foreign_helper.JS_FUNCTION_TYPE_NAMED_PARAMETERS_TAG()}`);
    return areAssignableMaps(sNamedParameters, tNamedParameters);
  }
  // Function invoke: (dynamic, dynamic) → dynamic
  function invoke(function, arguments) {
    return invokeOn(function, null, arguments);
  }
  // Function invokeOn: (dynamic, dynamic, dynamic) → Object
  function invokeOn(function, receiver, arguments) {
    dart.assert(isJsFunction(function));
    dart.assert(dart.notNull(arguments === null) || dart.notNull(isJsArray(arguments)));
    return _foreign_helper.JS('var', '#.apply(#, #)', function, receiver, arguments);
  }
  // Function call: (dynamic, String) → dynamic
  function call(object, name) {
    return _foreign_helper.JS('var', '#[#]()', object, name);
  }
  // Function getField: (dynamic, String) → dynamic
  function getField(object, name) {
    return _foreign_helper.JS('var', '#[#]', object, name);
  }
  // Function getIndex: (dynamic, int) → dynamic
  function getIndex(array, index) {
    dart.assert(isJsArray(array));
    return _foreign_helper.JS('var', '#[#]', array, index);
  }
  // Function getLength: (dynamic) → int
  function getLength(array) {
    dart.assert(isJsArray(array));
    return dart.as(_foreign_helper.JS('int', '#.length', array), core.int);
  }
  // Function isJsArray: (dynamic) → bool
  function isJsArray(value) {
    return dart.is(value, _interceptors.JSArray);
  }
  // Function hasField: (dynamic, dynamic) → dynamic
  function hasField(object, name) {
    return _foreign_helper.JS('bool', '# in #', name, object);
  }
  // Function hasNoField: (dynamic, dynamic) → dynamic
  function hasNoField(object, name) {
    return dart.throw_("Unimplemented PrefixExpression: !hasField(object, name)");
  }
  // Function isJsFunction: (dynamic) → bool
  function isJsFunction(o) {
    return dart.as(_foreign_helper.JS('bool', 'typeof # == "function"', o), core.bool);
  }
  // Function isJsObject: (dynamic) → bool
  function isJsObject(o) {
    return dart.as(_foreign_helper.JS('bool', "typeof # == 'object'", o), core.bool);
  }
  // Function isIdentical: (dynamic, dynamic) → bool
  function isIdentical(s, t) {
    return dart.as(_foreign_helper.JS('bool', '# === #', s, t), core.bool);
  }
  // Function isNotIdentical: (dynamic, dynamic) → bool
  function isNotIdentical(s, t) {
    return dart.as(_foreign_helper.JS('bool', '# !== #', s, t), core.bool);
  }
  // Exports:
  _js_helper.patch = patch;
  _js_helper.InternalMap = InternalMap;
  _js_helper.requiresPreamble = requiresPreamble;
  _js_helper.isJsIndexable = isJsIndexable;
  _js_helper.S = S;
  _js_helper.createInvocationMirror = createInvocationMirror;
  _js_helper.createUnmangledInvocationMirror = createUnmangledInvocationMirror;
  _js_helper.throwInvalidReflectionError = throwInvalidReflectionError;
  _js_helper.traceHelper = traceHelper;
  _js_helper.JSInvocationMirror = JSInvocationMirror;
  _js_helper.CachedInvocation = CachedInvocation;
  _js_helper.CachedCatchAllInvocation = CachedCatchAllInvocation;
  _js_helper.CachedNoSuchMethodInvocation = CachedNoSuchMethodInvocation;
  _js_helper.ReflectionInfo = ReflectionInfo;
  _js_helper.getMetadata = getMetadata;
  _js_helper.Primitives = Primitives;
  _js_helper.JsCache = JsCache;
  _js_helper.iae = iae;
  _js_helper.ioore = ioore;
  _js_helper.stringLastIndexOfUnchecked = stringLastIndexOfUnchecked;
  _js_helper.checkNull = checkNull;
  _js_helper.checkNum = checkNum;
  _js_helper.checkInt = checkInt;
  _js_helper.checkBool = checkBool;
  _js_helper.checkString = checkString;
  _js_helper.wrapException = wrapException;
  _js_helper.toStringWrapper = toStringWrapper;
  _js_helper.throwExpression = throwExpression;
  _js_helper.makeLiteralListConst = makeLiteralListConst;
  _js_helper.throwRuntimeError = throwRuntimeError;
  _js_helper.throwAbstractClassInstantiationError = throwAbstractClassInstantiationError;
  _js_helper.TypeErrorDecoder = TypeErrorDecoder;
  _js_helper.NullError = NullError;
  _js_helper.JsNoSuchMethodError = JsNoSuchMethodError;
  _js_helper.UnknownJsTypeError = UnknownJsTypeError;
  _js_helper.unwrapException = unwrapException;
  _js_helper.getTraceFromException = getTraceFromException;
  _js_helper.objectHashCode = objectHashCode;
  _js_helper.fillLiteralMap = fillLiteralMap;
  _js_helper.invokeClosure = invokeClosure;
  _js_helper.convertDartClosureToJS = convertDartClosureToJS;
  _js_helper.Closure = Closure;
  _js_helper.closureFromTearOff = closureFromTearOff;
  _js_helper.TearOffClosure = TearOffClosure;
  _js_helper.BoundClosure = BoundClosure;
  _js_helper.jsHasOwnProperty = jsHasOwnProperty;
  _js_helper.jsPropertyAccess = jsPropertyAccess;
  _js_helper.getFallThroughError = getFallThroughError;
  _js_helper.Creates = Creates;
  _js_helper.Returns = Returns;
  _js_helper.JSName = JSName;
  _js_helper.boolConversionCheck = boolConversionCheck;
  _js_helper.stringTypeCheck = stringTypeCheck;
  _js_helper.stringTypeCast = stringTypeCast;
  _js_helper.doubleTypeCheck = doubleTypeCheck;
  _js_helper.doubleTypeCast = doubleTypeCast;
  _js_helper.numTypeCheck = numTypeCheck;
  _js_helper.numTypeCast = numTypeCast;
  _js_helper.boolTypeCheck = boolTypeCheck;
  _js_helper.boolTypeCast = boolTypeCast;
  _js_helper.intTypeCheck = intTypeCheck;
  _js_helper.intTypeCast = intTypeCast;
  _js_helper.propertyTypeError = propertyTypeError;
  _js_helper.propertyTypeCastError = propertyTypeCastError;
  _js_helper.propertyTypeCheck = propertyTypeCheck;
  _js_helper.propertyTypeCast = propertyTypeCast;
  _js_helper.interceptedTypeCheck = interceptedTypeCheck;
  _js_helper.interceptedTypeCast = interceptedTypeCast;
  _js_helper.numberOrStringSuperTypeCheck = numberOrStringSuperTypeCheck;
  _js_helper.numberOrStringSuperTypeCast = numberOrStringSuperTypeCast;
  _js_helper.numberOrStringSuperNativeTypeCheck = numberOrStringSuperNativeTypeCheck;
  _js_helper.numberOrStringSuperNativeTypeCast = numberOrStringSuperNativeTypeCast;
  _js_helper.stringSuperTypeCheck = stringSuperTypeCheck;
  _js_helper.stringSuperTypeCast = stringSuperTypeCast;
  _js_helper.stringSuperNativeTypeCheck = stringSuperNativeTypeCheck;
  _js_helper.stringSuperNativeTypeCast = stringSuperNativeTypeCast;
  _js_helper.listTypeCheck = listTypeCheck;
  _js_helper.listTypeCast = listTypeCast;
  _js_helper.listSuperTypeCheck = listSuperTypeCheck;
  _js_helper.listSuperTypeCast = listSuperTypeCast;
  _js_helper.listSuperNativeTypeCheck = listSuperNativeTypeCheck;
  _js_helper.listSuperNativeTypeCast = listSuperNativeTypeCast;
  _js_helper.voidTypeCheck = voidTypeCheck;
  _js_helper.checkMalformedType = checkMalformedType;
  _js_helper.checkDeferredIsLoaded = checkDeferredIsLoaded;
  _js_helper.JavaScriptIndexingBehavior = JavaScriptIndexingBehavior;
  _js_helper.TypeErrorImplementation = TypeErrorImplementation;
  _js_helper.CastErrorImplementation = CastErrorImplementation;
  _js_helper.FallThroughErrorImplementation = FallThroughErrorImplementation;
  _js_helper.assertHelper = assertHelper;
  _js_helper.throwNoSuchMethod = throwNoSuchMethod;
  _js_helper.throwCyclicInit = throwCyclicInit;
  _js_helper.RuntimeError = RuntimeError;
  _js_helper.DeferredNotLoadedError = DeferredNotLoadedError;
  _js_helper.RuntimeType = RuntimeType;
  _js_helper.RuntimeFunctionType = RuntimeFunctionType;
  _js_helper.buildFunctionType = buildFunctionType;
  _js_helper.buildNamedFunctionType = buildNamedFunctionType;
  _js_helper.buildInterfaceType = buildInterfaceType;
  _js_helper.DynamicRuntimeType = DynamicRuntimeType;
  _js_helper.getDynamicRuntimeType = getDynamicRuntimeType;
  _js_helper.VoidRuntimeType = VoidRuntimeType;
  _js_helper.getVoidRuntimeType = getVoidRuntimeType;
  _js_helper.functionTypeTestMetaHelper = functionTypeTestMetaHelper;
  _js_helper.convertRtiToRuntimeType = convertRtiToRuntimeType;
  _js_helper.RuntimeTypePlain = RuntimeTypePlain;
  _js_helper.RuntimeTypeGeneric = RuntimeTypeGeneric;
  _js_helper.FunctionTypeInfoDecoderRing = FunctionTypeInfoDecoderRing;
  _js_helper.UnimplementedNoSuchMethodError = UnimplementedNoSuchMethodError;
  _js_helper.random64 = random64;
  _js_helper.jsonEncodeNative = jsonEncodeNative;
  _js_helper.getIsolateAffinityTag = getIsolateAffinityTag;
  _js_helper.loadDeferredLibrary = loadDeferredLibrary;
  _js_helper.MainError = MainError;
  _js_helper.missingMain = missingMain;
  _js_helper.badMain = badMain;
  _js_helper.mainHasTooManyParameters = mainHasTooManyParameters;
  _js_helper.NoSideEffects = NoSideEffects;
  _js_helper.NoThrows = NoThrows;
  _js_helper.NoInline = NoInline;
  _js_helper.IrRepresentation = IrRepresentation;
  _js_helper.Native = Native;
  _js_helper.ConstantMap = ConstantMap;
  _js_helper.ConstantMap$ = ConstantMap$;
  _js_helper.ConstantStringMap = ConstantStringMap;
  _js_helper.ConstantStringMap$ = ConstantStringMap$;
  _js_helper.ConstantProtoMap = ConstantProtoMap;
  _js_helper.ConstantProtoMap$ = ConstantProtoMap$;
  _js_helper.GeneralConstantMap = GeneralConstantMap;
  _js_helper.GeneralConstantMap$ = GeneralConstantMap$;
  _js_helper.contains = contains;
  _js_helper.arrayLength = arrayLength;
  _js_helper.arrayGet = arrayGet;
  _js_helper.arraySet = arraySet;
  _js_helper.propertyGet = propertyGet;
  _js_helper.callHasOwnProperty = callHasOwnProperty;
  _js_helper.propertySet = propertySet;
  _js_helper.getPropertyFromPrototype = getPropertyFromPrototype;
  _js_helper.toStringForNativeObject = toStringForNativeObject;
  _js_helper.hashCodeForNativeObject = hashCodeForNativeObject;
  _js_helper.defineProperty = defineProperty;
  _js_helper.isDartObject = isDartObject;
  _js_helper.interceptorsByTag = interceptorsByTag;
  _js_helper.leafTags = leafTags;
  _js_helper.findDispatchTagForInterceptorClass = findDispatchTagForInterceptorClass;
  _js_helper.lookupInterceptor = lookupInterceptor;
  _js_helper.UNCACHED_MARK = UNCACHED_MARK;
  _js_helper.INSTANCE_CACHED_MARK = INSTANCE_CACHED_MARK;
  _js_helper.LEAF_MARK = LEAF_MARK;
  _js_helper.INTERIOR_MARK = INTERIOR_MARK;
  _js_helper.DISCRIMINATED_MARK = DISCRIMINATED_MARK;
  _js_helper.lookupAndCacheInterceptor = lookupAndCacheInterceptor;
  _js_helper.patchInstance = patchInstance;
  _js_helper.patchProto = patchProto;
  _js_helper.patchInteriorProto = patchInteriorProto;
  _js_helper.makeLeafDispatchRecord = makeLeafDispatchRecord;
  _js_helper.makeDefaultDispatchRecord = makeDefaultDispatchRecord;
  _js_helper.setNativeSubclassDispatchRecord = setNativeSubclassDispatchRecord;
  _js_helper.constructorNameFallback = constructorNameFallback;
  _js_helper.initNativeDispatch = initNativeDispatch;
  _js_helper.initNativeDispatchContinue = initNativeDispatchContinue;
  _js_helper.initHooks = initHooks;
  _js_helper.applyHooksTransformer = applyHooksTransformer;
  _js_helper.regExpGetNative = regExpGetNative;
  _js_helper.regExpGetGlobalNative = regExpGetGlobalNative;
  _js_helper.regExpCaptureCount = regExpCaptureCount;
  _js_helper.JSSyntaxRegExp = JSSyntaxRegExp;
  _js_helper.firstMatchAfter = firstMatchAfter;
  _js_helper.StringMatch = StringMatch;
  _js_helper.allMatchesInStringUnchecked = allMatchesInStringUnchecked;
  _js_helper.stringContainsUnchecked = stringContainsUnchecked;
  _js_helper.stringReplaceJS = stringReplaceJS;
  _js_helper.stringReplaceFirstRE = stringReplaceFirstRE;
  _js_helper.ESCAPE_REGEXP = ESCAPE_REGEXP;
  _js_helper.stringReplaceAllUnchecked = stringReplaceAllUnchecked;
  _js_helper.stringReplaceAllFuncUnchecked = stringReplaceAllFuncUnchecked;
  _js_helper.stringReplaceAllEmptyFuncUnchecked = stringReplaceAllEmptyFuncUnchecked;
  _js_helper.stringReplaceAllStringFuncUnchecked = stringReplaceAllStringFuncUnchecked;
  _js_helper.stringReplaceFirstUnchecked = stringReplaceFirstUnchecked;
  _js_helper.stringJoinUnchecked = stringJoinUnchecked;
  _js_helper.createRuntimeType = createRuntimeType;
  _js_helper.TypeImpl = TypeImpl;
  _js_helper.TypeVariable = TypeVariable;
  _js_helper.getMangledTypeName = getMangledTypeName;
  _js_helper.setRuntimeTypeInfo = setRuntimeTypeInfo;
  _js_helper.getRuntimeTypeInfo = getRuntimeTypeInfo;
  _js_helper.getRuntimeTypeArguments = getRuntimeTypeArguments;
  _js_helper.getRuntimeTypeArgument = getRuntimeTypeArgument;
  _js_helper.getTypeArgumentByIndex = getTypeArgumentByIndex;
  _js_helper.copyTypeArguments = copyTypeArguments;
  _js_helper.getClassName = getClassName;
  _js_helper.getRuntimeTypeAsString = getRuntimeTypeAsString;
  _js_helper.getConstructorName = getConstructorName;
  _js_helper.runtimeTypeToString = runtimeTypeToString;
  _js_helper.joinArguments = joinArguments;
  _js_helper.getRuntimeTypeString = getRuntimeTypeString;
  _js_helper.getRuntimeType = getRuntimeType;
  _js_helper.substitute = substitute;
  _js_helper.checkSubtype = checkSubtype;
  _js_helper.computeTypeName = computeTypeName;
  _js_helper.subtypeCast = subtypeCast;
  _js_helper.assertSubtype = assertSubtype;
  _js_helper.assertIsSubtype = assertIsSubtype;
  _js_helper.throwTypeError = throwTypeError;
  _js_helper.checkArguments = checkArguments;
  _js_helper.areSubtypes = areSubtypes;
  _js_helper.computeSignature = computeSignature;
  _js_helper.isSupertypeOfNull = isSupertypeOfNull;
  _js_helper.checkSubtypeOfRuntimeType = checkSubtypeOfRuntimeType;
  _js_helper.subtypeOfRuntimeTypeCast = subtypeOfRuntimeTypeCast;
  _js_helper.assertSubtypeOfRuntimeType = assertSubtypeOfRuntimeType;
  _js_helper.getArguments = getArguments;
  _js_helper.isSubtype = isSubtype;
  _js_helper.isAssignable = isAssignable;
  _js_helper.areAssignable = areAssignable;
  _js_helper.areAssignableMaps = areAssignableMaps;
  _js_helper.isFunctionSubtype = isFunctionSubtype;
  _js_helper.invoke = invoke;
  _js_helper.invokeOn = invokeOn;
  _js_helper.call = call;
  _js_helper.getField = getField;
  _js_helper.getIndex = getIndex;
  _js_helper.getLength = getLength;
  _js_helper.isJsArray = isJsArray;
  _js_helper.hasField = hasField;
  _js_helper.hasNoField = hasNoField;
  _js_helper.isJsFunction = isJsFunction;
  _js_helper.isJsObject = isJsObject;
  _js_helper.isIdentical = isIdentical;
  _js_helper.isNotIdentical = isNotIdentical;
})(_js_helper || (_js_helper = {}));