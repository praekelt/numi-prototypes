var _ = require('lodash');
var d3 = require('d3');
var sapphire = require('../../../bower_components/sapphire/build/sapphire');
var translate = sapphire.utils.translate;


function draw(el) {
  var padding = 30;
  var nodeRadius = 4;
  var dims = getDims(el);

  // TODO something better for dims
  var layout = d3.layout.tree()
    .size([dims.width - (padding * 2), dims.height - (padding * 2)]);

  var nodes = layout.nodes(el.datum());
  normalizeX(nodes);

  var links = layout.links(nodes);

  var diagonal = Diagonal({
    projection: function(d) {
      return [d.x, d.y];
    }
  });

  var svg = el.select('svg')
    .attr('width', dims.width)
    .attr('height', dims.height)
    .append('g')
      .attr('transform', translate(padding, padding));

  svg.selectAll('.nm-ov-link')
    .data(links)
    .enter().append('path')
      .call(drawLink, diagonal);

  svg.selectAll('.nm-ov-node')
    .data(nodes)
    .enter().append('g')
      .call(drawNode, nodeRadius);
}


function normalizeX(nodes) {
  var minX = d3.min(nodes, function(d) { return d.x; });
  var xOffset = Math.abs(Math.min(0, minX));
  nodes.forEach(function(d) { d.x += xOffset; });
}


function getDims(el) {
  var $el = $(el.node());

  return {
    width: $el.width(),
    height: $el.height(),
  };
}


function drawLink(link, diagonal) {
  link
    .attr('class', 'nm-ov-link')
    .attr('d', diagonal);
}


function drawNode(node, nodeRadius) {
  node
    .attr('class', 'nm-ov-node')
    .attr('transform', function(d) {
      return translate(d.x, d.y);
    });

  node.append('circle')
    .attr('r', nodeRadius);

  node.append('text')
    .attr('text-anchor', 'middle')
    .attr('y', function(d) {
      return d.children
        ? -8
        : 18;
    })
    .text(function(d) {
      return d.title;
    });
}


function Diagonal(opts) {
  opts = _.defaults(opts || {}, {
    projection: _.identity,
    controlPointFactor: 0.382
  });

  return function(d, i) {
    var p0 = d.source;
    var p2 = d.target;
    var len = p2.y - p0.y;
    var c = p0.y + (len * opts.controlPointFactor);

    var p1 = {
      x: p2.x,
      y: c
    };

    var p = [p0, p1, p2];
    p = p.map(opts.projection);

    return ['M', p[0], 'L', p[1], ' ', p[2]].join('');
  };
}


exports.draw = draw;
