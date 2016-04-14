var store = {
  name: string,
  password: string,
  account: number
};

var warehouse = {
  name: string,
  account: number,
  storeId: id
};

var user = {
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
  price: number,
  count: number
};

var item {
  title: string,
  description: string,
  image: string,
  category: string
};

var transaction = {
  accountFrom: number,
  accountTo: number,
  amount: number
};

var order = {
  date: date,
  itemSet: [itemObject1, itemObject2, ... ],
  transactionId: id
}
