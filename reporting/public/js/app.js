var app = angular.module('reports', ['ngRoute', 'smart-table']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/bank.html',
            controller: 'BankController',
        })
        .when('/warehouse', {
            templateUrl: 'views/warehouse.html',
            controller: 'WarehouseController'
        })
        .when('/shop', {
            templateUrl: 'views/shop.html',
            controller: 'ShopController',
        })
        .otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode(true);
})

app.controller('BankController', ['$scope', "$http", function($scope, $http) {
    $scope.templates = [{
        name: 'report 1',
        url: 'views/reports/bank/report1.html'
    }, {
        name: 'report 2',
        url: 'views/reports/bank/report2.html'
    }];
    $scope.template = $scope.templates[0];

    $http.get('/bank/report1')
        .success(function(data) {
            $scope.bankReport1Data = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

}]);

app.controller('WarehouseController', ['$scope','$http', function($scope, $http) {
    $scope.templates = [{
        name: 'report 1',
        url: 'views/reports/warehouse/report1.html'
    }, {
        name: 'report 2',
        url: 'views/reports/warehouse/report2.html'
    }];
    $scope.template = $scope.templates[0];

    $http.get('/warehouse/report1')
        .success(function(data) {
            $scope.warehouseReport1Data = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

}]);

app.controller('ShopController', ['$scope','$http', function($scope,$http) {
    $scope.templates = [{
        name: 'report 1',
        url: 'views/reports/shop/report1.html'
    }, {
        name: 'report 2',
        url: 'views/reports/shop/report2.html'
    }];
    $scope.template = $scope.templates[0];
    // $scope.report1Collection = [{
    //     firstName: 'Laurent',
    //     lastName: 'Renard',
    //     birthDate: new Date('1987-05-21'),
    //     balance: 102,
    //     email: 'whatever@gmail.com'
    // }, {
    //     firstName: 'Blandine',
    //     lastName: 'Faivre',
    //     birthDate: new Date('1987-04-25'),
    //     balance: -2323.22,
    //     email: 'oufblandou@gmail.com'
    // }, {
    //     firstName: 'Francoise',
    //     lastName: 'Frere',
    //     birthDate: new Date('1955-08-27'),
    //     balance: 42343,
    //     email: 'raymondef@gmail.com'
    // }];
    $http.get('/shop/report1')
        .success(function(data) {
            $scope.shopReport1Data = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
}]);



/*
var app = angular.module('reports', ['ui.router']);

app.config(function($stateProvider,$urlRouterProvider,$locationProvider){
    $stateProvider
        .state('bank',{
            url:'/',
            templateUrl:'views/bank.html'
        })
        .state('warehouse',{
            url:'/warehouse',
            templateUrl: 'views/warehouse.html'
        })
        .state('shop',{
            url:'/shop',
            templateUrl: 'views/shop.html'
        });
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);
})
*/
