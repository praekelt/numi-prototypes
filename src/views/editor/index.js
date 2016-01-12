var _ = require('lodash');
var rangy = require('rangy');
var Ractive = require('ractive');


module.exports = Ractive.extend({
  template: require('./template.html'),
  onrender: function() {
    this.drawContent();

    // TODO unbind on unrender
    this.$editEl().on('keyup', this.onKeyUp.bind(this));
  },
  onKeyUp: function() {
    var d = this.get('keyupHandler');
    if (d) this.parent[d[0]].apply(this.parent, d.slice(1));
  },
  onunrender: function() {
    if (this.range) restoreRange(this.$editEl(), this.range);
  },
  $editEl: function() {
    return $(this.el).find('.nm-editor');
  },
  drawContent: function() {
    var $el = this.$editEl();
    this.range = saveRange($el);
    $el.html(this.parseContent(this.get('content')));
    restoreRange($el, this.range);
  },
  updateContent: function() {
    this.set('content', this.$editEl().text());
    this.drawContent();
  },
  parseContent: function(content) {
    return _.escape(content)
      .split('')
      .map(this.get('charParser'))
      .map(function(classes, i) {
        return classes.length
          ? specialCharHtml(content[i], classes)
          : content[i];
      })
    .join('');
  }
});


function saveRange($el) {
  return rangy
    .getSelection()
    .saveCharacterRanges($el.get(0));
}


function restoreRange($el, range) {
  rangy
    .getSelection()
    .restoreCharacterRanges($el.get(0), range);
}



function specialCharHtml(s, classes) {
  return [
    '<span class="', classes.join(' '), '">', s, '</span>'
  ].join('');
}
