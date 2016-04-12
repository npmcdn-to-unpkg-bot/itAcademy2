'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var Schema = _mongoose2['default'].Schema;

var AccountSchema = new Schema({
    login: { type: String },
    password: { type: String },
    amount: { type: Number }
});

var Account = _mongoose2['default'].model('Account', AccountSchema);

//# sourceMappingURL=Account-compiled.js.map