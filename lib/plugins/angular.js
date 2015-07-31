"use strict";

exports.__esModule = true;
// istanbul ignore next

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _tokenizerTypes = require("../tokenizer/types");

var _parser = require("../parser");

var _parser2 = _interopRequireDefault(_parser);

var pp = _parser2["default"].prototype;

pp.angularParseBindingList = function (close, allowEmpty, allowTrailingComma) {
  var elts = [],
      first = true;
  while (!this.eat(close)) {
    if (first) first = false;else this.expect(_tokenizerTypes.types.comma);
    if (allowEmpty && this.match(_tokenizerTypes.types.comma)) {
      elts.push(null);
    } else if (allowTrailingComma && this.eat(close)) {
      break;
    } else if (this.match(_tokenizerTypes.types.ellipsis)) {
      elts.push(this.parseAssignableListItemTypes(this.parseRest()));
      this.expect(close);
      break;
    } else {
      var decorators = [];
      while (this.match(_tokenizerTypes.types.at)) {
        decorators.push(this.parseDecorator());
      }
      var left = this.parseMaybeDefault();
      if (decorators.length > 0) {
        left.decorators = decorators;
      }
      this.parseAssignableListItemTypes(left);
      elts.push(this.parseMaybeDefault(null, null, left));
    }
  }
  return elts;
};

exports["default"] = function (instance) {

  instance.extend("parseBindingList", function () {
    return function (close, allowEmpty, allowTrailingComma) {
      return this.angularParseBindingList(close, allowEmpty, allowTrailingComma);
    };
  });
};

module.exports = exports["default"];