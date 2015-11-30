var d3 = require('d3');
var sapphire = require('../bower_components/sapphire/build/sapphire');
var utils = sapphire.utils;


module.exports = sapphire.widgets.widget.extend()
  .prop('title')
  .set(d3.functor)
  .default(function(d) { return d.title; })

  .prop('metrics')
  .set(d3.functor)
  .default(function(d) { return d.metrics; })

  .prop('key')
  .set(d3.functor)
  .default(function(d, i) { return i; })

  .prop('metricTitle')
  .set(d3.functor)
  .default(function(d) { return d.title; })

  .prop('values')
  .set(d3.functor)
  .default(function(d) { return d.values; })

  .prop('x')
  .set(d3.functor)
  .default(function(d) { return d.x; })

  .prop('y')
  .set(d3.functor)
  .default(function(d) { return d.y; })

  .prop('xTickFormat')
  .default(null)

  .prop('xTicks')
  .default(8)

  .prop('yFormat')
  .default(d3.format('.1p'))

  .prop('yTicks')
  .default(5)

  .prop('yTickFormat')
  .default(d3.format('.1p'))

  .prop('yMin')
  .set(d3.functor)
  .default(d3.min)

  .prop('yMax')
  .set(d3.functor)
  .default(d3.max)

  .prop('none')
  .default(0)

  .prop('chartMargin')
  .default({
    top: 10,
    left: 45,
    right: 5,
    bottom: 20
  })

  .prop('colors')
  .prop('chart')
  .prop('legend')

  .init(function() {
    this.colors(d3.scale.category10());
  })

  .draw(function(el) {
    var opts = this.props();
    normalize(el, opts);
    drawWidget(el, opts);
  });


function drawWidget(el, opts) {
  el.classed('sph-widget sph-areas', true);

  if (!opts.explicitComponents) initComponents(el);

  var component = el.select('[data-widget-component="title"]');
  if (component.size()) component.call(drawTitle);

  component = el.select('[data-widget-component="chart"]');
  if (component.size()) component.datum(getMetrics).call(drawChart, opts);

  component = el.select('[data-widget-component="legend"]');
  if (component.size()) component.datum(getMetrics).call(drawLegend, opts);
}


function initComponents(el) {
  el.append('div')
    .attr('data-widget-component', 'title');

  el.append('div')
    .attr('data-widget-component', 'chart');

  el.append('div')
    .attr('data-widget-component', 'legend');
}


function drawTitle(title) {
  title
    .classed('sph-title', true)
    .text(function(d) { return d.title; });
}


function drawChart(chart, opts) {
  chart
    .classed('sph-chart sph-chart-areas', true);

  var dims = utils.box()
    .margin(opts.chartMargin)
    .width(utils.innerWidth(chart))
    .height(utils.innerHeight(chart))
    .calc();

  var allValues = chart
    .datum()
    .reduce(function(results, metric) {
      results.push.apply(results, metric.values);
      return results;
    }, []);

  var fx = d3.time.scale()
    .domain(d3.extent(allValues, function(d) { return d.x; }))
    .range([0, dims.innerWidth]);

  var y0s = allValues
    .map(function(d) { return d.y0; });

  var y1s = allValues
    .map(function(d) { return d.y1; });

  var fy = d3.scale.linear()
    .domain([opts.yMin(y0s), opts.yMax(y1s)])
    .range([dims.innerHeight, 0]);

  chart
    .filter(utils.isEmptyNode)
    .call(initChart);

  chart.select('svg')
    .call(drawSvg, dims, fx, fy, opts);
}


function initChart(chart) {
  var svg = chart.append('svg')
    .append('g');

  svg.append('g')
    .attr('class', 'sph-areas-metrics');

  svg.append('g')
    .attr('class', 'sph-axis sph-axis-lines sph-axis-lines-x');

  svg.append('g')
    .attr('class', 'sph-axis sph-axis-lines sph-axis-lines-y');
}


function drawSvg(svg, dims, fx, fy, opts) {
  svg
    .attr('width', dims.width)
    .attr('height', dims.height)
    .select('g')
      .attr('transform', utils.translate(dims.margin.left, dims.margin.top));

  svg.select('.sph-areas-metrics')
    .call(drawChartMetrics, fx, fy);

  svg.select('.sph-axis-lines-x')
    .call(drawXAxis, dims, fx, opts);

  svg.select('.sph-axis-lines-y')
    .call(drawYAxis, dims, fy, opts);
}


function drawChartMetrics(metrics, fx, fy) {
  var area = d3.svg.area()
    .x(function(d) { return fx(d.x); })
    .y0(function(d) { return fy(d.y0); })
    .y1(function(d) { return fy(d.y1); });

  metrics.selectAll('.sph-areas-metric')
    .data(function(d) { return d; },
          function(d) { return d.key; })
    .call(drawChartMetric, fx, fy, area);
}


function drawChartMetric(metric, fx, fy, area) {
  metric.enter().append('g')
    .attr('class', 'sph-areas-metric')
    .attr('data-key', function(d) { return d.key; })
    .append('path')
      .attr('class', 'sph-areas-area');

  metric.select('.sph-areas-area')
    .attr('fill', function(d) { return d.color; })
    .attr('d', function(d) { return area(d.values); });

  metric.exit()
    .remove();
}


function drawXAxis(axis, dims, fx, opts) {
  axis
    .attr('transform', utils.translate(0, dims.innerHeight))
    .call(d3.svg.axis()
      .scale(fx)
      .tickPadding(8)
      .ticks(opts.xTicks)
      .tickFormat(opts.xTickFormat)
      .tickSize(-dims.innerHeight));
}


function drawYAxis(axis, dims, fy, opts) {
  axis.call(d3.svg.axis()
    .orient('left')
    .scale(fy)
    .tickPadding(8)
    .ticks(opts.yTicks)
    .tickFormat(opts.yTickFormat)
    .tickSize(-dims.innerWidth));
}


function drawLegend(legend, opts) {
  legend
    .filter(utils.isEmptyNode)
    .call(initLegend);

  legend.select('.sph-table-areas').selectAll('.sph-row-areas-metric')
    .data(function(d) { return d; },
          function(d) { return d.key; })
    .call(drawLegendMetric, opts);
}


function initLegend(legend) {
  legend.append('table')
    .classed('sph-table sph-table-areas', true);
}


function drawLegendMetric(metric, opts) {
  var none = opts.yFormat(opts.none);

  metric.enter().append('tr')
    .call(enterLegendMetric);

  metric.select('.sph-col-swatch')
    .style('background', function(d) { return d.color; });

  metric.select('.sph-col-areas-title')
    .text(function(d) { return d.title; });

  metric.select('.sph-col-areas-value')
    .text(function(d) {
      d = d.values[d.values.length - 1];

      return d
        ? opts.yFormat(d.y)
        : none;
    });

  metric.exit()
    .remove();
}


function enterLegendMetric(metric) {
  metric
    .attr('data-key', function(d) { return d.key; })
    .attr('class', 'sph-row-areas-metric');

  metric.append('td')
    .attr('class', 'sph-col-swatch');

  metric.append('td')
    .attr('class', 'sph-col-areas-title');

  metric.append('td')
    .attr('class', 'sph-col-areas-value');
}


function normalize(el, opts) {
  var node = el.node();

  el.datum(function(d, i) {
    var title = opts.title.call(node, d, i);

    return {
      title: title,
      metrics: opts.metrics.call(node, d, i).map(metric)
    };
  });

  el.datum(function(d) {
    var metrics = d.metrics;

    metrics
      .forEach(function(metric, i) {
        var values = metric.values;
        var n = values.length;
        var j = -1;
        var v;

        while (++j < n) {
          v = values[j];

          if (i > 0) v.y0 = metrics[i - 1].values[j].y1;
          else v.y0 = 0;

          v.y1 = v.y0 + v.y;
        }
      });

    return d;
  });

  function metric(d, i) {
    var key = opts.key
      .call(node, d, i)
      .toString();

    return {
      key: key,
      color: opts.colors(key),
      title: opts.metricTitle.call(node, d, i),
      values: opts.values.call(node, d, i).map(value)
    };
  }

  function value(d, i) {
    return {
      x: opts.x.call(node, d, i),
      y: opts.y.call(node, d, i)
    };
  }
}


function getMetrics(d) {
  return d.metrics;
}
