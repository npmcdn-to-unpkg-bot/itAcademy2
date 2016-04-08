var config = require('../config');
var mongojs = require('mongojs')
var db = mongojs(config.dbConnection, config.collections);
var _ = require('underscore');

module.exports.set = function(app) {
	app.get('/accounts', function (req, res) {

		var filter = {};
		var projection = {};

		db.collection('accounts').find(filter, projection, function(err, data){
			if (err)
				return res.send({error: 'Error while making response'});
			return res.send(data);
		});
	});

	app.post('/accounts', function (req, res) {

		var newAccount = {
			name: req.body.name,
			amount: req.body.amount
		}

		db.collection('accounts').insert(newAccount, function(err){
			if (err)
				return res.send({error: 'Error while inserting new record'});
			return res.sendStatus(200);
		});
	});

	app.delete('/accounts/:id', function (req, res) {

		var filter = {_id: mongojs.ObjectId(req.params.id)}

		db.collection('accounts').remove(filter, function(err){
			if (err)
				return res.send({error: 'Error while deleting a record'});
			return res.sendStatus(200);
		});
	});
}