window.jQuery = require('jquery');
window.$ = require('jquery');

require('jquery-ui');
require('jquery-mousewheel');
require('jquery.scrollto');
require('./app.scss');
require('../bootstrap/js/bootstrap.min.js');
require('gridforms/gridforms/gridforms');
require('gridforms/gridforms/gridforms.css');
require('../bower_components/sapphire/build/sapphire.css');
require('../bower_components/sapphire/build/sapphire-theme.css');

var page = require('page');
var Dashboard = require('./views/dashboard');
var pg = require('./pg');
var hist = require('./hist');
var persist = require('./persist');

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


page('/filters/:id', function(ctx, next) {
  pg.push(dashboard.findFilterView(ctx.params.id));
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
});


exports.dashboard = dashboard;
