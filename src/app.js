window.jQuery = require('jquery');
window.$ = require('jquery');
window.log = console.log.bind(console);

require('jquery-ui');
require('jquery-mousewheel');
require('jquery.scrollto');
require('./app.scss');
require('../bootstrap/js/bootstrap.min.js');
require('../bower_components/sapphire/build/sapphire.css');
require('../bower_components/sapphire/build/sapphire-theme.css');
require('./ractive-extensions');
require('rangy/lib/rangy-textrange');

var page = require('page');
var Dashboard = require('./views/dashboard');
var pg = require('./pg');
var drawers = require('./drawers');
var hist = require('./hist');
var persist = require('./persist');

window.log = require('./utils').log;

window.dashboard = Dashboard({
  el: $('<div>'),
  data: persist.has('dashboard')
    ? persist.get('dashboard')
    : {}
});

page.base('/numi-prototypes');

page('/', function(ctx, next) {
  hist.clear();
  dashboard.update();
  pg.push(dashboard);
});


page('/dialogues/:id', function(ctx, next) {
  pg.push(dashboard.findDialogueView(ctx.params.id));
});

page('/dialogues/:id/overview', function(ctx, next) {
  dashboard.showDialogueOverview(ctx.params.id);
});


page({hashbang: true});


var reset = false;

window.addEventListener('beforeunload', function(e) {
  if (!reset) persist.set('dashboard', dashboard.get());
});


$(document).keydown(function(e) {
  // <C-Esc>
  if (e.keyCode === 27 && e.ctrlKey) {
    persist.clear();
    reset = true;
    window.location = '/numi-prototypes';
  }

  // <Esc>
  else if (e.keyCode === 27 && !e.ctrlKey) {
    drawers.close();
  }
});


exports.dashboard = dashboard;
