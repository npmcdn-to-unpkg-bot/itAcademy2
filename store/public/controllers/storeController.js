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

storeAppControllers.controller('StoreFrontCtrl', ['$scope', '$http','$routeParams', 'storeInfo', function($scope, $http, $routeParams, storeInfo){
  $scope.products = [];
  $scope.store = storeInfo.get();

	var visitStore = function(){

    $http.get('/store/' + $routeParams.id)
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


var underscore = angular.module('underscore', []);
underscore.factory('_', ['$window', function($window) {
  return $window._;
}]);

(function() {
    angular
        .module('storeApp', ['ngRoute', 'storeAppControllers', 'underscore'])
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
        .config(['$routeProvider',
        function($routeProvider) {
          $routeProvider.
          when('/', {
            templateUrl: 'partials/storesList.html',
            controller: 'StoreCtrl'
          }).
          when('/store/:id', {
            templateUrl: 'partials/storeFront.html',
            controller: 'StoreFrontCtrl'
          }).
          otherwise({
            redirectTo: '/'
          });
        }]);

})();
