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


Ractive.prototype.setMap = function(name, fn) {
  this.set(name, this.get(name).map(fn));
};


Ractive.prototype.setMap = function(name, fn) {
  this.set(name, this.get(name).filter(fn));
};


Ractive.prototype.updateMatches = function(name, query, props) {
  this.setMap(name, function(d) {
    return _.isMatch(d, query)
      ? _.extend({}, d, props)
      : d;
  });
};


Ractive.prototype.updateDatum = function(name, datum) {
  this.setMap(function(d) {
    return d.id === datum.id
      ? datum
      : d;
  });
};


Ractive.prototype.removeWhere = function(name, query) {
  // HACK ractive.js seems to want to recompute the properties of removed
  // components for some reason, so we set it to bypass them.
  var component = this.findComponentWhere(query);

  _.each(component.viewmodel.computations, function(computation) {
    computation.bypass = true;
  });

  var data = this.get(name);
  var i = _.findIndex(data, query);
  if (i > -1) this.splice(name, i, 1);
};


Ractive.prototype.findComponentWhere = function(query) {
  return _.find(this.findAllComponents(), function(c) {
    return _.isMatch(c.get(), query);
  });
};


Ractive.prototype.forceUpdate = function(name) {
  this.set(name, this.get(name));
};


Ractive.prototype.onDeepUpdate = function(){};


Ractive.prototype.deepUpdate = function() {
  this.findAllComponents()
    .forEach(function(c) { c.deepUpdate(); });

  this.onDeepUpdate();
  this.update();
};
