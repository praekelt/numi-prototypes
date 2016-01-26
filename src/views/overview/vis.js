var _ = require('lodash');
var d3 = require('d3');
var data = require('./data');
var setExpanded = data.setExpanded;
var isInnerNode = data.isInnerNode;
var isLeafNode = data.isLeafNode;
var isExpanded = data.isExpanded;
var isCollapsed = data.isCollapsed;


function draw(el, opts) {
  var padding = 20;
  var dims = getDims(el);

  opts = _.defaults(opts || {}, {
    enterCoords: {
      x: 0,
      y: 0
    },
    exitCoords: {
      x: 0,
      y: 0
    },
    transitionDuration: 0
  });


  // TODO something better for dims
  var layout = d3.layout.tree()
    .separation(function() { return 2; })
    .size([
      dims.height - (padding * 2),
      dims.width - (padding * 2)]);

  var nodes = layout.nodes(el.datum());
  normalizeX(nodes);

  var links = layout.links(nodes);

  var lineWeight = d3.scale.linear()
    .domain([1, 100, 500, 800, 1000])
    .range([1]);

  var nodeRadius = d3.scale.linear()
    .domain([1, 2, 50, 1000])
    .range([2, 7, 10, 15]);

  var diagonal = Diagonal({
    r: 0.1618,
    s: 0.9618,
    projection: function(d) {
      return [d.y, d.x];
    }
  });

  var svg = el.select('svg')
    .attr('width', dims.width)
    .attr('height', dims.height)
    .select('.nm-vis-main')
      .attr('transform', translate(padding, padding));

  svg.select('.nm-ov-links')
    .selectAll('.nm-ov-link')
    .data(links, function(d, i) {
      return [d.source.id, d.target.id].join();
    })
    .call(drawLink, {
      diagonal,
      lineWeight,
      transitionDuration: opts.transitionDuration,
      enterCoords: opts.enterCoords,
      exitCoords: opts.exitCoords
    });

  svg.select('.nm-ov-nodes')
    .selectAll('.nm-ov-node')
    .data(nodes, function(d) {
      return d.id;
    })
    .call(drawNode, {
      nodeRadius,
      update,
      transitionDuration: opts.transitionDuration,
      enterCoords: opts.enterCoords,
      exitCoords: opts.exitCoords
    });

  function update(opts) {
    draw(el, _.defaults(opts, {transitionDuration: 300}));
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


function drawLink(link, opts) {
  link.enter()
    .append('path')
      .attr('stroke-width', 0)
      .attr('d', opts.diagonal({
        source: opts.enterCoords,
        target: opts.enterCoords
      }));

  link.exit()
    .transition()
      .duration(opts.transitionDuration)
      .attr('stroke-width', 0)
      .attr('d', opts.diagonal({
        source: opts.exitCoords,
        target: opts.exitCoords
      }))
      .remove();

  link
    .attr('class', 'nm-ov-link')
    .transition()
      .duration(opts.transitionDuration)
      .attr('stroke-width', function(d) {
        return opts.lineWeight(linkWeight(d));
      })
      .attr('d', opts.diagonal);
}


function drawNode(node, opts) {
  var entering = node.enter()
    .append('g')
      .attr('radius', 0)
      .attr('transform', translate(flip(opts.enterCoords)))
      .on('click', function(d) {
        setExpanded(d, !isExpanded(d));

        opts.update({
          enterCoords: {
            x: d.x,
            y: d.y
          },
          exitCoords: d
        });
      });

  entering.append('circle');
  entering.append('text');

  node.exit()
    .transition()
      .duration(opts.transitionDuration)
      .attr('radius', 0)
      .attr('transform', translate(flip(opts.exitCoords)))
      .remove();

  node
    .attr('class', 'nm-ov-node')
    .classed('nm-ov-node-leaf', isLeafNode)
    .classed('nm-ov-node-inner', isInnerNode)
    .classed('is-expanded', isExpanded)
    .classed('is-collapsed', isCollapsed)
    .transition()
      .duration(opts.transitionDuration)
      .attr('transform', function(d) {
        return translate(flip(d.x, d.y));
      });

  node.select('circle')
    .attr('r', function(d) {
      return opts.nodeRadius(nodeWeight(d));
    });

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
    r: 0.182,
    s: 0.9
  });

  return function(d, i) {
    var pA = d.source;
    var pB = d.target;
    var lenY = pB.y - pA.y;
    var lenX = pB.x - pA.x;
    var cY = pA.y + (lenY * opts.r);
    var lenCY = pB.y - cY;

    var p = [
      pA, {
       x: pA.x,
       y: cY
      }, {
       x: pA.x + (lenX * opts.s),
       y: cY
      }, {
       x: pB.x,
       y: pB.y - (lenCY * opts.s)
      },
      pB];

    p = p.map(opts.projection);

    return ['M', p[0], 'L']
      .concat(p.slice(1).join(' '))
      .join('');
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


function flip(x, y) {
  var d = arguments.length > 1
    ? {
      x: x,
      y: y
    }
    : x;

  return {
    x: d.y,
    y: d.x
  };
}


function linkWeight(d) {
  return nodeWeight(d.target);
}


function nodeWeight(d) {
  var n = 0;
  walk(d, function() { n++; });
  return n;
}


function walk(root, fn) {
  each(root, fn);

  function each(node) {
    fn(node);
    node._children.forEach(each);
  }
}


exports.draw = draw;
