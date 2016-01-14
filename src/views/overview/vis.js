var d3 = require('d3');
var sapphire = require('../../../bower_components/sapphire/build/sapphire');
var translate = sapphire.utils.translate;


function draw(el) {
  var padding = 15;
  var nodeRadius = 3;

  // TODO something better for dims
  var layout = d3.layout.cluster()
    .nodeSize([30, 30]);

  var nodes = layout.nodes(el.datum());
  normalizeX(nodes);

  var links = layout.links(nodes);
  var dims = getDims(el.select('svg'), nodes, padding, nodeRadius);

  var diagonal = d3.svg.diagonal()
    .projection(function(d) {
      return [d.x * dims.scale, d.y * dims.scale];
    });

  var svg = el.select('svg')
    .attr('height', dims.height + 20)
    .append('g')
      .attr('transform', translate(padding, padding));

  svg.selectAll('.nm-ov-link')
    .data(links)
    .enter().append('path')
      .call(drawLink, diagonal);

  svg.selectAll('.nm-ov-node')
    .data(nodes)
    .enter().append('g')
      .call(drawNode, dims, nodeRadius);
}


function normalizeX(nodes) {
  var minX = d3.min(nodes, function(d) { return d.x; });
  var xOffset = Math.abs(Math.min(0, minX));
  nodes.forEach(function(d) { d.x += xOffset; });
}


function getDims(svg, nodes, padding, nodeRadius) {
  var maxWidth = $(svg.node()).width() - padding;
  var maxX = d3.max(nodes, function(d) { return d.x; });
  var maxY = d3.max(nodes, function(d) { return d.y; });
  var scale = maxWidth / (Math.max(maxX, maxY) + nodeRadius);

  return {
    scale: scale,
    width: maxX * scale,
    height: maxY * scale
  };
}


function drawLink(link, diagonal) {
  link
    .attr('class', 'nm-ov-link')
    .attr('d', diagonal);
}


function drawNode(node, dims, nodeRadius) {
  node
    .attr('class', 'nm-ov-node')
    .attr('transform', function(d) {
      return translate(d.x * dims.scale, d.y * dims.scale);
    });

  node.append('circle')
    .attr('r', nodeRadius);

  node.append('text')
    .text(function(d) {
      return d.title;
    });
}


exports.draw = draw;
