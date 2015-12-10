var _ = require('lodash');
var Ractive = require('ractive');


Ractive.prototype.removeWhere = function(name, query) {
  var i = _.findIndex(this.get(name), query);
  if (i > -1) this.splice(name, i, 1);
};


Ractive.prototype.findWhere = function(name, query) {
  return _.find(this.get(name), query);
};


Ractive.prototype.findComponentWhere = function(query) {
  return _.find(this.findAllComponents(), function(c) {
    return _.isMatch(c.get(), query);
  });
};
