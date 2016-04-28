var config = require('./config');
var mongojs = require('mongojs')
var db = mongojs(config.dbConnection, config.collections);
var _ = require('underscore');
var Promise = require('bluebird');

// {
// 	"_id" : ObjectId("5721deb6aeac13d5088e018b"),
// 	"title" : "Shoes \"MoonWalk\"",
// 	"description" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
// 	"image" : "http://g04.a.alicdn.com/kf/HTB1eHAIKpXXXXaxXVXXq6xXFXXXX/New-2013-canvas-shoes-lady-canvas-shoes-1908.jpg_350x350.jpg",
// 	"category" : "shoes"
// }
// {
// 	"_id" : ObjectId("5721deb6aeac13d5088e018c"),
// 	"title" : "Chrome watch \"Chuck\"",
// 	"description" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
// 	"image" : "http://www.englemed.co.uk/graphics/clock.jpg",
// 	"category" : "clocks"
// }
// {
// 	"_id" : ObjectId("5721deb6aeac13d5088e018d"),
// 	"title" : "Blue necklace",
// 	"description" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
// 	"image" : "http://www.foreverjewel.com/images/store_gallery/gold/gold_large05.jpg",
// 	"category" : "jewellery"
// }
// {
// 	"_id" : ObjectId("5721deb6aeac13d5088e018e"),
// 	"title" : "Black women's bag",
// 	"description" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
// 	"image" : "http://g01.a.alicdn.com/kf/HTB1MWdHKVXXXXarXVXXq6xXFXXXu/2014-fashion-black-women-bag-women-handbag-women-messenger-bags.jpg_350x350.jpg",
// 	"category" : "apparel"
// }
// {
// 	"_id" : ObjectId("5721deb6aeac13d5088e018f"),
// 	"title" : "Davidoff parfumes",
// 	"description" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
// 	"image" : "http://www.perfume.com/images/products/parent/medium/61187W.jpg",
// 	"category" : "parfumes"
// }
// {
// 	"_id" : ObjectId("5721deb6aeac13d5088e0190"),
// 	"title" : "Wow's parfumes",
// 	"description" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
// 	"image" : "http://topperfume.yolasite.com/resources/p9.jpg",
// 	"category" : "parfumes"
// }
// {
// 	"_id" : ObjectId("5721deb6aeac13d5088e0191"),
// 	"title" : "Brown women's bag",
// 	"description" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
// 	"image" : "http://www.saddler.co.uk/prodpics/ready/b/barbour_ladies_brown_leather_newmarket_bag_b_large.jpg",
// 	"category" : "apparel"
// }
// {
// 	"_id" : ObjectId("5721deb6aeac13d5088e0192"),
// 	"title" : "Calvin Klein's parfumes",
// 	"description" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit",
// 	"image" : "http://cdn.luxatic.com/wp-content/uploads/2010/09/Joy-Perfume-for-Jean-Patou.jpg",
// 	"category" : "parfumes"
// }


// var data1  = [
// {
// 	name: 'Good wh',
// 	bankAccount: '5721df9f19ff9e3e6db233ee'
// },
// {
// 	name: 'Nice wh',
// 	bankAccount: '5721dfa319ff9e3e6db233ef'
// },
// {
// 	name: 'Bad wh',
// 	bankAccount: '5721dfa719ff9e3e6db233f0'
// }
// ]

// Promise.all([
// 	Promise.fromNode(function(cb){
// 		db.items.find(cb);
// 	}),
// 	Promise.fromNode(function(cb){
// 		db.warehouses.findOne({_id: mongojs.ObjectId('5721e3e2c3cd12ad0b3a878b') }, cb);
// 	})
// ])
// .spread(function(items, warehouse){
// 	var getSet =  function() {
// 		return _.map(items, function(item){
// 			return {
// 				itemId: item._id.toString(),
// 				amount: _.random(100, 10000),
// 				price: _.random(100, 10000)
// 			}
// 		});
// 	}

// 	warehouse.itemSet = getSet();
// 	db.warehouses.save(warehouse);
// 	console.log("done");
// 	process.exit();
// })
// .catch(function(err){
// 	console.log(err.stack)
// })



