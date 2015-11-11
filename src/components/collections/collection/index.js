var _ = require('lodash');
var $ = require('jquery');
var Base = require('../base');
var pg = require('../../../pg');
var ChooseChannel = require('../../../views/choose-channel');


module.exports = Base.extend({
  template: require('./template.html')
});
