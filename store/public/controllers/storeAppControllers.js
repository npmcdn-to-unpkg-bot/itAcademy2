var storeAppControllers = angular.module('storeAppControllers', ['underscore'])

storeAppControllers.controller('StoreCtrl', ['$cookies', '$scope', '$http', 'dataTransfer', function($cookies, $scope, $http, dataTransfer){

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

storeAppControllers.controller('StoreFrontCtrl', ['$cookies','$scope', '$http','$stateParams', '$state', 'dataTransfer',  function($cookies, $scope, $http, $stateParams, $state, dataTransfer) {
  $scope.store = $cookies.getObject('store');
  $scope.user = $cookies.getObject('user');

  $scope.logout = function () {
    $http.get('/api/logout')
    .then(function() {
      $cookies.remove('user');
      delete $scope.user;
      $state.go('store', {id: $scope.store._id}, {reload: true});
    }, function(err) {
      console.log(err);
      $scope.alert = 'Logout failed'
    });

  };

  // Start of Filtering section
  $scope.filterByCategory = function (category) {
    var url = 'api/store/'+ $scope.store._id + '?category=' + category;

    $http.get(url)
		.then(function(res){
      dataTransfer.setProducts(res.data);

      dataTransfer.setFilter(category);
      $state.go('store', {id: $scope.store._id, category: category}, {reload: true});

		}, function(err){
      console.log(err);
		});
  };

  $scope.showAll = function() {
    dataTransfer.setProducts([]);
    dataTransfer.setFilter('');
    $state.go('store', {id: $scope.store._id}, {reload: true});
  };
  // End of filtering section

  // START of populate data for the main page
  var getProducts = function(){

    $http.get('api/store/' + $scope.store._id)
    .then(function(res){
      if (res.data.error)
        return console.log(res.data.error);

      $scope.products = res.data[0];
      $scope.categories = res.data[1];
      dataTransfer.setCategories(res.data[1]);
    }, function(err){
      console.log(err);
    });
  }

  var getCategories = function(){

    $http.get('api/store/' + $scope.store._id)
    .then(function(res){
      if (res.data.error)
        return console.log(res.data.error);

      $scope.categories = res.data[1];
      dataTransfer.setCategories(res.data[1]);
    }, function(err){
      console.log(err);
    });
  }
  // END of populates data for the main page

  $scope.saveItem = function(item) {
    $cookies.putObject('item', item);
    dataTransfer.setItem(item);
  };

  $scope.addToCart = function(item) {
    $scope.user.cart.push(item);
    $cookies.putObject('user', $scope.user);
  }

  dataTransfer.getFilter() ? $scope.filter = dataTransfer.getFilter() : '';
  dataTransfer.getCategories().length > 0 ? $scope.categories = dataTransfer.getCategories() : getCategories();
  dataTransfer.getProducts().length > 0 ? $scope.products = dataTransfer.getProducts() : getProducts();
}]);

storeAppControllers.controller('RegisterCtrl', ['$scope', '$http', '$cookies', '$state', function($scope, $http, $cookies, $state){
  $scope.store = $cookies.getObject('store');
  $scope.formData = {"storeId": $scope.store._id};

  $scope.addUser = function (formData) {
    $http.post('api/add_user', formData)
		.then(function(res){
      var user = res.data;
      $cookies.putObject('user', user);
      $state.go('store', {id: $scope.store._id}, {reload: true});

		}, function(err){
      if (err.data.error.indexOf('E11000') !== -1) {
        $scope.error = "User with same email is already registered. Please ";
      } else {
        $scope.error = "Error occured, please try again later";
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
      console.log(err);
		});
  }
}]);

storeAppControllers.controller('ItemCtrl', ['$scope', '$http', '$cookies', '$state', 'dataTransfer', function($scope, $http, $cookies, $state, dataTransfer){
  $scope.store = $cookies.getObject('store');
  $scope.item =  dataTransfer.getItem() || $cookies.getObject('item');

  var getCategories = function(){

    $http.get('api/store/' + $scope.store._id)
    .then(function(res){
      if (res.data.error)
        return console.log(res.data.error);

      $scope.categories = res.data[1];
      dataTransfer.setCategories(res.data[1]);
    }, function(err){
      console.log(err);
    });
  }

  dataTransfer.getCategories().length > 0 ? $scope.categories = dataTransfer.getCategories() : getCategories();
}]);

storeAppControllers.controller('CartCtrl', ['$scope', '$http', '$cookies', '$state', 'dataTransfer', function($scope, $http, $cookies, $state, dataTransfer){
  $scope.store = $cookies.getObject('store');
  $scope.user = $cookies.getObject('user');

  $scope.removeItem = function(index) {
    $scope.user.cart.splice(index, 1);
    $cookies.putObject('user', $scope.user);
  }

  $scope.totalPrice = _.reduce($scope.user.cart, function (memo, item) {
      return memo + item.price;
    }, 0)

  $scope.purchaseItems = function () {
    var transactionDetails = {
      source: $scope.user.email,
      password: $scope.user.password,
      destination: $scope.store.email,
      amount: $scope.totalPrice
    };

    $http.post('http://localhost:3001/api/transfer', transactionDetails)
    .then(function(res){
      if (res.data.success) {
        transactionDetails.token = res.data.token;
        transactionDetails.items = $scope.user.cart;

        /* $http.post('/api/purchaseItems', transactionDetails)
        .then(function(res){


        }, function(err){
          console.log(err);
        });
        */


        $scope.user.cart = [];
        $cookies.putObject('user', $scope.user);
        $state.go('store', {id: $scope.store._id}, {reload: true});
      } else {
        console.log(err);
      }

    }, function(err){
      console.log(err);
    });
  }

}]);

storeAppControllers.controller('ProfileCtrl', ['$scope', '$http', '$cookies', '$state', 'dataTransfer', function($scope, $http, $cookies, $state, dataTransfer){
  $scope.store = $cookies.getObject('store');
  $scope.user = $cookies.getObject('user');

  var bankUser = {
    login: $scope.user.email,
    password: $scope.user.password
  }

  var checkBalance = function () {
    $http.post('http://localhost:3001/api/checkBalance', bankUser)
    .then(function(res) {
      var user = $cookies.getObject('user');
      $scope.user.amount = res.data.amount;

      $cookies.putObject('user', user);

    }, function(err){
      console.log(err);
    });
  };
  checkBalance();


  $scope.getMoney = function (){
    $http.post('http://localhost:3001/api/getMoney', bankUser)
    .then(function(res){
      checkBalance();

    }, function(err){
      console.log(err);
    });
  };

}]);

var underscore = angular.module('underscore', []);
underscore.factory('_', ['$window', function($window) {
  return $window._;
}]);

module.exports = storeAppControllers;
