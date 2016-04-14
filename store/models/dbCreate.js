var _ = require('underscore');

var Store = require('../models').Store;
var ItemSet = require('../models').ItemSet;
var Item = require('../models').Item;

var items = [
  {
    title: 'Shoes "MoonWalk"',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    image: 'images/sh.jpg',
    price: 115,
    category: 'shoes',
    originalPrice: 50,
    count: 10
  },
  {
    title: 'Chrome watch "Chuck"',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    image: 'images/wa.jpg',
    price: '230',
    category: 'clocks',
    originalPrice: 150,
    count: 20
  },
  {
    title: 'Blue necklace',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    image: 'images/ch.jpg',
    price: '55',
    category: 'jewellery',
    originalPrice: 20,
    count: 15
  },
  {
    title: 'Black women\'s bag',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    image: 'images/ba.jpg',
    price: '155',
    category: 'apparel',
    originalPrice: 50,
    count: 10
  },
  {
    title: 'Davidoff parfumes',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    image: 'images/bo.jpg',
    price: '300',
    category: 'parfumes',
    originalPrice: 150,
    count: 15
  },
  {
    title: 'Calvin Klein\'s parfumes',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    image: 'images/bott.jpg',
    price: '165',
    category: 'parfumes',
    originalPrice: 50,
    count: 25
  },
  {
    title: 'Wow\'s parfumes',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    image: 'images/bottle.jpg',
    price: '400',
    category: 'parfumes',
    originalPrice: 50,
    count: 15
  },
  {
    title: 'Brown women\'s bag',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
    image: 'images/baa.jpg',
    price: '320',
    category: 'apparel',
    originalPrice: 150,
    count: 20
  }
]

var storeIds = ['570e0cd574f0942419bf8ee6', '570e0cd574f0942419bf8ee4', '570e0cd574f0942419bf8ee5'];

_.each(storeIds, function(storeId) {
  _.each(items, function(item) {
    var itemToItems = _.pick(item, 'title', 'description', 'image', 'category');
    var itemToItemSet = _.pick(item, 'originalPrice', 'count');

    var options = {
      upsert: true
    };

    Item.findOneAndUpdate(itemToItems, options, function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        itemToItemSet.storeId = storeId;
        itemToItemSet.itemId = doc._id;
        itemToItemSet.price = itemToItemSet.originalPrice * 2;

        ItemSet.create(itemToItemSet, function(err, doc) {
          if (err) {
            console.log(err);
          } else {
            console.log(doc);
          };

        });
      };

    });
  });

});
