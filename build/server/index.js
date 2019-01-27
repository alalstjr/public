"use strict";

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _morgan = _interopRequireDefault(require("morgan"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _webpackDevServer = _interopRequireDefault(require("webpack-dev-server"));

var _webpack = _interopRequireDefault(require("webpack"));

var _routes = _interopRequireDefault(require("./routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// HTTP REQUEST LOGGER
// PARSE HTML BODY
var app = (0, _express.default)();
var port = 3000;
/* mongodb connection */

var db = _mongoose.default.connection;
db.on('error', console.error);
db.once('open', function () {
  console.log('Connected to mongodb server');
}); // mongoose.connect('mongodb://username:password@host:port/database=');

_mongoose.default.connect('mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb');
/* use session */


app.use((0, _expressSession.default)({
  secret: 'CodeLab1$1$234',
  resave: false,
  saveUninitialized: true
}));
var devPort = 4000;
app.use((0, _morgan.default)('dev'));
app.use(_bodyParser.default.json());
/*
    Express Codes 
*/

if (process.env.NODE_ENV == 'development') {
  console.log('Server is running on development mode');

  var config = require('../webpack.dev.config');

  var compiler = (0, _webpack.default)(config);
  var devServer = new _webpackDevServer.default(compiler, config.devServer);
  devServer.listen(devPort, function () {
    console.log('webpack-dev-server is listening on port', devPort);
  });
}
/* handle error */


app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.use('/', _express.default.static(_path.default.resolve(__dirname, '../')));
app.use('/api', _routes.default);
/* support client-side routing */

app.get('*', function (req, res) {
  res.sendFile(_path.default.resolve(__dirname, './../index.html'));
});
app.listen(port, function () {
  console.log('start express port -> ', port);
});