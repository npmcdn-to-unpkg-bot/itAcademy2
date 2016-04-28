var Store = require('../models').Store;

Store.create({
  email: 'store1@gmail.com',
  name: 'Cool Store',
  password: 'store1',
  account: 1234
}, function (err, store) {
  if (!err ) console.log(store);
});

Store.create({
  email: 'store2@gmail.com',
  name: 'Best Store',
  password: 'store2',
  account: 4321
}, function (err, store) {
  if (!err ) console.log(store);
})

Store.create({
  email: 'store3@gmail.com',
  name: 'Fancy Store',
  password: 'store3',
  account: 1254
}, function (err, store) {
  if (!err ) console.log(store);
})
