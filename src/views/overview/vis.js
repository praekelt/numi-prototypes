var d3 = require('d3');
var sapphire = require('../../../bower_components/sapphire/build/sapphire');
var translate = sapphire.utils.translate;


function draw(el) {
  // TODO something better for dims
  var width = 640;
  var height = 480;

  var layout = d3.layout.cluster()
    .size([width - 40, height - 40]);

  var nodes = layout.nodes(el.datum());
  var links = layout.links(nodes);

  var diagonal = d3.svg.diagonal();

  var svg = el.select('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
      .attr('transform', translate(20, 20));

  svg.selectAll('.nm-ov-link')
    .data(links)
    .enter().append('path')
      .call(drawLink, diagonal);

  svg.selectAll('.nm-ov-node')
    .data(nodes)
    .enter().append('g')
      .call(drawNode);
}


function drawLink(link, diagonal) {
  link
    .attr('class', 'nm-ov-link')
    .attr('d', diagonal);
}


function drawNode(node) {
  node
    .attr('class', 'nm-ov-node')
    .attr('transform', function(d) {
      return translate(d.x, d.y);
    });

  node.append('circle')
    .attr('r', 3);

  node.append('text')
    .text(function(d) {
      return d.title;
    });
}


exports.draw = draw;
