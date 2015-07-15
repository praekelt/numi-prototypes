window.jQuery = require('jquery');
require('jquery-ui');
require('./app.scss');
require('../bootstrap/js/bootstrap.min.js');

var _ = require('lodash');
var $ = require('jquery');
var page = require('page');
var Dashboard = require('./views/dashboard');
var CollectionEdit = require('./views/collection-edit');
var pg = require('./pg');

var dashboard = Dashboard({el: $('<div>')});
var collections = {};

dashboard.push('collections', {
  id: 'collection1',
  name: 'Collection 1'
});

page.base('/numi-prototypes');


page('/', function(ctx, next) {
  pg.push(dashboard.el);
});


page('/collections/:id/edit', function(ctx, next) {
  var coll = collections[ctx.params.id] || CollectionEdit({
    el: $('<div>'),
    data: _.find(dashboard.get('collections'), {id: ctx.params.id})
  });

  collections[ctx.params.id] = coll;
  pg.push(coll.el);
});


page();



window.addEventListener('beforeunload', function(e) {
  e.returnValue = "Changing the page will reset the prototype.";
});
