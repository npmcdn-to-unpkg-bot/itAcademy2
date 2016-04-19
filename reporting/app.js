var express = require('express');
var path = require('path');
var app = express();
//var testDB = require('mongoose');
//var storeDB = require('mongoose');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
//var Schema = mongoose.Schema, ObjectId = Schema.ObjectId;
var connReports = mongoose.createConnection('mongodb://admin:admin@ds028799.mlab.com:28799/itacademy2reports');
var connStore = mongoose.createConnection('mongodb://admin:admin@ds019940.mlab.com:19940/elif_store');
var connBank = mongoose.createConnection('mongodb://elifuser:qwerty12@ds015710.mlab.com:15710/elifbankdb');
var connWarehouse = mongoose.createConnection('mongodb://admin:qwertyuiop@ds017070.mlab.com:17070/warehouse');


var TestShema = new mongoose.Schema({
    date: String,
    profit: Number
}, {
    collection: 'testdata'
});
// Mongoose by default produces a collection name by passing the model name to the utils.toCollectionName method. This method pluralizes the name. Set this option if you need a different name for your collection.
// var dataSchema = new Schema({..}, { collection: 'data' });
var Tst = connReports.model('Tst', TestShema)

var itemSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    category: {
        type: String,
        required: true
    }
});

var item = connStore.model('item', itemSchema)

var itemSetSchema = new mongoose.Schema({
    storeId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    itemId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    originalPrice: {
        type: Number,
        required: true
    },
    price: {
        type: Number
    },
    count: {
        type: Number,
        required: true
    }
}, {
    collection: 'itemSet'
});

var itemSet = connStore.model('itemSet', itemSetSchema);

var storeSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    account: {
        type: Number,
        unique: true,
        required: true
    }
}, {
    collection: 'stores'
});

var stores = connStore.model('stores', storeSchema);


// testDB.connect('mongodb://admin:admin@ds028799.mlab.com:28799/itacademy2reports');
//
// var TestShema = new testDB.Schema({
//     date: String,
//     profit: Number
// }, {
//     collection: 'testdata'
// });
// // Mongoose by default produces a collection name by passing the model name to the utils.toCollectionName method. This method pluralizes the name. Set this option if you need a different name for your collection.
// // var dataSchema = new Schema({..}, { collection: 'data' });
// var Tst = testDB.model('Tst', TestShema)


// storeDB.connect('mongodb://admin:admin@ds019940.mlab.com:19940/elif_store');
//
// var itemSchema = new storeDB.Schema({
//     title: {
//         type: String,
//         unique: true,
//         required: true
//     },
//     description: {
//         type: String,
//         required: true
//     },
//     image: {
//         type: String
//     },
//     category: {
//         type: String,
//         required: true
//     }
// });
//
// var item = storeDB.model('item', itemSchema)
//
//
// var itemSetSchema = new storeDB.Schema({
//     itemId: {
//         type: Schema.Types.ObjectId,
//         required: true
//     },
//     originalPrice: {
//         type: Number,
//         required: true
//     },
//     price: {
//         type: Number
//     },
//     count: {
//         type: Number,
//         required: true
//     }
// }, {
//     collection: 'itemSet'
// });
//
// var itemSet = storeDB.model('itemSet', itemSetSchema,'item');


var PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

var index = path.join(__dirname, "public", "index.html");

app.get('/', function(req, res) {
    console.log("home");
    res.sendFile(index);
    //res.status(200).send('home');
});

app.get('/bank/report1', function(req, res) {
    Tst.find(function(err, data) {
        if (err) return console.log(err);
        console.log(data);
        res.json(data)
    })
});

app.get('/shop/report1', function(req, res) {
    var ret = [];

    function getName(id, fieldName, collection) {
        for (var i = 0; i < collection.length; i++) {
            if (collection[i]["_id"].toString() === id) {
                return collection[i][fieldName];
                break;
            }
        }
    };

    item.find({}, function(err, itemsCollection) {
        if (err) return console.log(err);
        itemSet.find({}, function(err, items) {
            if (err) return console.log(err);
            stores.find({}, function(err, stores) {
                if (err) return console.log(err);

                for (var i = 0; i < items.length; i++) {
                    var obj = {}
                    obj.price = items[i].price;
                    obj.count = items[i].count;
                    obj.itemTitle = getName(items[i].itemId.toString(), 'title', itemsCollection);
                    obj.storeTitle = getName(items[i].storeId.toString(), 'name', stores);

                    ret.push(obj);
                }
                res.json(ret)
            })
        })
    });
});

app.get('/warehouse/report1', function(req, res) {
var ret = [];

function getName(id, fieldName, collection) {
    for (var i = 0; i < collection.length; i++) {
        if (collection[i]["_id"].toString() === id) {
            return collection[i][fieldName];
            break;
        }
    }
};

item.find({}, function(err, itemsCollection) {
    if (err) return console.log(err);
    itemSet.find({}, function(err, items) {
        if (err) return console.log(err);
        stores.find({}, function(err, stores) {
            if (err) return console.log(err);
            for (var i = 0; i < items.length; i++) {
                var obj = {}
                obj.price = items[i].price;
                obj.count = items[i].count;
                obj.itemTitle = getName(items[i].itemId.toString(), 'title', itemsCollection);
                obj.storeTitle = getName(items[i].storeId.toString(), 'name', stores);
                ret.push(obj);
            }
            res.json(ret)
        })
    })
});

});

// app.get('/warehouse/report1', function(req, res) {
//     var ret = [];
//
//     // function getItemName(id, collection) {
//     //     var res = "test";
//     //     for (var i = 0; i < collection.length; i++) {
//     //         console.log(id);
//     //          console.log(collection[i]["_id"]);
//     //          console.log(collection[i].title);
//     //         if (collection[i]["_id"] == id) res = collection[i].title;
//     //     }
//     //     return res
//     // }
//
//     function getName(id, fieldName, collection) {
//         for (var i = 0; i < collection.length; i++) {
//             // console.log(id);
//             //  console.log(clId);
//             //console.log(collection[i].title);
//             if (collection[i]["_id"].toString() === id) {
//                 return collection[i][fieldName];
//                 break;
//             }
//         }
//     }
//     // itemSet.findOne().populate({
//     // 	path:
//     // })
//
//     item.find({}, function(err, itemsCollection) {
//         if (err) return console.log(err);
//         itemSet.find({}, function(err, items) {
//             if (err) return console.log(err);
//             stores.find({}, function(err, stores) {
//                 if (err) return console.log(err);
//                 //console.log(data);
//                 //res.json(data)
//                 //console.log(items[0].itemId);
//                 //console.log(itemsCollection[0]._id);
//                 //console.log(items);
//                 //console.log(stores);
//                 for (var i = 0; i < items.length; i++) {
//                     var obj = {}
//                     obj.price = items[i].price;
//                     obj.count = items[i].count;
//                     obj.itemTitle = getName(items[i].itemId.toString(), 'title', itemsCollection);
//                     obj.storeTitle = getName(items[i].storeId.toString(), 'name', stores);
//                     //console.log(obj);
//                     //console.log(obj.itemId == obj.ittemSetId);
//                     //console.log(getItemName(items[0].itemId.toString(), itemsCollection));
//                     ret.push(obj);
//                 }
//                 //console.log(ret);
//                 res.json(ret)
//                     // item.find({},function(err, itemsCollection){
//                     //   if (err) return console.log(err);
//                     //   for (var i=0;i<items.length;i++){
//                     //     var obj = {};
//                     //     obj.price = items[i].price;
//                     //     obj.count = items[i].count;
//                     //     console.log(items[i].storeId);
//                     //     //console.log(getItemName(items[i].itemId,itemsCollection));
//                     //     obj.itemTitle = getItemName(items[i].itemId,itemsCollection);
//                     //     ret.push(obj);
//                     //   }
//                     //   //console.log(ret);
//                     //   //console.log(itemsCollection);
//                     //   //console.log(items);
//                     //       res.json(items[0].itemId)
//                     // })
//             })
//         })
//     });

// itemSet.find({}, function(err, items) {
//     if (err) return console.log(err);
//     //console.log(data);
//     //res.json(data)
//     console.log(items[0].itemId);
//     // item.find({},function(err, itemsCollection){
//     //   if (err) return console.log(err);
//     //   for (var i=0;i<items.length;i++){
//     //     var obj = {};
//     //     obj.price = items[i].price;
//     //     obj.count = items[i].count;
//     //     console.log(items[i].storeId);
//     //     //console.log(getItemName(items[i].itemId,itemsCollection));
//     //     obj.itemTitle = getItemName(items[i].itemId,itemsCollection);
//     //     ret.push(obj);
//     //   }
//     //   //console.log(ret);
//     //   //console.log(itemsCollection);
//     //   //console.log(items);
//     //       res.json(items[0].itemId)
//     // })
// })


//});

app.get('/warehouse', function(req, res) {
    console.log("warehouse");
    res.sendFile(index);
    //res.status(200).send('warehouse');
});

app.get('/shop', function(req, res) {
    console.log("shop");
    res.sendFile(index);
    //	var db = testDB.connection;
    //db.on('error', console.error.bind(console, 'connection error:'));
    //db.once('open', function() {
    //  console.log("Connected to DB");
    // Tst.find(function(err, data){
    //   if(err) return console.log(err);
    //   console.log(data);
    //   res.json(data)
    //  })
    //});
});

app.get('*', function(req, res) {
    //res.sendFile(path.join(__dirname,"public","err","404.html"));
    console.log("err");
    res.status(404).send('what???');
});


app.listen(PORT, function() {
    console.log('Server listening on port ' + PORT);
});

// app.get('/', function (req, res) {
//     if(req.accepts('text/html')){
//         res.sendfile(__dirname + '/index.html');
//         return;
//      }
//      else if(req.accepts('application/json')){
//         res.json({'key':'value'});
//         return;
//      }
// });
