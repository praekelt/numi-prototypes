window.jQuery = require('jquery');
require('./app.scss');
require('../bootstrap/js/bootstrap.min.js');

var _ = require('lodash');
var $ = require('jquery');
var jqui = require('jquery-ui');
var page = require('page');
var Dashboard = require('./views/dashboard');
var CollectionEdit = require('./views/collection-edit');
var pg = require('./pg');

var dashboard = Dashboard({el: $('<div>')});

dashboard.push('collections', {
  id: 'collection1',
  name: 'Collection 1'
});

page.base('/numi-prototypes');


page('/', function(ctx, next) {
  pg.push(dashboard.el);
});


page('/collections/:id/edit', function(ctx, next) {
  var coll = CollectionEdit({
    el: $('<div>'),
    data: _.find(dashboard.get('collections'), {id: 'collection1'})
  });

  pg.push(coll.el);
  $('.sortable-blocks').sortable();
});


page();



window.addEventListener('beforeunload', function(e) {
  e.returnValue = "Changing the page will reset the prototype.";
});
