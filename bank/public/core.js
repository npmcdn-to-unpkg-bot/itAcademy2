var bankControllers = angular.module('bankControllers', []);

bankControllers.controller('mainController', ['$scope', '$http', '$state', 'loginInfo', function($scope, $http, $state, loginInfo) {
    $scope.formData = {};
    $scope.account = loginInfo.getAccount();
    $scope.operations = loginInfo.getOperations;
    console.log(loginInfo.getAccount());

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
        console.log('tip');
        $http.post('/api/operations', $scope.account)
            .then(function(res) {
                console.log('tip1');
               loginInfo.operations = res.body;
                $state.go('operations');
            }, function(err) {
                console.log('errrrrr');
                console.log(err);
            });
        console.log('finish');
    };

    $scope.createAccount = function() {
        console.log('tip');
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
        $scope.formData.source = $scope.account.login;
        $scope.formData.password = $scope.account.password;
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
        $http.post('/api/getMoney', $scope.account)
            .then(function (data) {
                console.log(data);
                $scope.accounts = data;
                console.log(data);
                $state.go('home');
            }, function(err){
                console.log(err);
            });
    }

    $scope.loginUser = function (formData) {
           $http.post('api/login', formData)
                .then(function(res){
                    loginInfo.setAccount(res.data);
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
            .factory('loginInfo', function() {
                var account,
                    operations;

                return{
                    setAccount: function(data) {
                        account = data;
                    },
                    getAccount: function() {
                        return account;
                    },
                    setOperations: function(data) {
                    operations = data;
                    },
                    getOperations: function() {
                        return operations;
                    }
                }
            })
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
                        }).
                        state('operations', {
                            url: '/operations',
                            templateUrl: 'partials/operations.html',
                            controller: 'mainController'
                        });

                    $locationProvider.html5Mode(true);
                }]);

    })();

