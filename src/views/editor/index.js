var _ = require('lodash');
var rangy = require('rangy');
var Ractive = require('ractive');


module.exports = Ractive.extend({
  template: require('./template.html'),
  onrender: function() {
    this.drawContent();
  },
  $editEl: function() {
    return $(this.el).find('.nm-editor');
  },
  drawContent: function() {
    var $el = this.$editEl();
    var range = saveRange($el);
    $el.html(this.parseContent(this.get('content')));
    restoreRange($el, range);
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
