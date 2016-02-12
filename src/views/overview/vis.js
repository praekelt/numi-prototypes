var _ = require('lodash');
var d3 = require('d3');
var args = require('../../utils').args;
var store = require('./store');
var Layout = require('./layout');


function draw(el, opts) {
  opts = _.defaults(opts || {}, {
    enterCoords: {
      x: 0,
      y: 0
    },
    exitCoords: {
      x: 0,
      y: 0
    },
    transitionDuration: 0,
    root: el.datum(),
    update: update,

    lineWeight: d3.functor(1),

    nodeRadius: d3.functor(8),

    diagonal: Diagonal({
      r: 0.1618,
      s: 0.9618
    })
  });

  el.call(drawKey, opts)
    .call(drawVis, opts);

  function update(opts) {
    draw(el, _.defaults(opts, {transitionDuration: 300}));
  }
}


function drawKey(el, opts) {
  el.select('.nm-ov-key-glyph-link')
    .selectAll('.nm-ov-link')
      .data([{
        source: {
          x: 8,
          y: 16
        },
        target: {
          x: 20,
          y: 16
        }
      }])
      .call(drawLink, {
        diagonal: opts.diagonal,
        lineWeight: opts.lineWeight,
        transitionDuration: opts.transitionDuration,
        enterCoords: opts.enterCoords,
        exitCoords: opts.exitCoords,
        root: opts.root
      });

  el.select('.nm-ov-key-glyph-node-leaf')
    .selectAll('.nm-ov-node')
      .data([{
        isLink: false,
        selected: false,
        current: false,
        expanded: false,
        x: 9,
        y: 16,
        title: '',
        _children: []
      }])
      .call(drawNode, {
        nodeRadius: opts.nodeRadius,
        update: opts.update,
        root: opts.root,
        transitionDuration: opts.transitionDuration,
        enterCoords: opts.enterCoords,
        exitCoords: opts.exitCoords
      });

  el.select('.nm-ov-key-glyph-node-collapsed')
    .selectAll('.nm-ov-node')
      .data([{
        isLink: false,
        selected: false,
        current: false,
        expanded: false,
        x: 14,
        y: 16,
        title: '',
        _children: [{_children: []}]
      }])
      .call(drawNode, {
        nodeRadius: opts.nodeRadius,
        update: opts.update,
        root: opts.root,
        transitionDuration: opts.transitionDuration,
        enterCoords: opts.enterCoords,
        exitCoords: opts.exitCoords
      });

  el.select('.nm-ov-key-glyph-node-expanded')
    .selectAll('.nm-ov-node')
      .data([{
        isLink: false,
        selected: false,
        current: false,
        expanded: true,
        x: 14,
        y: 16,
        title: '',
        _children: [{_children: []}]
      }])
      .call(drawNode, {
        nodeRadius: opts.nodeRadius,
        update: opts.update,
        root: opts.root,
        transitionDuration: opts.transitionDuration,
        enterCoords: opts.enterCoords,
        exitCoords: opts.exitCoords
      });

  el.select('.nm-ov-key-glyph-selection-old')
    .selectAll('.nm-ov-link')
      .data([{
        source: {
          x: 0,
          y: 16,
          current: true
        },
        target: {
          x: 8,
          y: 16,
          current: true
        }
      }])
      .call(drawLink, {
        diagonal: opts.diagonal,
        lineWeight: opts.lineWeight,
        transitionDuration: opts.transitionDuration,
        enterCoords: opts.enterCoords,
        exitCoords: opts.exitCoords,
        root: opts.root
      });

  el.select('.nm-ov-key-glyph-selection-old')
    .selectAll('.nm-ov-node')
      .data([{
        isLink: false,
        selected: false,
        current: true,
        expanded: false,
        x: 14,
        y: 16,
        title: '',
        _children: [{_children: []}]
      }])
      .call(drawNode, {
        nodeRadius: opts.nodeRadius,
        update: opts.update,
        root: opts.root,
        transitionDuration: opts.transitionDuration,
        enterCoords: opts.enterCoords,
        exitCoords: opts.exitCoords
      });

  el.select('.nm-ov-key-glyph-selection-new')
    .selectAll('.nm-ov-link')
      .data([{
        source: {
          x: 0,
          y: 16,
          selected: true
        },
        target: {
          x: 8,
          y: 16,
          selected: true
        }
      }])
      .call(drawLink, {
        diagonal: opts.diagonal,
        lineWeight: opts.lineWeight,
        transitionDuration: opts.transitionDuration,
        enterCoords: opts.enterCoords,
        exitCoords: opts.exitCoords,
        root: opts.root
      });

  el.select('.nm-ov-key-glyph-selection-new')
    .selectAll('.nm-ov-node')
      .data([{
        isLink: false,
        selected: true,
        current: false,
        expanded: false,
        x: 14,
        y: 16,
        title: '',
        _children: [{_children: []}]
      }])
      .call(drawNode, {
        nodeRadius: opts.nodeRadius,
        update: opts.update,
        root: opts.root,
        transitionDuration: opts.transitionDuration,
        enterCoords: opts.enterCoords,
        exitCoords: opts.exitCoords
      })
      .classed('nm-ov-node-no-hint', true);
}


function drawVis(el, opts) {
  var padding = 100;
  var dims = getDims(el);

  var layout = Layout({
    width: dims.width - (padding * 2),
    height: dims.height - (padding * 2)
  });

  var nodes = layout.nodes(opts.root);
  var links = layout.links(nodes);

  var svg = el.select('.nm-ov-container')
    .attr('width', dims.width)
    .attr('height', dims.height)
    .select('.nm-vis-main')
      .attr('transform', translate(padding, padding));

  svg.select('.nm-ov-underlay')
    .attr('width', dims.width)
    .attr('height', dims.height)
    .on('click', args(deselect, opts));

  svg.select('.nm-ov-links')
    .selectAll('.nm-ov-link')
    .data(links, function(d, i) {
      return [d.source.id, d.target.id].join();
    })
    .call(drawLink, {
      diagonal: opts.diagonal,
      lineWeight: opts.lineWeight,
      transitionDuration: opts.transitionDuration,
      enterCoords: opts.enterCoords,
      exitCoords: opts.exitCoords,
      root: opts.root
    });

  svg.select('.nm-ov-nodes')
    .selectAll('.nm-ov-node')
    .data(nodes, function(d) {
      return d.id;
    })
    .call(drawNode, {
      nodeRadius: opts.nodeRadius,
      update: opts.update,
      root: opts.root,
      transitionDuration: opts.transitionDuration,
      enterCoords: opts.enterCoords,
      exitCoords: opts.exitCoords
    });
}


function deselect(d, opts) {
  store.setSelected(opts.root, false);
  opts.update();
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
    .classed('is-selected', function(d) {
      return store.isSelected(d.target);
    })
    .classed('is-current', function(d) {
      return store.isCurrent(d.target);
    })
    .transition()
      .duration(opts.transitionDuration)
      .attr('stroke-width', function(d) {
        return opts.lineWeight(d);
      })
      .attr('d', opts.diagonal);

  link
    .sort(function(a, b) {
      return nodeOrdinal(a.target) - nodeOrdinal(b.target);
    });
}


function nodeOrdinal(node) {
  if (store.isSelected(node)) return 3;
  if (store.isCurrent(node)) return 2;
  return 1;
}


function drawNode(node, opts) {
  var entering = node.enter()
    .append('g')
      .attr('radius', 0)
      .attr('transform', translate(opts.enterCoords));

  entering
    .filter(store.isInnerNode)
    .append('circle')
      .classed('nm-ov-glyph-node', true);

  entering
    .filter(store.isInnerNode)
    .append('text')
      .classed('nm-ov-hint-toggle-node', true);

  entering
    .filter(store.isLeafNode)
    .append('rect')
      .classed('nm-ov-glyph-node', true);

  entering.append('text')
    .classed('nm-ov-label-node', true);

  node.exit()
    .transition()
      .duration(opts.transitionDuration)
      .attr('radius', 0)
      .attr('transform', translate(opts.exitCoords))
      .remove();

  node
    .on('click', null)
    .on('mouseover', null)
    .on('mouseout', null)
    .on('click', args(toggleNodeSelected, opts))
    .on('mouseover', function(d) {
      d3.select(this).select('.nm-ov-label-node').text(d.title);
    })
    .on('mouseout', function(d) {
      d3.select(this).select('.nm-ov-label-node').text(nodeText(d));
    })
    .attr('class', 'nm-ov-node')
    .classed('nm-ov-node-leaf', store.isLeafNode)
    .classed('nm-ov-node-inner', store.isInnerNode)
    .classed('is-expanded', store.isExpanded)
    .classed('is-collapsed', store.isCollapsed)
    .classed('is-current', store.isCurrent)
    .transition()
      .duration(opts.transitionDuration)
      .attr('transform', function(d) {
        return translate(d);
      });

  node.select('circle')
    .attr('r', function(d) {
      return opts.nodeRadius(d);
    });

  node.select('rect')
    .attr('width', 10)
    .attr('height', 10)
    .attr('y', -5)
    .attr('rx', 2)
    .attr('ry', 2);

  node.select('.nm-ov-label-node')
    .attr('text-anchor', function(d) {
      return !d.parent
        ? 'middle'
        : 'end';
    })
    .attr('y', function(d) {
      return !d.parent
        ? -(opts.nodeRadius(d) + 6)
        : -6;
    })
    .attr('x', function(d) {
      return !d.parent
        ? 0
        : -19;
    })
    .text(nodeText);

  node.select('.nm-ov-hint-toggle-node')
    .attr('x', -5.5)
    .attr('y', 5)
    .text(function(d) {
      return store.isCollapsed(d)
        ? '+'
        : '−';
    });

  node
    .filter(store.isSelected)
    .call(drawSelectedNode, opts);
}


function nodeText(d) {
  return !store.isSelected(d) || d._children.some(store.isSelected)
    ? truncate(d.title, 18)
    : d.title;
}


function truncate(s, pos) {
  return s.length > pos
    ? s.slice(0, pos) + '…'
    : s;
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


exports.draw = draw;
