"use stict"

angular.module('app')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider

      .when('/', {
        templateUrl: 'static/src/main/templates/main.html'
      })

      // Administration side of site
      .when('/registration',  {
        templateUrl: 'static/src/admin/templates/registration.html',
        permission: 'staff'
      })

      .when('/notifications',  {
        templateUrl: 'static/src/admin/templates/admin_notifications.html',
        permission: 'staff'
      })

      .when('/order-container/:orderContainerId', {
        templateUrl: 'static/src/admin/templates/admin_order_container_detail.html',
        permission: 'staff'
      })

      .when('/order-container/:orderContainerId/schedule', {
        templateUrl: 'static/src/admin/templates/schedule.html',
        permission: 'staff'
      })

      .when('/order-container/:orderContainerId/schedule/:scheduleId',  {
        templateUrl: 'static/src/admin/templates/delivery.html',
        permission: 'staff'
      })

      .when('/order-container/:orderContainerId/orders/:orderId',  {
        templateUrl: 'static/src/admin/templates/admin_companies_order_detail.html',
        permission: 'staff'
      })

      .when('/customers',  {
        templateUrl: 'static/src/admin/templates/customers_list.html',
        permission: 'staff'
      })

      .when('/customer/:customerId', {
        templateUrl: 'static/src/admin/templates/customer_account.html',
        permission: 'staff'
      })

      .when('/companies',  {
        templateUrl: 'static/src/admin/templates/admin_companies_list.html',
        permission: 'staff'
      })

      .when('/companies/add', {
        templateUrl: 'static/src/admin/templates/admin_companies_add.html',
        permission: 'staff'
      })

      .when('/companies/:companyId', {
        templateUrl: 'static/src/admin/templates/admin_companies_detail.html',
        permission: 'staff'
      })

      .when('/fast-order', {
        templateUrl: 'static/src/admin/templates/fast_order.html',
        permission: 'staff'
      })

      // Users side of website
      .when('/express-tariff', {
        templateUrl: 'static/src/accounts/templates/account_express_tariff.html',
        permission: 'customer'
      })

      .when('/orders', {
        templateUrl: 'static/src/accounts/templates/account_orders_list.html',
        permission: 'customer'
      })

      .when('/orders/create', {
        templateUrl: 'static/src/accounts/templates/account_order_container.html',
        permission: 'customer'
      })

      .when('/orders/:orderId', {
        templateUrl: 'static/src/accounts/templates/account_order_edit.html',
        permission: 'customer'
      })

      .when('/profile', {
        templateUrl: 'static/src/accounts/templates/account_profile.html',
        permission: 'customer'
      })

      .otherwise({redirectTo: '/'});
  }])

  .controller('AppCtr', function ($scope, $location, permissions, api, User) {
    $scope.$on('$routeChangeStart', function (scope, next) {
      api.all('profile').customGET().then(function(response) {
        permissions.setPermissions(response.data.permissions_names)
        var permission = next.$$route.permission;
        if(_.isString(permission) && !permissions.hasPermission(permission)) {
          $location.path('#');
        }
        if (permissions.hasPermission('staff')) {
          User.getAsync().then(function(){
            api.all('notifications').customGET('', {ordering: '-time', checked: 'False', manager: User.get().id}).then(function(response) {
              $scope.notify = response.data.length;
            })
          })
        }
      })
    });
  })

