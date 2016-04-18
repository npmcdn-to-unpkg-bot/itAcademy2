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
    //items_collection
    var getListOfItems = function () {
        $http.get('/item')
            .then(function (res) {
                if (res.data.error)
                    return console.log(res.data.error);
                $scope.itemList = res.data;
                $scope.item = {};
            }, function (err) {
                console.log(err);
            });
    };

    getListOfItems();
    $scope.addItem = function () {
        $http.post('/item', $scope.item)
            .then(function (res) {
                getListOfItems();
            }, function (err) {
                console.log(err);
            });
    };
    $scope.removeItem = function (id) {
        $http.delete('/item/' + id)
            .then(function (res) {
                getListOfItems();
            }, function (err) {
                console.log(err);
            });
    };
    $scope.editItem = function (id, name, description, image, category) {
        var target = document.querySelector('#saveItemButton');
        target.dataset.id = id;
        $scope.item.name = name;
        $scope.item.description = description;
        $scope.item.image = image;
        $scope.item.category = category;
    };
    $scope.saveItem = function () {
        var target = document.querySelector('#saveItemButton');

        $http.put('/item/' + target.dataset.id, $scope.item)
            .then(function (res) {
                getListOfItems();
            }, function (err) {
                console.log(err);
            });
    };
    //edit itemSet in warehouses
    $scope.editItemSet = function (id) {
        var target = document.getElementById(id);
        target.hidden=false;
    };
    $scope.addItemToSet = function (id) {
        $http.put('/item/' + id, $scope.itemSet)
            .then(function (res) {
                //getListOfItems();
            }, function (err) {
                console.log(err);
            });
    };
    $scope.addItemCansel= function (id) {
        var target = document.getElementById(id);
        target.hidden=true;
    };

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
