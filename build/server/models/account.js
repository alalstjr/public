"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose.default.Schema;
var Account = new Schema({
  username: String,
  password: String,
  created: {
    type: Date,
    default: Date.now
  }
}); // generates hash

Account.methods.generateHash = function (password) {
  return _bcryptjs.default.hashSync(password, 8);
}; // compares the password


Account.methods.validateHash = function (password) {
  return _bcryptjs.default.compareSync(password, this.password);
};

var _default = _mongoose.default.model('account', Account);

exports.default = _default;