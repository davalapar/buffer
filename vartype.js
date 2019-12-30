// ES5 compatible, using typeof & Object.prototype.toString
// - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString#Using_toString_to_detect_object_class
// - http://www.ecma-international.org/ecma-262/7.0/index.html#sec-object.prototype.tostring

// https://caniuse.com/#search=isInteger
const isInteger = typeof Number.isInteger === 'function'
  ? Number.isInteger
  : value => Math.floor(value) === value;

const vartype = (value, strict) => {
  if (strict === true) {
    // strict:
    // - everything in loose mode
    // - integer, float, double
    // - error, date, regexp
    // - typed arrays
    let type = Object.prototype.toString.call(value);
    type = type.substring(8, type.length - 1).toLowerCase();
    switch (type) {
      case 'number':
        if (Number.isNaN(value) === true) {
          return 'nan';
        }
        if (Number.isFinite(value) === false) {
          return 'infinity';
        }
        if (isInteger(value)) {
          return 'integer';
        }
        if (Math.fround(value) === value) {
          return 'float';
        }
        return 'double';
      default:
        return type;
    }
  }
  // loose (default):
  // - null, array, object
  // - number, nan, infinity
  // - undefined, boolean, string, bigint, symbol, function
  const type = typeof value;
  switch (type) {
    case 'object': {
      if (value === null) {
        return 'null';
      }
      if (Array.isArray(value) === true) {
        return 'array';
      }
      return 'object';
    }
    case 'number':
      if (Number.isNaN(value) === true) {
        return 'nan';
      }
      if (Number.isFinite(value) === false) {
        return 'infinity';
      }
      return type;
    default:
      return type;
  }
};

module.exports = vartype;
