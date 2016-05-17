'use strict';

describe('Service: Auth', function () {

  // load the service's module
  beforeEach(module('angularPassportApp'));

  // instantiate service
  var Auth,
    store,
    $rootScope,
    $httpBackend;

  var sessionURL = '/auth/session',
    storeURL = '/auth/stores';

  beforeEach(inject(function (_Auth_, _$rootScope_, _$httpBackend_) {
    Auth = _Auth_;
    $rootScope = _$rootScope_;
    $httpBackend = _$httpBackend_;

    // mock store
    store = {'email': 'test@gmail.com', 'password':'pass', storename:'bob' }
  }));

  it('should login and set global store', function () {
    $httpBackend.expectPOST(sessionURL)
      .respond(store);

    expect($rootScope.currentUser).toBe(null);

    Auth.login('password', store);
    $httpBackend.flush();

    expect($rootScope.currentUser.storename).toBe(store.storename);
  });

  it('should logout and remove global store', function () {
    $httpBackend.expectDELETE(sessionURL)
      .respond({});

    $rootScope.currentUser = store;
    expect($rootScope.currentUser.storename).toBe(store.storename);

    Auth.logout();
    $httpBackend.flush();

    expect($rootScope.currentUser).toBe(null);
  });

  it('should create a new store and set global store', function () {
    $httpBackend.expectPOST(storeURL)
      .respond(store);
    expect($rootScope.currentUser).toBe(null);

    Auth.createUser(store);
    $httpBackend.flush();

    expect($rootScope.currentUser.storename).toBe(store.storename);
  });

});