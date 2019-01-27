"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _account = _interopRequireDefault(require("../models/account"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router();
/*
    ACCOUNT SIGNUP: POST /api/account/signup
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: BAD USERNAME
        2: BAD PASSWORD
        3: USERNAM EXISTS
*/


router.post('/signup', function (req, res) {
  // CHECK USERNAME FORMAT
  var usernameRegex = /^[a-z0-9]+$/; // 소문자 a-z 와 숫자 0-9 를 정규식으로 표현

  if (!usernameRegex.test(req.body.username)) {
    // 위 변수 정규식에 test RegExp.prototype.test() 돌려
    // 조건에 맞지 않으면 한글이나 특수문자가 있다면 fail 을 반환
    return res.status(400).json({
      error: "BAD USERNAME",
      code: 1
    });
  } // CHECK PASS LENGTH


  if (req.body.password.length < 4 || typeof req.body.password !== "string") {
    return res.status(400).json({
      error: "BAD PASSWORD",
      code: 2
    });
  } // CHECK USER EXISTANCE


  _account.default.findOne({
    username: req.body.username
  }, function (err, exists) {
    if (err) throw err;

    if (exists) {
      return res.status(409).json({
        error: "USERNAME EXISTS",
        code: 3
      });
    } // CREATE ACCOUNT


    var account = new _account.default({
      username: req.body.username,
      password: req.body.password
    });
    account.password = account.generateHash(account.password); // SAVE IN THE DATABASE

    account.save(function (err) {
      if (err) throw err;
      return res.json({
        success: true
      });
    });
  });
});
/*
    ACCOUNT SIGNIN: POST /api/account/signin
    BODY SAMPLE: { "username": "test", "password": "test" }
    ERROR CODES:
        1: LOGIN FAILED
*/

router.post('/signin', function (req, res) {
  if (typeof req.body.password !== "string") {
    return res.status(401).json({
      error: "LOGIN FAILED",
      code: 1
    });
  } // FIND THE USER BY USERNAME


  _account.default.findOne({
    username: req.body.username
  }, function (err, account) {
    // mongoose findOne은 query 조건에 부합하는 데이타중에 하나만 리턴하는 함수
    // model 의 Account 을 탐색
    if (err) throw err; // CHECK ACCOUNT EXISTANCY

    if (!account) {
      return res.status(401).json({
        error: "LOGIN FAILED",
        code: 1
      });
    } // CHECK WHETHER THE PASSWORD IS VALID


    if (!account.validateHash(req.body.password)) {
      return res.status(401).json({
        error: "LOGIN FAILED",
        code: 1
      });
    } // ALTER SESSION


    var session = req.session;
    session.loginInfo = {
      _id: account._id,
      username: account.username
    }; // RETURN SUCCESS

    return res.json({
      success: true
    });
  });
});
/*
    GET CURRENT USER INFO GET /api/account/getInfo
*/

router.get('/getinfo', function (req, res) {
  if (typeof req.session.loginInfo === "undefined") {
    return res.status(401).json({
      error: 1
    });
  }

  res.json({
    info: req.session.loginInfo
  });
});
/*
    LOGOUT: POST /api/account/logout
*/

router.post('/logout', function (req, res) {
  req.session.destroy(function (err) {
    if (err) throw err;
  });
  return res.json({
    sucess: true
  });
});
/* 
    SEARCH USER: GET /api/account/search/:username
*/

router.get('/search/:username', function (req, res) {
  // SEARCH USERNAMES THAT STARTS WITH GIVEN KEYWORD USING REGEX
  var re = new RegExp('^' + req.params.username);

  _account.default.find({
    username: {
      $regex: re
    }
  }, {
    _id: false,
    username: true
  }).limit(5).sort({
    username: 1
  }).exec(function (err, accounts) {
    if (err) throw err;
    res.json(accounts);
  });
}); // EMPTY SEARCH REQUEST: GET /api/account/search

router.get('/search', function (req, res) {
  res.json([]);
});
var _default = router;
exports.default = _default;