webpackJsonp([1],{

/***/ 68:
/***/ function(module, exports, __webpack_require__) {

	module.exports = {
	  template: __webpack_require__(69),
	  replace: true,
	  data: function () {
	    return {
	      msg: 'This is page A.',
	      leftName: 'Bruce Lee',
	      rightName: 'Chuck Norris'
	    }
	  },
	  components: {
	    'app-header': __webpack_require__(70),
	    'app-pane': __webpack_require__(74)
	  }
	}

/***/ },

/***/ 69:
/***/ function(module, exports) {

	module.exports = "<div class=\"view\" v-transition>\n  <app-header msg=\"{{msg}}\"></app-header>\n  <app-pane side=\"left\" name=\"{{leftName}}\"></app-pane>\n  <app-pane side=\"right\" name=\"{{rightName}}\"></app-pane>\n</div>";

/***/ },

/***/ 70:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(71)

	module.exports = {
	  template: __webpack_require__(73),
	  props: ['msg']
	}

/***/ },

/***/ 71:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(72);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/stylus-loader/index.js!./style.styl", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/stylus-loader/index.js!./style.styl");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 72:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	exports.push([module.id, "app-header {\n  color: #bada55;\n}\n", ""]);

/***/ },

/***/ 73:
/***/ function(module, exports) {

	module.exports = "<h1>{{msg}}</h1>";

/***/ },

/***/ 74:
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(75)

	module.exports = {
	  template: __webpack_require__(77),
	  replace: true,
	  props: ['side', 'name']
	}

/***/ },

/***/ 75:
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(76);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/stylus-loader/index.js!./style.styl", function() {
				var newContent = require("!!./../../../node_modules/css-loader/index.js!./../../../node_modules/stylus-loader/index.js!./style.styl");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },

/***/ 76:
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	exports.push([module.id, ".pane {\n  display: inline-block;\n  width: 300px;\n  height: 300px;\n  box-sizing: border-box;\n  padding: 15px 30px;\n  border: 2px solid #f3f3f3;\n  margin: 10px;\n}\n", ""]);

/***/ },

/***/ 77:
/***/ function(module, exports) {

	module.exports = "<div class=\"pane\">\n  <p>This is the {{side}} pane!</p>\n  <p>{{name}}</p>\n</div>";

/***/ }

});