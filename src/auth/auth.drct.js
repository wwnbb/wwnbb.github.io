'use strict';


angular.module('auth')

  .directive('authApplication', function($http, localStorageService, User) {
    return {
      restrict: 'A',
      scope: false,
      link: function (scope, elem, attrs) {

        var main = document.getElementById("main");
        var login = document.getElementById("login-holder");

        var applyLogin = function(good) {
          if (good) {
            main.style.display = "block";
            login.style.display = "none";
          } else {
            main.style.display = "none";
            login.style.display = "block";
          }
        };

        if (localStorageService.get('token')) {
          applyLogin(true);
        }

        scope.$on('event:auth-loginRequired', function () {
          applyLogin(false);
        });

        scope.$on('event:auth-loginConfirmed', function () {
          applyLogin(true);
        });
      }
    };
  })


  .directive('hasPermission', function(permissions) {
    return {
      scope: false,
      link: function(scope, element, attrs) {
        if(!_.isString(attrs.hasPermission)){
          throw "hasPermission value must be a string";
        }

        var value = attrs.hasPermission.trim();
        var notPermissionFlag = value[0] === '!';
        if(notPermissionFlag) {
          value = value.slice(1).trim();
        }

        function toggleVisibilityBasedOnPermission() {
          var hasPermission = permissions.hasPermission(value);

          if(hasPermission && !notPermissionFlag || !hasPermission && notPermissionFlag) {
            element.show();
          }
          else {
            element.hide();
          }
        }
        toggleVisibilityBasedOnPermission();
        scope.$on('permissionsChanged', toggleVisibilityBasedOnPermission);
      }
    };
  })


  .directive('login', function($http, api, localStorageService, authService) {
    return {
      restrict: 'E',
      scope: false,
      transclude: false,
      templateUrl: 'static/src/auth/templates/login.html',
      link: function(scope, elem, attrs) {

        elem.bind('submit', function() {
          localStorageService.remove('token');

          var userData = {
            "username": scope.username,
            "password": scope.password
          };

          api.all('api-token-auth/').customPOST(userData).then(function(response){
            localStorageService.set('token', 'Token ' + response.data.token);
            authService.loginConfirmed();
          }, function (res) {
            scope.status = res;
            alert('Неправильный логи или пароль');
            scope.error = 'Неправильный логин или пароль';
          });
        });
      }
    };
  });
