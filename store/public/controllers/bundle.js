(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var storeAppControllers = require('./storeAppControllers');

(function() {
    angular
        .module('storeApp', ['storeAppControllers', 'underscore', 'ui.router', 'ngCookies'])
        .factory('dataTransfer', function() {
          var products = [];
          var categories = [];
          var filter;
          var item;

          return {
            setProducts: function (data) {
              products = data;
            },
            getProducts: function () {
              return products;
            },
            setCategories: function (data) {
              categories = data;
            },
            getCategories: function () {
              return categories;
            },
            setFilter: function (data) {
              filter = data;
            },
            getFilter: function () {
              return filter;
            },
            setItem: function (data) {
              item = data;
            },
            getItem: function () {
              return item;
            }
          };

        })
        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {

          $urlRouterProvider.otherwise("/");

          $stateProvider.
          state('list', {
            url: '/',
            templateUrl: 'partials/storesList.html',
            controller: 'StoreCtrl'
          }).
          state('store', {
            url: '/store/?storeId&sort&filter',
            templateUrl: 'partials/storeFront.html',
            controller: 'StoreFrontCtrl'
          }).
          state('store.register', {
            url: '/register',
            templateUrl: 'partials/register.html',
            controller: 'RegisterCtrl'
          }).
          state('store.login', {
            url: '/login',
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
          }).
          state('store.cart', {
            url: '/cart',
            templateUrl: 'partials/cart.html',
            controller: 'CartCtrl'
          }).
          state('store.profile', {
            url: '/user=:userId',
            templateUrl: 'partials/userProfile.html',
            controller: 'ProfileCtrl'
          }).
          state('store.profile.orders', {
            url: '/orders',
            templateUrl: 'partials/orders.html',
            controller: 'OrdersCtrl'
          }).
          state('store.item', {
            url: '/item={item_title}',
            templateUrl: 'partials/itemPage.html',
            controller: 'ItemCtrl'
          });

          $locationProvider.html5Mode(true);
        }])

})();

},{"./storeAppControllers":2}],2:[function(require,module,exports){
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

  // setting proper Filters array
  if (_.isUndefined($stateParams.filter)) {
    $scope.filterList = [];
  } else if (_.isString($stateParams.filter)) {
    $scope.filterList = [$stateParams.filter];
  } else if (_.isObject($stateParams.filter)) {
    $scope.filterList = _.toArray($stateParams.filter);
  };


  $scope.filterState = $scope.filterList.length > 0;

  // setting SELECT options to sorting value
  if ($scope.sortOption === 'price_desc') {
    $scope.selectedPriceDesc = true;
  } else if ($scope.sortOption === 'price_asc') {
    $scope.selectedPriceAsc = true;
  };

  if ($scope.sortOption === 'name_desc') {
    $scope.selectedNameDesc = true;
  } else if ($scope.sortOption === 'name_asc') {
    $scope.selectedNameAsc = true;
  };

  $scope.sort = function(sortOption) {
     $http.get('api/store/', {
      params: {
        storeId: $scope.store._id,
        category: $scope.filterList,
        sort: sortOption
    }})
    .then(function(res){
      if (res.data.error)
        return console.log(res.data.error);

      dataTransfer.setProducts(res.data.products)
      $state.go('store', {storeId: $scope.store._id, sort: sortOption}, {location: true});
    }, function(err){
      console.log(err);
    });
  }

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
        sort: $scope.sortOption
    }})
		.then(function(res){
      dataTransfer.setProducts(res.data.products);
      $scope.products = res.data.products;

      $state.go('store', {storeId: $scope.store._id, filter: $scope.filterList, sort: $scope.sortOption}, {location: true});
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
        sort: $scope.sortOption
    }})
		.then(function(res){
      dataTransfer.setProducts(res.data.products);
      $scope.products = res.data.products;

      $state.go('store', {storeId: $scope.store._id, filter: $scope.filterList, sort: $scope.sortOption}, {location: true});
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
        sort: $scope.sortOption
    }})
    .then(function(res){
      if (res.data.error)
        return console.log(res.data.error);

      $scope.products = res.data.products;
      $scope.categories = res.data.categories;
      dataTransfer.setCategories(res.data.categories);
    }, function(err){
      console.log(err);
    });
  }

  var getCategories = function(){

    $http.get('api/store/', {
      params: {
        storeId: $scope.store._id
    }})
    .then(function(res){
      if (res.data.error)
        return console.log(res.data.error);

      $scope.categories = res.data.categories;
      dataTransfer.setCategories(res.data.categories);
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

    $http.get('api/store/', {
      params: {
        storeId: $scope.store._id
    }})
    .then(function(res){
      if (res.data.error)
        return console.log(res.data.error);

      $scope.categories = res.data.categories;
      dataTransfer.setCategories(res.data.categories);
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
      user: $scope.user,
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
    /* var transactionDetails = {
      source: $scope.user.email,
      password: $scope.user.password,
      destination: $scope.store.email,
      amount: $scope.totalPrice
    };

    $http.post('http://localhost:3001/api/transfer', transactionDetails)
    .then(function(res){
      if (res.data.success) {
        transactionDetails.token = res.data.token;
        transactionDetails.items = $scope.user.cart;

        $scope.user.cart = [];
        $cookies.putObject('user', $scope.user);
        $state.go('store', {id: $scope.store._id}, {reload: true});
      } else {
        console.log(err);
      }

    }, function(err){
      console.log(err);
    });
  */
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

},{}]},{},[1,2]);
