'use strict';

angular.module('angularPassportApp')
  .factory('Store', function ($resource) {
    return $resource('/auth/stores/:id/', {},
      {
        'update': {
          method:'PUT'
        }
      });
  });
