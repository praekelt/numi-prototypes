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
var campaignData = require('./data/campaigns');

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


page('/campaigns/:name', function(ctx) {
  load(ctx.params.name);
});


page('/dialogues/:id', function(ctx, next) {
  pg.push(dashboard.findDialogueView(ctx.params.id));
});


page({hashbang: true});


var hasReset = false;

window.addEventListener('beforeunload', function(e) {
  if (!hasReset) persist.set('dashboard', dashboard.get());
});


$(document).keydown(function(e) {
  // <C-Esc>
  if (e.keyCode === 27 && e.ctrlKey) {
    reset();
  }

  // <Esc>
  else if (e.keyCode === 27 && !e.ctrlKey) {
    drawers.close();
  }

  // <C-d>
  else if (e.keyCode === 83 && e.ctrlKey) {
    dashboard.download();
  }
});


function load(name) {
  dashboard.reset(campaignData[name]());
  reload();
}


function reset() {
  persist.clear();
  hasReset = true;
  reload();
}


function reload() {
  window.location = '/numi-prototypes';
}


exports.dashboard = dashboard;
