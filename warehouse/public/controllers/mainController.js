var mainController = ['$scope', '$http', '$location', function ($scope, $http, $location) {

    var getList = function () {
        $http.get('/warehouse')
            .then(function (res) {
                if (res.data.error)
                    return console.log(res.data.error);

                $scope.warehouseList = res.data;
                $scope.warehouse = {};
            }, function (err) {
                console.log(err);
            });
    };

    getList();

    $scope.addWarehouse = function () {
        $http.post('/warehouse', $scope.warehouse)
            .then(function (res) {
                getList();
            }, function (err) {
                console.log(err);
            });
    };

    $scope.removeWarehouse = function (id) {
        $http.delete('/warehouse/' + id)
            .then(function (res) {
                getList();
            }, function (err) {
                console.log(err);
            });
    };
    $scope.removeWarehouses = function () {
        $http.delete('/warehouse')
            .then(function (res) {
                getList();
            }, function (err) {
                console.log(err);
            });
    };
    //login
    $scope.keypressAuth = function ($event) {
        if (!$scope.arr)$scope.arr = [];
        $scope.arr.unshift($event.keyCode);
        $scope.arr.length = 10;
        if ($scope.arr.join('') == '71826966786983736972') {
            $location.path('/warehouse', false);
        }

    };
    //items
}];

(function () {
    angular
        .module("app", ["ui.router"])
        .controller("mainController", mainController)
        .config(function ($urlRouterProvider, $stateProvider) {

            $stateProvider
                .state('index', {
                    url: "",
                    templateUrl: "../main.html",
                    activetab: 'index'
                })
                .state('warehouses', {
                    url: "warehouses",
                    templateUrl: "../warehouses.html",
                    activetab: 'warehouses'
                })
                .state('items', {
                    url: "items",
                    templateUrl: "../items.html",
                    activetab: 'items'
                });
            //$urlRouterProvider.otherwise('index');
        });

})();
