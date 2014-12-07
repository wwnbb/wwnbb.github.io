'use strict';

angular.module('auth')

  .factory('authInterceptor', function(localStorageService) {
    // Проверяем локальное хранилище на наличие тока при каждом запросе.
    return {
      request: function(config) {
        var token = localStorageService.get('token');
        config.headers = config.headers || {};
        if (token) {
          config.headers.Authorization = token;
        }
        return config;
      }
    };
  })

  .factory('permissions', function ($rootScope) {
    return {
      setPermissions: function(permissions) {
        $rootScope.permissionList = permissions;
        $rootScope.$broadcast('permissionsChanged');
      },
      hasPermission: function (permission) {
        permission = permission.trim();
        return _.some($rootScope.permissionList, function(item) {
          if(_.isString(item)){
            return item.trim() === permission;
          }
        });
      },
      get: function() {
        return permissionList;
      }
    };
  })

  .factory('User', function($rootScope, permissions, $window, api, localStorageService) {
    var userProfile;

    var service = {
      updateUser: function() {
        api.all('profile/').customGET().then(function(response) {
          userProfile = response.data;
          permissions.setPermissions(userProfile.permissions_names);
          $rootScope.$broadcast('event:user-profileUpdated');
        });
      },

      resetUser: function() {
        userProfile = null;
        localStorageService.remove('token');
        $window.location.reload();
      },

      get: function() {
        return userProfile;
      },

      getAsync: function() {
        return api.all('profile/').customGET().then(function(response) {
          userProfile = response.data;
          permissions.setPermissions(userProfile.permissions_names);
          $rootScope.$broadcast('event:user-profileUpdated');
        });
      }
    };
    return service;
    $rootScope.$on('event:auth-loginconfirmed', service.updateUser());
  });
