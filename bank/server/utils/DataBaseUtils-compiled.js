'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});
exports.setUpConnection = setUpConnection;
exports.listAccounts = listAccounts;
exports.createAccount = createAccount;
exports.checkBalance = checkBalance;
exports.checkOperation = checkOperation;
exports.deleteAccount = deleteAccount;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

require('../models/Account');

var Account = _mongoose2['default'].model('Account');

function setUpConnection() {
    _mongoose2['default'].connect('mongodb://elifuser:qwerty12@ds015710.mlab.com:15710/elifbankdb');
}

function listAccounts() {
    return Account.find();
}

function createAccount(data) {
    var account = new Account({
        login: data.login,
        password: data.password,
        amount: data.amount
    });

    return account.save();
}

function checkBalance(data) {}

function checkOperation(data) {}

function deleteAccount(id) {
    return Account.findById(id).remove();
}

//# sourceMappingURL=DataBaseUtils-compiled.js.map