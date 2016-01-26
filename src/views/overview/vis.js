var _ = require('lodash');
var d3 = require('d3');
var args = require('../../utils').args;
var store = require('./store');
var Layout = require('./layout');


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

  var layout = Layout({
    width: dims.width - (padding * 2),
    height: dims.height - (padding * 2)
  });

  var nodes = layout.nodes(el.datum());
  var links = layout.links(nodes);

  var lineWeight = d3.scale.linear()
    .domain([1, 100, 500, 800, 1000])
    .range([1]);

  var nodeRadius = d3.scale.linear()
    .domain([1, 2, 50, 1000])
    .range([5, 7, 10, 15]);

  var diagonal = Diagonal({
    r: 0.1618,
    s: 0.9618
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
      exitCoords: opts.exitCoords,
      root: nodes[0]
    });

  svg.select('.nm-ov-nodes')
    .selectAll('.nm-ov-node')
    .data(nodes, function(d) {
      return d.id;
    })
    .call(drawNode, {
      nodeRadius,
      update,
      root: nodes[0],
      transitionDuration: opts.transitionDuration,
      enterCoords: opts.enterCoords,
      exitCoords: opts.exitCoords
    });

  function update(opts) {
    draw(el, _.defaults(opts, {transitionDuration: 300}));
  }
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

  link
    .filter(function(d) {
      return store.isSelected(d.target);
    })
    .call(drawSelectedLink, opts);

  link
    .sort(function(a, b) {
      return +store.isSelected(a.target) - +store.isSelected(b.target);
    });
}


function drawSelectedLink(link, opts) {
  link
    .classed('is-selected', true);
}


function drawNode(node, opts) {
  var entering = node.enter()
    .append('g')
      .attr('radius', 0)
      .attr('transform', translate(opts.enterCoords));

  entering.append('circle');
  entering.append('text');

  node.exit()
    .transition()
      .duration(opts.transitionDuration)
      .attr('radius', 0)
      .attr('transform', translate(opts.exitCoords))
      .remove();

  node
    .on('click', null)
    .on('click', args(toggleNodeSelected, opts))
    .attr('class', 'nm-ov-node')
    .classed('nm-ov-node-leaf', store.isLeafNode)
    .classed('nm-ov-node-inner', store.isInnerNode)
    .classed('is-expanded', store.isExpanded)
    .classed('is-collapsed', store.isCollapsed)
    .transition()
      .duration(opts.transitionDuration)
      .attr('transform', function(d) {
        return translate(d);
      });

  node.select('circle')
    .attr('r', function(d) {
      return opts.nodeRadius(nodeWeight(d));
    });

  node.select('text')
    .attr('text-anchor', 'right')
    .attr('y', -12)
    .attr('x', -140)
    .text(function(d) {
      return d.title;
    });


  node
    .filter(store.isSelected)
    .call(drawSelectedNode, opts);
}


function drawSelectedNode(node, opts) {
  node
    .on('click', args(expandNode, opts))
    .classed('is-selected', true);
}


function toggleNodeSelected(d, opts) {
  store.toggleSelected(d, opts.root);
  updateFrom(d, opts);
}


function expandNode(d, opts) {
  store.setExpanded(d, !store.isExpanded(d));
  updateFrom(d, opts);
}


function updateFrom(d, opts) {
  opts.update({
    enterCoords: {
      x: d.x,
      y: d.y
    },
    exitCoords: d
  });
}


function Diagonal(opts) {
  opts = _.defaults(opts || {}, {
    projection: function(d) {
      return [d.x, d.y];
    },
    r: 0.182,
    s: 0.9
  });

  return function(d, i) {
    var pA = d.source;
    var pB = d.target;
    var lenX = pB.x - pA.x;
    var lenY = pB.y - pA.y;
    var cX = pA.x + (lenX * opts.r);
    var lenCX = pB.x - cX;

    var p = [
      pA, {
       x: cX,
       y: pA.y
      }, {
       x: cX,
       y: pA.y + (lenY * opts.s)
      }, {
       x: pB.x - (lenCX * opts.s),
       y: pB.y
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


function linkWeight(d) {
  return nodeWeight(d.target);
}


function nodeWeight(d) {
  var n = 0;
  store.walk(d, function() { n++; });
  return n;
}


exports.draw = draw;
