var bankControllers = angular.module('bankControllers', []);

bankControllers.controller('mainController', ['$scope', '$http', '$state', function($scope, $http, $state) {
    $scope.formData = {};


    $http.get('/home').success(function(data) {
        $scope.user = user;
    });

    $http.get('/api/accounts')
        .success(function(data) {
            $scope.accounts = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.checkBalance = function()
    {
        $http.get('/api/checkBalance', $scope.formData)
            .success(function(data)
            {
                $scope.balance = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            })
    };

    $scope.getOperations = function() {
        $http.get('/api/operations', $scope.formData);
    };

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
    }

        $scope.loginUser = function (formData) {
            $http.post('api/login_user', formData)
                .then(function(res){
                    var user = res.data;

                    $state.go('home');

                }, function(err){
                    console.log(err);
                });
        }

}]
);

//function mainController($scope, $http) {
//    $scope.formData = {};
//
//    $http.get('/api/accounts')
//        .success(function(data) {
//            $scope.accounts = data;
//            console.log(data);
//        })
//        .error(function(data) {
//            console.log('Error: ' + data);
//        });
//
//    $scope.checkBalance = function()
//    {
//        $http.get('/api/checkBalance', $scope.formData)
//            .success(function(data)
//            {
//                $scope.balance = data;
//            })
//            .error(function(data) {
//                console.log('Error: ' + data);
//            })
//    };
//
//    $scope.getOperations = function()
//    {
//        $http.get('/api/operations', $scope.formData);
//    };
//
//    $scope.createAccount = function() {
//        $http.post('/api/accounts', $scope.formData)
//            .success(function(data) {
//                $scope.formData = {};
//                $scope.accounts = data;
//                console.log(data);
//            })
//            .error(function(data) {
//                console.log('Error: ' + data);
//            });
//    };
//
//    $scope.deleteAccount = function(id) {
//        $http.delete('/api/accounts/' + id)
//            .success(function(data) {
//                $scope.accounts = data;
//                console.log(data);
//            })
//            .error(function(data) {
//                console.log('Error: ' + data);
//            });
//    };
//
//    $scope.transfer = function() {
//        $http.post('/api/transfer', $scope.formData)
//            .success(function(data) {
//                $scope.formData = {};
//                $scope.transfers = data;
//                console.log(data);
//            })
//            .error(function(data) {
//                console.log('Error: ' + data);
//            });
//    };
//
//    $scope.getMoney = function() {
//        $http.post('/api/getMoney', $scope.formData)
//            .success(function (data) {
//                $scope.formData = {};
//                $scope.accounts = data;
//                console.log(data);
//            })
//            .error(function(data) {
//                console.log('Error: ' + data);
//            });
//    };



    (function() {
        angular
            .module('Bank', ['bankControllers', 'ui.router', 'ngCookies'])
            .config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
                function($stateProvider, $urlRouterProvider, $locationProvider) {

                    $urlRouterProvider.otherwise("/");

                    $stateProvider.
                        state('home', {
                            url: '/home',
                            templateUrl: 'partials/home.html',
                            controller: 'mainController'
                        }).
                        state('signup', {
                            url: '/signup',
                            templateUrl: 'partials/signup.html',
                            controller: 'mainController'
                        }).
                        state('login', {
                            url: '/',
                            templateUrl: 'partials/login.html',
                            controller: 'mainController'
                        });

                    $locationProvider.html5Mode(true);
                }]);

    })();

