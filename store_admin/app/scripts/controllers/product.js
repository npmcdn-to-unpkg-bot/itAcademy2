'use strict';

angular.module('angularPassportApp')
  .controller('ProductsCtrl', function ($scope, Products, $location, $routeParams, $rootScope) {

    $scope.create = function() {
      var product = new Products({
        title: this.title,
        content: this.content,
        price: this.price
      });
      product.$save(function(response) {
        $location.path("products/" + response._id);
      });

      this.title = "";
      this.content = "";
      this.price = 0;
    };

    $scope.remove = function(product) {
      product.$remove();

      for (var i in $scope.products) {
        if ($scope.products[i] == product) {
          $scope.products.splice(i, 1);
        }
      }
    };

    $scope.update = function() {
      var product = $scope.product;
      product.$update(function() {
        $location.path('products/' + product._id);
      });
    };

    $scope.find = function() {
      Ptoducts.query(function(products) {
        $scope.products = products;
      });
    };

    $scope.findOne = function() {
      Products.get({
        productId: $routeParams.productId
      }, function(product) {
        $scope.product = product;
      });
    };
  });
