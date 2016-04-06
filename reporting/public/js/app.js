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
});