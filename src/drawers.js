var _ = require('lodash');
var $ = require('jquery');


var openDuration = 200;
var closeDuration = 200;
var changeCloseDuration = 100;
var stack = [];


function close(view, duration) {
  var i = stack.length - 1;
  if (view) i = _.findIndex(stack, {view: view});
  if (i < 0) return Promise.resolve();

  var drawer = stack[i];
  stack.splice(i, 1);

  return new Promise(function(resolve, reject) {
    drawer.$el
      .hide({
        effect: 'slide',
        duration: duration || closeDuration,
        direction: 'right',
        complete: function() {
          $('body').unbind('click', drawer.onBodyClick);
          drawer.view.teardown();
          resolve();
        }
      });
  });
}


function closeAll() {
  while (stack.length) close();
}


function open(view, opts) {
  var drawer = {
    view: view,
    $el: newDrawer(opts).appendTo('.nm-drawers'),
    onBodyClick: onBodyClick
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
          $('body').on('click', onBodyClick);
          focusFirstInput(view.el);
          resolve();
        }
      });
  });

  function onBodyClick(e) {
    var $target = $(e.target);
    if ($target.is(':input')) return;
    if ($target.parents('.nm-drawer').length > 0) return;
    close(drawer.view);
  }
}


function change(view) {
  var curr = _.last(stack);

  return curr
    ? close(curr.view, changeCloseDuration)
      .then(function() { return open(view); })
    : open(view);
}


function isFirst(view) {
  return _.findIndex(stack, {view: view}) === 0;
}


function newDrawer(opts) {
  opts = _.defaults({}, opts || {}, {isThin: false});

  var $el = $([
    '<div class="nm-drawer" hidden>',
  '    <div class="nm-drawer-body"></div>',
    '</div>'
  ].join('\n'));

  if (opts.isThin) $el.addClass('nm-drawer-thin');

  return $el;
}


function focusFirstInput(el) {
  var $input = $(el).find(':not(button):input,.nm-editor').eq(0);

  if ($input.is(':input')) {
    var val = $input.val();
    if (val) $input.val('').val(val);
  }

  $input.focus();
}


exports.close = close;
exports.closeAll = closeAll;
exports.open = open;
exports.change = change;
exports.isFirst = isFirst;
