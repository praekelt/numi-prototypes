var $ = require('jquery');


var stack = [];


function push(el) {
  stack.push($('.nm-curr-pg'));
  switchTo(el);
}


function pop() {
  var el = stack.pop();
  if (el) switchTo(el);
}


function switchTo(el) {
  $('.nm-curr-pg')
    .removeClass('nm-curr-pg')
    .detach();
  
  $(el)
    .addClass('nm-curr-pg')
    .appendTo('#app');
}


exports.push = push;
exports.pop = pop;
