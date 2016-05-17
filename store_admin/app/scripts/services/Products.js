'use strict';

angular.module('angularPassportApp')
  .factory('Productss', function ($resource) {
    return $resource('api/products/:productId', {
      productId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  });
