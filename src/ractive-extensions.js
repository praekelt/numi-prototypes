var _ = require('lodash');
var Ractive = require('ractive');


Ractive.prototype.removeWhere = function(name, query) {
  var i = _.findIndex(this.get(name), query);
  if (i > -1) this.splice(name, i, 1);
};


Ractive.prototype.findIndex = function(name, query) {
  return _.find(this.get(name), query);
};


Ractive.prototype.findWhere = function(name, query) {
  return _.find(this.get(name), query);
};


Ractive.prototype.remap = function(name, fn) {
  this.set(name, this.get(name).map(fn));
};


Ractive.prototype.updateMatches = function(name, query, props) {
  this.remap(name, function(d) {
    return _.isMatch(d, query)
      ? _.extend({}, d, props)
      : d;
  });
};


Ractive.prototype.updateDatum = function(name, datum) {
  this.remap(function(d) {
    return d.id === datum.id
      ? datum
      : d;
  });
};


Ractive.prototype.findComponentWhere = function(query) {
  return _.find(this.findAllComponents(), function(c) {
    return _.isMatch(c.get(), query);
  });
};
