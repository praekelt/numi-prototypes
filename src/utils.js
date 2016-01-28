var _ = require('lodash');


function log(v) {
  console.log.apply(console, arguments);
  return v;
}


function hashzip(names, lists) {
  return _.zipWith.apply(_, lists.concat(function(a, v, i, group) {
    return _.zipObject(names, group);
  }));
}


function isNonAscii(s) {
  if (s.length !== 1) return s.split('').some(isNonAscii);

  var code = s.charCodeAt(0);
  return code > 127
      && code !== 160;
}


function args(fn) {
  var a = _.slice(arguments, 1);

  return function(v) {
    var args = arguments.length > 0
      ? [v].concat(a, _.slice(arguments, 1))
      : a;

    return fn.apply(this, args);
  };
}


exports.log = log;
exports.hashzip = hashzip;
exports.isNonAscii = isNonAscii;
exports.args = args;
