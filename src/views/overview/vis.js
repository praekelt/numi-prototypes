var _ = require('lodash');
var d3 = require('d3');
var setExpanded = require('./data').setExpanded;


function draw(el, enterCoords, exitCoords) {
  var padding = 20;
  var nodeRadius = 4;
  var dims = getDims(el);

  enterCoords = enterCoords || {
    x: 0,
    y: 0
  };

  exitCoords = exitCoords || {
    x: 0,
    y: 0
  };

  // TODO something better for dims
  var layout = d3.layout.tree()
    .size([
      dims.width - (padding * 2),
      dims.height - (padding * 2)]);

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
    .select('.nm-vis-main')
      .attr('transform', translate(padding, padding));

  svg.selectAll('.nm-ov-link')
    .data(links, function(d, i) {
      return [d.source.id, d.target.id].join();
    })
    .call(drawLink, diagonal, enterCoords, exitCoords);

  svg.selectAll('.nm-ov-node')
    .data(nodes, function(d) {
      return d.id;
    })
    .call(drawNode, nodeRadius, update, enterCoords, exitCoords);


  function update(enterCoords, exitCoords) {
    draw(el, enterCoords, exitCoords);
  }
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
    height: $el.height()
  };
}


function drawLink(link, diagonal, enterCoords, exitCoords) {
  link.enter()
    .append('path')
      .attr('stroke-width', 0)
      .attr('d', diagonal({
        source: enterCoords,
        target: enterCoords
      }));

  link.exit()
    .transition()
      .duration(300)
      .attr('stroke-width', 0)
      .attr('d', diagonal({
        source: exitCoords,
        target: exitCoords
      }))
      .remove();

  link
    .attr('class', 'nm-ov-link')
    .transition()
      .duration(300)
      .attr('d', diagonal);
}


function drawNode(node, nodeRadius, update, enterCoords, exitCoords) {
  var entering = node.enter()
    .append('g')
      .attr('radius', 0)
      .attr('transform', translate(enterCoords));

  entering.append('circle');
  entering.append('text');

  node.exit()
    .transition()
      .duration(300)
      .attr('radius', 0)
      .attr('transform', translate(exitCoords))
      .remove();

  node
    .on('click', function(d) {
      setExpanded(d, !d.expanded);
      update({
        x: d.x,
        y: d.y
      }, d);
    })
    .attr('class', 'nm-ov-node')
    .transition()
      .duration(300)
      .attr('transform', function(d) {
        return translate(d.x, d.y);
      });

  node.select('circle')
    .attr('r', nodeRadius);

  node.select('text')
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



function translate(x, y) {
  var d = arguments.length > 1
    ? {
      x: x,
      y: y
    }
    : x;

  return 'translate(' + d.x + ',' + d.y + ')';
}


exports.draw = draw;
