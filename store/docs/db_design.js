var store = {
  _id: string,
  name: string,
  password: string,
  account: number
};

var warehouse = {
  _id: objectId,
  name: string,
  account: number,
  storeId: id
};

var user = {
  _id: objectId,
  storeId: id,
  name: string,
  surname:  string,
  email: string,
  class: string,
  password: string,
  cart: [itemObject1, itemObject2, ... ],
  account: number
};

var itemSet = {
  storeId: id,
  itemId: id,
  originalPrice: number,
  count: number
};

var item {
  _id: objectId,
  title: string,
  description: string,
  image: string,
  price: number,
  category: string
};

var transaction = {
  _id: string,
  accountFrom: number,
  accountTo: number,
  amount: number
};

var order = {
  _id: objectId,
  date: date,
  itemSet: [itemObject1, itemObject2, ... ],
  transactionId: id
}
