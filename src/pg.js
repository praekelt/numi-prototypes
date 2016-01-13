var $ = require('jquery');


var stack = [];


function push(view) {
  stack.push(view);
  switchTo(view);
}


function pop() {
  stack.pop();
  var view = peek();
  if (view) switchTo(view);
  return view;
}


function peek() {
  return stack.slice(-1)[0];
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
exports.peek = peek;
