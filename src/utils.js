function log(v) {
  console.log.apply(console, arguments);
  return v;
}


function hashzip(names, lists) {
  return _.zipWith.apply(_, lists.concat(function(a, v, i, group) {
    return _.zipObject(names, group);
  }));
}


exports.log = log;
exports.hashzip = hashzip;
