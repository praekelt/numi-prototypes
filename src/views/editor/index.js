var _ = require('lodash');
var rangy = require('rangy');
var Ractive = require('ractive');


module.exports = Ractive.extend({
  template: require('./template.html'),
  computed: {
    rawContent: {
      get: function() {
        return this.parseContent(this.get('content'));
      },
      set: function(v) {
        this.set('content', $('<div>').html(v).text());
      }
    }
  },
  updateContent: function(e) {
    var el = e.original.target;
    var $el = $(el);
    var content = $el.text();
    this.set('rawContent', content);

    var range = rangy.getSelection().saveCharacterRanges(el);
    $el.html(this.parseContent(content));
    rangy.getSelection().restoreCharacterRanges(el, range);
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



function specialCharHtml(s, classes) {
  return [
    '<span class="', classes.join(' '), '">', s, '</span>'
  ].join('');
}
