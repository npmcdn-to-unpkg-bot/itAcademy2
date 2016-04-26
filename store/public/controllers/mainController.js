var storeAppControllers = require('./storeAppControllers');

(function() {
    angular
        .module('storeApp', ['storeAppControllers', 'underscore', 'ui.router', 'ngCookies'])
        .factory('dataTransfer', function() {
          var products = [];
          var categories = [];
          var cart = [];
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
            },
            addToCart: function (data) {
              cart.push(data);
            },
            getCart: function () {
              return cart;
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
          }).
          state('store.cart', {
            url: '/cart',
            templateUrl: 'partials/cart.html',
            controller: 'CartCtrl'
          }).
          state('store.item', {
            url: '/{item_title}',
            templateUrl: 'partials/itemPage.html',
            controller: 'ItemCtrl'
          });

          $locationProvider.html5Mode(true);
        }])

})();
