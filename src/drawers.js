var $ = require('jquery');


var duration = 300;
var stack = [];


function close() {
  var drawer = stack.pop();
  if (!drawer) return;

  return new Promise(function(resolve, reject) {
    drawer.$el
      .hide({
        effect: 'slide',
        duration: duration,
        direction: 'right',
        complete: function() {
          drawer.view
            .teardown()
            .then(resolve, reject);
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
        duration: duration,
        direction: 'right',
        complete: function() {
          focusFirstInput(view.el);
          resolve();
        }
      });
  });
}


function change(view) {
  close().then(function() { open(view); });
}


function newDrawer() {
  return $([
    '<div class="container nm-drawer" hidden>',
    '  <div class="row">',
    '    <div class="col-xs-12 col-sm-offset-6 col-sm-6 col-md-offset-8 col-md-4 nm-drawer-body">',
    '  </div>',
    '  </div>',
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
