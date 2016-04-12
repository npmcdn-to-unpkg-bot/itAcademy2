'use strict';

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _utilsDataBaseUtils = require('./utils/DataBaseUtils');

var db = _interopRequireWildcard(_utilsDataBaseUtils);

var app = (0, _express2['default'])();

db.setUpConnection();

app.use(_bodyParser2['default'].json());

app.get('/accounts', function (req, res) {
    console.log('hit');
    db.listAccounts(function (data) {
        res.send(data);
    });
});

app.post('/accounts', function (req, res) {
    db.createAccount(req.body).then(function (data) {
        return res.send(data);
    });
});

app['delete']('/accounts/:id', function (req, res) {
    db.deleteAccount(req.params.id).then(function (data) {
        return res.send(data);
    });
});

var server = app.listen(8080, function () {
    console.log("Server is up and running on port 8080");
});

//# sourceMappingURL=app-compiled.js.map