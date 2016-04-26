var express = require('express');
var path = require('path');
var app = express();
var Promise = require('bluebird')
    //var testDB = require('mongoose');
    //var storeDB = require('mongoose');
var mongoose = Promise.promisifyAll(require("mongoose"));

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
    // Tst.find(function(err, data) {
    //     if (err) return console.log(err);
    //     console.log(data);
    //     res.json(data)
    // })
    Tst.find({}).then(function(data) {
        console.log(data);
        return res.json(data)
    })
});

function mockupDataShopReport1(){
    var arr = [
        {"price":"100","count":"10","itemTitle":"testItem1","storeTitle":"testStore1"},
        {"price":"200","count":"20","itemTitle":"testItem2","storeTitle":"testStore1"},
        {"price":"300","count":"30","itemTitle":"testItem3","storeTitle":"testStore1"},
        {"price":"400","count":"40","itemTitle":"testItem4","storeTitle":"testStore1"},
        {"price":"500","count":"50","itemTitle":"testItem5","storeTitle":"testStore1"},
        {"price":"600","count":"60","itemTitle":"testItem6","storeTitle":"testStore1"},
        {"price":"700","count":"70","itemTitle":"testItem7","storeTitle":"testStore1"},
        {"price":"800","count":"80","itemTitle":"testItem8","storeTitle":"testStore1"},
        {"price":"900","count":"90","itemTitle":"testItem9","storeTitle":"testStore1"},
        {"price":"102","count":"12","itemTitle":"testItem1","storeTitle":"testStore2"},
        {"price":"202","count":"22","itemTitle":"testItem2","storeTitle":"testStore2"},
        {"price":"302","count":"32","itemTitle":"testItem3","storeTitle":"testStore2"},
        {"price":"402","count":"42","itemTitle":"testItem4","storeTitle":"testStore2"},
        {"price":"502","count":"52","itemTitle":"testItem5","storeTitle":"testStore2"},
        {"price":"602","count":"62","itemTitle":"testItem6","storeTitle":"testStore2"},
        {"price":"702","count":"72","itemTitle":"testItem7","storeTitle":"testStore2"},
        {"price":"802","count":"82","itemTitle":"testItem8","storeTitle":"testStore2"},
        {"price":"902","count":"92","itemTitle":"testItem9","storeTitle":"testStore2"},
        {"price":"103","count":"15","itemTitle":"testItem1","storeTitle":"testStore3"},
        {"price":"203","count":"15","itemTitle":"testItem2","storeTitle":"testStore3"},
        {"price":"303","count":"15","itemTitle":"testItem3","storeTitle":"testStore3"},
        {"price":"403","count":"15","itemTitle":"testItem4","storeTitle":"testStore3"},
        {"price":"503","count":"15","itemTitle":"testItem5","storeTitle":"testStore3"},
        {"price":"603","count":"15","itemTitle":"testItem6","storeTitle":"testStore3"},
        {"price":"703","count":"15","itemTitle":"testItem7","storeTitle":"testStore3"},
        {"price":"803","count":"15","itemTitle":"testItem8","storeTitle":"testStore3"},
        {"price":"903","count":"15","itemTitle":"testItem9","storeTitle":"testStore3"},
        {"price":"504","count":"54","itemTitle":"testItem1","storeTitle":"testStore4"},
        {"price":"604","count":"64","itemTitle":"testItem2","storeTitle":"testStore4"},
        {"price":"704","count":"74","itemTitle":"testItem3","storeTitle":"testStore4"},
        {"price":"804","count":"84","itemTitle":"testItem4","storeTitle":"testStore4"},
        {"price":"904","count":"94","itemTitle":"testItem5","storeTitle":"testStore4"}
    ];
    return arr;
};

function mockupDataWarehouseReport1(){
    var arr = [
        {"warehouseTitle":"warehouse1", "itemTitle":"testItem1", "amount":"10", "price":"10"},
        {"warehouseTitle":"warehouse1", "itemTitle":"testItem2", "amount":"20", "price":"20"},
        {"warehouseTitle":"warehouse1", "itemTitle":"testItem3", "amount":"30", "price":"30"},
        {"warehouseTitle":"warehouse1", "itemTitle":"testItem4", "amount":"40", "price":"40"},
        {"warehouseTitle":"warehouse1", "itemTitle":"testItem5", "amount":"50", "price":"50"},
        {"warehouseTitle":"warehouse1", "itemTitle":"testItem6", "amount":"60", "price":"60"},
        {"warehouseTitle":"warehouse1", "itemTitle":"testItem7", "amount":"70", "price":"70"},
        {"warehouseTitle":"warehouse1", "itemTitle":"testItem8", "amount":"80", "price":"80"},
        {"warehouseTitle":"warehouse1", "itemTitle":"testItem9", "amount":"90", "price":"90"},
        {"warehouseTitle":"warehouse2", "itemTitle":"testItem1", "amount":"90", "price":"90"},
        {"warehouseTitle":"warehouse2", "itemTitle":"testItem2", "amount":"80", "price":"80"},
        {"warehouseTitle":"warehouse2", "itemTitle":"testItem3", "amount":"70", "price":"70"},
        {"warehouseTitle":"warehouse2", "itemTitle":"testItem4", "amount":"60", "price":"60"},
        {"warehouseTitle":"warehouse2", "itemTitle":"testItem5", "amount":"50", "price":"50"},
        {"warehouseTitle":"warehouse2", "itemTitle":"testItem6", "amount":"40", "price":"40"},
        {"warehouseTitle":"warehouse2", "itemTitle":"testItem7", "amount":"30", "price":"30"},
        {"warehouseTitle":"warehouse2", "itemTitle":"testItem8", "amount":"20", "price":"20"},
        {"warehouseTitle":"warehouse2", "itemTitle":"testItem9", "amount":"10", "price":"10"},
        {"warehouseTitle":"warehouse3", "itemTitle":"testItem1", "amount":"10", "price":"20"},
        {"warehouseTitle":"warehouse3", "itemTitle":"testItem1", "amount":"10", "price":"30"},
        {"warehouseTitle":"warehouse3", "itemTitle":"testItem2", "amount":"10", "price":"40"},
        {"warehouseTitle":"warehouse3", "itemTitle":"testItem2", "amount":"10", "price":"50"},
        {"warehouseTitle":"warehouse3", "itemTitle":"testItem1", "amount":"10", "price":"60"},
        {"warehouseTitle":"warehouse3", "itemTitle":"testItem4", "amount":"10", "price":"70"},
        {"warehouseTitle":"warehouse3", "itemTitle":"testItem4", "amount":"10", "price":"80"}
    ]
    return arr
};

function mockupDataBankReport2(){
    var arr = [
        {"source":"testUser1","time":"24-04-2016","amount":"100"},
        {"source":"testUser2","time":"24-04-2016","amount":"200"},
        {"source":"testUser3","time":"24-04-2016","amount":"300"},
        {"source":"testUser4","time":"24-04-2016","amount":"400"},
        {"source":"testUser5","time":"24-04-2016","amount":"500"},
        {"source":"testUser6","time":"24-04-2016","amount":"600"},
        {"source":"testUser7","time":"24-04-2016","amount":"700"},
        {"source":"testUser8","time":"24-04-2016","amount":"800"},
        {"source":"testUser9","time":"24-04-2016","amount":"900"},
        {"source":"testUser1","time":"25-04-2016","amount":"100"},
        {"source":"testUser1","time":"25-04-2016","amount":"200"},
        {"source":"testUser2","time":"25-04-2016","amount":"300"},
        {"source":"testUser2","time":"25-04-2016","amount":"400"},
        {"source":"testUser3","time":"25-04-2016","amount":"500"},
        {"source":"testUser3","time":"25-04-2016","amount":"600"},
        {"source":"testUser4","time":"25-04-2016","amount":"700"},
        {"source":"testUser5","time":"25-04-2016","amount":"800"},
        {"source":"testUser5","time":"25-04-2016","amount":"900"},
        {"source":"testUser1","time":"26-04-2016","amount":"100"},
        {"source":"testUser2","time":"26-04-2016","amount":"100"},
        {"source":"testUser3","time":"26-04-2016","amount":"200"},
        {"source":"testUser3","time":"26-04-2016","amount":"200"},
        {"source":"testUser4","time":"26-04-2016","amount":"300"},
        {"source":"testUser4","time":"26-04-2016","amount":"300"},
        {"source":"testUser4","time":"26-04-2016","amount":"400"},
        {"source":"testUser5","time":"26-04-2016","amount":"500"},
        {"source":"testUser5","time":"26-04-2016","amount":"600"}
    ]
    return arr;
};

app.get('/bank/report2', function(req, res) {
    res.json(mockupDataBankReport2());
});

app.get('/shop/report1', function(req, res) {
    function getName(id, fieldName, collection) {
        for (var i = 0; i < collection.length; i++) {
            if (collection[i]["_id"].toString() === id) {
                return collection[i][fieldName];
                break;
            }
        }
    };
    ////--return real data
    // //db.item.find({filter}).sort({date:-1/*+1*/}order).skip(per_page*(page-1)).limit(page)
    // Promise.all([item.find({}), itemSet.find({}), stores.find({})])
    //     .spread(function(itemsCollection, items, stores) {
    //         //  console.log(items,stores,itemsCollection);
    //         //   var ret = [];
    //         // for (var i = 0; i < items.length; i++) {
    //         //     var obj = {}
    //         //     obj.price = items[i].price;
    //         //     obj.count = items[i].count;
    //         //     obj.itemTitle = getName(items[i].itemId.toString(), 'title', itemsCollection);
    //         //     obj.storeTitle = getName(items[i].storeId.toString(), 'name', stores);
    //         //
    //         //     ret.push(obj);
    //         //   };
    //         var arr = items.map(function(obj) {
    //                 var rObj = {};
    //                 rObj.price = obj.price;
    //                 rObj.count = obj.count;
    //                 rObj.itemTitle = getName(obj.itemId.toString(), 'title', itemsCollection);
    //                 rObj.storeTitle = getName(obj.storeId.toString(), 'name', stores);
    //                 return rObj;
    //             })
    //             //console.log(arr);
    //         //return res.json(ret)
    //         return res.json(arr)
    //     })
    //     .catch(function(err) {
    //         console.log(err.stack);
    //     })
    ////--return real data
    res.json(mockupDataShopReport1());

    // item.find({}).
    // then(function(itemsCollection){
    //   return Proomise.all([itemSet.find({}), stores.find({}),itemsCollection])
    // })
    // .then(function(itms,stores,itemsCollection){
    //
    // })
    // .catch(function(err){
    //  console.log(err);
    // })

    //  item.find({}).
    //  then(function(itemsCollection){
    //    return itemSet.find({})
    //  })
    //  .then()
    // .catch(function(err){
    //   console.log(err);
    // })
    // item.find({}, function(err, itemsCollection) {
    //     if (err) return console.log(err);
    //     itemSet.find({}, function(err, items) {
    //         if (err) return console.log(err);
    //         stores.find({}, function(err, stores) {
    //             if (err) return console.log(err);
    //
    //             for (var i = 0; i < items.length; i++) {
    //                 var obj = {}
    //                 obj.price = items[i].price;
    //                 obj.count = items[i].count;
    //                 obj.itemTitle = getName(items[i].itemId.toString(), 'title', itemsCollection);
    //                 obj.storeTitle = getName(items[i].storeId.toString(), 'name', stores);
    //
    //                 ret.push(obj);
    //             }
    //             res.json(ret)
    //         })
    //     })
    // });
});

app.get('/warehouse/report1', function(req, res) {
    // var ret = [];
    //
    // function getName(id, fieldName, collection) {
    //     for (var i = 0; i < collection.length; i++) {
    //         if (collection[i]["_id"].toString() === id) {
    //             return collection[i][fieldName];
    //             break;
    //         }
    //     }
    // };
    //
    // item.find({}, function(err, itemsCollection) {
    //     if (err) return console.log(err);
    //     itemSet.find({}, function(err, items) {
    //         if (err) return console.log(err);
    //         stores.find({}, function(err, stores) {
    //             if (err) return console.log(err);
    //             for (var i = 0; i < items.length; i++) {
    //                 var obj = {}
    //                 obj.price = items[i].price;
    //                 obj.count = items[i].count;
    //                 obj.itemTitle = getName(items[i].itemId.toString(), 'title', itemsCollection);
    //                 obj.storeTitle = getName(items[i].storeId.toString(), 'name', stores);
    //                 ret.push(obj);
    //             }
    //             res.json(ret)
    //         })
    //     })
    // });

    res.json(mockupDataWarehouseReport1());

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
