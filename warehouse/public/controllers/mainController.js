var mainController = ['$scope', '$http', function($scope, $http){

	var getList = function(){
		$http.get('/accounts')
		.then(function(res){
			if (res.data.error)
				return console.log(res.data.error);

			$scope.accountList = res.data;
			$scope.account = {};
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

	$scope.removeAccount = function(id){
		$http.delete('/accounts/' + id)
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
