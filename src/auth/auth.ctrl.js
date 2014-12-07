'use strict'

angular.module('auth')
  .controller('AuthenticationCtr', function($scope, User) {
    $scope.logout = function() {
      User.resetUser();
    };
  });