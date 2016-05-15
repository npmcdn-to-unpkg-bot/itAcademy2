var express = require('express');
var app = express();

var Store = require('../models').Store;
var ItemSet = require('../models').ItemSet;
var Item = require('../models').Item;
var User = require('../models').User;
var Transaction = require('../models').Transaction;
var Order = require('../models').Order;

var _ = require('underscore');
var Promise = require('bluebird');
var request = require('request');

module.exports.set = function(app) {
	require('./passport')(app);

	app.get('/api/stores', function (req, res) {

		Store.find({}, function(err, docs) {
			if (err) console.log(err);

			return res.json(docs);
		})

	});

	app.get('/api/getStoreCategories', function (req, res) {
		var storeId = req.query.storeId;

		ItemSet.find({storeId: storeId}).lean()
		.then(function(itemSetItems) {
			var itemSetItemsIds = _.map(itemSetItems, function(item) {
				return item.itemId
			});

			return Item.find({'_id': {$in: itemSetItemsIds}}).lean()
		})
		.then(function(items) {
			//console.log(items);
			var categories = _.uniq(_.map(items, (item) => {
				return item.category;
			}));

			return res.json(categories);
		})
	});

	// created itemsToSend in order to form and populate array of products for the store
	app.get('/api/store/*', function (req, res) {
		var storeId = req.query.storeId;
		var categories = [];
		var sortOption = req.query.sort;
		var search = req.query.search;
		var page = req.query.page;
		var itemsPerPage = 6;

		if (_.isString(req.query.category)) categories.push(req.query.category);
		if (_.isObject(req.query.category)) categories = req.query.category;

		console.log(req.query);

		if (_.isEmpty(sortOption) || sortOption.indexOf('name') !== -1) {
			getItemsWithSortByName(storeId, categories, sortOption, search, page, itemsPerPage, res);
		} else if (sortOption.indexOf('price') !== -1) {
			getItemsWithSortByPrice(storeId, categories, sortOption, search, page, itemsPerPage, res)
		};

	});

	var getItemsWithSortByPrice = function(storeId, categories, sortOption, search, page, itemsPerPage, res) {
		var res = res;
		var query = {};
		var result = {};
		var sort = {};

		if (sortOption === 'price_desc') _.extend(sort, {price: -1});

		if (sortOption === 'price_asc') _.extend(sort, {price: 1})

		if (categories.length > 0) _.extend(query, {'category': {$in: categories}});

		if (search) _.extend(query, {$text: {$search: search}});

		ItemSet.find({'storeId': storeId}).sort(sort).lean()
		.then(function(itemSetItems) {
			var itemSetItemsIds = _.map(itemSetItems, function(item) {
				return item._id
			});

			storeItems = itemSetItems;

			return Item.find({'_id': {$in: itemSetItemsIds}, query}).lean()
		})
		.then(function(items) {
			result.products = [];
			_.map(storeItems, (storeItem) => {
				var item = _.find(items, (item) => {
					return storeItem.itemId.toString() === item._id.toString()
				});
				if (item) result.products.push(_.extend(_.pick(item, 'title', 'description', 'image', 'category'), _.pick(storeItem, 'storeId', 'itemId', 'price', 'count')));
			})

			var start = page * itemsPerPage;
			result.numOfPages = Math.ceil(result.products.length / itemsPerPage);
			result.products = result.products.splice((page - 1) * itemsPerPage, itemsPerPage);

			return res.send(result);

		})
		.catch(function(err) {
			return console.log(err);
		})
	}

	var getItemsWithSortByName = function(storeId, categories, sortOption, search, page, itemsPerPage, res) {
		var query = {};
		var result = {};
		var sort = {};

		if (sortOption === 'name_desc') _.extend(sort, {title: -1});

		if (sortOption === 'name_asc') _.extend(sort, {title: 1})

		if (categories.length > 0) _.extend(query, {'category': {$in: categories}});

		if (search) _.extend(query, {$text: {$search: search}});

		Item.find(query).count()
		.then(function(numOfItems) {
			result.numOfPages = Math.ceil(numOfItems / itemsPerPage);
			return Item.find(query).sort(sort).skip((page - 1) * itemsPerPage).limit(itemsPerPage).lean()
		})
		.then(function(items) {
			var itemsIds = _.map(items, function(item) {
				return item._id
			});

			storeItems = items;

			return ItemSet.find({'storeId': storeId, 'itemId': {$in: itemsIds}}).lean()
		})
		.then(function(ItemSetItems) {
			result.products = _.map(storeItems, (storeItem) => {
				var item = _.find(ItemSetItems, (item) => {
					return storeItem._id.toString() === item.itemId.toString()
				});
				return _.extend(_.pick(storeItem, 'title', 'description', 'image', 'category'), _.pick(item, 'storeId', 'itemId', 'price', 'count'));
			})

			return res.send(result);

		})
		.catch(function(err) {
			return console.log(err);
		})
	}

	app.post('/api/order', function (req, res) {
		var order = {
			date: Date.now(),
			user: req.body.user,
			$push: {itemSet: req.body.itemDetails}
		}

		var options = {
			upsert: true
		};

		Order.findOneAndUpdate({'user': req.body.user, 'transactionId': {$exists: false}}, order, options).
		then(function(doc) {
			console.log(doc)
		}).
		catch(function(err) {
			console.log(err);
		});

	})

	app.post('/api/makePurchase', function (req, res) {
		var cartIds = _.map(req.body.userCart, function(item) {
			return item.itemId;
		});

		var cartItems = req.body.userCart;

		ItemSet.find({'itemId': {$in: cartIds}, 'storeId': req.user.storeId}).lean()
		.then(function(items) {
			var result = _.map(items, (item) => {
				var cartItem = _.find(cartItems, (cartItem) => {
					return cartItem.itemId.toString() === item.itemId.toString()
				});
				return cartItem.price === item.price
			})

			if (result.indexOf(false) !== -1) {
				return res.send('Incorrect items price, please add them one more time')
			} else {
				return transferMoney();
			}
		})
		.then(function(bankTransaction) {
			bankTransaction = JSON.parse(bankTransaction);

			if (bankTransaction.success) {
				var transaction = {
					token: bankTransaction.token,
					accountFrom: req.user.email,
					accountTo: req.store.email,
					amount: req.body.totalPrice
				};
				return Transaction.create(transaction)
			};
		})
		.then(function(transaction) {
			var orderSet = _.map(cartItems, function(cartItem) {
				return _.pick(cartItem, 'itemId', 'price', 'amountToBuy', 'title')
			})

			return Order.create({
				date: Date.now(),
				itemSet: orderSet,
				user: req.user.email,
				transactionId: transaction._id
			})
		})
		.then(function(order) {
			return res.json(order);
		})
		.catch(function(err) {
			return res.send(err)
		})

		var transferMoney = function() {
			return new Promise(function(resolve, reject) {
				request(
		      {
		        headers: {'content-type' : 'application/x-www-form-urlencoded'},
		        method: 'POST',
		        uri: 'http://localhost:3001/api/transfer',
		        form: {
		          source: req.user.email,
		          password: req.user.password,
							destination: req.body.store.email,
							amount: req.body.totalPrice
		        }
		      }, function(error, response, body) {
		      if (error) {
		        reject(error);
		      };

					resolve(body);
		    });
			})
		};

	})

	app.get('/api/orders/:userEmail', function (req, res) {
		var query = {user: req.params.userEmail}
		var userOrders = [];


		Order.find(query).sort({date: 'desc'}).lean()
		.then(function(orders) {
			var ordersClean = _.map(orders, function(order) {
				return _.pick(order, 'itemSet', 'date', '_id')
			});

			res.json(ordersClean);
		});

	})

	app.all('*', function(req, res, next) {
		// Just send the index.html for other files to support HTML5Mode
		res.sendFile('index.html', { root:  __dirname + '/../public' });
	});
};
