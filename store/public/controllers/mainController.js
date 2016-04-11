var storeController = ['$scope', '$http', function($scope, $http){

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

	getProducts();

}];

(function() {
    angular
        .module("store", [])
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
        .controller("storeController", storeController);
})();
