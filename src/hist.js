var stack = [];


function push(view) {
  stack.push(view);
}


function pop() {
  var view = peek();
  stack.pop();
  return view;
}


function peek() {
  var view = stack.slice(-1)[0];
  return view && view.get('histName') && view.get('href')
    ? {
      name: view.get('histName'),
      href: view.get('href')
    }
    : null;
}


function clear() {
  stack = [];
}


exports.push = push;
exports.pop = pop;
exports.peek = peek;
exports.clear = clear;
