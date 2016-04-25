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
