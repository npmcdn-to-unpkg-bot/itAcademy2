var warehouse = {
    _id: id,
    nameWarehouse: String,
    date: Date,
    available: Boolean,
    warehouseAccount: String,
    itemSet: [{
        id: id, //id in item so here id, not _id
        amount: Number,
        price: Number

    }]
};
var item = {
    _id: id,
    name: String,
    description: String,
    image: String,
    category: String
};