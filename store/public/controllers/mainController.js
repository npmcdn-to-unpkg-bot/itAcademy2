î
var storeAppControllers = require('./storeAppControllers');

(function() {
    angular
        .module('storeApp', ['storeAppControllers', 'underscore', 'ui.router', 'ngCookies'])
        .factory('dataTransfer', function() {
          var products = [];
          var categories = [];
          var numOfPages;
          var item;
          var currentPage;

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
            setNumOfPages: function (data) {
              numOfPages = data;
            },
            getNumOfPages: function () {
              return numOfPages;
            },
            setItem: function (data) {
              item = data;
            },
            getItem: function () {
              return item;
            },
            setCurrentPage: function (data) {
              currentPage = Number(data);
            },
            getCurrentPage: function () {
              return currentPage;
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
            url: '/store/?storeId&sort&filter&search&page',
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
