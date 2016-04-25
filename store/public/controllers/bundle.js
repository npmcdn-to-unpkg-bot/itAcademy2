(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var storeAppControllers = require('./storeAppControllers');

(function() {
    angular
        .module('storeApp', ['storeAppControllers', 'underscore', 'ui.router', 'ngCookies'])
        .factory('dataTransfer', function() {
          var products = [];
          var categories = [];
          var filter;

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
            }
          };

        })
        .filter('unique', function() {
          return function(collection, keyname) {
            var output = [],
            keys = [];

            angular.forEach(collection, function(item) {
              var key = item[keyname];
              if(keys.indexOf(key) === -1) {
                keys.push(key);
                output.push(item);
              }
            });
            return output;
          };
        })
        .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
        function($stateProvider, $urlRouterProvider, $locationProvider) {

          $urlRouterProvider.otherwise("/");

          $stateProvider.
          state('list', {
            url: '/',
            views: {
              'content': {
                templateUrl: 'partials/storesList.html',
                controller: 'StoreCtrl'
              }
            }
          }).
          state('store', {
            url: '/store/:id',
            views: {
              'content': {
                templateUrl: 'partials/storeFront.html',
                controller: 'StorePageCtrl'
              },
              'categories@store': {
                templateUrl: 'partials/categoriesList.html',
                controller: 'CategoriesCtrl'
              },
              'products@store': {
                templateUrl: 'partials/products.html',
                controller: 'ProductsCtrl'
              }
            }
          }).
          state('store.register', {
            url: '/register',
            views: {
              'storeFront': {
                templateUrl: 'partials/register.html',
                controller: 'RegisterCtrl'
              }
            }
          }).
          state('store.login', {
            url: '/login',
            views: {
              'storeFront': {
                templateUrl: 'partials/login.html',
                controller: 'RegisterCtrl'
              }
            }
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

storeAppControllers.controller('StorePageCtrl', ['$cookies','$scope', '$http','$stateParams', '$state', 'dataTransfer',  function($cookies, $scope, $http, $stateParams, $state, dataTransfer) {
  $scope.store = $cookies.getObject('store');
  $scope.user = $cookies.getObject('user');

  $scope.logout = function () {
    $cookies.remove('user');
    delete $scope.user;

    $state.go('store', {id: $scope.store._id}, {reload: true});
  }


}]);

storeAppControllers.controller('CategoriesCtrl', ['$cookies','$scope','$http', '$state', 'dataTransfer',  function($cookies, $scope, $http, $state, dataTransfer) {
  $scope.store = $cookies.getObject('store');
  $scope.user = $cookies.getObject('user');

  var getCategories = function(){

    $http.get('api/store/' + $scope.store._id)
    .then(function(res){
      if (res.data.error)
        return console.log(res.data.error);

      $scope.categories = res.data[1];
      dataTransfer.setCategories(res.data[1]);

    }, function(err){
      console.log(err);
    });
  }

  dataTransfer.getCategories().length > 0 ? $scope.categories = dataTransfer.getCategories() : getCategories();

  $scope.filterByCategory = function (category) {
    var url = 'api/store/'+ $scope.store._id + '?category=' + category;

    $http.get(url)
		.then(function(res){
      dataTransfer.setProducts(res.data);

      dataTransfer.setFilter(category);
      $state.go('store', {id: $scope.store._id, category: category}, {reload: true});

		}, function(err){
      console.log(err);
		});
  };

  $scope.showAll = function() {
    dataTransfer.setProducts([]);
    $state.go('store', {id: $scope.store._id}, {reload: true});
  };

}]);

storeAppControllers.controller('ProductsCtrl', ['$cookies','$scope','$http', '$state', 'dataTransfer',  function($cookies, $scope, $http, $state, dataTransfer) {
  $scope.store = $cookies.getObject('store');
  $scope.user = $cookies.getObject('user');
  $scope.filter = dataTransfer.getFilter() || '';

  var getProducts = function(){

    $http.get('api/store/' + $scope.store._id)
    .then(function(res){
      if (res.data.error)
        return console.log(res.data.error);

      $scope.products = res.data[0];
    }, function(err){
      console.log(err);
    });
  }

  dataTransfer.getProducts().length > 0 ? $scope.products = dataTransfer.getProducts() : getProducts();

  $scope.showAll = function() {
    dataTransfer.setProducts([]);
    dataTransfer.setFilter('');
    
    $state.go('store', {id: $scope.store._id}, {reload: true});
  };

}]);

storeAppControllers.controller('RegisterCtrl', ['$scope', '$http', '$cookies', '$state', function($scope, $http, $cookies, $state){
  $scope.store = $cookies.getObject('store');
  $scope.formData = {"storeId": $scope.store._id};

  $scope.addUser = function (formData) {
    $http.post('api/add_user', formData)
		.then(function(res){
      var user = res.data;
      $cookies.putObject('user', user);
      $state.go('store', {id: $scope.store._id}, {reload: true});

		}, function(err){
      if (err.data.error.indexOf('E11000') !== -1) {
        $scope.error = "User with same email is already registered. Please "
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
      $state.go('store', {id: $scope.store._id}, {reload: true});

		}, function(err){
      if (err.data.error.indexOf('E11000') !== -1) {
        $scope.error = "User with same email is already registered. Please "
      }

		});
  }
}]);


var underscore = angular.module('underscore', []);
underscore.factory('_', ['$window', function($window) {
  return $window._;
}]);

module.exports = storeAppControllers;

},{}]},{},[1]);
