var app = angular.module('app', [
  'ngRoute',
  'ngSanitize',
  'ngCookies',
  'restangular',
  'LocalStorageModule',
  'mm.foundation',
  'angularFileUpload',

  'main',
  'accounts',
  'admin',
  'auth',
  'validation'
]);

