var storeAppControllers = require('./storeAppControllers');

var filterControllers = angular.module('filterControllers', []);

filterControllers.controller('CategoriesCtrl', ['$cookies', '$scope', '$http', '$state', 'dataTransfer', function($cookies, $scope, $http, $state, dataTransfer) {
  $scope.products = dataTransfer.getProducts();

  $scope.filterByCategory = function (category) {
    var url = 'api/store/'.concat($scope.store._id, '/', category);

    $http.get(url)
		.then(function(res){
      dataTransfer.setProducts(res.data);

      $state.go('store.category', {category: category});

		}, function(err){
      console.log(err);
		});

  }
}]);

(function() {
    angular
        .module('storeApp', ['storeAppControllers', 'filterControllers', 'underscore', 'ui.router', 'ngCookies'])
        .factory('dataTransfer', function($http) {
          var products = [];

          return {
            setProducts: function (data) {
              products = data;
            },
            getProducts: function () {
              return products;
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
            templateUrl: 'partials/storesList.html',
            controller: 'StoreCtrl'
          }).
          state('store', {
            url: '/store/:id',
            templateUrl: 'partials/storeFront.html',
            controller: 'StoreFrontCtrl'
          }).
          state('store.category', {
            url: '/:category',
            templateUrl: 'partials/category.html',
            controller: 'CategoriesCtrl'
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
          });

          $locationProvider.html5Mode(true);
        }])

})();
