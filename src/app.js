window.jQuery = require('jquery');
require('jquery-ui');
require('./app.scss');
require('../bootstrap/js/bootstrap.min.js');

var _ = require('lodash');
var $ = require('jquery');
var page = require('page');
var Dashboard = require('./views/dashboard');
var pg = require('./pg');


window.dashboard = Dashboard({el: $('<div>')});

page.base('/numi-prototypes');


page('/', function(ctx, next) {
  dashboard.update();
  pg.push(dashboard.el);
});


page('/collections/:id/edit', function(ctx, next) {
  var coll = _.find(dashboard.get('collectionViews'), function(c) {
    return c.get('id') === ctx.params.id;
  });

  pg.push(coll.el);
});


page('/filters/:id/edit', function(ctx, next) {
  var filter = _.find(dashboard.get('filterViews'), function(c) {
    return c.get('id') === ctx.params.id;
  });

  pg.push(filter.el);
});


page();



window.addEventListener('beforeunload', function(e) {
  e.returnValue = "Changing the page will reset the prototype.";
});


exports.dashboard = dashboard;
