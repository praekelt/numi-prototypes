var $ = require('jquery');


var stack = [];


function push(view) {
  stack.push($('.nm-curr-pg'));
  switchTo(view);
}


function pop() {
  var view = stack.pop();
  if (view) switchTo(view);
  return view;
}


function switchTo(view) {
  $('.nm-curr-pg')
    .removeClass('nm-curr-pg')
    .detach();
  
  $(view.el)
    .addClass('nm-curr-pg')
    .appendTo('#app');
}


exports.push = push;
exports.pop = pop;
