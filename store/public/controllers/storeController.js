var storeAppControllers = angular.module('storeAppControllers', [])

storeAppControllers.controller('StoreCtrl', ['$scope', '$http', function($scope, $http){

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

  getStores();

}]);

storeAppControllers.controller('StoreFrontCtrl', ['$scope', '$http','$routeParams', function($scope, $http, $routeParams){
  $scope.products = [];

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

(function() {
    angular
        .module('storeApp', ['ngRoute', 'storeAppControllers'])
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
