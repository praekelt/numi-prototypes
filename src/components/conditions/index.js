var uuid = require('node-uuid');


var types = {};
types.comparison = require('./comparison');
types.group = require('./group');


function create(d) {
  return _.extend({}, types[d.type]().get(), d, {id: uuid.v4()});
}

exports.create = create;
exports.types = types;
