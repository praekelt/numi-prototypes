var uuid = require('node-uuid');


var types = {};
types.comparison = require('./comparison');
types.group = require('./group');
types.haslabel = require('./has-label');
types.nothaslabel = require('./not-has-label');
types.datepast = require('./date-past');
types.datefuture = require('./date-future');


function create(d) {
  return _.extend({}, types[d.type]().get(), d, {id: uuid.v4()});
}


exports.create = create;
exports.types = types;
