var bank = require('./bank');
var store = require('./store');
var warehouse = require('./warehouse');
var test = require('./test');

warehouse.start();
store.start();
// bank.start();
//test.start();