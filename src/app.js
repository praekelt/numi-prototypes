window.jQuery = require('jquery');
require('./app.scss');
require('../bootstrap/js/bootstrap.min.js');
require('ractive-decorators-sortable');

var $ = require('jquery');
var page = require('page');
var Dashboard = require('./views/dashboard');
var CollectionEdit = require('./views/collection-edit');
var pg = require('./pg');


var dashboard = Dashboard({el: $('<div>')});

addCollection({
  id: 'collection1',
  name: 'Collection 1'
});

page.base('/numi-prototypes');


page('/', function(ctx, next) {
  pg.push(dashboard.el);
});


page('/collections/:id/edit', function(ctx, next) {
  pg.push(dashboard
    .get('collectionViews')
    .filter(function(col) {
      return col.get('id') === ctx.params.id;
    })
    [0]
    .el);
});


page();



window.addEventListener('beforeunload', function(e) {
  e.returnValue = "Changing the page will reset the prototype.";
});


function addCollection(data) {
  dashboard.push('collectionViews', CollectionEdit({
    el: $('<div>'),
    data: data
  }));
}
