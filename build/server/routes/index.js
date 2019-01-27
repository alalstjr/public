"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _account = _interopRequireDefault(require("./account"));

var _memo = _interopRequireDefault(require("./memo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router();

router.use('/*', function (req, res, next) {
  res.setHeader("Expires", "-1");
  res.setHeader("Cache-Control", "must-revalidate, private");
  next();
});
router.use('/account', _account.default);
router.use('/memo', _memo.default);
var _default = router;
exports.default = _default;