var storeAppControllers = angular.module('storeAppControllers', ['underscore'])

storeAppControllers.controller('StoreCtrl', ['$cookies', '$scope', '$http', function($cookies, $scope, $http){

  var getStores = function() {
    $http.get('/stores')
		.then(function(res){
			if (res.data.error)
				return console.log(res.data.error);

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

storeAppControllers.controller('StoreFrontCtrl', ['$cookies','$scope', '$http','$stateParams', function($cookies, $scope, $http, $stateParams) {
  $scope.products = [];
  $scope.store = $cookies.getObject('store');

	var visitStore = function(){

    $http.get('/store/' + $stateParams.id)
		.then(function(res){
			if (res.data.error)
				return console.log(res.data.error);

			$scope.products = res.data;
		}, function(err){
			console.log(err);
		});
	}

  visitStore();

}]);

storeAppControllers.controller('RegisterCtrl', ['$scope', '$http', '$cookies', function($scope, $http, $cookies){
  $scope.store = $cookies.getObject('store');
  this.user = {"storeId": $scope.store._id};

  this.addUser = function (user) {
    console.log(user);
  }
}]);

var underscore = angular.module('underscore', []);
underscore.factory('_', ['$window', function($window) {
  return $window._;
}]);

(function() {
    angular
        .module('storeApp', ['storeAppControllers', 'underscore', 'ui.router', 'ngCookies'])
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
          state('store.register', {
            url: '/register',
            templateUrl: 'partials/register.html',
            controller: 'RegisterCtrl'
          }).
          state('store.login', {
            url: '/login',
            templateUrl: 'partials/login.html'
            //controller: 'RegisterCtrl'
          });

          $locationProvider.html5Mode(true);
        }])

})();
