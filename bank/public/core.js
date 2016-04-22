var Bank = angular.module('Bank', []); 

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

    $scope.transfer = function() {
        $http.post('/api/transfer', $scope.formData)
            .success(function(data) {
                $scope.formData = {};
                $scope.transfers = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    $scope.getMoney = function() {
        $http.post('/api/getMoney', $scope.formData)
            .success(function (data) {
                $scope.formData = {};
                $scope.accounts = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
}
