var storeAppControllers = angular.module('storeAppControllers', ['underscore'])

storeAppControllers.controller('StoreCtrl', ['$cookies', '$scope', '$http', function($cookies, $scope, $http){

  var getStores = function() {
    $http.get('api/stores')
		.then(function(res){

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

storeAppControllers.controller('StoreFrontCtrl', ['$cookies','$scope', '$http','$stateParams', '$state',  function($cookies, $scope, $http, $stateParams) {
  $scope.products = [];
  $scope.store = $cookies.getObject('store');
  $scope.user = $cookies.getObject('user');

  console.log($scope.user);

	var visitStore = function(){

    $http.get('api/store/' + $stateParams.id)
		.then(function(res){
			if (res.data.error)
				return console.log(res.data.error);

			$scope.products = res.data;
		}, function(err){
			console.log(err);
		});
	}

  visitStore();

  $scope.logout = function () {
    $cookies.remove('user');
    delete $scope.user;

    $state.go('store', {id: $scope.store._id});
  }

}]);

storeAppControllers.controller('RegisterCtrl', ['$scope', '$http', '$cookies', '$state', function($scope, $http, $cookies, $state){
  $scope.store = $cookies.getObject('store');
  $scope.formData = {"storeId": $scope.store._id};

  $scope.addUser = function (formData) {
    $http.post('api/add_user', formData)
		.then(function(res){
      var user = res.data;
      $cookies.putObject('user', user);
      $state.go('store', {id: $scope.store._id});

		}, function(err){
      if (err.data.error.indexOf('E11000') !== -1) {
        $scope.error = "User with same email is already registered. Please "
      }

		});
  }
}]);

storeAppControllers.controller('LoginCtrl', ['$scope', '$http', '$cookies', '$state', function($scope, $http, $cookies, $state){
  $scope.store = $cookies.getObject('store');
  $scope.formData = {"storeId": $scope.store._id};

  $scope.loginUser = function (formData) {
    $http.post('api/login_user', formData)
		.then(function(res){
      var user = res.data;
      $cookies.putObject('user', user);
      $state.go('store', {id: $scope.store._id}, {reload: true});

		}, function(err){
      if (err.data.error.indexOf('E11000') !== -1) {
        $scope.error = "User with same email is already registered. Please "
      }

		});
  }
}]);


var underscore = angular.module('underscore', []);
underscore.factory('_', ['$window', function($window) {
  return $window._;
}]);

module.exports = storeAppControllers;
