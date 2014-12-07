"use stict"

angular.module('app')
  .factory('api', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setFullResponse(true);
      RestangularConfigurer.setBaseUrl('api');
    });
  })

  .factory('Papa', ['$window',
    function($window) {
      return $window.Papa;
    }
  ]);
