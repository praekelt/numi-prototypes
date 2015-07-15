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

var dashboard = Dashboard({
  el: $('<div>'),
  data: {collectionViews: []}
});


dashboard.push('collectionViews', CollectionEdit({
  el: $('<div>'),
  data: {
    id: 'collection1',
    name: 'Collection 1'
  }
}));


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


page();



window.addEventListener('beforeunload', function(e) {
  e.returnValue = "Changing the page will reset the prototype.";
});
