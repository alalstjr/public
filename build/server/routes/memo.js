"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _memo = _interopRequireDefault(require("../models/memo"));

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express.default.Router();
/* 
    WRITE MEMO: POST /api/memo
    BODY SAMPLE: { contents: "sample "}
    ERROR CODES
        1: NOT LOGGED IN
        2: EMPTY CONTENTS
*/


router.post('/', function (req, res) {
  // CHECK LOGIN STATUS
  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: "NOT LOGGED IN",
      code: 1
    });
  } // CHECK CONTENTS VALID


  if (typeof req.body.contents !== 'string') {
    return res.status(400).json({
      error: "EMPTY CONTENTS",
      code: 2
    });
  }

  if (req.body.contents === "") {
    return res.status(400).json({
      error: "EMPTY CONTENTS",
      code: 2
    });
  } // CREATE NEW MEMO


  var memo = new _memo.default({
    writer: req.session.loginInfo.username,
    contents: req.body.contents
  }); // SAVE IN DATABASE

  memo.save(function (err) {
    if (err) throw err;
    return res.json({
      success: true
    });
  });
});
/*
    MODIFY MEMO: PUT /api/memo/:id
    BODY SAMPLE: { contents: "sample "}
    ERROR CODES
        1: INVALID ID,
        2: EMPTY CONTENTS
        3: NOT LOGGED IN
        4: NO RESOURCE
        5: PERMISSION FAILURE
*/

router.put('/:id', function (req, res) {
  // CHECK MEMO ID VALIDITY
  if (!_mongoose.default.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      error: "INVALID ID",
      code: 1
    });
  } // CHECK CONTENTS VALID


  if (typeof req.body.contents !== 'string') {
    return res.status(400).json({
      error: "EMPTY CONTENTS",
      code: 2
    });
  }

  if (req.body.contents === "") {
    return res.status(400).json({
      error: "EMPTY CONTENTS",
      code: 2
    });
  } // CHECK LOGIN STATUS


  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: "NOT LOGGED IN",
      code: 3
    });
  } // FIND MEMO


  _memo.default.findById(req.params.id, function (err, memo) {
    if (err) throw err; // IF MEMO DOES NOT EXIST

    if (!memo) {
      return res.status(404).json({
        error: "NO RESOURCE",
        code: 4
      });
    } // IF EXISTS, CHECK WRITER


    if (memo.writer != req.session.loginInfo.username) {
      return res.status(403).json({
        error: "PERMISSION FAILURE",
        code: 5
      });
    } // MODIFY AND SAVE IN DATABASE


    memo.contents = req.body.contents;
    memo.date.edited = new Date();
    memo.is_edited = true;
    memo.save(function (err, memo) {
      if (err) throw err;
      return res.json({
        success: true,
        memo: memo
      });
    });
  });
});
/*
    DELETE MEMO: DELETE /api/memo/:id
    ERROR CODES
        1: INVALID ID
        2: NOT LOGGED IN
        3: NO RESOURCE
        4: PERMISSION FAILURE
*/

router.delete('/:id', function (req, res) {
  // CHECK MEMO ID VALIDITY
  if (!_mongoose.default.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      error: "INVALID ID",
      code: 1
    });
  } // CHECK LOGIN STATUS


  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: "NOT LOGGED IN",
      code: 2
    });
  } // FIND MEMO AND CHECK FOR WRITER


  _memo.default.findById(req.params.id, function (err, memo) {
    if (err) throw err;

    if (!memo) {
      return res.status(404).json({
        error: "NO RESOURCE",
        code: 3
      });
    }

    if (memo.writer != req.session.loginInfo.username) {
      return res.status(403).json({
        error: "PERMISSION FAILURE",
        code: 4
      });
    } // REMOVE THE MEMO


    _memo.default.remove({
      _id: req.params.id
    }, function (err) {
      if (err) throw err;
      res.json({
        success: true
      });
    });
  });
});
/*
    READ MEMO: GET /api/memo
*/

router.get('/', function (req, res) {
  _memo.default.find().sort({
    "_id": -1
  }).limit(6).exec(function (err, memos) {
    if (err) throw err;
    res.json(memos);
  });
});
/*
    READ ADDITIONAL (OLD/NEW) MEMO: GET /api/memo/:listType/:id
*/

router.get('/:listType/:id', function (req, res) {
  var listType = req.params.listType;
  var id = req.params.id; // CHECK LIST TYPE VALIDITY

  if (listType !== 'old' && listType !== 'new') {
    return res.status(400).json({
      error: "INVALID LISTTYPE",
      code: 1
    });
  } // CHECK MEMO ID VALIDITY


  if (!_mongoose.default.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: "INVALID ID",
      code: 2
    });
  }

  var objId = new _mongoose.default.Types.ObjectId(req.params.id);

  if (listType === 'new') {
    // GET NEWER MEMO
    _memo.default.find({
      _id: {
        $gt: objId
      }
    }).sort({
      _id: -1
    }).limit(6).exec(function (err, memos) {
      if (err) throw err;
      return res.json(memos);
    });
  } else {
    // GET OLDER MEMO
    _memo.default.find({
      _id: {
        $lt: objId
      }
    }).sort({
      _id: -1
    }).limit(6).exec(function (err, memos) {
      if (err) throw err;
      return res.json(memos);
    });
  }
});
/*
    TOGGLES STAR OF MEMO: POST /api/memo/star/:id
    ERROR CODES
        1: INVALID ID
        2: NOT LOGGED IN
        3: NO RESOURCE
*/

router.post('/star/:id', function (req, res) {
  // CHECK MEMO ID VALIDITY
  if (!_mongoose.default.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      error: "INVALID ID",
      code: 1
    });
  } // CHECK LOGIN STATUS


  if (typeof req.session.loginInfo === 'undefined') {
    return res.status(403).json({
      error: "NOT LOGGED IN",
      code: 2
    });
  } // FIND MEMO


  _memo.default.findById(req.params.id, function (err, memo) {
    if (err) throw err; // MEMO DOES NOT EXIST

    if (!memo) {
      return res.status(404).json({
        error: "NO RESOURCE",
        code: 3
      });
    } // 배열에서 사용자 이름 색인 가져 오기


    var index = memo.starred.indexOf(req.session.loginInfo.username); // 사용자가 이미 별표를 가지고 있는지 확인하십시오.

    var hasStarred = index === -1 ? false : true;

    if (!hasStarred) {
      // 그것이 존재하지 않는 경우
      memo.starred.push(req.session.loginInfo.username);
    } else {
      // 이미 별표가 붙어 있습니다.
      memo.starred.splice(index, 1);
    } // SAVE THE MEMO


    memo.save(function (err, memo) {
      if (err) throw err;
      res.json({
        success: true,
        'has_starred': !hasStarred,
        memo: memo
      });
    });
  });
});
/*
    READ MEMO OF A USER: GET /api/memo/:username
*/

router.get('/:username', function (req, res) {
  _memo.default.find({
    writer: req.params.username
  }).sort({
    "_id": -1
  }).limit(6).exec(function (err, memos) {
    if (err) throw err;
    res.json(memos);
  });
});
/*
    READ ADDITIONAL (OLD/NEW) MEMO OF A USER: GET /api/memo/:username/:listType/:id
*/

router.get('/:username/:listType/:id', function (req, res) {
  var listType = req.params.listType;
  var id = req.params.id; // CHECK LIST TYPE VALIDITY

  if (listType !== 'old' && listType !== 'new') {
    return res.status(400).json({
      error: "INVALID LISTTYPE",
      code: 1
    });
  } // CHECK MEMO ID VALIDITY


  if (!_mongoose.default.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: "INVALID ID",
      code: 2
    });
  }

  var objId = new _mongoose.default.Types.ObjectId(req.params.id);

  if (listType === 'new') {
    // GET NEWER MEMO
    _memo.default.find({
      writer: req.params.username,
      _id: {
        $gt: objId
      }
    }).sort({
      _id: -1
    }).limit(6).exec(function (err, memos) {
      if (err) throw err;
      return res.json(memos);
    });
  } else {
    // GET OLDER MEMO
    _memo.default.find({
      writer: req.params.username,
      _id: {
        $lt: objId
      }
    }).sort({
      _id: -1
    }).limit(6).exec(function (err, memos) {
      if (err) throw err;
      return res.json(memos);
    });
  }
});
var _default = router;
exports.default = _default;