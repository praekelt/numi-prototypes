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
  Object
    .keys(localStorage)
    .filter(function(k) {
      return k.startsWith(prefix);
    })
    .forEach(function(k) {
      localStorage.removeItem(k);
    });
}


exports.set = set;
exports.get = get;
exports.has = has;
exports.clear = clear;
