"use stict"

angular.module('app')
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider

      .when('/', {
        templateUrl: 'src/main/templates/main.html'
      })

      // Administration side of site
      .when('/registration',  {
        templateUrl: 'src/admin/templates/registration.html',
        permission: 'staff'
      })

      .when('/notifications',  {
        templateUrl: 'src/admin/templates/admin_notifications.html',
        permission: 'staff'
      })

      .when('/order-container/:orderContainerId', {
        templateUrl: 'src/admin/templates/admin_order_container_detail.html',
        permission: 'staff'
      })

      .when('/order-container/:orderContainerId/schedule', {
        templateUrl: 'src/admin/templates/schedule.html',
        permission: 'staff'
      })

      .when('/order-container/:orderContainerId/schedule/:scheduleId',  {
        templateUrl: 'src/admin/templates/delivery.html',
        permission: 'staff'
      })

      .when('/order-container/:orderContainerId/orders/:orderId',  {
        templateUrl: 'src/admin/templates/admin_companies_order_detail.html',
        permission: 'staff'
      })

      .when('/customers',  {
        templateUrl: 'src/admin/templates/customers_list.html',
        permission: 'staff'
      })

      .when('/customer/:customerId', {
        templateUrl: 'src/admin/templates/customer_account.html',
        permission: 'staff'
      })

      .when('/companies',  {
        templateUrl: 'src/admin/templates/admin_companies_list.html',
        permission: 'staff'
      })

      .when('/companies/add', {
        templateUrl: 'src/admin/templates/admin_companies_add.html',
        permission: 'staff'
      })

      .when('/companies/:companyId', {
        templateUrl: 'src/admin/templates/admin_companies_detail.html',
        permission: 'staff'
      })

      .when('/fast-order', {
        templateUrl: 'src/admin/templates/fast_order.html',
        permission: 'staff'
      })

      // Users side of website
      .when('/express-tariff', {
        templateUrl: 'src/accounts/templates/account_express_tariff.html',
        permission: 'customer'
      })

      .when('/orders', {
        templateUrl: 'src/accounts/templates/account_orders_list.html',
        permission: 'customer'
      })

      .when('/orders/create', {
        templateUrl: 'src/accounts/templates/account_order_container.html',
        permission: 'customer'
      })

      .when('/orders/:orderId', {
        templateUrl: 'src/accounts/templates/account_order_edit.html',
        permission: 'customer'
      })

      .when('/profile', {
        templateUrl: 'src/accounts/templates/account_profile.html',
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

