var storeAppControllers = angular.module('storeAppControllers', ['underscore'])

storeAppControllers.factory('storeInfo', [function() {
  var storeData = {};

  function set(data) {
    storeData = data;
  }
  function get() {
    return storeData;
  }

  return {
    set: set,
    get: get
  }
}])

storeAppControllers.controller('StoreCtrl', ['$scope', '$http', 'storeInfo', function($scope, $http, storeInfo){

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
    storeInfo.set(_.find($scope.stores, function(store) {
      return store._id === id;
    }));
  }

  getStores();

}]);

storeAppControllers.controller('StoreFrontCtrl', ['$scope', '$http','$stateParams', 'storeInfo', function($scope, $http, $stateParams, storeInfo){
  $scope.products = [];
  $scope.store = storeInfo.get();

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

storeAppControllers.controller('LoginCtrl', ['$scope', '$http', function($scope, $http, storeInfo){
  console.log("LoginCtrl working!");
}]);

var underscore = angular.module('underscore', []);
underscore.factory('_', ['$window', function($window) {
  return $window._;
}]);

(function() {
    angular
        .module('storeApp', ['ngRoute', 'storeAppControllers', 'underscore', 'ui.router'])
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
        .config(['$stateProvider', '$urlRouterProvider',
        function($stateProvider, $urlRouterProvider) {

          $urlRouterProvider.otherwise("");

          $stateProvider.
          state('list', {
            url: '',
            templateUrl: 'partials/storesList.html',
            controller: 'StoreCtrl'
          }).
          state('store', {
            url: 'store/:id',
            templateUrl: 'partials/storeFront.html',
            controller: 'StoreFrontCtrl'
          }).
          state('store.login', {
            templateUrl: 'partials/login.html',
            controller: 'LoginCtrl'
          });
        }]);

})();
