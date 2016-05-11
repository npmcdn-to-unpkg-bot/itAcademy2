var storeAppControllers = angular.module('storeAppControllers', ['underscore'])

storeAppControllers.controller('StoreCtrl', ['$cookies', '$scope', '$http', 'dataTransfer', function($cookies, $scope, $http, dataTransfer){

  var getStores = function() {
    $http.get('api/stores')
		.then(function(res){

			$scope.stores = res.data;
		}, function(err){
			console.log(err);
		});
  }

  $scope.saveStoreData = function(id) {
    var data = _.find($scope.stores, function(store) {
      return store._id === id;
    })
    $cookies.putObject("store", data);
  }

  getStores();

}]);

storeAppControllers.controller('StoreFrontCtrl', ['$cookies','$scope', '$http','$stateParams', '$state', 'dataTransfer',  function($cookies, $scope, $http, $stateParams, $state, dataTransfer) {
  $scope.store = $cookies.getObject('store');
  $scope.user = $cookies.getObject('user');

  $scope.store._id = $stateParams.storeId;
  $scope.sortOption = $stateParams.sort;
  $scope.searchWords = $stateParams.search;
  $scope.page = $stateParams.page || 1;

  // setting proper Filters array
  if (_.isUndefined($stateParams.filter)) {
    $scope.filterList = [];
  } else if (_.isString($stateParams.filter)) {
    $scope.filterList = [$stateParams.filter];
  } else if (_.isObject($stateParams.filter)) {
    $scope.filterList = _.toArray($stateParams.filter);
  };

  // START of filtering and SEARCH part
  // setting SELECT options to sorting value
  if ($scope.sortOption === 'price_desc') {
    $scope.selectedPriceDesc = true;
  } else if ($scope.sortOption === 'price_asc') {
    $scope.selectedPriceAsc = true;
  } else if ($scope.sortOption === 'name_desc') {
    $scope.selectedNameDesc = true;
  } else if ($scope.sortOption === 'name_asc') {
    $scope.selectedNameAsc = true;
  };

  $scope.sort = function(sortOption) {
     $http.get('api/store/', {
      params: {
        storeId: $scope.store._id,
        category: $scope.filterList,
        sort: sortOption,
        search: $scope.searchWords
    }})
    .then(function(res){
      if (res.data.error)
        return console.log(res.data.error);

      dataTransfer.setProducts(res.data.products)
      $state.go('store', {storeId: $scope.store._id, sort: sortOption, search: $scope.searchWords}, {location: true});
    }, function(err){
      console.log(err);
    });
  }

  $scope.search = function(keywords) {

    $http.get('api/store/', {
      params: {
        storeId: $scope.store._id,
        category: $scope.filterList,
        sort: $scope.sortOption,
        search: keywords
    }})
    .then(function(res){
      dataTransfer.setProducts(res.data.products);
      $scope.products = res.data.products;

      $state.go('store', {storeId: $scope.store._id, filter: $scope.filterList, sort: $scope.sortOption, search: keywords}, {location: true});
    }, function(err){
      console.log(err);
    });
  };

  $scope.deleteSearch = function () {
    delete $scope.searchWords;

    $http.get('api/store/', {
      params: {
        storeId: $scope.store._id,
        category: $scope.filterList,
        sort: $scope.sortOption,
        search: $scope.searchWords
    }})
    .then(function(res){
      dataTransfer.setProducts(res.data.products);
      $scope.products = res.data.products;

      $state.go('store', {storeId: $scope.store._id, filter: $scope.filterList, sort: $scope.sortOption, search: $scope.searchWords}, {location: true});
    }, function(err){
      console.log(err);
    });
  }
  //END of filtering and SEARCH part

  $scope.logout = function () {
    $http.get('/api/logout')
    .then(function() {
      $cookies.remove('user');
      delete $scope.user;
      $state.go('store', {storeId: $scope.store._id}, {reload: true});
    }, function(err) {
      console.log(err);
      $scope.alert = 'Logout failed'
    });

  };

  // Start of Filtering section
  $scope.filterByCategory = function (category) {

    //stateParams returns 'string' in case of 1 parameter and 'object' in case of many parameters
    _.isUndefined($stateParams.filter) ? $scope.filterList = [category] : $scope.filterList = _.flatten(_.toArray([$stateParams.filter, category]));

    $scope.filterList = _.uniq($scope.filterList);

    $http.get('api/store/', {
      params: {
        storeId: $scope.store._id,
        category: $scope.filterList,
        sort: $scope.sortOption,
        search: $scope.searchWords
    }})
		.then(function(res){
      dataTransfer.setProducts(res.data.products);
      $scope.products = res.data.products;

      $state.go('store', {storeId: $scope.store._id, filter: $scope.filterList, sort: $scope.sortOption, search: $scope.searchWords}, {location: true});
		}, function(err){
      console.log(err);
		});
  };

  $scope.deleteCategory = function (category) {
    $scope.filterList = _.without($scope.filterList, category)

    if ($scope.filterList.length === 0) {
      delete $scope.filterList;
    };

    $http.get('api/store/', {
      params: {
        storeId: $scope.store._id,
        category: $scope.filterList,
        sort: $scope.sortOption,
        search: $scope.searchWords
    }})
		.then(function(res){
      dataTransfer.setProducts(res.data.products);
      $scope.products = res.data.products;

      $state.go('store', {storeId: $scope.store._id, filter: $scope.filterList, sort: $scope.sortOption, search: $scope.searchWords}, {location: true});
		}, function(err){
      console.log(err);
		});
  };

  $scope.showAll = function() {
    dataTransfer.setProducts([]);
    $state.go('store', {storeId: $scope.store._id}, {inherit: false});
  };
  // End of filtering section

  // START of populate data for the main page
  var getProducts = function(){

    $http.get('api/store/', {
      params: {
        storeId: $scope.store._id,
        category: $scope.filterList,
        sort: $scope.sortOption,
        search: $scope.searchWords,
        page: $scope.page
    }})
    .then(function(res){
      if (res.data.error)
        return console.log(res.data.error);

      $scope.numOfPages = _.range(1, res.data.numOfPages + 1);
      $scope.products = res.data.products;
    }, function(err){
      console.log(err);
    });
  }

  var getCategories = function(){

    $http.get('api/getStoreCategories', {
      params: {
        storeId: $scope.store._id
    }})
    .then(function(res){
      if (res.data.error)
        return console.log(res.data.error);

      $scope.categories = res.data;
      dataTransfer.setCategories(res.data);
    }, function(err){
      console.log(err);
    });
  }
  // END of populates data for the main page

  $scope.saveItem = function(item) {
    $cookies.putObject('item', item);
    dataTransfer.setItem(item);
  };

  $scope.addToCart = function(item) {
    item.amountToBuy = 1;
    $scope.user = $cookies.getObject('user');
    $scope.user.cart.push(item);
    $cookies.putObject('user', $scope.user);
  };

  $scope.goToPage = function (page) {
    $state.go('store', {page: page});
  }
  dataTransfer.getCategories().length > 0 ? $scope.categories = dataTransfer.getCategories() : getCategories();
  dataTransfer.getProducts().length > 0 ? $scope.products = dataTransfer.getProducts() : getProducts();
}]);

storeAppControllers.controller('RegisterCtrl', ['$scope', '$http', '$cookies', '$state', function($scope, $http, $cookies, $state){
  $scope.store = $cookies.getObject('store');
  $scope.formData = {"storeId": $scope.store._id};

  $scope.addUser = function (formData) {
    $http.post('api/add_user', formData)
		.then(function(res){
      var user = res.data;
      $cookies.putObject('user', user);
      $state.go('store', {storeId: $scope.store._id}, {reload: true});

		}, function(err){
      if (err.data.error.indexOf('E11000') !== -1) {
        $scope.error = "User with same email is already registered. Please ";
      } else {
        $scope.error = "Error occured, please try again later";
      }

		});
  }
}]);

storeAppControllers.controller('LoginCtrl', ['$scope', '$http', '$cookies', '$state', function($scope, $http, $cookies, $state){
  $scope.store = $cookies.getObject('store');
  $scope.formData = {"storeId": $scope.store._id};

  $scope.loginUser = function (formData) {
    $http.post('api/login_user', formData)
		.then(function(res){
      var user = res.data;
      $cookies.putObject('user', user);
      $state.go('store', {storeId: $scope.store._id}, {reload: true});

		}, function(err){
      console.log(err);
		});
  }
}]);

storeAppControllers.controller('ItemCtrl', ['$scope', '$http', '$cookies', '$state', 'dataTransfer', function($scope, $http, $cookies, $state, dataTransfer){
  $scope.store = $cookies.getObject('store');
  $scope.user = $cookies.getObject('user');
  $scope.item =  dataTransfer.getItem() || $cookies.getObject('item');
  $scope.item.amountToBuy = 1;

  var getCategories = function(){

    $http.get('api/getStoreCategories', {
      params: {
        storeId: $scope.store._id
    }})
    .then(function(res){
      if (res.data.error)
        return console.log(res.data.error);

      $scope.categories = res.data;
      dataTransfer.setCategories(res.data);
    }, function(err){
      console.log(err);
    });
  }

  $scope.increaseItemsNumber = function() {
    if ($scope.item.amountToBuy < $scope.item.count) {
      $scope.item.amountToBuy += 1;
    }
  };

  $scope.decreaseItemsNumber = function() {
    if ($scope.item.amountToBuy > 0) {
      $scope.item.amountToBuy -= 1;
    }
  };

  $scope.addToCart = function() {
    /* Adding items to Order
    var itemToOrder = {
      itemDetails: {
        itemId: $scope.item.itemId,
        price: $scope.item.price,
        amountToBuy: $scope.item.amountToBuy
      },
      user: $scope.user.email
    };

    $http.post('/api/order', itemToOrder)
    .then(function(res) {

    }, function(err){
      console.log(err);
    });
    */

    $scope.user.cart.push($scope.item);
    $cookies.putObject('user', $scope.user);
  }

  dataTransfer.getCategories().length > 0 ? $scope.categories = dataTransfer.getCategories() : getCategories();
}]);

storeAppControllers.controller('CartCtrl', ['$scope', '$http', '$cookies', '$state', 'dataTransfer', function($scope, $http, $cookies, $state, dataTransfer){
  $scope.store = $cookies.getObject('store');
  $scope.user = $cookies.getObject('user');

  $scope.removeItem = function(index) {
    $scope.user.cart.splice(index, 1);
    $cookies.putObject('user', $scope.user);
  }

  $scope.totalPrice = _.reduce($scope.user.cart, function (memo, item) {
      return memo + item.price*item.amountToBuy;
    }, 0)

  $scope.purchaseItems = function () {
    var purchaseInfo = {
      userCart: $scope.user.cart,
      store: $scope.store,
      totalPrice: $scope.totalPrice
    }

    $http.post('api/makePurchase', purchaseInfo)
    .then(function(res) {
      $scope.user.cart = [];
      $cookies.putObject('user', $scope.user);
      $state.go('store', {storeId: $scope.store._id}, {reload: true});
    }, function (err) {
      console.log(err);
    });
  }

}]);

storeAppControllers.controller('ProfileCtrl', ['$scope', '$http', '$cookies', '$state', 'dataTransfer', function($scope, $http, $cookies, $state, dataTransfer){
  $scope.store = $cookies.getObject('store');
  $scope.user = $cookies.getObject('user');

  var bankUser = {
    login: $scope.user.email,
    password: $scope.user.password
  }

  var checkBalance = function () {
    $http.post('http://localhost:3001/api/checkBalance', bankUser)
    .then(function(res) {
      var user = $cookies.getObject('user');
      $scope.user.amount = res.data.amount;

      $cookies.putObject('user', user);

    }, function(err){
      console.log(err);
    });
  };
  checkBalance();


  $scope.getMoney = function (){
    $http.post('http://localhost:3001/api/getMoney', bankUser)
    .then(function(res){
      console.log(res);
      checkBalance();

    }, function(err){
      console.log(err);
    });
  };

}]);

storeAppControllers.controller('OrdersCtrl', ['$scope', '$http', '$cookies', '$state', 'dataTransfer', function($scope, $http, $cookies, $state, dataTransfer){
  $scope.store = $cookies.getObject('store');
  $scope.user = $cookies.getObject('user');

  var getOrders = function () {
    $http.get('api/orders/' + $scope.user.email)
    .then(function(res) {
      $scope.orders = res.data;

    }, function(err){
      console.log(err);
    });
  };
  getOrders();

}]);

var underscore = angular.module('underscore', []);
underscore.factory('_', ['$window', function($window) {
  return $window._;
}]);

module.exports = storeAppControllers;
