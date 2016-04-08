var _ = require('underscore');
var randomName = require('random-name')

module.exports.set = function(app) {
	app.get('/accounts', function (req, res) {
		
		var result = [];

		_.times(10, function(){
			result.push({
				name: randomName(),
				amount: _.random(0, 1000) 
			});
		});

		res.send(result);
	});
}