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

	// created itemsToSend in order to form and populate array of products for the store
	app.get('/api/store/:id*', function (req, res) {
		var storeId = req.params.id;
		var category = req.query.category;
		var storeItems = [];

		ItemSet.find({storeId: storeId}).lean()
		.then(function(data) {
			storeItems = data;
			var storeItemsIds = _.map(storeItems, function(storeItem) {
				return storeItem.itemId
			});

			var filter = {'_id': {$in: storeItemsIds}};

			if (category) {
				_.extend(filter, {'category': category})
			}
			return Item.find(filter).lean();
		})
		.then(function(items) {
			var result = _.map(items, (item) => {
				var storeItem = _.find(storeItems, (storeItem) => {
					return storeItem.itemId.toString() === item._id.toString()
				});
				return _.extend(_.pick(item, 'title', 'description', 'image', 'category'), _.pick(storeItem, 'storeId', 'itemId', 'price', 'count'));
			})

			if (category) {
				return res.send(result);
			} else {
				var categories = _.uniq(_.map(result, (item) => {
					return item.category;
				}));

				return res.send([result, categories]);
			}
		})
		.catch(function(err){
			return console.log(err);
		});

	});

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
		var cartIds = _.map(req.body.user.cart, function(item) {
			return item.itemId;
		});

		var cartItems = req.body.user.cart;

		ItemSet.find({'itemId': {$in: cartIds}, 'storeId': req.body.store._id}).lean()
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
					accountFrom: req.body.user.email,
					accountTo: req.body.store.email,
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
				user: req.body.user.email,
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
		          source: req.body.user.email,
		          password: req.body.user.password,
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


		Order.find(query).lean()
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

/* LOGIN - LOGOUT simple version
	app.post('/api/add_user', function (req, res) {
		var user = {
			storeId: req.body.storeId,
			name: req.body.name,
			surname: req.body.surname,
			email: req.body.email,
			password: req.body.password,
			class: 'registered'
		};

		User.create(user)
		.then(function(data) {
			var user = _.pick(data, 'name', 'surname', 'email', 'storeId', 'cart');

			return res.send(user);
		})
		.catch(function(err){
			return res.status(400).send({error: err.message})
		});

	});

	app.post('/api/login_user', function (req, res) {
		var user = {
			storeId: req.body.storeId,
			email: req.body.email,
			password: req.body.password
		};

		//console.log(user);

		User.findOne(user)
		.then(function(data) {
			var user = _.pick(data, 'name', 'surname', 'email', 'storeId', 'cart');

			return res.send(user);
		})
		.catch(function(err){
			return res.status(400).send({error: err.message})
		});

	});
	*/
