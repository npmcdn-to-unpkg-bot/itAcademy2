'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var Schema = _mongoose2['default'].Schema;

var TransactionSchema = new Schema({
    login: { type: String },
    password: { type: String },
    amount: { type: Number }
});

var Transaction = _mongoose2['default'].model('Transaction', TransactionSchema); /**
                                                                                 * Created by Olexa on 12.04.2016.
                                                                                 */

//# sourceMappingURL=Transaction-compiled.js.map