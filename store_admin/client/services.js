angular.module('myApp').factory('AuthService',
  ['$q', '$timeout', '$http',
  function ($q, $timeout, $http) {

    // create store variable
    var store = null;

    // return available functions for use in the controllers
    return ({
      isLoggedIn: isLoggedIn,
      getStoreStatus: getStoreStatus,
      login: login,
      logout: logout,
      register: register
    });

    function isLoggedIn() {
      if(store) {
        return true;
      } else {
        return false;
      }
    }

    function getStoreStatus() {
      $http.get('/store/status')
      // handle success
      .success(function (data) {
        if(data.status){
          store = true;
        } else {
         store = false;
        }
      })
      // handle error
      .error(function (data) {
        store = false;
      });
    }

    function login(storename, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/store/login',
        {storename: storename, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            store = true;
            deferred.resolve();
          } else {
            store = false;
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          store = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function logout() {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a get request to the server
      $http.get('/store/logout')
        // handle success
        .success(function (data) {
          store = false;
          deferred.resolve();
        })
        // handle error
        .error(function (data) {
          store = false;
          deferred.reject();
        });

      // return promise object
      return deferred.promise;

    }

    function register(storename, password) {

      // create a new instance of deferred
      var deferred = $q.defer();

      // send a post request to the server
      $http.post('/store/register',
        {storename: storename, password: password})
        // handle success
        .success(function (data, status) {
          if(status === 200 && data.status){
            deferred.resolve();
          } else {
            deferred.reject();
          }
        })
        // handle error
        .error(function (data) {
          deferred.reject();
        });

      // return promise object
      return deferred.promise;
    }
}]);