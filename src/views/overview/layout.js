var d3 = require('d3');
var _ = require('lodash');


function Layout(opts) {
  opts = _.defaults(opts || {}, {
    separation: _.constant(2)
  });

  var tree = d3.layout.tree()
    .separation(opts.separation)
    .size([opts.height, opts.width]);

  return {
    nodes: calcNodes,
    links: calcLinks
  };

  function calcNodes(data) {
    var nodes = tree.nodes(data);
    normalizeX(nodes);
    nodes.forEach(flip);
    return nodes;
  }

  function calcLinks(nodes) {
    return tree.links(nodes);
  }
}


function normalizeX(nodes) {
  var minX = d3.min(nodes, function(d) { return d.x; });
  var xOffset = Math.abs(Math.min(0, minX));
  nodes.forEach(function(d) { d.x += xOffset; });
}


function flip(d) {
  var x = d.x;
  d.x = d.y;
  d.y = x;
}


module.exports = Layout;
