var _ = require('underscore');
var Promise = require('bluebird');

var Store = require('../models').Store;
var ItemSet = require('../models').ItemSet;
var Item = require('../models').Item;

var items = [
  {
    title: 'Shoes "MoonWalk"',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    image: 'images/sh.jpg',
    category: 'shoes'
  },
  {
    title: 'Chrome watch "Chuck"',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    image: 'images/wa.jpg',
    category: 'clocks'
  },
  {
    title: 'Blue necklace',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    image: 'images/ch.jpg',
    category: 'jewellery'
  },
  {
    title: 'Black women\'s bag',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    image: 'images/ba.jpg',
    category: 'apparel'
  },
  {
    title: 'Davidoff parfumes',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    image: 'images/bo.jpg',
    category: 'parfumes'
  },
  {
    title: 'Calvin Klein\'s parfumes',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    image: 'images/bott.jpg',
    category: 'parfumes'
  },
  {
    title: 'Wow\'s parfumes',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    image: 'images/bottle.jpg',
    category: 'parfumes'
  },
  {
    title: 'Brown women\'s bag',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    image: 'images/baa.jpg',
    category: 'apparel'
  }
]

var stores = [
  {
    email: 'store1@gmail.com',
    name: 'Cool Store',
    password: 'store1',
    account: 1234
  },
  {
    email: 'store2@gmail.com',
    name: 'Best Store',
    password: 'store2',
    account: 4321
  },
  {
    email: 'store3@gmail.com',
    name: 'Fancy Store',
    password: 'store3',
    account: 1254
  }];

var createdStores;

Store.insertMany(stores).
then(function(stores) {
  createdStores = stores;

  return Item.insertMany(items)
}).
then(function(items) {
  var itemsToItemSet = [];

  _.each(createdStores, function(store) {
    _.each(items, function(item) {
      var originalPrice = _.random(50, 400)
      var price = originalPrice * 2;
      var count = _.random(5, 20);

      var itemToItemSet = {
        storeId: store._id,
        itemId: item._id,
        originalPrice: originalPrice,
        price: price,
        count: count
      };

      itemsToItemSet.push(itemToItemSet);
    })
  })

  return ItemSet.insertMany(itemsToItemSet);
}).
catch(function(err) {
  console.log(err);
})





    /* _.each(items, function(item) {
      var itemToItems = _.pick(item, 'title', 'description', 'image', 'category');
      var itemToItemSet = _.pick(item, 'originalPrice', 'count');

      var options = {
        upsert: true
      };

      Item.findOneAndUpdate(itemToItems, options)
      .then(function(item) {

      })
    })
  })
  .catch(function(err) {
    console.log(err);
  })
});
*/
