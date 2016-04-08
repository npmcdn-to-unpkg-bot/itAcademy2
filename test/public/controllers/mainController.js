var mainController = ['$scope', '$http', function($scope, $http){

	$http.get('/accounts')
	.then(function(res){
		$scope.accountList = res.data;
	}, function(err){
		console.log(err);
	});
}];

(function() {
    angular
        .module("app", [])
        .controller("mainController", mainController);
})();
