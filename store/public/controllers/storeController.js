var storeController = ['$scope', '$http', function($scope, $http){
  $scope.products = [];

	var getProducts = function(){
		$http.get('/products')
		.then(function(res){
			if (res.data.error)
				return console.log(res.data.error);


			$scope.products = res.data;
		}, function(err){
			console.log(err);
		});
	}

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

  this.visitStore = function(storeId) {
    console.log(storeId);
  }

}];

(function() {
    angular
        .module('storeApp', ['ngRoute'])
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
        .controller("storeController", storeController)
        .config(['$routeProvider',
        function($routeProvider) {
          $routeProvider.
          when('/', {
            templateUrl: 'partials/storesList.html',
            controller: 'storeController',
            controllerAs: 'storeCtrl'
          }).
          otherwise({
            redirectTo: '/'
          });
        }]);

})();
