var _ = require('lodash');
var $ = require('jquery');


var openDuration = 200;
var closeDuration = 100;
var stack = [];


function close(view) {
  var i = _.findIndex(stack, {view: view});
  if (i < 0) return Promise.resolve();
  var drawer = stack[i];
  stack.splice(i, 1);

  return new Promise(function(resolve, reject) {
    drawer.$el
      .hide({
        effect: 'slide',
        duration: closeDuration,
        direction: 'right',
        complete: function() {
          drawer.view.teardown();
          resolve();
        }
      });
  });
}


function open(view) {
  var drawer = {
    $el: newDrawer().appendTo('.nm-drawers'),
    view: view
  };

  stack.push(drawer);

  return new Promise(function(resolve) {
    drawer.$el
      .find('.nm-drawer-body')
      .append(view.el);

    drawer.$el
      .show({
        effect: 'slide',
        duration: openDuration,
        direction: 'right',
        complete: function() {
          focusFirstInput(view.el);
          resolve();
        }
      });
  });
}


function change(view) {
  var curr = _.last(stack);

  return curr
    ? close(curr.view).then(function() { return open(view); })
    : open(view);
}


function newDrawer() {
  return $([
    '<div class="nm-drawer" hidden>',
  '    <div class="nm-drawer-body"></div>',
    '</div>'
  ].join('\n'));
}


function focusFirstInput(el) {
  var $input = $(el).find(':input').eq(0);
  var val = $input.val();
  if (val) $input.val('').val(val);
  $input.focus();
}


exports.close = close;
exports.open = open;
exports.change = change;
