var mainController = ['$scope', '$http', function($scope, $http){

	var getList = function(){
		$http.get('/admGetWarehouses')
		.then(function(res){
			if (res.data.error)
				return console.log(res.data.error);

			$scope.warehouseList = res.data;
			$scope.warehouse = {};
		}, function(err){
			console.log(err);
		});
	}

	getList();


	$scope.addAccount = function(){
		$http.post('/accounts', $scope.account)
		.then(function(res){
			getList();
		}, function(err){
			console.log(err);
		});
	}

	$scope.removeWarehouse = function(id){
		$http.delete('/warehouse/' + id)
		.then(function(res){
			getList();
		}, function(err){
			console.log(err);
		});
	}
}];

(function() {
    angular
        .module("app", [])
        .controller("mainController", mainController);
})();
