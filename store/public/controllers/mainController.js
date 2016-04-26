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
