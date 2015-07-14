window.jQuery = require('jquery');
require('./app.scss');
require('../bootstrap/js/bootstrap.min.js');

var $ = require('jquery');
var page = require('page');
var CollectionEdit = require('./views/collection-edit');
var pg = require('./pg');


// make already existing collections here
var collections = {
  'collection1': makeCollection({name: 'Collection 1'})
};


page.base('/numi-prototypes');


// TODO change this to go to a campaign view once we have multiple collections
page('/', function(ctx, next) {
  pg.push(collections.collection1.edit.el);
});


page('/collections/:id/edit', function(ctx, next) {
  pg.push(collections[ctx.params.id].edit.el);
});


page();


function makeCollection(data) {
  return {
    edit: CollectionEdit({
      el: $('<div>'),
      data: {
        name: 'Collection 1'
      }
    })
  };
}


window.addEventListener('beforeunload', function(e) {
  e.returnValue = "Changing the page will reset the prototype.";
});
