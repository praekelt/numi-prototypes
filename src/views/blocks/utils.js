var utils = require('../../utils');


function contentPropGetter(name, langId) {
  langId = langId || null;

  return function() {
    return this.getForLang(langId, name);
  };
}


function contentProp(name, langId) {
  langId = langId || null;

  return {
    get: function() {
      return this.getForLang(langId, name);
    },
    set: function(v) {
      this.setForLang(langId, name, v);
    }
  };
}


function listPropWithContentGetter(name, contentProps, langId) {
  langId = langId || null;

  return function() {
    return this.getForLangList(langId, name, contentProps);
  };
}


function listPropWithContent(name, contentProps, langId) {
  langId = langId || null;

  return {
    get: function() {
      return this.getForLangList(langId, name, contentProps);
    },
    set: function(data) {
      this.setForLangList(langId, name, contentProps, data);
    }
  };
}


function parentAndCurrentListGetter(name, contentProps) {
  return function() {
    return utils.hashzip(['parent', 'current'], [
        this.getForLangList('parent', name, contentProps),
        this.getForLangList(null, name, contentProps)
    ]);
  };
}


function proxyProp(targetName, propName) {
  return function() {
    // We can't dynamically delegate to the relevant block's computed
    // properties, Ractive.js doesn't seem able to react to changes that way.
    // Instead, we borrow the property.
    return this.get(targetName).computed[propName].call(this);
  };
}


exports.proxyProp = proxyProp;
exports.contentProp = contentProp;
exports.listPropWithContent = listPropWithContent;
exports.contentPropGetter = contentPropGetter;
exports.listPropWithContent = listPropWithContent;
exports.listPropWithContentGetter = listPropWithContentGetter;
exports.parentAndCurrentListGetter = parentAndCurrentListGetter;
