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


exports.log = log;
exports.hashzip = hashzip;
exports.isNonAscii = isNonAscii;
