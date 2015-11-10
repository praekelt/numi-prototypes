var _ = require('lodash');
var prefix = 'numi-prototype:';


function set(k, v) {
  localStorage.setItem(prefix + k, JSON.stringify(v));
}


function get(k) {
  return JSON.parse(localStorage.getItem(prefix + k));
}


function has(k) {
  return (prefix + k) in localStorage;
}


function clear() {
  _.chain(localStorage)
    .keys()
    .filter(function(k) {
      return k.startsWith(prefix);
    })
    .each(function(k) {
      localStorage.removeItem(k);
    });
}


exports.set = set;
exports.get = get;
exports.has = has;
exports.clear = clear;
