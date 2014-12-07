angular.module('app')

.config(function($interpolateProvider) {
  $interpolateProvider.startSymbol('{@');
    $interpolateProvider.endSymbol('@}');
})

.config(['RestangularProvider', function (RestangularProvider) {
  RestangularProvider.setFullResponse(true);
  RestangularProvider.setBaseUrl('api');
  RestangularProvider.setRequestSuffix('/');
}])

.config(['$httpProvider', function($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');

  $httpProvider.defaults.xsrfCookieName = 'csrftoken';
  $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);

jQuery('.datetimepicker').datetimepicker({
  onGenerate:
  function( ct ) {
    jQuery(this).find('.xdsoft_date.xdsoft_weekend').addClass('xdsoft_disabled'); 
  },
  format:"Y-m-d\\TH:i",
  lang: 'ru',
  minTime:'10:00',
  maxTime:'21:00',
  timepickerScrollbar:'false',
  dayOfWeekStart: 1
});
