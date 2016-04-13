var app = angular.module('reports', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/bank.html',
            controller: 'BankController',
        })
        .when('/warehouse', {
            templateUrl: 'views/warehouse.html' ,
                controller: 'WarehouseController'
        })
        .when('/shop', {
            templateUrl: 'views/shop.html' ,
                    controller: 'ShopController',
        })
        .otherwise({
            redirectTo: '/'
        });
    $locationProvider.html5Mode(true);
})

app.controller('BankController', ['$scope', function($scope) {
  $scope.templates =
    [ { name: 'report 1', url: 'views/reports/bank/report1.html'},
      { name: 'report 2', url: 'views/reports/bank/report2.html'} ];
  $scope.template = $scope.templates[0];
}]);

app.controller('WarehouseController', ['$scope', function($scope) {
  $scope.templates =
    [ { name: 'report 1', url: 'views/reports/warehouse/report1.html'},
      { name: 'report 2', url: 'views/reports/warehouse/report2.html'} ];
  $scope.template = $scope.templates[0];
}]);

app.controller('ShopController', ['$scope', function($scope) {
  $scope.templates =
    [ { name: 'report 1', url: 'views/reports/shop/report1.html'},
      { name: 'report 2', url: 'views/reports/shop/report2.html'} ];
  $scope.template = $scope.templates[0];
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
