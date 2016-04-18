var Bank = angular.module('Bank', []); //Here is an error, I'm in search of solution

function mainController($scope, $http) {
    $scope.formData = {};

    $http.get('/api/accounts')
        .success(function(data) {
            $scope.accounts = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    $scope.createAccount = function() {
        $http.post('/api/accounts', $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.accounts = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.deleteAccount = function(id) {
        $http.delete('/api/accounts/' + id)
            .success(function(data) {
                $scope.accounts = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
}