"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose.default.Schema;
var Memo = new Schema({
  writer: String,
  contents: String,
  starred: [String],
  date: {
    created: {
      type: Date,
      default: Date.now
    },
    edited: {
      type: Date,
      default: Date.now
    }
  },
  is_edited: {
    type: Boolean,
    default: false
  }
});

var _default = _mongoose.default.model('memo', Memo);

exports.default = _default;