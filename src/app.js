window.jQuery = require('jquery');
require('jquery-ui');
require('./app.scss');
require('../bootstrap/js/bootstrap.min.js');

var Ractive = require('ractive');
Ractive.components.block = require('./components/blocks/block');

var $ = require('jquery');
var page = require('page');
var Dashboard = require('./views/dashboard');
var pg = require('./pg');
var hist = require('./hist');
var persist = require('./persist');


window.dashboard = Dashboard({
  el: $('<div>'),
  data: persist.has('dashboard')
    ? persist.get('dashboard')
    : {
      values: [],
      labels: [],
      filters: [],
      collections: []
    }
});
page.base('/numi-prototypes');


page('/', function(ctx, next) {
  hist.clear();
  dashboard.update();
  pg.push(dashboard);
});


page('/collections/:id/edit', function(ctx, next) {
  pg.push(dashboard.findCollectionView(ctx.params.id));
});


page('/filters/:id/edit', function(ctx, next) {
  pg.push(dashboard.findFilterView(ctx.params.id));
});


page();



var reset = false;

window.addEventListener('beforeunload', function(e) {
  if (!reset) persist.set('dashboard', dashboard.get());
});


$(document).keydown(function(e) {
  // <C-Esc>
  if (e.keyCode === 27 && e.ctrlKey) {
    persist.clear();
    reset = true;
    location.reload();
  }
});


exports.dashboard = dashboard;
