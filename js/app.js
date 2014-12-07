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


angular.module('accounts', [ 'restangular', ]);
var app = angular.module('admin', [
  'ngCookies',
  'restangular',
  'LocalStorageModule',
  'auth'
]);
var app = angular.module('auth', [
  'ngCookies',
  'restangular',
  'LocalStorageModule',
  'http-auth-interceptor'
]);
var app = angular.module('main', [
  'ngCookies',
  'restangular',
  'LocalStorageModule',
  'angularFileUpload'
]);
var app = angular.module('validation', [
  'restangular',
  'LocalStorageModule',
]);
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

'use strict'

angular.module('accounts')


  .controller('OrdersCtr', function($scope, api, User) {
    User.getAsync().then(function() {
      api.all('order_container').customGET('', {company: User.get().company}).then(function(response) {
        $scope.data = response.data;
      });
    });
  })


  .controller('CreateOrdersCtr', function($scope, api, $routeParams) {
    $scope.sendform = function() {
      api.one('order_container', $routeParams.orderId).all('orders').customPOST($scope.form).then(function() {
        alert('Заказ добавлен');
      }, function() {
        alert('error');
      });
    };
  })


  .controller('PriceListCtr', function($scope, api) {
    api.all('express-tariff/').customGET().then(function(response){
      $scope.data = response.data;
    });
  })


  .controller('ProfileCtr', function($scope, api) {
    api.all('profile/').customGET().then(function(response){
      $scope.data = response.data;
      api.all('companies').customGET($scope.data.company).then(function(response) {$scope.company=response.data})
    });
  })


  .controller('FileUploadCtr', function($scope, api, FileUploader, localStorageService, $routeParams) {
    $scope.postIt = function() {
      var formData = new FormData()
      formData.append('file', $scope.file)
      formData.append('name', $scope.file.name)
    }
    $scope.uploader = new FileUploader(
      {
        url:'/api/order_container/'+ $routeParams.orderId +'/fileupload/',
        formData: [{data: 'somedata'},$scope.form],
        removeAfterUpload: true,
        headers: {Authorization: localStorageService.get('token')},
        method: 'POST'
      });
  })


  .controller('AccountOrderContainerCtr', function($scope, api, $location) {
    $scope.addOrderContainer = function() {
      api.all('order_container').customPOST($scope.form).then(function(response){

        $location.path('/orders/' + response.data.id)
      }, function() {alert('error');});
    }
  })


  .controller('AccountOrderEditCtr', function($scope, api, $routeParams) {
    api.all('order_container').customGET($routeParams.orderId).then(function(response) {
      $scope.data = response.data;
    })
  })


  .controller('ModalDemoCtr', function ($scope, $modal, $log) {

    $scope.items = ['item1', 'item2', 'item3'];

    $scope.open = function () {
      var modalInstance = $modal.open({
        templateUrl: 'static/src/accounts/templates/account_order_modal.html',
        controller: 'ModalInstanceCtr',
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  })


  .controller('ModalInstanceCtr', function ($scope, $modalInstance, items) {

    $scope.items = items;
    $scope.selected = {
      item: $scope.items[0]
    };

    $scope.ok = function () {
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  })
'use strict'

angular.module('admin')


  .controller('DeliveryCtr', function($scope, api, $routeParams){
    api.all('express-tariff').customGET('').then(function(response){
      $scope.tarifs = response.data;
    })
    $scope.form = {};
    var get = function() {
      api.one('order_container', $routeParams.orderContainerId).one('schedule', $routeParams.scheduleId).customGET('delivery')
        .then(function(response) {
          $scope.data = response.data;
        });
    };
    get();
    $scope.add = function() {
      api.one('order_container', $routeParams.orderContainerId).one('schedule', $routeParams.scheduleId)
        .all('delivery').customPOST($scope.form).then(function() {
        alert('success');
        get();
      });
    };
  })


  .controller('CustomersCtr', function($scope, api, $location) {
    var get = function(search_params, permissions_list) {
      api.all('users').customGET('', {
        permissions__permission: permissions_list,
        ordering: 'id', search: search_params})
        .then(function(response){
          $scope.data = response.data;
        });
    }
    $scope.delete = function(id) {
      api.all('users').customDELETE(id).then(function(){get($scope.search)})
    }
    get();
    $scope.get = function(){get($scope.search)};
    $scope.showClient = function() {
      $location.path('#/customers');
    };
  })


  .controller('ScheduleCtr', function($scope, api, $routeParams) {
    $scope.form = {};
    var getShedule = function(){
      api.one('order_container', $routeParams.orderContainerId).all('schedule').customGET('', {ordering: 'date'})
        .then(function(response){
          $scope.shedule = response.data;
        });
    };
    getShedule();
    $scope.add = function() {
      api.one('order_container', $routeParams.orderContainerId).all('schedule').customPOST($scope.form).then(function() {
        alert('success');
        getShedule();
      }, function(){
        alert('error');
      });
    };
    $scope.delete = function(id) {
      api.one('order_container', $routeParams.orderContainerId).all('schedule').customDELETE(id).then(function() {
        getShedule();
      })
    }
  })


  .controller('RegistrationCtr', function($scope, api){
    $scope.form = {};

    var addCustomer = function() {
        $scope.form.user.permissions = [2,]
        api.all('singup').customPOST($scope.form.user).then(function(){
          alert('success');
        }, function(){
          alert('error');
        });
    };
    $scope.signup = function() {
      addCustomer();
    };

  })


  .controller('CustomerAccountCtr', function($scope, api, $routeParams){
    $scope.edit = false;
    $scope.startEdit = function() {
      $scope.edit = true;
    };
    var getUser = function() {
      api.all('users').customGET($routeParams.customerId).then(function(response){
        $scope.data = response.data;
      });
    }
    getUser();
    api.all('permissions').customGET().then(function(response){
      $scope.permissions = response.data;
    });
    api.all('companies').customGET().then(function(response) {
      $scope.companies = response.data;
    })
    $scope.putUser = function() {
      form = {
        "company": $scope.data.company,
        "date_joined": $scope.data.date_joined,
        "email": $scope.data.email,
        "first_name": $scope.data.first_name,
        "last_name": $scope.data.last_name,
        "permissions": [$scope.data.permissions,],
        "id": $scope.data.id
      }
      api.all('users').customPUT(form, $routeParams.customerId).then(function(){
        $scope.edit = false;
        getUser();
      });
    };
  })


  .controller('OrdersListCtr', function($scope, api, $routeParams) {
    api.all('orders-list').customGET('', {owner__id: $routeParams.customerId})
      .then(function(response) {
        $scope.data = response.data;
      })
  })


  .controller('FastOrderCtr', function($scope, api) {
    $scope.formState = {
      AddedUser: {},
      registrationIsDone: false,
    };
    $scope.addUser = function(){
      $scope.user.permssions = [1];
      api.all('singup').customPOST($scope.user)
        .then(function(response){
          $scope.formState.registrationIsDone = true;
          $scope.formState.AddedUser = response.data
          alert('success');
          console.log($scope.formState, response);
        }, function(){
          alert('error');
        });
    }
    $scope.sendform = function() {
      api.all('orders/').customPOST($scope.form).then(function() {
        alert('Заказ добавлен');
      }, function() {
        alert('error');
      });
    };
  })


  .controller('CompaniesListCtr', function($scope, api, User) {
    User.updateUser();
    var getCompany = function(params) {
      api.all('companies').customGET('', {search: params}).then(function(response){
        $scope.data = response.data;
      });
    };
    getCompany();
    $scope.deleteCompany = function(id) {
      api.all('companies').customDELETE(id).then(function(){getCompany();})
    }
    $scope.get = function(item) {getCompany(item)};
  })


  .controller('CompaniesDetailCtr', function($scope, api, $routeParams) {
    api.all('companies').customGET($routeParams.companyId).then(function(response){
      $scope.data = response.data
    });
    api.all('order_container').customGET('', {
      company:$routeParams.companyId}).then(function(response) {
        $scope.order_containers = response.data;
      });
    api.all('users').customGET('', {company: $routeParams.companyId}).then(function(response){
      $scope.users = response.data
    })

  })


  .controller('CompaniesAddCtr', function($scope, api) {
    $scope.addCompany = function() {
      api.all('companies').customPOST($scope.form).then(function(){
        alert('success');
      }, function() {
        alert('error');
      });
    }
  })

  .controller('OrderContainerCtr', function($scope, api, $routeParams) {
    $scope.data = {}
    var orderContainer = api.one('order_container', $routeParams.orderContainerId);
    orderContainer.customGET('').then(function(response) {
      $scope.data.orderContainers = response.data;
    });
    orderContainer.all('fileupload').customGET('').then(function(response) {
      $scope.data.files = response.data;
    });
    orderContainer.all('orders').customGET('').then(function(response) {
      $scope.data.orders = response.data;
    });
    orderContainer.all('schedule').customGET('').then(function(response) {
      $scope.data.schedule = response.data;
    });
    orderContainer.all('status').customGET('').then(function(response) {
      $scope.data.status = response.data
    })
  })


  .controller('NotificationsCtr', function($scope, api, User) {
    var get = function() {
      api.all('notifications').customGET('', {ordering: '-time', checked: 'False', manager: User.get().id}).then(function(response){
        $scope.data = response.data;
      });
      $scope.hello = ('hello there');
    };
    User.getAsync().then(function(){
      get();
    });
    $scope.delete = function(id) {
      api.all('notifications').customDELETE(id).then(function(){
      get();})
    }
  })


  .controller('OrderDetailCtr', function($scope, api, $routeParams) {
    api.one('order_container', $routeParams.orderContainerId).one('orders', $routeParams.orderId).customGET('').then(function(response) {
        $scope.order = response.data
      })
  })

'use strict'

angular.module('admin')


  .filter('bool2icon', function () {
    // function that's invoked each time Angular runs $digest()
    // pass in `item` which is the single Object we'll manipulate
    return function (item) {
      if (item == true) {
        item = '<i class="fi-plus size-18 green"></i>'
      }
      else {
        item = '<i class="fi-minus size-18 red"></i>'
      }
      // return the current `item`, but call `toUpperCase()` on it
      return item;
    };
  })
  .filter('int2status', function() {
  return function (item) {
    if (item == '1') {
      item = 'Несогласован';
    } else if (item === '2') {
      item = 'Согласован';
    } else if (item === '3') {
      item = 'Ожидает Поставки';
    } else if (item === '4') {
      item = 'Обработка';
    } else if (item === '5') {
      item = 'Доставка';
    } else if (item === '6') {
      item = 'Доставлено';
    }
    return item
  };
});

'use strict'

angular.module('auth')
  .controller('AuthenticationCtr', function($scope, User) {
    $scope.logout = function() {
      User.resetUser();
    };
  });
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

'use strict'

angular.module('main')

  .controller('demo', function($scope, FileUploader, localStorageService) {
    $scope.uploader = new FileUploader({url:'api/fileupload/', headers: {Authorization: localStorageService.get('token')}, method: 'POST' });
  })

  .controller('ModalDemoCtr', function ($scope, $modal, $log) {

    $scope.items = ['item1', 'item2', 'item3'];

    $scope.open = function () {
      var modalInstance = $modal.open({
        templateUrl: 'myModalContent.html',
        controller: 'ModalInstanceCtr',
        resolve: {
          items: function () {
            return $scope.items;
          }
        }
      });

      modalInstance.result.then(function (selectedItem) {
        $scope.selected = selectedItem;
      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    };
  })
  .controller('DemoController', function($scope) {
    $scope.rating = 42;
    $scope.minRating = 40;
    $scope.maxRating = 50;
})

  .controller('ModalInstanceCtr', function ($scope, $modalInstance, items) {

    $scope.items = items;
    $scope.selected = {
      item: $scope.items[0]
    };

    $scope.ok = function () {
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  })

  .controller('test', function($scope, api) {
    api.all('users').options().then(function(response){
      console.log(response)
    })
  })

  .controller('hello', function($scope, api, $routeParams){
    api.all('express-tariff').customGET('').then(function(response){
      $scope.tarifs = response.data;
    })
    $scope.form = {};
    var get = function() {
      api.one('order_container', $routeParams.orderContainerId).one('schedule', $routeParams.scheduleId).customGET('delivery')
        .then(function(response) {
          $scope.data = response.data;
        });
    };
    get();
    $scope.add = function() {
      api.one('order_container', $routeParams.orderContainerId).one('schedule', $routeParams.scheduleId)
        .all('delivery').customPOST($scope.form).then(function() {
          alert('success');
          get();
        });
    };
  })

'use strict';


angular.module('validation')
  .directive('getForm', function(api) {
    return {
      restrict: 'E',
      template: '<p ng-repeat="item in data">{@item.type@}{@item.label@}</p>',
      link: function(scope) {
        api.all('order_container').options().then(function(response) {
          console.log(response)
          scope.data = response.data.actions.POST;
        })
      }
    };
  })

  .directive('rnStepper', function() {
    return {
      scope: {},
      require: 'ngModel',
      link: function(scope, iElement, iAttrs, ngModelController) {
        ngModelController.$render = function() {
          iElement.find('div').text(ngModelController.$viewValue);
        };
        function updateModel(offset) {
          ngModelController.$setViewValue(ngModelController.$viewValue + offset);
          ngModelController.$render();
        }
        scope.decrement = function() {
          updateModel(-1);
        };
        scope.increment = function() {
          updateModel(+1);
        };
      }
    };
  });

//l = {
//    "name": "Order Container List",
//    "description": "",
//    "renders": [
//        "application/json",
//        "text/html"
//    ],
//    "parses": [
//        "application/json",
//        "application/x-www-form-urlencoded",
//        "multipart/form-data"
//    ],
//    "actions": {
//        "POST": {
//            "id": {
//                "type": "integer",
//                "required": false,
//                "read_only": true,
//                "label": "ID"
//            },
//            "sync_status": {
//                "type": "boolean",
//                "required": false,
//                "read_only": false,
//                "label": "\u0441\u0442\u0430\u0442\u0443\u0441 \u0441\u0438\u043d\u0445\u0440\u043e\u043d\u0438\u0437\u0430\u0446\u0438\u0438"
//            },
//            "status": {
//                "type": "boolean",
//                "required": false,
//                "read_only": false,
//                "label": "status"
//            },
//            "comment": {
//                "type": "string",
//                "required": false,
//                "read_only": false,
//                "label": "comment",
//                "max_length": 256
//            },
//            "customer_date": {
//                "type": "datetime",
//                "required": false,
//                "read_only": false,
//                "label": "customer date"
//            },
//            "manager_date": {
//                "type": "datetime",
//                "required": false,
//                "read_only": false,
//                "label": "manager date"
//            },
//            "company": {
//                "type": "field",
//                "required": true,
//                "read_only": true,
//                "label": "\u041a\u043e\u043c\u043f\u0430\u043d\u0438\u044f"
//            }
//        }
//    }
//}

angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('accounts\templates\account_express_tariff.html',
        "<div class='row' ng-controller='PriceListCtr'>\n  <div class=\"twelve columns centered\">\n    <table>\n      <tbody ng-repeat=\"item in data\">\n      <tr>\n        <td>{@item.name@}</td>\n        <td>{@item.inside_mkad_courier_price@}</td>\n        <td>{@item.outside_mkad_courier_price@}</td>\n        <td>{@item.area_one_price@}</td>\n        <td>{@item.area_two_price@}</td>\n        <td>{@item.area_three_price@}</td>\n        <td>{@item.area_four_price@}</td>\n        <td>{@item.weight_overlimit_price@}</td>\n        <td>{@item.waiting_price@}</td>\n      </tr>\n      </tbody>\n    </table>\n  </div>\n</div>\n");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('accounts\templates\account_order_container.html',
        "<div class='row' ng-controller='AccountOrderContainerCtr'>\n    <div class=\"twelve columns centered\">\n        <fieldset>\n            <legend>Добавть Заказ</legend>\n            <div class=\"row\">\n                <div class=\"large-6 columns\">\n                    <label>Комментарий к заказу\n                        <input type=\"text\" placeholder=\"\" ng-model=\"form.comment\"/>\n                    </label>\n                </div>\n                <div class=\"large-6 columns \">\n                    <label>Дата окончания заказа\n                        <input type=\"text\" class=\"datetimepicker\" placeholder=\"\" ng-model=\"form.customer_date\"/>\n                    </label>\n                </div>\n            </div>\n            <a href=\"\" class=\"button\" value=\"\" ng-click=\"addOrderContainer()\">Продолжить</a>\n        </fieldset>\n    </div>\n</div>\n\n<script type=\"text/javascript\"> jQuery('.datetimepicker').datetimepicker( { onGenerate:function( ct ){ jQuery(this).find('.xdsoft_date.xdsoft_weekend') .addClass('xdsoft_disabled'); }, format:\"d.m.Y H:i\", lang: 'ru', minTime:'10:00', maxTime:'21:00', timepickerScrollbar:'false', dayOfWeekStart: 1 }) </script>\n");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('accounts\templates\account_order_create.html',
        "<div class='row' ng-controller='CreateOrdersCtr'>\n  <div class=\"twelve columns centered\">\n    <!-- Форма отправления заказа -->\n    <fieldset>\n\n      <p>Дата приезда:</p>\n      <input class=\"datetimepicker\" type=\"text\" ng-model='form.order_datetime'>\n\n      <h2>Отправление:</h2>\n\n      <p>Плательщик:</p>\n      <select ng-model='form.payer'>\n        <option value=\"1\">Отправитель</option>\n        <option value=\"2\">Получатель</option>\n        <option value=\"3\">Третье лицо</option>\n        <option value=\"4\">Отправитель (безналичный расчет)</option>\n        <option value=\"5\">Получатель (безналичный расчет)</option>\n        <option value=\"6\">Третье лицо (безналичный расчет)</option>\n      </select>\n\n      <p>Ценность отправления</p>\n      <input type=\"text\" ng-model='form.worth'>\n\n      <p><span class=\"mark\">**</span>Вес (кг):</p>\n      <input ng-model='form.weight' type=\"text\" class=\"weight\">\n\n      <p><span class=\"mark\">**</span>Размеры (см):</p>\n      <input ng-model='form.dimension_x' type=\"text\" class=\"length\">\n      <p>Длина</p>\n      <p>X</p>\n      <input ng-model='form.dimension_y' type=\"text\" class=\"width\">\n      <p>Ширина</p>\n      <p>X</p>\n      <input ng-model='form.dimension_z'  type=\"text\" class=\"height\">\n      <p>Высота</p>\n\n      <p>Комментарий:</p>\n      <input ng-model='form.comment' type=\"text\">\n\n      <p>Тип отправления:</p>\n      <select ng-model='form.is_docs'>\n        <option value='true' selected=\"selected\">Документы</option>\n        <option value='false'>Товары</option>\n      </select>\n\n      <p>Адрес отправителя</p>    \n      <input type=\"text\" ng-model=\"form.sender_adress\">\n\n      <p>Адрес получателя</p>\n      <input type=\"text\" ng-model=\"form.recipeint_adress\">\n      <a href=\"\" class=\"button\" value=\"\" ng-click=\"sendform()\">Добавить заказ</a>\n    </fieldset>\n  </div>\n</div>\n<script type=\"text/javascript\"> jQuery('.datetimepicker').datetimepicker( { onGenerate:function( ct ){ jQuery(this).find('.xdsoft_date.xdsoft_weekend') .addClass('xdsoft_disabled'); }, format:\"Y-m-d\\\\TH:i\", lang: 'ru', minTime:'10:00', maxTime:'21:00', timepickerScrollbar:'false', dayOfWeekStart: 1 }) </script>\n");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('accounts\templates\account_order_create_with_attachment.html',
        "<div class=\"row\" ng-controller='FileUploadCtr'>\n    <input type=\"file\" ng-model=\"form.file\"/><br/>\n        <li>\n            <p>Дата приезда:</p>\n            <input class=\"datetimepicker\" type=\"text\" ng-model='form.deliver_date_time'>\n        </li>\n        <p>{@form@}</p>\n</div>\n\n<script type=\"text/javascript\"> jQuery('.datetimepicker').datetimepicker(\n        {\n            format:\"Y-m-d\\\\TH:i\",\n            lang: 'ru',\n            minTime:'10:00',\n            maxTime:'21:00',\n            timepickerScrollbar:'false'\n        })\n</script>\n");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('accounts\templates\account_order_edit.html',
        "<div class='row' ng-controller='AccountOrderEditCtr'>\n    <div class=\"twelve columns centered\">\n        <div class=\"row\">\n            <fieldset>\n                <legend>Заказ</legend>\n                <div class=\"large-6 columns\">\n                    <label>Комментарий к заказу\n                        <p>{@data.comment@}</p>\n                    </label>\n                </div>\n                <div class=\"large-6 columns \">\n                    <label>Дата окончания заказа\n                        <p>{@data.customer_date@}</p>\n                    </label>\n                </div>\n\n                <div class=\"row\" ng-controller='FileUploadCtr'>\n                    <input type=\"file\" nv-file-select uploader=\"uploader\"/><br/>\n        <ul>\n            <li ng-repeat=\"item in uploader.queue\">\n                Name: <span ng-bind=\"item.file.name\"></span><br/>\n                <button ng-click=\"item.upload()\">upload</button>\n            </li>\n        </ul>\n                </div>\n\n\n                <div ng-controller=\"ModalDemoCtr\">\n                    <button class=\"button\" ng-click=\"open()\">Open me!</button>\n                    <div ng-show=\"selected\">Selection from a modal: {@ selected @}</div>\n                </div>\n            </fieldset>\n        </div>\n    </div>\n</div>");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('accounts\templates\account_order_modal.html',
        "<div ng-controller='CreateOrdersCtr'>\n    <!-- Форма отправления заказа -->\n    <div class=\"row\">\n        <div class=\"small-12 columns\"></div>\n    <fieldset>\n        <h2>Отправление:</h2>\n        <div class=\"row\">\n            <div class=\"small-4 columns\">\n                <p>Дата приезда:</p>\n                <input class=\"datetimepicker\" type=\"text\" ng-model='form.order_datetime'>\n            </div>\n            <div class=\"small-4 columns\">\n                <p>Плательщик:</p>\n                <select ng-model='form.payer'>\n                    <option value=\"1\">Отправитель</option>\n                    <option value=\"2\">Получатель</option>\n                    <option value=\"3\">Третье лицо</option>\n                    <option value=\"4\">Отправитель (безналичный расчет)</option>\n                    <option value=\"5\">Получатель (безналичный расчет)</option>\n                    <option value=\"6\">Третье лицо (безналичный расчет)</option>\n                </select>\n            </div>\n            <div class=\"small-4 columns\">\n                <p>Ценность отправления</p>\n                <input type=\"text\" ng-model='form.worth'>\n\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"small-6 columns\">\n                <p>Тип отправления:</p>\n                <select ng-model='form.is_docs'>\n                    <option value='true' selected=\"selected\">Документы</option>\n                    <option value='false'>Товары</option>\n                </select>\n            </div>\n            <div class=\"small-6 columns\">\n                <p><span class=\"mark\">**</span>Вес (кг):</p>\n                <input ng-model='form.weight' type=\"text\" class=\"weight\">\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"small-6 columns\">\n                <p>Адрес отправителя</p>\n                <input type=\"text\" ng-model=\"form.sender_adress\">\n            </div>\n            <div class=\"small-6 columns\">\n                <p>Адрес получателя</p>\n                <input type=\"text\" ng-model=\"form.recipeint_adress\">\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"small-12 column\">\n                <p><span class=\"mark\">**</span>Размеры (см):</p>\n\n                <div class=\"small-4 column\">\n                    <p>Длина</p>\n                    <input ng-model='form.dimension_x' type=\"text\" class=\"length\">\n                </div>\n                <div class=\"small-4 column\">\n                    <p>Ширина</p>\n                    <input ng-model='form.dimension_y' type=\"text\" class=\"width\">\n                </div>\n                <div class=\"small-4 column\">\n                    <p>Высота</p>\n                    <input ng-model='form.dimension_z'  type=\"text\" class=\"height\">\n                </div>\n            </div>\n        </div>\n        <div class=\"row\">\n            <div class=\"small-6 column\"></div>\n            <div class=\"small-6 column\"></div>\n        </div>\n        <div class=\"row\">\n            <div class=\"small-6 column\">\n                <p>Комментарий:</p>\n                <input ng-model='form.comment' type=\"text\">\n            </div>\n            <div class=\"small-6 column\">\n                <a href=\"\" class=\"button\" value=\"\" ng-click=\"sendform()\">Добавить заказ</a>\n            </div>\n        </div>\n\n\n    </fieldset>\n</div>\n<button class=\"button\" ng-click=\"ok()\">OK</button>\n<a class=\"close-reveal-modal\" ng-click=\"cancel()\">&#215;</a>\n<script type=\"text/javascript\"> jQuery('.datetimepicker').datetimepicker( { onGenerate:function( ct ){ jQuery(this).find('.xdsoft_date.xdsoft_weekend') .addClass('xdsoft_disabled'); }, format:\"d.m.Y H:i\", lang: 'ru', minTime:'10:00', maxTime:'21:00', timepickerScrollbar:'false', dayOfWeekStart: 1 }) </script>\n");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('accounts\templates\account_orders_list.html',
        "<div class=\"row\" ng-controller='OrdersCtr'>\n    <table>\n        <thead>\n        <tr>\n            <td>Номер заказа</td>\n            <td>Комментарий</td>\n            <td>Дата заказчика</td>\n            <td>Согласованная дата</td>\n            <td>Текущий статус</td>\n        </tr>\n        </thead>\n        <tbody>\n        <tr ng-repeat='item in data'>\n            <td><a href='#/orders/{@ item.id @}'><i class=\"fi-link size-18\"></i></a></td>\n            <td>{@ item.comment @}</td>\n            <td>{@ item.customer_date @}</td>\n            <td>{@ item.manager_date @}</td>\n            <td>{@item.status@}</td>\n        </tr>\n        </tbody>\n    </table>\n    <a href=\"#/orders/create\" class=\"button\">Добавить заказ</a>\n</div>");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('accounts\templates\account_profile.html',
        "<div class=\"row\" ng-controller='ProfileCtr'>\n  <div class=\"twelve columns\">\n    <table>\n      <tbody>\n      <tr>\n        <td> Электронная почта </td>\n        <td> {@data.email@} </td>\n      </tr>\n      <tr>\n        <td> Имя </td>\n        <td> {@data.first_name@} </td>\n      </tr>\n      <tr>\n        <td> Фамилия </td>\n        <td> {@data.last_name@} </td>\n      </tr>\n      <tr>\n        <td> Дата регистрации </td>\n        <td> {@data.date_joined@} </td>\n      </tr>\n      <tr>\n        <td>Компания</td>\n        <td>{@company.name@}</td>\n      </tr>\n      <tr>\n        <td>Адрес компании:</td>\n        <td>{@company.allocation@}</td>\n      </tr>\n      <tr>\n        <td>Телефон компании</td>\n        <td>{@company.phone@}</td>\n      </tr>\n      </tbody>\n    </table>\n  </div>\n</div>\n");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('admin\templates\admin_companies_detail.html',
        "<div ng-controller='CompaniesDetailCtr'>\n    <div class='row' >\n        <div class=\"large-6 columns\">\n            <table>\n                <colgroup>\n                    <col span=\"1\" style=\"width: 20%;\">\n                    <col span=\"1\" style=\"width: 80%;\">\n                </colgroup>\n                <tbody>\n                <tr>\n                    <td>Имя</td>\n                    <td>{@data.name@}</td>\n                </tr>\n                <tr>\n                    <td>Адрес</td>\n                    <td>{@data.allocation@}</td>\n                </tr>\n                <tr>\n                    <td>Менеджер</td>\n                    <td><a href=\"#/customer/{@data.manager@}\">{@data.manager_deatil@}</a></td>\n                </tr>\n                </tbody>\n            </table>\n        </div>\n    </div>\n    <div class=\"row\">\n        <div class=\"large-6 columns\">\n            <p>Сотрудники</p>\n            <table>\n                <tr ng-repeat=\"item in users\">\n                    <td><a ng-href=\"#/customer/{@ item.id @}\"><i class=\"fi-link size-18\"></i></a></td>\n                    <td>{@item.email@}</td>\n                    <td>{@item.first_name@} {@item.last_name@}</td>\n                </tr>\n            </table>\n        </div>\n        <div class=\"large-6 columns\">\n            <p>Заказы</p>\n            <table>\n                <tr ng-repeat=\"item in order_containers\">\n                    <td><a href=\"#/order-container/{@item.id@}\"><i class=\"fi-link size-18\"></i></a></td>\n                    <td>{@item.id@}</td>\n                    <td>{@item.status@}</td>\n                    <td>{@item.customer_date@}</td>\n                    <td>{@item.manager_date@}</td>\n                </tr>\n            </table>\n        </div>\n    </div>\n</div>\n");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('admin\templates\admin_companies_list.html',
        "<div class='row' ng-controller='CompaniesListCtr'>\n    <div class=\"large-12 columns\">\n        <form ng-submit=\"get()\">\n            <div class=\"row\">\n                <div class=\"large-6 columns\">\n                    <label>Поиск\n                        <input type=\"text\" placeholder=\"Введите данные\" ng-model=\"search\"/>\n                    </label>\n                </div>\n            </div>\n        </form>\n            <table>\n                <colgroup>\n                    <col span=\"1\" style=\"width: 5%;\">\n                    <col span=\"1\" style=\"width: 30%;\">\n                    <col span=\"1\" style=\"width: 30%;\">\n                    <col span=\"1\" style=\"width: 25%;\">\n                    <col span=\"1\" style=\"width: 5%;\">\n                </colgroup>\n                <thead>\n                <tr>\n                    <td></td>\n                    <td>Имя</td>\n                    <td>Адрес</td>\n                    <td>Телефон</td>\n                    <td></td>\n                </tr>\n                </thead>\n                <tbody ng-repeat=\"item in data\">\n                <tr>\n                    <td><a ng-href=\"#/companies/{@ item.id @}\"><i class=\"fi-link size-18\"></i></a></td>\n                    <td>{@item.name@}</td>\n                    <td>{@item.allocation@}</td>\n                    <td>{@item.phone@}</td>\n\n                    <td><a ng-click=\"deleteCompany(item.id)\" href=\"\"> <i class=\"fi-trash size-18\"></i></a></td>\n                </tr>\n                </tbody>\n            </table>\n    </div>\n</div>\n");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('admin\templates\admin_companies_order_detail.html',
        "<div class='row' ng-controller='OrderDetailCtr'>\n    <div class=\"large-12 columns\">\n        <table>\n            <tr><td>ID</td><td>{@order.id@}</td></tr>\n            <tr><td>№ Заказа</td><td>{@order.order_container@}</td></tr>\n            <tr><td>Комментарий</td><td>{@order.comment@}</td></tr>\n            <tr><td>Способ оплаты</td><td>{@order.payer@}</td></tr>\n            <tr><td>Вес</td><td>{@order.weight@}</td></tr>\n            <tr><td>Длина</td><td>{@order.dimension_x@}</td></tr>\n\n            <tr><td>Ширина</td><td>{@order.dimension_y@}</td></tr>\n\n            <tr><td>Высота</td><td>{@order.dimension_z@}</td></tr>\n\n            <tr><td>Адрес получателя</td><td>{@order.recipeint_adress@}</td></tr>\n            <tr><td>Адрес отправителя</td><td>{@order.sender_adress@}</td></tr>\n            <tr><td>Тип отправления</td><td>{@order.is_docs@}</td></tr>\n            <tr><td>Время отправления</td><td>{@order.order_datetime@}</td> </tr>\n            <tr><td>Время создания заявки</td><td>{@order.creater_datetime@}</td> </tr>\n        </table>\n\n\n\n    </div>\n</div>\n");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('admin\templates\admin_notifications.html',
        "<div class='row' ng-controller='NotificationsCtr'>\n    <div class=\"large-12 columns\">\n        <div ng-repeat=\"item in data\">\n            <p>Отвественный менеджер <a href=\"#/customer/{@item.manager@}\"><i class=\"fi-link size-18\"></i></a></p>\n            <p>Компания <a href=\"#/companies/{@item.company@}\"><i class=\"fi-link size-18\"></i></a></p>\n            <p>{@item.text@}</p>\n            <p>Время: {@item.time@}</p>\n            <a href=\"\"  ng-click='delete(item.id)' class=\"button tiny\">Удалить</a>\n            <hr/>\n        </div>\n    </div>\n</div>\n");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('admin\templates\admin_order_container_detail.html',
        "<div class='row' ng-controller='OrderContainerCtr'>\n    <div class=\"large-12 columns\">\n\n        <fieldset>\n            <legend>Проект</legend>\n        <div>\n            {@data.orderContainers.id@}\n            {@data.orderContainers.status@}\n            {@data.orderContainers.customer_date@}\n        </div>\n        </fieldset>\n       <filedset>\n           <legend>Статусы контракта</legend>\n          <div ng-repeat=\"item in data.status\">\n              {@item.status | int2status @} {@item.time_change@}\n          </div>\n\n       </filedset>\n\n        <fieldset>\n            <legend>Файлы проекта</legend>\n        <div ng-repeat=\"file in data.files\">\n            {@data.file.user@}\n            {@data.file.id@}\n            <a href=\"media/{@file.file@}\">{@file.file@}</a>\n        </div>\n        </fieldset>\n\n        <fieldset>\n            <legend>Заказы</legend>\n            <div ng-repeat=\"order in data.orders\">\n                <a href=\"#/order-container/{@data.orderContainers.id@}/orders/{@order.id@}\"><i class=\"fi-paperclip size-18\"></i></a>\n                {@order.id@}\n                {@order.payer@}\n                {@order.comment@}\n                {@order.weight@}\n            </div>\n        </fieldset>\n\n        <fieldset>\n            <legend><a href=\"#/order-container/{@data.orderContainers.id@}/schedule\">Расписание</a></legend>\n            <div ng-repeat=\"item in data.schedule\">\n                <a href=\"#/order-container/{@data.orderContainers.id@}/schedule/{@item.id@}\"><i class=\"fi-paperclip size-18\"></i></a>\n                {@item.id@}\n                {@item.date@}\n                {@item.start_time@}\n                {@item.end_time@}\n            </div>\n        </fieldset>\n\n    </div>\n</div>");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('admin\templates\admin_order_express_detail.html',
        "<div class='row' ng-controller='OderExpressDetailCtr'>\n    <div class=\"large-12 columns\">\n\n    </div>\n</div>\n\n");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('admin\templates\customer_account.html',
        "<div class='row' ng-controller='CustomerAccountCtr'>\n    <div class=\"small-6 columns\" ng-show=\"!edit\">\n        <table>\n            <colgroup>\n                <col span=\"1\" style=\"width: 20%;\">\n                <col span=\"1\" style=\"width: 80%;\">\n            </colgroup>\n            <tbody>\n            <tr>\n                <td>Почта</td>\n                <td>{@data.email@}</td>\n            </tr>\n            <tr>\n                <td>Дата регистрации</td>\n                <td>{@data.date_joined@}</td>\n            </tr>\n            <tr>\n                <td>Контактное лицо</td>\n                <td>{@data.last_name@} {@data.first_name@}</td>\n            </tr>\n            <tr>\n                <td>Привилегии пользователя</td>\n                <td ><span ng-repeat=\"item in data.permissions_names\">{@item@} </span></td>\n            </tr>\n            </tbody>\n        </table>\n        <a href=\"\" class=\"button\" ng-click=\"startEdit()\">Редактировать</a>\n    </div>\n    <div ng-show='edit'>\n        <form>\n            <input type=\"text\" ng-model=\"data.email\"/>\n            <input type=\"text\" ng-model=\"data.last_name\"/>\n            <input type=\"text\" ng-model=\"data.first_name\"/>\n            <select ng-model=\"data.permissions\" ng-options=\"permission.id as permission.permission for permission in permissions\" required></select>\n            <a class=\"button\" href=\"\" ng-click=\"putUser()\">Сохранить</i></a>\n        </form>\n    </div>\n</div>\n<script type=\"text/javascript\"> jQuery('.datetimepicker').datetimepicker( { onGenerate:function( ct ){ jQuery(this).find('.xdsoft_date.xdsoft_weekend') .addClass('xdsoft_disabled'); }, format:\"d.m.Y H:i\", lang: 'ru', minTime:'10:00', maxTime:'21:00', timepickerScrollbar:'false', dayOfWeekStart: 1 }) </script>\n");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('admin\templates\customers_list.html',
        "<div class='row' ng-controller='CustomersCtr'>\n    <div class=\"twelve columns centered\">\n        <form ng-submit=\"get()\">\n            <div class=\"row\">\n                <div class=\"large-6 columns\">\n                    <label>Поиск\n                        <input type=\"text\" placeholder=\"Введите данные\" ng-model=\"search\"/>\n                    </label>\n                </div>\n            </div>\n        </form>\n        <table>\n            <colgroup>\n                <col span=\"1\" style=\"width: 5%;\">\n                <col span=\"1\" style=\"width: 45%;\">\n                <col span=\"1\" style=\"width: 45%;\">\n                <col span=\"1\" style=\"width: 5%\">\n            </colgroup>\n            <thead>\n            <tr>\n                <td></td>\n                <td>Контактное лицо</td>\n                <td>Почта</td>\n                <td></td>\n            </tr>\n            </thead>\n            <tbody>\n            <tr ng-repeat='item in data'>\n                <td><a ng-href=\"#/customer/{@ item.id @}\"><i class=\"fi-link size-18\"></i></a></td>\n                <td>{@ item.first_name @} {@ item.last_name @}</td>\n                <td> {@item.email@} </td>\n                <td><a href=\"\" ng-click=\"delete(item.id)\"><i class=\"fi-trash size-18\"></i></a></td>\n            </tr>\n            </tbody>\n        </table>\n        <a class=\"button\" href=\"#/registration\">Добавить</a>\n    </div>\n</div>\n");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('admin\templates\delivery.html',
        "<div class='row' ng-controller='DeliveryCtr'>\n    <div class=\"twelve columns centered\">\n        <fieldset>\n            <input type=\"text\" placeholder=\"Вес\" ng-model=\"form.weight\"/>\n            <input type=\"text\" placeholder=\"Адрес\" ng-model=\"form.adress\"/>\n            <select ng-model=\"form.type\" ng-options=\"item.id as item.name for item in tarifs\"> </select>\n            <a href=\"\" class=\"button\" value=\"\" ng-click=\"add()\">add</a>\n        </fieldset>\n            <table>\n\t\t\t<tbody>\n\t\t\t\t<tr ng-repeat='item in data'>\n                    <td>{@item.id@}</td>\n                    <td>{@item.weight@}</td>\n                    <td>{@item.adress@}</td>\n\t\t\t\t</tr>\n\t\t\t</tbody>\n\t\t</table>\n    </div>\n</div>\n");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('admin\templates\fast_order.html',
        "<div class='row' ng-controller='FastOrderCtr'>\n    <div class=\"row\">\n        <div class=\"large-12 columns\">\n            <!-- Форма создания пользователя -->\n            <fieldset ng-show=\"!formState.registrationIsDone\">\n                <legend>Создание пользователя</legend>\n\n                <div class=\"row\">\n                    <div class=\"large-6 columns\">\n                        <label>Электронная почта\n                            <input type=\"email\" placeholder=\"\" ng-model=\"user.email\"/>\n                        </label>\n                    </div>\n                    <div class=\"large-6 columns \">\n                        <label>Пароль\n                            <input type=\"password\" placeholder=\"\" ng-model=\"user.password\"/>\n                        </label>\n                    </div>\n                </div>\n\n                <div class=\"row\">\n                    <div class=\"large-6 columns\">\n                        <label>Имя\n                            <input type=\"text\" placeholder=\"\" ng-model=\"user.first_name\"/>\n                        </label>\n                    </div>\n                    <div class=\"large-6 columns end\">\n                        <label>Фамилия\n                            <input type=\"text\" placeholder=\"\" ng-model=\"user.last_name\"/>\n                        </label>\n                    </div>\n                </div>\n\n                <div class=\"row\">\n                    <div class=\"large-6 columns end\">\n                        <label>Телефон\n                            <input type=\"tel\" placeholder=\"\" ng-model=\"user.phone\"/>\n                        </label>\n                    </div>\n                    <div class=\"large-6 columns \">\n                        <label>Название компании\n                            <input type=\"text\" placeholder=\"\" ng-model=\"user.company_name\"/>\n                        </label>\n                    </div>\n                </div>\n\n                <a href=\"\" class=\"button\" value=\"\" ng-click=\"addUser()\">Зарегистрировать</a>\n\n            </fieldset>\n\n\n            <!-- Показываем форму пользователя -->\n            <div class=\"\" ng-show=\"formState.registrationIsDone\">\n                <fieldset>\n                    <div class=\"row\">\n                        <div class=\"large-6 columns\">\n                            <label>Имя\n                                <p>{@formState.AddedUser.first_name@}</p>\n                            </label>\n                        </div>\n                        <div class=\"large-6 columns end\">\n                            <label>Фамилия\n                                <p>{@formState.AddedUser.last_name@}</p>\n                            </label>\n                        </div>\n                    </div>\n\n                    <div class=\"row\">\n                        <div class=\"large-6 columns\">\n                            <label>Электронная почта\n                                <p>{@formState.AddedUser.email@}</p>\n                            </label>\n                        </div>\n                        <div class=\"large-6 columns end\">\n                            <label>Время регистрации\n                                <p>{@formState.AddedUser.date_joined@}</p>\n                            </label>\n                        </div>\n                    </div>\n                </fieldset>\n            </div>\n\n        </div>\n    </div>\n\n    <!-- Форма отправления заказа -->\n    <fieldset ng-show=\"formState.registrationIsDone\">\n        <legend>Отправление:</legend>\n        <p>Дата приезда курьера:</p>\n        <input class=\"datetimepicker\" type=\"text\" ng-model='form.order_datetime'>\n        <p>Плательщик:</p>\n        <select ng-model='form.payer'>\n            <option value=\"1\">Отправитель</option>\n            <option value=\"2\">Получатель</option>\n            <option value=\"3\">Третье лицо</option>\n            <option value=\"4\">Отправитель (безналичный расчет)</option>\n            <option value=\"5\">Получатель (безналичный расчет)</option>\n            <option value=\"6\">Третье лицо (безналичный расчет)</option>\n        </select>\n        <p><span class=\"mark\">**</span>Вес (кг):</p>\n        <input ng-model='form.weight' type=\"text\" class=\"weight\">\n\n        <div class=\"row\">\n            <fieldset>\n                <legend><p><span class=\"mark\">**</span>Размеры (см):</p></legend>\n                <div class=\"large-4 columns\">\n                    <p>Длина</p>\n                    <input ng-model='form.dimension_x' type=\"text\" class=\"length\">\n                </div>\n                <div class=\"large-4 columns\">\n                    <p>Ширина</p>\n                    <input ng-model='form.dimension_y' type=\"text\" class=\"width\">\n                </div>\n                <div class=\"large-4 columns\">\n                    <p>Высота</p>\n                    <input ng-model='form.dimension_z'  type=\"text\" class=\"height\">\n                </div>\n            </fieldset>\n        </div>\n\n\n        <p>Комментарий:</p>\n        <input ng-model='form.comment' type=\"text\">\n\n        <p>Тип отправления:</p>\n        <select ng-model='form.is_docs'>\n            <option value='true' selected=\"selected\">Документы</option>\n            <option value='false'>Товары</option>\n        </select>\n\n        <p>Адрес отправителя</p>\n        <input type=\"text\" ng-model=\"form.sender_adress\">\n\n        <p>Адрес получателя</p>\n        <input type=\"text\" ng-model=\"form.recipeint_adress\">\n\n        <a href=\"\" class=\"button\" value=\"\" ng-click=\"sendform()\">Добавить заказ</a>\n    </fieldset>\n</div>\n\n<script type=\"text/javascript\"> jQuery('.datetimepicker').datetimepicker( { onGenerate:function( ct ){ jQuery(this).find('.xdsoft_date.xdsoft_weekend') .addClass('xdsoft_disabled'); }, format:\"Y-m-d\\\\TH:i\", lang: 'ru', minTime:'10:00', maxTime:'21:00', timepickerScrollbar:'false', dayOfWeekStart: 1 }) </script>\n");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('admin\templates\orders_list.html',
        "<div class='row' ng-controller='OrdersListCtr'>\n    <div class=\"twelve columns centered\">\n\n        <table>\n            <thead>\n            <tr>\n                <td>Вес</td>\n                <td>Ширина</td>\n                <td>Высота</td>\n                <td>Длинна</td>\n                <td>Ценность</td>\n                <td>Куда</td>\n                <td>Откуда</td>\n                <td>Документы</td>\n                <td>Дата заказа</td>\n            </tr>\n\n            </thead>\n            <tbody>\n            <tr ng-repeat=\"item in data\">\n                <td>\n                    {@item.weight@}\n                </td>\n                <td>\n                    {@item.dimension_x@}\n                </td>\n                <td>\n                    {@item.dimension_y@}\n                </td>\n                <td>\n                    {@item.dimension_z@}\n                </td>\n                <td>\n                    {@item.worth@}\n                </td>\n                <td>\n                    {@item.recipeint_adress@}\n                </td>\n                <td>\n                    {@item.sender_adress@}\n                </td>\n                <td ng-bind-html=\"item.is_docs | bool2icon\">\n                </td>\n                <td>\n                    {@item.order_datetime@}\n                </td>\n            </tr>\n            </tbody>\n        </table>\n    </div>\n</div>");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('admin\templates\registration.html',
        "<div class='row' ng-controller='RegistrationCtr'>\n    <div class=\"twelve columns centered\">\n        <fieldset>\n\n            <form name=\"form\" novalidate>\n            <label class=\"control-label\" for=\"email\">Электронная почта:</label>\n            <input type=\"email\" name=\"email\" ng-model=\"form.user.email\" required ng-minlength=1 ng-maxlength=80>\n            <label class=\"control-label\" for=\"password\">password:</label>\n            <input type=\"text\" name=\"password\" ng-model=\"form.user.password\" required ng-minlength=5 ng-maxlength=16>\n            <label class=\"control-label\" for=\"first_name\">Имя:</label>\n            <input type=\"text\" name=\"first_name\" ng-model=\"form.user.first_name\" required ng-minlength=3 ng-maxlength=25>\n            <label class=\"control-label\" for=\"last_name\">Фамилия:</label>\n            <input type=\"text\" name=\"last_name\" ng-model=\"form.user.last_name\" required ng-minlength=5 ng-maxlength=25>\n\n\n            <label class=\"control-label\" for=\"last_name\">Телефон:</label>\n            <input type=\"text\" name=\"last_name\" ng-model=\"form.company.phone\" required ng-minlength=9 ng-maxlength=15>\n            <label class=\"control-label\" for=\"last_name\">Название компании:</label>\n            <input type=\"text\" name=\"last_name\" ng-model=\"form.company.name\" required ng-minlength=5 ng-maxlength=40>\n            <label class=\"control-label\" for=\"last_name\">Адрес компании:</label>\n            <input type=\"text\" name=\"last_name\" ng-model=\"form.company.allocation\" required ng-minlength=5 ng-maxlength=90>\n\n            <label class=\"control-label\" for=\"permissions\">Привилегии пользователя:</label>\n            <select ng-model=\"form.user.permissions\" ng-options=\"permission.id as permission.permission for permission in permissions\" required></select>\n\n            <button title=\"Добавить пользователя в систему.\" ng-click=\"signup()\" class=\"btn btn-primary\">Добавить</button>\n            </form>\n        </fieldset>\n        <style>\n            input.ng-invalid {\n                border: 1px solid darkred;\n            }\n            input.ng-valid {\n                border: 1px solid green;\n            }\n        </style>\n    </div>\n</div>");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('admin\templates\schedule.html',
        "<div class='row' ng-controller='ScheduleCtr'>\n    <div class=\"twelve columns centered\">\n\n        <div class=\"row\">\n            <p>заказы по расписанию</p>\n            <div class=\"large-4 columns\">\n                <label>Дата\n                    <input class=\"datepicker\" type=\"text\" ng-model='form.date'>\n                </label>\n            </div>\n            <div class=\"large-2 columns\">\n                <label>Доставка с\n                    <input class=\"timepicker\" type=\"text\" ng-model='form.start_time'>\n                </label>\n            </div>\n            <div class=\"large-2 columns\">\n                <label>Доставка до\n                    <input class=\"timepicker\" type=\"text\" ng-model='form.end_time'>\n                </label>\n            </div>\n            <div class=\"large-3 large-offset-1 columns\">\n                    <a href=\"\" class=\"button\" value=\"\" ng-click=\"add()\">добавить день</a>\n            </div>\n        </div>\n        <div class=\"row\">\n            <table>\n\n                <colgroup>\n                    <col span=\"1\" style=\"width: 5%;\">\n                    <col span=\"1\" style=\"width: 25%;\">\n                    <col span=\"1\" style=\"width: 30%;\">\n                    <col span=\"1\" style=\"width: 30%;\">\n                </colgroup>\n                <tbody>\n                <tr ng-repeat=\"item in shedule\">\n\n                    <td><a href=\"#/order-container/{@item.order_container@}/schedule/{@item.id@}\"><i class=\"fi-paperclip size-18\"></i></a> </td>\n                    <td>{@item.date | date:'yyyy-MM-dd'@}</td>\n                    <td>{@item.start_time@}</td>\n                    <td>{@item.end_time@}<a href=\"\" ng-click=\"delete(item.id)\"> <i class=\"fi-trash size-18\"></i></a></td>\n\n                </tr>\n                </tbody>\n            </table>\n        </div>\n    </div>\n</div>\n<script type=\"text/javascript\">\n    jQuery('.datepicker').datetimepicker(\n            {\n                format:\"Y-m-d\",\n                timepicker:false,\n            });\n\n    jQuery('.timepicker').datetimepicker({\n        datepicker:false,\n        format:'H:i'\n    });\n\n</script>");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('admin\templates\schedule_list_create.html',
        "<div class='row' ng-controller='CustomersCtr'>\r\n    <div class=\"twelve columns centered\">\r\n        <p>заказы по расписанию</p>\r\n        <script type=\"text/javascript\">\r\n            jQuery('.datepicker').datetimepicker(\r\n                    {\r\n                        format:\"Y-m-d\",\r\n                        timepicker:false,\r\n                    });\r\n\r\n            jQuery('.timepicker').datetimepicker({\r\n                datepicker:false,\r\n                format:'H:i'\r\n            });\r\n\r\n        </script>\r\n        <div class=\"row\">\r\n            <div class=\"large-4 columns\">\r\n                <label>Дата\r\n                    <input class=\"datepicker\" type=\"text\" ng-model='form.date'>\r\n                </label>\r\n            </div>\r\n            <div class=\"large-2 columns\">\r\n                <label>Доставка с\r\n                    <input class=\"timepicker\" type=\"text\" ng-model='form.start_time'>\r\n                </label>\r\n            </div>\r\n            <div class=\"large-2 columns\">\r\n                <label>Доставка до\r\n                    <input class=\"timepicker\" type=\"text\" ng-model='form.end_time'>\r\n                </label>\r\n            </div>\r\n            <div class=\"large-3 large-offset-1 columns\">\r\n                    <a href=\"\" class=\"button\" value=\"\" ng-click=\"add()\">добавить день</a>\r\n            </div>\r\n        </div>\r\n        <div class=\"row\">\r\n            <table>\r\n\r\n            <tbody>\r\n            <tr ng-repeat=\"item in shedule\">\r\n               <td><a ng-href=\"#/customers/{@item.customer@}/{@item.id@}\">+</a></td>\r\n                <td>{@item.date | date:'yyyy-MM-dd'@}</td>\r\n                <td>{@item.start_time@}</td>\r\n                <td>{@item.end_time@}</td>\r\n            </tr>\r\n            </tbody>\r\n            </table>\r\n        </div>\r\n    </div>\r\n</div>");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('auth\templates\login.html',
        "<div class='row'>\r\n<div class=\"four columns centered\">\r\n\t<form>\r\n\t\t{@ error @}\r\n\t<ul class=\"no-bullet\">\r\n\t\t<li class=\"field\"><label>Электронная почта</label>\r\n\t\t<li class=\"field\"><input type=\"email\" placeholder=\"Email input\" class=\"email input\" ng-model='username'></li>\r\n\t\t<li class=\"field\"><label>Пароль</label>\r\n\t\t<li class=\"field\"><input type=\"password\" placeholder=\"Password input\" class=\"password input\" ng-model='password'></li>\r\n\t<ul>\r\n\t\t<br>\r\n\t\t<div class=\"medium success btn\"><button type=\"submit\">Log in</button></div>\r\n\t</form>\r\n</div>\r\n</div>\r\n");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('auth\templates\profile.html',
        "<div class=\"row\">\r\n  <div class=\"six columns\">\r\n  \t<p>\r\n  \t{@user.email@}\r\n  \t</p>\r\n  \t<p>\r\n  \t{@user.last_login@}\r\n  \t</p>\r\n  \t<p>\r\n  \t{@user.first_name@}\r\n  \t</p>\r\n  \t<p>\r\n  \t{@user.last_name@}\r\n  \t</p>\r\n\t</div>\r\n</div>");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('main\templates\main.html',
        "\n");
}]);
angular.module('app').run(['$templateCache', function($templateCache) {
    $templateCache.put('main\templates\prices.html',
        "<div class='row'>\r\n<div class=\"twelve columns centered\">\r\n<table border=\"0\" style=\"width: 100%;\">\r\n\t<tbody>\r\n\t\t<tr class=\"table-head\">\r\n\t\t\t<td style=\"width: 30px; text-align: center; vertical-align: middle;\">№</td>\r\n\t\t\t<td style=\"text-align: center; vertical-align: middle;\">Описание курьерской услуги</td>\r\n\t\t\t<td style=\"width: 110px; text-align: center; vertical-align: middle;\">Стоимость (руб)</td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<td style=\"text-align: center; vertical-align: middle;\">1</td>\r\n\t\t\t<td>Вызов курьера в пределах МКАД</td>\r\n\t\t\t<td style=\"text-align: center; vertical-align: middle;\">200 руб</td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<td style=\"text-align: center; vertical-align: middle;\">2</td>\r\n\t\t\t<td><span style=\"font-size: 13px; line-height: 20px; background-color: #ffffff;\">Вызов курьера за пределы МКАД до 10 км</span></td>\r\n\t\t\t<td style=\"text-align: center; vertical-align: middle;\">400 руб</td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<td style=\"text-align: center; vertical-align: middle;\">3</td>\r\n\t\t\t<td>Доставка одного отправления весом до 500 гр. в один адрес в пределах Зоны 1*</td>\r\n\t\t\t<td style=\"text-align: center; vertical-align: middle;\">200 руб</td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<td style=\"text-align: center; vertical-align: middle;\">4</td>\r\n\t\t\t<td>Доставка одного отправления весом до 500 гр. в один адрес в пределах Зоны 2*</td>\r\n\t\t\t<td style=\"text-align: center; vertical-align: middle;\">200 руб</td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<td style=\"text-align: center; vertical-align: middle;\">5</td>\r\n\t\t\t<td>Доставка одного отправления весом до 500 гр. в один адрес в пределах Зоны 3*</td>\r\n\t\t\t<td style=\"text-align: center; vertical-align: middle;\">250 руб</td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<td style=\"text-align: center; vertical-align: middle;\">6</td>\r\n\t\t\t<td>Доставка одного отправления весом до 500 гр. в один адрес в пределах Зоны 4*</td>\r\n\t\t\t<td style=\"text-align: center; vertical-align: middle;\">770 руб</td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<td style=\"text-align: center; vertical-align: middle;\">7</td>\r\n\t\t\t<td>Надбавка за каждые последующие 500 гр.</td>\r\n\t\t\t<td style=\"text-align: center; vertical-align: middle;\">60 руб</td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<td style=\"text-align: center; vertical-align: middle;\">8</td>\r\n\t\t\t<td>Ожидание в пределах 15 минут</td>\r\n\t\t\t<td style=\"text-align: center; vertical-align: middle;\">Бесплатно</td>\r\n\t\t</tr>\r\n\t\t<tr>\r\n\t\t\t<td style=\"text-align: center; vertical-align: middle;\">9</td>\r\n\t\t\t<td>Ожидание сверх 15 минут</td>\r\n\t\t\t<td style=\"text-align: center; vertical-align: middle;\">70 руб / за каждые 30 мин</td>\r\n\t\t</tr>\r\n\t</tbody>\r\n</table>\r\n</div>\r\n</div>");
}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImFjY291bnRzL21vZHVsZS5qcyIsImFkbWluL21vZHVsZS5qcyIsImF1dGgvbW9kdWxlLmpzIiwibWFpbi9tb2R1bGUuanMiLCJ2YWxpZGF0aW9uL21vZHVsZS5qcyIsImNvbmZpZy5qcyIsInJvdXRlcy5qcyIsInNlcnZpY2VzLmpzIiwiYWNjb3VudHMvYWNjb3VudHMuY3RybC5qcyIsImFkbWluL2FkbWluLmN0cmwuanMiLCJhZG1pbi9hZG1pbi5mbHRyLmpzIiwiYXV0aC9hdXRoLmN0cmwuanMiLCJhdXRoL2F1dGguZHJjdC5qcyIsImF1dGgvYXV0aC5zcnZjLmpzIiwibWFpbi9tYWluLmN0cmwuanMiLCJ2YWxpZGF0aW9uL3ZhbGlkYXRpb24uZHJjdC5qcyIsInRlbXBsYXRlX2NhY2hlL2FjY291bnRzL3RlbXBsYXRlcy9hY2NvdW50X2V4cHJlc3NfdGFyaWZmLmh0bWwuanMiLCJ0ZW1wbGF0ZV9jYWNoZS9hY2NvdW50cy90ZW1wbGF0ZXMvYWNjb3VudF9vcmRlcl9jb250YWluZXIuaHRtbC5qcyIsInRlbXBsYXRlX2NhY2hlL2FjY291bnRzL3RlbXBsYXRlcy9hY2NvdW50X29yZGVyX2NyZWF0ZS5odG1sLmpzIiwidGVtcGxhdGVfY2FjaGUvYWNjb3VudHMvdGVtcGxhdGVzL2FjY291bnRfb3JkZXJfY3JlYXRlX3dpdGhfYXR0YWNobWVudC5odG1sLmpzIiwidGVtcGxhdGVfY2FjaGUvYWNjb3VudHMvdGVtcGxhdGVzL2FjY291bnRfb3JkZXJfZWRpdC5odG1sLmpzIiwidGVtcGxhdGVfY2FjaGUvYWNjb3VudHMvdGVtcGxhdGVzL2FjY291bnRfb3JkZXJfbW9kYWwuaHRtbC5qcyIsInRlbXBsYXRlX2NhY2hlL2FjY291bnRzL3RlbXBsYXRlcy9hY2NvdW50X29yZGVyc19saXN0Lmh0bWwuanMiLCJ0ZW1wbGF0ZV9jYWNoZS9hY2NvdW50cy90ZW1wbGF0ZXMvYWNjb3VudF9wcm9maWxlLmh0bWwuanMiLCJ0ZW1wbGF0ZV9jYWNoZS9hZG1pbi90ZW1wbGF0ZXMvYWRtaW5fY29tcGFuaWVzX2RldGFpbC5odG1sLmpzIiwidGVtcGxhdGVfY2FjaGUvYWRtaW4vdGVtcGxhdGVzL2FkbWluX2NvbXBhbmllc19saXN0Lmh0bWwuanMiLCJ0ZW1wbGF0ZV9jYWNoZS9hZG1pbi90ZW1wbGF0ZXMvYWRtaW5fY29tcGFuaWVzX29yZGVyX2RldGFpbC5odG1sLmpzIiwidGVtcGxhdGVfY2FjaGUvYWRtaW4vdGVtcGxhdGVzL2FkbWluX25vdGlmaWNhdGlvbnMuaHRtbC5qcyIsInRlbXBsYXRlX2NhY2hlL2FkbWluL3RlbXBsYXRlcy9hZG1pbl9vcmRlcl9jb250YWluZXJfZGV0YWlsLmh0bWwuanMiLCJ0ZW1wbGF0ZV9jYWNoZS9hZG1pbi90ZW1wbGF0ZXMvYWRtaW5fb3JkZXJfZXhwcmVzc19kZXRhaWwuaHRtbC5qcyIsInRlbXBsYXRlX2NhY2hlL2FkbWluL3RlbXBsYXRlcy9jdXN0b21lcl9hY2NvdW50Lmh0bWwuanMiLCJ0ZW1wbGF0ZV9jYWNoZS9hZG1pbi90ZW1wbGF0ZXMvY3VzdG9tZXJzX2xpc3QuaHRtbC5qcyIsInRlbXBsYXRlX2NhY2hlL2FkbWluL3RlbXBsYXRlcy9kZWxpdmVyeS5odG1sLmpzIiwidGVtcGxhdGVfY2FjaGUvYWRtaW4vdGVtcGxhdGVzL2Zhc3Rfb3JkZXIuaHRtbC5qcyIsInRlbXBsYXRlX2NhY2hlL2FkbWluL3RlbXBsYXRlcy9vcmRlcnNfbGlzdC5odG1sLmpzIiwidGVtcGxhdGVfY2FjaGUvYWRtaW4vdGVtcGxhdGVzL3JlZ2lzdHJhdGlvbi5odG1sLmpzIiwidGVtcGxhdGVfY2FjaGUvYWRtaW4vdGVtcGxhdGVzL3NjaGVkdWxlLmh0bWwuanMiLCJ0ZW1wbGF0ZV9jYWNoZS9hZG1pbi90ZW1wbGF0ZXMvc2NoZWR1bGVfbGlzdF9jcmVhdGUuaHRtbC5qcyIsInRlbXBsYXRlX2NhY2hlL2F1dGgvdGVtcGxhdGVzL2xvZ2luLmh0bWwuanMiLCJ0ZW1wbGF0ZV9jYWNoZS9hdXRoL3RlbXBsYXRlcy9wcm9maWxlLmh0bWwuanMiLCJ0ZW1wbGF0ZV9jYWNoZS9tYWluL3RlbXBsYXRlcy9tYWluLmh0bWwuanMiLCJ0ZW1wbGF0ZV9jYWNoZS9tYWluL3RlbXBsYXRlcy9wcmljZXMuaHRtbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25QQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFtcbiAgJ25nUm91dGUnLFxuICAnbmdTYW5pdGl6ZScsXG4gICduZ0Nvb2tpZXMnLFxuICAncmVzdGFuZ3VsYXInLFxuICAnTG9jYWxTdG9yYWdlTW9kdWxlJyxcbiAgJ21tLmZvdW5kYXRpb24nLFxuICAnYW5ndWxhckZpbGVVcGxvYWQnLFxuXG4gICdtYWluJyxcbiAgJ2FjY291bnRzJyxcbiAgJ2FkbWluJyxcbiAgJ2F1dGgnLFxuICAndmFsaWRhdGlvbidcbl0pO1xuXG4iLCJhbmd1bGFyLm1vZHVsZSgnYWNjb3VudHMnLCBbICdyZXN0YW5ndWxhcicsIF0pOyIsInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYWRtaW4nLCBbXG4gICduZ0Nvb2tpZXMnLFxuICAncmVzdGFuZ3VsYXInLFxuICAnTG9jYWxTdG9yYWdlTW9kdWxlJyxcbiAgJ2F1dGgnXG5dKTsiLCJ2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2F1dGgnLCBbXG4gICduZ0Nvb2tpZXMnLFxuICAncmVzdGFuZ3VsYXInLFxuICAnTG9jYWxTdG9yYWdlTW9kdWxlJyxcbiAgJ2h0dHAtYXV0aC1pbnRlcmNlcHRvcidcbl0pOyIsInZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnbWFpbicsIFtcbiAgJ25nQ29va2llcycsXG4gICdyZXN0YW5ndWxhcicsXG4gICdMb2NhbFN0b3JhZ2VNb2R1bGUnLFxuICAnYW5ndWxhckZpbGVVcGxvYWQnXG5dKTsiLCJ2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ3ZhbGlkYXRpb24nLCBbXG4gICdyZXN0YW5ndWxhcicsXG4gICdMb2NhbFN0b3JhZ2VNb2R1bGUnLFxuXSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG5cbi5jb25maWcoZnVuY3Rpb24oJGludGVycG9sYXRlUHJvdmlkZXIpIHtcbiAgJGludGVycG9sYXRlUHJvdmlkZXIuc3RhcnRTeW1ib2woJ3tAJyk7XG4gICAgJGludGVycG9sYXRlUHJvdmlkZXIuZW5kU3ltYm9sKCdAfScpO1xufSlcblxuLmNvbmZpZyhbJ1Jlc3Rhbmd1bGFyUHJvdmlkZXInLCBmdW5jdGlvbiAoUmVzdGFuZ3VsYXJQcm92aWRlcikge1xuICBSZXN0YW5ndWxhclByb3ZpZGVyLnNldEZ1bGxSZXNwb25zZSh0cnVlKTtcbiAgUmVzdGFuZ3VsYXJQcm92aWRlci5zZXRCYXNlVXJsKCdhcGknKTtcbiAgUmVzdGFuZ3VsYXJQcm92aWRlci5zZXRSZXF1ZXN0U3VmZml4KCcvJyk7XG59XSlcblxuLmNvbmZpZyhbJyRodHRwUHJvdmlkZXInLCBmdW5jdGlvbigkaHR0cFByb3ZpZGVyKSB7XG4gICRodHRwUHJvdmlkZXIuaW50ZXJjZXB0b3JzLnB1c2goJ2F1dGhJbnRlcmNlcHRvcicpO1xuXG4gICRodHRwUHJvdmlkZXIuZGVmYXVsdHMueHNyZkNvb2tpZU5hbWUgPSAnY3NyZnRva2VuJztcbiAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy54c3JmSGVhZGVyTmFtZSA9ICdYLUNTUkZUb2tlbic7XG59XSk7XG5cbmpRdWVyeSgnLmRhdGV0aW1lcGlja2VyJykuZGF0ZXRpbWVwaWNrZXIoe1xuICBvbkdlbmVyYXRlOlxuICBmdW5jdGlvbiggY3QgKSB7XG4gICAgalF1ZXJ5KHRoaXMpLmZpbmQoJy54ZHNvZnRfZGF0ZS54ZHNvZnRfd2Vla2VuZCcpLmFkZENsYXNzKCd4ZHNvZnRfZGlzYWJsZWQnKTsgXG4gIH0sXG4gIGZvcm1hdDpcIlktbS1kXFxcXFRIOmlcIixcbiAgbGFuZzogJ3J1JyxcbiAgbWluVGltZTonMTA6MDAnLFxuICBtYXhUaW1lOicyMTowMCcsXG4gIHRpbWVwaWNrZXJTY3JvbGxiYXI6J2ZhbHNlJyxcbiAgZGF5T2ZXZWVrU3RhcnQ6IDFcbn0pO1xuIiwiXCJ1c2Ugc3RpY3RcIlxuXG5hbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgLmNvbmZpZyhbJyRyb3V0ZVByb3ZpZGVyJywgZnVuY3Rpb24oJHJvdXRlUHJvdmlkZXIpIHtcbiAgICAkcm91dGVQcm92aWRlclxuXG4gICAgICAud2hlbignLycsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvbWFpbi90ZW1wbGF0ZXMvbWFpbi5odG1sJ1xuICAgICAgfSlcblxuICAgICAgLy8gQWRtaW5pc3RyYXRpb24gc2lkZSBvZiBzaXRlXG4gICAgICAud2hlbignL3JlZ2lzdHJhdGlvbicsICB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2FkbWluL3RlbXBsYXRlcy9yZWdpc3RyYXRpb24uaHRtbCcsXG4gICAgICAgIHBlcm1pc3Npb246ICdzdGFmZidcbiAgICAgIH0pXG5cbiAgICAgIC53aGVuKCcvbm90aWZpY2F0aW9ucycsICB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2FkbWluL3RlbXBsYXRlcy9hZG1pbl9ub3RpZmljYXRpb25zLmh0bWwnLFxuICAgICAgICBwZXJtaXNzaW9uOiAnc3RhZmYnXG4gICAgICB9KVxuXG4gICAgICAud2hlbignL29yZGVyLWNvbnRhaW5lci86b3JkZXJDb250YWluZXJJZCcsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvYWRtaW4vdGVtcGxhdGVzL2FkbWluX29yZGVyX2NvbnRhaW5lcl9kZXRhaWwuaHRtbCcsXG4gICAgICAgIHBlcm1pc3Npb246ICdzdGFmZidcbiAgICAgIH0pXG5cbiAgICAgIC53aGVuKCcvb3JkZXItY29udGFpbmVyLzpvcmRlckNvbnRhaW5lcklkL3NjaGVkdWxlJywge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9hZG1pbi90ZW1wbGF0ZXMvc2NoZWR1bGUuaHRtbCcsXG4gICAgICAgIHBlcm1pc3Npb246ICdzdGFmZidcbiAgICAgIH0pXG5cbiAgICAgIC53aGVuKCcvb3JkZXItY29udGFpbmVyLzpvcmRlckNvbnRhaW5lcklkL3NjaGVkdWxlLzpzY2hlZHVsZUlkJywgIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvYWRtaW4vdGVtcGxhdGVzL2RlbGl2ZXJ5Lmh0bWwnLFxuICAgICAgICBwZXJtaXNzaW9uOiAnc3RhZmYnXG4gICAgICB9KVxuXG4gICAgICAud2hlbignL29yZGVyLWNvbnRhaW5lci86b3JkZXJDb250YWluZXJJZC9vcmRlcnMvOm9yZGVySWQnLCAge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9hZG1pbi90ZW1wbGF0ZXMvYWRtaW5fY29tcGFuaWVzX29yZGVyX2RldGFpbC5odG1sJyxcbiAgICAgICAgcGVybWlzc2lvbjogJ3N0YWZmJ1xuICAgICAgfSlcblxuICAgICAgLndoZW4oJy9jdXN0b21lcnMnLCAge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9hZG1pbi90ZW1wbGF0ZXMvY3VzdG9tZXJzX2xpc3QuaHRtbCcsXG4gICAgICAgIHBlcm1pc3Npb246ICdzdGFmZidcbiAgICAgIH0pXG5cbiAgICAgIC53aGVuKCcvY3VzdG9tZXIvOmN1c3RvbWVySWQnLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2FkbWluL3RlbXBsYXRlcy9jdXN0b21lcl9hY2NvdW50Lmh0bWwnLFxuICAgICAgICBwZXJtaXNzaW9uOiAnc3RhZmYnXG4gICAgICB9KVxuXG4gICAgICAud2hlbignL2NvbXBhbmllcycsICB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2FkbWluL3RlbXBsYXRlcy9hZG1pbl9jb21wYW5pZXNfbGlzdC5odG1sJyxcbiAgICAgICAgcGVybWlzc2lvbjogJ3N0YWZmJ1xuICAgICAgfSlcblxuICAgICAgLndoZW4oJy9jb21wYW5pZXMvYWRkJywge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9hZG1pbi90ZW1wbGF0ZXMvYWRtaW5fY29tcGFuaWVzX2FkZC5odG1sJyxcbiAgICAgICAgcGVybWlzc2lvbjogJ3N0YWZmJ1xuICAgICAgfSlcblxuICAgICAgLndoZW4oJy9jb21wYW5pZXMvOmNvbXBhbnlJZCcsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvYWRtaW4vdGVtcGxhdGVzL2FkbWluX2NvbXBhbmllc19kZXRhaWwuaHRtbCcsXG4gICAgICAgIHBlcm1pc3Npb246ICdzdGFmZidcbiAgICAgIH0pXG5cbiAgICAgIC53aGVuKCcvZmFzdC1vcmRlcicsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvYWRtaW4vdGVtcGxhdGVzL2Zhc3Rfb3JkZXIuaHRtbCcsXG4gICAgICAgIHBlcm1pc3Npb246ICdzdGFmZidcbiAgICAgIH0pXG5cbiAgICAgIC8vIFVzZXJzIHNpZGUgb2Ygd2Vic2l0ZVxuICAgICAgLndoZW4oJy9leHByZXNzLXRhcmlmZicsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzcmMvYWNjb3VudHMvdGVtcGxhdGVzL2FjY291bnRfZXhwcmVzc190YXJpZmYuaHRtbCcsXG4gICAgICAgIHBlcm1pc3Npb246ICdjdXN0b21lcidcbiAgICAgIH0pXG5cbiAgICAgIC53aGVuKCcvb3JkZXJzJywge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9hY2NvdW50cy90ZW1wbGF0ZXMvYWNjb3VudF9vcmRlcnNfbGlzdC5odG1sJyxcbiAgICAgICAgcGVybWlzc2lvbjogJ2N1c3RvbWVyJ1xuICAgICAgfSlcblxuICAgICAgLndoZW4oJy9vcmRlcnMvY3JlYXRlJywge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9hY2NvdW50cy90ZW1wbGF0ZXMvYWNjb3VudF9vcmRlcl9jb250YWluZXIuaHRtbCcsXG4gICAgICAgIHBlcm1pc3Npb246ICdjdXN0b21lcidcbiAgICAgIH0pXG5cbiAgICAgIC53aGVuKCcvb3JkZXJzLzpvcmRlcklkJywge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3NyYy9hY2NvdW50cy90ZW1wbGF0ZXMvYWNjb3VudF9vcmRlcl9lZGl0Lmh0bWwnLFxuICAgICAgICBwZXJtaXNzaW9uOiAnY3VzdG9tZXInXG4gICAgICB9KVxuXG4gICAgICAud2hlbignL3Byb2ZpbGUnLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc3JjL2FjY291bnRzL3RlbXBsYXRlcy9hY2NvdW50X3Byb2ZpbGUuaHRtbCcsXG4gICAgICAgIHBlcm1pc3Npb246ICdjdXN0b21lcidcbiAgICAgIH0pXG5cbiAgICAgIC5vdGhlcndpc2Uoe3JlZGlyZWN0VG86ICcvJ30pO1xuICB9XSlcblxuICAuY29udHJvbGxlcignQXBwQ3RyJywgZnVuY3Rpb24gKCRzY29wZSwgJGxvY2F0aW9uLCBwZXJtaXNzaW9ucywgYXBpLCBVc2VyKSB7XG4gICAgJHNjb3BlLiRvbignJHJvdXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoc2NvcGUsIG5leHQpIHtcbiAgICAgIGFwaS5hbGwoJ3Byb2ZpbGUnKS5jdXN0b21HRVQoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgIHBlcm1pc3Npb25zLnNldFBlcm1pc3Npb25zKHJlc3BvbnNlLmRhdGEucGVybWlzc2lvbnNfbmFtZXMpXG4gICAgICAgIHZhciBwZXJtaXNzaW9uID0gbmV4dC4kJHJvdXRlLnBlcm1pc3Npb247XG4gICAgICAgIGlmKF8uaXNTdHJpbmcocGVybWlzc2lvbikgJiYgIXBlcm1pc3Npb25zLmhhc1Blcm1pc3Npb24ocGVybWlzc2lvbikpIHtcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnIycpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwZXJtaXNzaW9ucy5oYXNQZXJtaXNzaW9uKCdzdGFmZicpKSB7XG4gICAgICAgICAgVXNlci5nZXRBc3luYygpLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGFwaS5hbGwoJ25vdGlmaWNhdGlvbnMnKS5jdXN0b21HRVQoJycsIHtvcmRlcmluZzogJy10aW1lJywgY2hlY2tlZDogJ0ZhbHNlJywgbWFuYWdlcjogVXNlci5nZXQoKS5pZH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgJHNjb3BlLm5vdGlmeSA9IHJlc3BvbnNlLmRhdGEubGVuZ3RoO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH0pO1xuICB9KVxuXG4iLCJcInVzZSBzdGljdFwiXG5cbmFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuICAuZmFjdG9yeSgnYXBpJywgZnVuY3Rpb24oUmVzdGFuZ3VsYXIpIHtcbiAgICByZXR1cm4gUmVzdGFuZ3VsYXIud2l0aENvbmZpZyhmdW5jdGlvbihSZXN0YW5ndWxhckNvbmZpZ3VyZXIpIHtcbiAgICAgIFJlc3Rhbmd1bGFyQ29uZmlndXJlci5zZXRGdWxsUmVzcG9uc2UodHJ1ZSk7XG4gICAgICBSZXN0YW5ndWxhckNvbmZpZ3VyZXIuc2V0QmFzZVVybCgnYXBpJyk7XG4gICAgfSk7XG4gIH0pXG5cbiAgLmZhY3RvcnkoJ1BhcGEnLCBbJyR3aW5kb3cnLFxuICAgIGZ1bmN0aW9uKCR3aW5kb3cpIHtcbiAgICAgIHJldHVybiAkd2luZG93LlBhcGE7XG4gICAgfVxuICBdKTtcbiIsIid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyLm1vZHVsZSgnYWNjb3VudHMnKVxuXG5cbiAgLmNvbnRyb2xsZXIoJ09yZGVyc0N0cicsIGZ1bmN0aW9uKCRzY29wZSwgYXBpLCBVc2VyKSB7XG4gICAgVXNlci5nZXRBc3luYygpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICBhcGkuYWxsKCdvcmRlcl9jb250YWluZXInKS5jdXN0b21HRVQoJycsIHtjb21wYW55OiBVc2VyLmdldCgpLmNvbXBhbnl9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICRzY29wZS5kYXRhID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KVxuXG5cbiAgLmNvbnRyb2xsZXIoJ0NyZWF0ZU9yZGVyc0N0cicsIGZ1bmN0aW9uKCRzY29wZSwgYXBpLCAkcm91dGVQYXJhbXMpIHtcbiAgICAkc2NvcGUuc2VuZGZvcm0gPSBmdW5jdGlvbigpIHtcbiAgICAgIGFwaS5vbmUoJ29yZGVyX2NvbnRhaW5lcicsICRyb3V0ZVBhcmFtcy5vcmRlcklkKS5hbGwoJ29yZGVycycpLmN1c3RvbVBPU1QoJHNjb3BlLmZvcm0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIGFsZXJ0KCfQl9Cw0LrQsNC3INC00L7QsdCw0LLQu9C10L0nKTtcbiAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICBhbGVydCgnZXJyb3InKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pXG5cblxuICAuY29udHJvbGxlcignUHJpY2VMaXN0Q3RyJywgZnVuY3Rpb24oJHNjb3BlLCBhcGkpIHtcbiAgICBhcGkuYWxsKCdleHByZXNzLXRhcmlmZi8nKS5jdXN0b21HRVQoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICRzY29wZS5kYXRhID0gcmVzcG9uc2UuZGF0YTtcbiAgICB9KTtcbiAgfSlcblxuXG4gIC5jb250cm9sbGVyKCdQcm9maWxlQ3RyJywgZnVuY3Rpb24oJHNjb3BlLCBhcGkpIHtcbiAgICBhcGkuYWxsKCdwcm9maWxlLycpLmN1c3RvbUdFVCgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgJHNjb3BlLmRhdGEgPSByZXNwb25zZS5kYXRhO1xuICAgICAgYXBpLmFsbCgnY29tcGFuaWVzJykuY3VzdG9tR0VUKCRzY29wZS5kYXRhLmNvbXBhbnkpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHskc2NvcGUuY29tcGFueT1yZXNwb25zZS5kYXRhfSlcbiAgICB9KTtcbiAgfSlcblxuXG4gIC5jb250cm9sbGVyKCdGaWxlVXBsb2FkQ3RyJywgZnVuY3Rpb24oJHNjb3BlLCBhcGksIEZpbGVVcGxvYWRlciwgbG9jYWxTdG9yYWdlU2VydmljZSwgJHJvdXRlUGFyYW1zKSB7XG4gICAgJHNjb3BlLnBvc3RJdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKClcbiAgICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsICRzY29wZS5maWxlKVxuICAgICAgZm9ybURhdGEuYXBwZW5kKCduYW1lJywgJHNjb3BlLmZpbGUubmFtZSlcbiAgICB9XG4gICAgJHNjb3BlLnVwbG9hZGVyID0gbmV3IEZpbGVVcGxvYWRlcihcbiAgICAgIHtcbiAgICAgICAgdXJsOicvYXBpL29yZGVyX2NvbnRhaW5lci8nKyAkcm91dGVQYXJhbXMub3JkZXJJZCArJy9maWxldXBsb2FkLycsXG4gICAgICAgIGZvcm1EYXRhOiBbe2RhdGE6ICdzb21lZGF0YSd9LCRzY29wZS5mb3JtXSxcbiAgICAgICAgcmVtb3ZlQWZ0ZXJVcGxvYWQ6IHRydWUsXG4gICAgICAgIGhlYWRlcnM6IHtBdXRob3JpemF0aW9uOiBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgndG9rZW4nKX0sXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnXG4gICAgICB9KTtcbiAgfSlcblxuXG4gIC5jb250cm9sbGVyKCdBY2NvdW50T3JkZXJDb250YWluZXJDdHInLCBmdW5jdGlvbigkc2NvcGUsIGFwaSwgJGxvY2F0aW9uKSB7XG4gICAgJHNjb3BlLmFkZE9yZGVyQ29udGFpbmVyID0gZnVuY3Rpb24oKSB7XG4gICAgICBhcGkuYWxsKCdvcmRlcl9jb250YWluZXInKS5jdXN0b21QT1NUKCRzY29wZS5mb3JtKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblxuICAgICAgICAkbG9jYXRpb24ucGF0aCgnL29yZGVycy8nICsgcmVzcG9uc2UuZGF0YS5pZClcbiAgICAgIH0sIGZ1bmN0aW9uKCkge2FsZXJ0KCdlcnJvcicpO30pO1xuICAgIH1cbiAgfSlcblxuXG4gIC5jb250cm9sbGVyKCdBY2NvdW50T3JkZXJFZGl0Q3RyJywgZnVuY3Rpb24oJHNjb3BlLCBhcGksICRyb3V0ZVBhcmFtcykge1xuICAgIGFwaS5hbGwoJ29yZGVyX2NvbnRhaW5lcicpLmN1c3RvbUdFVCgkcm91dGVQYXJhbXMub3JkZXJJZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLmRhdGEgPSByZXNwb25zZS5kYXRhO1xuICAgIH0pXG4gIH0pXG5cblxuICAuY29udHJvbGxlcignTW9kYWxEZW1vQ3RyJywgZnVuY3Rpb24gKCRzY29wZSwgJG1vZGFsLCAkbG9nKSB7XG5cbiAgICAkc2NvcGUuaXRlbXMgPSBbJ2l0ZW0xJywgJ2l0ZW0yJywgJ2l0ZW0zJ107XG5cbiAgICAkc2NvcGUub3BlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3N0YXRpYy9zcmMvYWNjb3VudHMvdGVtcGxhdGVzL2FjY291bnRfb3JkZXJfbW9kYWwuaHRtbCcsXG4gICAgICAgIGNvbnRyb2xsZXI6ICdNb2RhbEluc3RhbmNlQ3RyJyxcbiAgICAgICAgcmVzb2x2ZToge1xuICAgICAgICAgIGl0ZW1zOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gJHNjb3BlLml0ZW1zO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oZnVuY3Rpb24gKHNlbGVjdGVkSXRlbSkge1xuICAgICAgICAkc2NvcGUuc2VsZWN0ZWQgPSBzZWxlY3RlZEl0ZW07XG4gICAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICRsb2cuaW5mbygnTW9kYWwgZGlzbWlzc2VkIGF0OiAnICsgbmV3IERhdGUoKSk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9KVxuXG5cbiAgLmNvbnRyb2xsZXIoJ01vZGFsSW5zdGFuY2VDdHInLCBmdW5jdGlvbiAoJHNjb3BlLCAkbW9kYWxJbnN0YW5jZSwgaXRlbXMpIHtcblxuICAgICRzY29wZS5pdGVtcyA9IGl0ZW1zO1xuICAgICRzY29wZS5zZWxlY3RlZCA9IHtcbiAgICAgIGl0ZW06ICRzY29wZS5pdGVtc1swXVxuICAgIH07XG5cbiAgICAkc2NvcGUub2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkbW9kYWxJbnN0YW5jZS5jbG9zZSgkc2NvcGUuc2VsZWN0ZWQuaXRlbSk7XG4gICAgfTtcblxuICAgICRzY29wZS5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAkbW9kYWxJbnN0YW5jZS5kaXNtaXNzKCdjYW5jZWwnKTtcbiAgICB9O1xuICB9KSIsIid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyLm1vZHVsZSgnYWRtaW4nKVxuXG5cbiAgLmNvbnRyb2xsZXIoJ0RlbGl2ZXJ5Q3RyJywgZnVuY3Rpb24oJHNjb3BlLCBhcGksICRyb3V0ZVBhcmFtcyl7XG4gICAgYXBpLmFsbCgnZXhwcmVzcy10YXJpZmYnKS5jdXN0b21HRVQoJycpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgJHNjb3BlLnRhcmlmcyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgfSlcbiAgICAkc2NvcGUuZm9ybSA9IHt9O1xuICAgIHZhciBnZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGFwaS5vbmUoJ29yZGVyX2NvbnRhaW5lcicsICRyb3V0ZVBhcmFtcy5vcmRlckNvbnRhaW5lcklkKS5vbmUoJ3NjaGVkdWxlJywgJHJvdXRlUGFyYW1zLnNjaGVkdWxlSWQpLmN1c3RvbUdFVCgnZGVsaXZlcnknKVxuICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICRzY29wZS5kYXRhID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBnZXQoKTtcbiAgICAkc2NvcGUuYWRkID0gZnVuY3Rpb24oKSB7XG4gICAgICBhcGkub25lKCdvcmRlcl9jb250YWluZXInLCAkcm91dGVQYXJhbXMub3JkZXJDb250YWluZXJJZCkub25lKCdzY2hlZHVsZScsICRyb3V0ZVBhcmFtcy5zY2hlZHVsZUlkKVxuICAgICAgICAuYWxsKCdkZWxpdmVyeScpLmN1c3RvbVBPU1QoJHNjb3BlLmZvcm0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIGFsZXJ0KCdzdWNjZXNzJyk7XG4gICAgICAgIGdldCgpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSlcblxuXG4gIC5jb250cm9sbGVyKCdDdXN0b21lcnNDdHInLCBmdW5jdGlvbigkc2NvcGUsIGFwaSwgJGxvY2F0aW9uKSB7XG4gICAgdmFyIGdldCA9IGZ1bmN0aW9uKHNlYXJjaF9wYXJhbXMsIHBlcm1pc3Npb25zX2xpc3QpIHtcbiAgICAgIGFwaS5hbGwoJ3VzZXJzJykuY3VzdG9tR0VUKCcnLCB7XG4gICAgICAgIHBlcm1pc3Npb25zX19wZXJtaXNzaW9uOiBwZXJtaXNzaW9uc19saXN0LFxuICAgICAgICBvcmRlcmluZzogJ2lkJywgc2VhcmNoOiBzZWFyY2hfcGFyYW1zfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICRzY29wZS5kYXRhID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgICRzY29wZS5kZWxldGUgPSBmdW5jdGlvbihpZCkge1xuICAgICAgYXBpLmFsbCgndXNlcnMnKS5jdXN0b21ERUxFVEUoaWQpLnRoZW4oZnVuY3Rpb24oKXtnZXQoJHNjb3BlLnNlYXJjaCl9KVxuICAgIH1cbiAgICBnZXQoKTtcbiAgICAkc2NvcGUuZ2V0ID0gZnVuY3Rpb24oKXtnZXQoJHNjb3BlLnNlYXJjaCl9O1xuICAgICRzY29wZS5zaG93Q2xpZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAkbG9jYXRpb24ucGF0aCgnIy9jdXN0b21lcnMnKTtcbiAgICB9O1xuICB9KVxuXG5cbiAgLmNvbnRyb2xsZXIoJ1NjaGVkdWxlQ3RyJywgZnVuY3Rpb24oJHNjb3BlLCBhcGksICRyb3V0ZVBhcmFtcykge1xuICAgICRzY29wZS5mb3JtID0ge307XG4gICAgdmFyIGdldFNoZWR1bGUgPSBmdW5jdGlvbigpe1xuICAgICAgYXBpLm9uZSgnb3JkZXJfY29udGFpbmVyJywgJHJvdXRlUGFyYW1zLm9yZGVyQ29udGFpbmVySWQpLmFsbCgnc2NoZWR1bGUnKS5jdXN0b21HRVQoJycsIHtvcmRlcmluZzogJ2RhdGUnfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICRzY29wZS5zaGVkdWxlID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBnZXRTaGVkdWxlKCk7XG4gICAgJHNjb3BlLmFkZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgYXBpLm9uZSgnb3JkZXJfY29udGFpbmVyJywgJHJvdXRlUGFyYW1zLm9yZGVyQ29udGFpbmVySWQpLmFsbCgnc2NoZWR1bGUnKS5jdXN0b21QT1NUKCRzY29wZS5mb3JtKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBhbGVydCgnc3VjY2VzcycpO1xuICAgICAgICBnZXRTaGVkdWxlKCk7XG4gICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICBhbGVydCgnZXJyb3InKTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICBhcGkub25lKCdvcmRlcl9jb250YWluZXInLCAkcm91dGVQYXJhbXMub3JkZXJDb250YWluZXJJZCkuYWxsKCdzY2hlZHVsZScpLmN1c3RvbURFTEVURShpZCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgZ2V0U2hlZHVsZSgpO1xuICAgICAgfSlcbiAgICB9XG4gIH0pXG5cblxuICAuY29udHJvbGxlcignUmVnaXN0cmF0aW9uQ3RyJywgZnVuY3Rpb24oJHNjb3BlLCBhcGkpe1xuICAgICRzY29wZS5mb3JtID0ge307XG5cbiAgICB2YXIgYWRkQ3VzdG9tZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJHNjb3BlLmZvcm0udXNlci5wZXJtaXNzaW9ucyA9IFsyLF1cbiAgICAgICAgYXBpLmFsbCgnc2luZ3VwJykuY3VzdG9tUE9TVCgkc2NvcGUuZm9ybS51c2VyKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgYWxlcnQoJ3N1Y2Nlc3MnKTtcbiAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICBhbGVydCgnZXJyb3InKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICAkc2NvcGUuc2lnbnVwID0gZnVuY3Rpb24oKSB7XG4gICAgICBhZGRDdXN0b21lcigpO1xuICAgIH07XG5cbiAgfSlcblxuXG4gIC5jb250cm9sbGVyKCdDdXN0b21lckFjY291bnRDdHInLCBmdW5jdGlvbigkc2NvcGUsIGFwaSwgJHJvdXRlUGFyYW1zKXtcbiAgICAkc2NvcGUuZWRpdCA9IGZhbHNlO1xuICAgICRzY29wZS5zdGFydEVkaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICRzY29wZS5lZGl0ID0gdHJ1ZTtcbiAgICB9O1xuICAgIHZhciBnZXRVc2VyID0gZnVuY3Rpb24oKSB7XG4gICAgICBhcGkuYWxsKCd1c2VycycpLmN1c3RvbUdFVCgkcm91dGVQYXJhbXMuY3VzdG9tZXJJZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICRzY29wZS5kYXRhID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICBnZXRVc2VyKCk7XG4gICAgYXBpLmFsbCgncGVybWlzc2lvbnMnKS5jdXN0b21HRVQoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICRzY29wZS5wZXJtaXNzaW9ucyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgfSk7XG4gICAgYXBpLmFsbCgnY29tcGFuaWVzJykuY3VzdG9tR0VUKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLmNvbXBhbmllcyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgfSlcbiAgICAkc2NvcGUucHV0VXNlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgZm9ybSA9IHtcbiAgICAgICAgXCJjb21wYW55XCI6ICRzY29wZS5kYXRhLmNvbXBhbnksXG4gICAgICAgIFwiZGF0ZV9qb2luZWRcIjogJHNjb3BlLmRhdGEuZGF0ZV9qb2luZWQsXG4gICAgICAgIFwiZW1haWxcIjogJHNjb3BlLmRhdGEuZW1haWwsXG4gICAgICAgIFwiZmlyc3RfbmFtZVwiOiAkc2NvcGUuZGF0YS5maXJzdF9uYW1lLFxuICAgICAgICBcImxhc3RfbmFtZVwiOiAkc2NvcGUuZGF0YS5sYXN0X25hbWUsXG4gICAgICAgIFwicGVybWlzc2lvbnNcIjogWyRzY29wZS5kYXRhLnBlcm1pc3Npb25zLF0sXG4gICAgICAgIFwiaWRcIjogJHNjb3BlLmRhdGEuaWRcbiAgICAgIH1cbiAgICAgIGFwaS5hbGwoJ3VzZXJzJykuY3VzdG9tUFVUKGZvcm0sICRyb3V0ZVBhcmFtcy5jdXN0b21lcklkKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICRzY29wZS5lZGl0ID0gZmFsc2U7XG4gICAgICAgIGdldFVzZXIoKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pXG5cblxuICAuY29udHJvbGxlcignT3JkZXJzTGlzdEN0cicsIGZ1bmN0aW9uKCRzY29wZSwgYXBpLCAkcm91dGVQYXJhbXMpIHtcbiAgICBhcGkuYWxsKCdvcmRlcnMtbGlzdCcpLmN1c3RvbUdFVCgnJywge293bmVyX19pZDogJHJvdXRlUGFyYW1zLmN1c3RvbWVySWR9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgJHNjb3BlLmRhdGEgPSByZXNwb25zZS5kYXRhO1xuICAgICAgfSlcbiAgfSlcblxuXG4gIC5jb250cm9sbGVyKCdGYXN0T3JkZXJDdHInLCBmdW5jdGlvbigkc2NvcGUsIGFwaSkge1xuICAgICRzY29wZS5mb3JtU3RhdGUgPSB7XG4gICAgICBBZGRlZFVzZXI6IHt9LFxuICAgICAgcmVnaXN0cmF0aW9uSXNEb25lOiBmYWxzZSxcbiAgICB9O1xuICAgICRzY29wZS5hZGRVc2VyID0gZnVuY3Rpb24oKXtcbiAgICAgICRzY29wZS51c2VyLnBlcm1zc2lvbnMgPSBbMV07XG4gICAgICBhcGkuYWxsKCdzaW5ndXAnKS5jdXN0b21QT1NUKCRzY29wZS51c2VyKVxuICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgJHNjb3BlLmZvcm1TdGF0ZS5yZWdpc3RyYXRpb25Jc0RvbmUgPSB0cnVlO1xuICAgICAgICAgICRzY29wZS5mb3JtU3RhdGUuQWRkZWRVc2VyID0gcmVzcG9uc2UuZGF0YVxuICAgICAgICAgIGFsZXJ0KCdzdWNjZXNzJyk7XG4gICAgICAgICAgY29uc29sZS5sb2coJHNjb3BlLmZvcm1TdGF0ZSwgcmVzcG9uc2UpO1xuICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgIGFsZXJ0KCdlcnJvcicpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgJHNjb3BlLnNlbmRmb3JtID0gZnVuY3Rpb24oKSB7XG4gICAgICBhcGkuYWxsKCdvcmRlcnMvJykuY3VzdG9tUE9TVCgkc2NvcGUuZm9ybSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgYWxlcnQoJ9CX0LDQutCw0Lcg0LTQvtCx0LDQstC70LXQvScpO1xuICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGFsZXJ0KCdlcnJvcicpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSlcblxuXG4gIC5jb250cm9sbGVyKCdDb21wYW5pZXNMaXN0Q3RyJywgZnVuY3Rpb24oJHNjb3BlLCBhcGksIFVzZXIpIHtcbiAgICBVc2VyLnVwZGF0ZVVzZXIoKTtcbiAgICB2YXIgZ2V0Q29tcGFueSA9IGZ1bmN0aW9uKHBhcmFtcykge1xuICAgICAgYXBpLmFsbCgnY29tcGFuaWVzJykuY3VzdG9tR0VUKCcnLCB7c2VhcmNoOiBwYXJhbXN9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgJHNjb3BlLmRhdGEgPSByZXNwb25zZS5kYXRhO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBnZXRDb21wYW55KCk7XG4gICAgJHNjb3BlLmRlbGV0ZUNvbXBhbnkgPSBmdW5jdGlvbihpZCkge1xuICAgICAgYXBpLmFsbCgnY29tcGFuaWVzJykuY3VzdG9tREVMRVRFKGlkKS50aGVuKGZ1bmN0aW9uKCl7Z2V0Q29tcGFueSgpO30pXG4gICAgfVxuICAgICRzY29wZS5nZXQgPSBmdW5jdGlvbihpdGVtKSB7Z2V0Q29tcGFueShpdGVtKX07XG4gIH0pXG5cblxuICAuY29udHJvbGxlcignQ29tcGFuaWVzRGV0YWlsQ3RyJywgZnVuY3Rpb24oJHNjb3BlLCBhcGksICRyb3V0ZVBhcmFtcykge1xuICAgIGFwaS5hbGwoJ2NvbXBhbmllcycpLmN1c3RvbUdFVCgkcm91dGVQYXJhbXMuY29tcGFueUlkKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICRzY29wZS5kYXRhID0gcmVzcG9uc2UuZGF0YVxuICAgIH0pO1xuICAgIGFwaS5hbGwoJ29yZGVyX2NvbnRhaW5lcicpLmN1c3RvbUdFVCgnJywge1xuICAgICAgY29tcGFueTokcm91dGVQYXJhbXMuY29tcGFueUlkfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUub3JkZXJfY29udGFpbmVycyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICB9KTtcbiAgICBhcGkuYWxsKCd1c2VycycpLmN1c3RvbUdFVCgnJywge2NvbXBhbnk6ICRyb3V0ZVBhcmFtcy5jb21wYW55SWR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICRzY29wZS51c2VycyA9IHJlc3BvbnNlLmRhdGFcbiAgICB9KVxuXG4gIH0pXG5cblxuICAuY29udHJvbGxlcignQ29tcGFuaWVzQWRkQ3RyJywgZnVuY3Rpb24oJHNjb3BlLCBhcGkpIHtcbiAgICAkc2NvcGUuYWRkQ29tcGFueSA9IGZ1bmN0aW9uKCkge1xuICAgICAgYXBpLmFsbCgnY29tcGFuaWVzJykuY3VzdG9tUE9TVCgkc2NvcGUuZm9ybSkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICBhbGVydCgnc3VjY2VzcycpO1xuICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIGFsZXJ0KCdlcnJvcicpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KVxuXG4gIC5jb250cm9sbGVyKCdPcmRlckNvbnRhaW5lckN0cicsIGZ1bmN0aW9uKCRzY29wZSwgYXBpLCAkcm91dGVQYXJhbXMpIHtcbiAgICAkc2NvcGUuZGF0YSA9IHt9XG4gICAgdmFyIG9yZGVyQ29udGFpbmVyID0gYXBpLm9uZSgnb3JkZXJfY29udGFpbmVyJywgJHJvdXRlUGFyYW1zLm9yZGVyQ29udGFpbmVySWQpO1xuICAgIG9yZGVyQ29udGFpbmVyLmN1c3RvbUdFVCgnJykudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLmRhdGEub3JkZXJDb250YWluZXJzID0gcmVzcG9uc2UuZGF0YTtcbiAgICB9KTtcbiAgICBvcmRlckNvbnRhaW5lci5hbGwoJ2ZpbGV1cGxvYWQnKS5jdXN0b21HRVQoJycpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5kYXRhLmZpbGVzID0gcmVzcG9uc2UuZGF0YTtcbiAgICB9KTtcbiAgICBvcmRlckNvbnRhaW5lci5hbGwoJ29yZGVycycpLmN1c3RvbUdFVCgnJykudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLmRhdGEub3JkZXJzID0gcmVzcG9uc2UuZGF0YTtcbiAgICB9KTtcbiAgICBvcmRlckNvbnRhaW5lci5hbGwoJ3NjaGVkdWxlJykuY3VzdG9tR0VUKCcnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUuZGF0YS5zY2hlZHVsZSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgfSk7XG4gICAgb3JkZXJDb250YWluZXIuYWxsKCdzdGF0dXMnKS5jdXN0b21HRVQoJycpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5kYXRhLnN0YXR1cyA9IHJlc3BvbnNlLmRhdGFcbiAgICB9KVxuICB9KVxuXG5cbiAgLmNvbnRyb2xsZXIoJ05vdGlmaWNhdGlvbnNDdHInLCBmdW5jdGlvbigkc2NvcGUsIGFwaSwgVXNlcikge1xuICAgIHZhciBnZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGFwaS5hbGwoJ25vdGlmaWNhdGlvbnMnKS5jdXN0b21HRVQoJycsIHtvcmRlcmluZzogJy10aW1lJywgY2hlY2tlZDogJ0ZhbHNlJywgbWFuYWdlcjogVXNlci5nZXQoKS5pZH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAkc2NvcGUuZGF0YSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICB9KTtcbiAgICAgICRzY29wZS5oZWxsbyA9ICgnaGVsbG8gdGhlcmUnKTtcbiAgICB9O1xuICAgIFVzZXIuZ2V0QXN5bmMoKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICBnZXQoKTtcbiAgICB9KTtcbiAgICAkc2NvcGUuZGVsZXRlID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgIGFwaS5hbGwoJ25vdGlmaWNhdGlvbnMnKS5jdXN0b21ERUxFVEUoaWQpLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgIGdldCgpO30pXG4gICAgfVxuICB9KVxuXG5cbiAgLmNvbnRyb2xsZXIoJ09yZGVyRGV0YWlsQ3RyJywgZnVuY3Rpb24oJHNjb3BlLCBhcGksICRyb3V0ZVBhcmFtcykge1xuICAgIGFwaS5vbmUoJ29yZGVyX2NvbnRhaW5lcicsICRyb3V0ZVBhcmFtcy5vcmRlckNvbnRhaW5lcklkKS5vbmUoJ29yZGVycycsICRyb3V0ZVBhcmFtcy5vcmRlcklkKS5jdXN0b21HRVQoJycpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgJHNjb3BlLm9yZGVyID0gcmVzcG9uc2UuZGF0YVxuICAgICAgfSlcbiAgfSlcbiIsIid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyLm1vZHVsZSgnYWRtaW4nKVxuXG5cbiAgLmZpbHRlcignYm9vbDJpY29uJywgZnVuY3Rpb24gKCkge1xuICAgIC8vIGZ1bmN0aW9uIHRoYXQncyBpbnZva2VkIGVhY2ggdGltZSBBbmd1bGFyIHJ1bnMgJGRpZ2VzdCgpXG4gICAgLy8gcGFzcyBpbiBgaXRlbWAgd2hpY2ggaXMgdGhlIHNpbmdsZSBPYmplY3Qgd2UnbGwgbWFuaXB1bGF0ZVxuICAgIHJldHVybiBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgaWYgKGl0ZW0gPT0gdHJ1ZSkge1xuICAgICAgICBpdGVtID0gJzxpIGNsYXNzPVwiZmktcGx1cyBzaXplLTE4IGdyZWVuXCI+PC9pPidcbiAgICAgIH1cbiAgICAgIGVsc2Uge1xuICAgICAgICBpdGVtID0gJzxpIGNsYXNzPVwiZmktbWludXMgc2l6ZS0xOCByZWRcIj48L2k+J1xuICAgICAgfVxuICAgICAgLy8gcmV0dXJuIHRoZSBjdXJyZW50IGBpdGVtYCwgYnV0IGNhbGwgYHRvVXBwZXJDYXNlKClgIG9uIGl0XG4gICAgICByZXR1cm4gaXRlbTtcbiAgICB9O1xuICB9KVxuICAuZmlsdGVyKCdpbnQyc3RhdHVzJywgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaXRlbSkge1xuICAgIGlmIChpdGVtID09ICcxJykge1xuICAgICAgaXRlbSA9ICfQndC10YHQvtCz0LvQsNGB0L7QstCw0L0nO1xuICAgIH0gZWxzZSBpZiAoaXRlbSA9PT0gJzInKSB7XG4gICAgICBpdGVtID0gJ9Ch0L7Qs9C70LDRgdC+0LLQsNC9JztcbiAgICB9IGVsc2UgaWYgKGl0ZW0gPT09ICczJykge1xuICAgICAgaXRlbSA9ICfQntC20LjQtNCw0LXRgiDQn9C+0YHRgtCw0LLQutC4JztcbiAgICB9IGVsc2UgaWYgKGl0ZW0gPT09ICc0Jykge1xuICAgICAgaXRlbSA9ICfQntCx0YDQsNCx0L7RgtC60LAnO1xuICAgIH0gZWxzZSBpZiAoaXRlbSA9PT0gJzUnKSB7XG4gICAgICBpdGVtID0gJ9CU0L7RgdGC0LDQstC60LAnO1xuICAgIH0gZWxzZSBpZiAoaXRlbSA9PT0gJzYnKSB7XG4gICAgICBpdGVtID0gJ9CU0L7RgdGC0LDQstC70LXQvdC+JztcbiAgICB9XG4gICAgcmV0dXJuIGl0ZW1cbiAgfTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnXHJcblxyXG5hbmd1bGFyLm1vZHVsZSgnYXV0aCcpXHJcbiAgLmNvbnRyb2xsZXIoJ0F1dGhlbnRpY2F0aW9uQ3RyJywgZnVuY3Rpb24oJHNjb3BlLCBVc2VyKSB7XHJcbiAgICAkc2NvcGUubG9nb3V0ID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgIFVzZXIucmVzZXRVc2VyKCk7XHJcbiAgICB9O1xyXG4gIH0pOyIsIid1c2Ugc3RyaWN0JztcblxuXG5hbmd1bGFyLm1vZHVsZSgnYXV0aCcpXG5cbiAgLmRpcmVjdGl2ZSgnYXV0aEFwcGxpY2F0aW9uJywgZnVuY3Rpb24oJGh0dHAsIGxvY2FsU3RvcmFnZVNlcnZpY2UsIFVzZXIpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdBJyxcbiAgICAgIHNjb3BlOiBmYWxzZSxcbiAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbSwgYXR0cnMpIHtcblxuICAgICAgICB2YXIgbWFpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpblwiKTtcbiAgICAgICAgdmFyIGxvZ2luID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsb2dpbi1ob2xkZXJcIik7XG5cbiAgICAgICAgdmFyIGFwcGx5TG9naW4gPSBmdW5jdGlvbihnb29kKSB7XG4gICAgICAgICAgaWYgKGdvb2QpIHtcbiAgICAgICAgICAgIG1haW4uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgICAgIGxvZ2luLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbWFpbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgICBsb2dpbi5zdHlsZS5kaXNwbGF5ID0gXCJibG9ja1wiO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpZiAobG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ3Rva2VuJykpIHtcbiAgICAgICAgICBhcHBseUxvZ2luKHRydWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgc2NvcGUuJG9uKCdldmVudDphdXRoLWxvZ2luUmVxdWlyZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgYXBwbHlMb2dpbihmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHNjb3BlLiRvbignZXZlbnQ6YXV0aC1sb2dpbkNvbmZpcm1lZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBhcHBseUxvZ2luKHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICB9KVxuXG5cbiAgLmRpcmVjdGl2ZSgnaGFzUGVybWlzc2lvbicsIGZ1bmN0aW9uKHBlcm1pc3Npb25zKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNjb3BlOiBmYWxzZSxcbiAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xuICAgICAgICBpZighXy5pc1N0cmluZyhhdHRycy5oYXNQZXJtaXNzaW9uKSl7XG4gICAgICAgICAgdGhyb3cgXCJoYXNQZXJtaXNzaW9uIHZhbHVlIG11c3QgYmUgYSBzdHJpbmdcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB2YWx1ZSA9IGF0dHJzLmhhc1Blcm1pc3Npb24udHJpbSgpO1xuICAgICAgICB2YXIgbm90UGVybWlzc2lvbkZsYWcgPSB2YWx1ZVswXSA9PT0gJyEnO1xuICAgICAgICBpZihub3RQZXJtaXNzaW9uRmxhZykge1xuICAgICAgICAgIHZhbHVlID0gdmFsdWUuc2xpY2UoMSkudHJpbSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlVmlzaWJpbGl0eUJhc2VkT25QZXJtaXNzaW9uKCkge1xuICAgICAgICAgIHZhciBoYXNQZXJtaXNzaW9uID0gcGVybWlzc2lvbnMuaGFzUGVybWlzc2lvbih2YWx1ZSk7XG5cbiAgICAgICAgICBpZihoYXNQZXJtaXNzaW9uICYmICFub3RQZXJtaXNzaW9uRmxhZyB8fCAhaGFzUGVybWlzc2lvbiAmJiBub3RQZXJtaXNzaW9uRmxhZykge1xuICAgICAgICAgICAgZWxlbWVudC5zaG93KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZWxlbWVudC5oaWRlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRvZ2dsZVZpc2liaWxpdHlCYXNlZE9uUGVybWlzc2lvbigpO1xuICAgICAgICBzY29wZS4kb24oJ3Blcm1pc3Npb25zQ2hhbmdlZCcsIHRvZ2dsZVZpc2liaWxpdHlCYXNlZE9uUGVybWlzc2lvbik7XG4gICAgICB9XG4gICAgfTtcbiAgfSlcblxuXG4gIC5kaXJlY3RpdmUoJ2xvZ2luJywgZnVuY3Rpb24oJGh0dHAsIGFwaSwgbG9jYWxTdG9yYWdlU2VydmljZSwgYXV0aFNlcnZpY2UpIHtcbiAgICByZXR1cm4ge1xuICAgICAgcmVzdHJpY3Q6ICdFJyxcbiAgICAgIHNjb3BlOiBmYWxzZSxcbiAgICAgIHRyYW5zY2x1ZGU6IGZhbHNlLFxuICAgICAgdGVtcGxhdGVVcmw6ICdzdGF0aWMvc3JjL2F1dGgvdGVtcGxhdGVzL2xvZ2luLmh0bWwnLFxuICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW0sIGF0dHJzKSB7XG5cbiAgICAgICAgZWxlbS5iaW5kKCdzdWJtaXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICBsb2NhbFN0b3JhZ2VTZXJ2aWNlLnJlbW92ZSgndG9rZW4nKTtcblxuICAgICAgICAgIHZhciB1c2VyRGF0YSA9IHtcbiAgICAgICAgICAgIFwidXNlcm5hbWVcIjogc2NvcGUudXNlcm5hbWUsXG4gICAgICAgICAgICBcInBhc3N3b3JkXCI6IHNjb3BlLnBhc3N3b3JkXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIGFwaS5hbGwoJ2FwaS10b2tlbi1hdXRoLycpLmN1c3RvbVBPU1QodXNlckRhdGEpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5zZXQoJ3Rva2VuJywgJ1Rva2VuICcgKyByZXNwb25zZS5kYXRhLnRva2VuKTtcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmxvZ2luQ29uZmlybWVkKCk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgc2NvcGUuc3RhdHVzID0gcmVzO1xuICAgICAgICAgICAgYWxlcnQoJ9Cd0LXQv9GA0LDQstC40LvRjNC90YvQuSDQu9C+0LPQuCDQuNC70Lgg0L/QsNGA0L7Qu9GMJyk7XG4gICAgICAgICAgICBzY29wZS5lcnJvciA9ICfQndC10L/RgNCw0LLQuNC70YzQvdGL0Lkg0LvQvtCz0LjQvSDQuNC70Lgg0L/QsNGA0L7Qu9GMJztcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhdXRoJylcblxuICAuZmFjdG9yeSgnYXV0aEludGVyY2VwdG9yJywgZnVuY3Rpb24obG9jYWxTdG9yYWdlU2VydmljZSkge1xuICAgIC8vINCf0YDQvtCy0LXRgNGP0LXQvCDQu9C+0LrQsNC70YzQvdC+0LUg0YXRgNCw0L3QuNC70LjRidC1INC90LAg0L3QsNC70LjRh9C40LUg0YLQvtC60LAg0L/RgNC4INC60LDQttC00L7QvCDQt9Cw0L/RgNC+0YHQtS5cbiAgICByZXR1cm4ge1xuICAgICAgcmVxdWVzdDogZnVuY3Rpb24oY29uZmlnKSB7XG4gICAgICAgIHZhciB0b2tlbiA9IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCd0b2tlbicpO1xuICAgICAgICBjb25maWcuaGVhZGVycyA9IGNvbmZpZy5oZWFkZXJzIHx8IHt9O1xuICAgICAgICBpZiAodG9rZW4pIHtcbiAgICAgICAgICBjb25maWcuaGVhZGVycy5BdXRob3JpemF0aW9uID0gdG9rZW47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbmZpZztcbiAgICAgIH1cbiAgICB9O1xuICB9KVxuXG4gIC5mYWN0b3J5KCdwZXJtaXNzaW9ucycsIGZ1bmN0aW9uICgkcm9vdFNjb3BlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNldFBlcm1pc3Npb25zOiBmdW5jdGlvbihwZXJtaXNzaW9ucykge1xuICAgICAgICAkcm9vdFNjb3BlLnBlcm1pc3Npb25MaXN0ID0gcGVybWlzc2lvbnM7XG4gICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgncGVybWlzc2lvbnNDaGFuZ2VkJyk7XG4gICAgICB9LFxuICAgICAgaGFzUGVybWlzc2lvbjogZnVuY3Rpb24gKHBlcm1pc3Npb24pIHtcbiAgICAgICAgcGVybWlzc2lvbiA9IHBlcm1pc3Npb24udHJpbSgpO1xuICAgICAgICByZXR1cm4gXy5zb21lKCRyb290U2NvcGUucGVybWlzc2lvbkxpc3QsIGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICBpZihfLmlzU3RyaW5nKGl0ZW0pKXtcbiAgICAgICAgICAgIHJldHVybiBpdGVtLnRyaW0oKSA9PT0gcGVybWlzc2lvbjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwZXJtaXNzaW9uTGlzdDtcbiAgICAgIH1cbiAgICB9O1xuICB9KVxuXG4gIC5mYWN0b3J5KCdVc2VyJywgZnVuY3Rpb24oJHJvb3RTY29wZSwgcGVybWlzc2lvbnMsICR3aW5kb3csIGFwaSwgbG9jYWxTdG9yYWdlU2VydmljZSkge1xuICAgIHZhciB1c2VyUHJvZmlsZTtcblxuICAgIHZhciBzZXJ2aWNlID0ge1xuICAgICAgdXBkYXRlVXNlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIGFwaS5hbGwoJ3Byb2ZpbGUvJykuY3VzdG9tR0VUKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgIHVzZXJQcm9maWxlID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5zZXRQZXJtaXNzaW9ucyh1c2VyUHJvZmlsZS5wZXJtaXNzaW9uc19uYW1lcyk7XG4gICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdldmVudDp1c2VyLXByb2ZpbGVVcGRhdGVkJyk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcblxuICAgICAgcmVzZXRVc2VyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdXNlclByb2ZpbGUgPSBudWxsO1xuICAgICAgICBsb2NhbFN0b3JhZ2VTZXJ2aWNlLnJlbW92ZSgndG9rZW4nKTtcbiAgICAgICAgJHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgICAgIH0sXG5cbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB1c2VyUHJvZmlsZTtcbiAgICAgIH0sXG5cbiAgICAgIGdldEFzeW5jOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGFwaS5hbGwoJ3Byb2ZpbGUvJykuY3VzdG9tR0VUKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgIHVzZXJQcm9maWxlID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICBwZXJtaXNzaW9ucy5zZXRQZXJtaXNzaW9ucyh1c2VyUHJvZmlsZS5wZXJtaXNzaW9uc19uYW1lcyk7XG4gICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCdldmVudDp1c2VyLXByb2ZpbGVVcGRhdGVkJyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIHNlcnZpY2U7XG4gICAgJHJvb3RTY29wZS4kb24oJ2V2ZW50OmF1dGgtbG9naW5jb25maXJtZWQnLCBzZXJ2aWNlLnVwZGF0ZVVzZXIoKSk7XG4gIH0pO1xuIiwiJ3VzZSBzdHJpY3QnXG5cbmFuZ3VsYXIubW9kdWxlKCdtYWluJylcblxuICAuY29udHJvbGxlcignZGVtbycsIGZ1bmN0aW9uKCRzY29wZSwgRmlsZVVwbG9hZGVyLCBsb2NhbFN0b3JhZ2VTZXJ2aWNlKSB7XG4gICAgJHNjb3BlLnVwbG9hZGVyID0gbmV3IEZpbGVVcGxvYWRlcih7dXJsOidhcGkvZmlsZXVwbG9hZC8nLCBoZWFkZXJzOiB7QXV0aG9yaXphdGlvbjogbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ3Rva2VuJyl9LCBtZXRob2Q6ICdQT1NUJyB9KTtcbiAgfSlcblxuICAuY29udHJvbGxlcignTW9kYWxEZW1vQ3RyJywgZnVuY3Rpb24gKCRzY29wZSwgJG1vZGFsLCAkbG9nKSB7XG5cbiAgICAkc2NvcGUuaXRlbXMgPSBbJ2l0ZW0xJywgJ2l0ZW0yJywgJ2l0ZW0zJ107XG5cbiAgICAkc2NvcGUub3BlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ215TW9kYWxDb250ZW50Lmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnTW9kYWxJbnN0YW5jZUN0cicsXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICBpdGVtczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICRzY29wZS5pdGVtcztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uIChzZWxlY3RlZEl0ZW0pIHtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkID0gc2VsZWN0ZWRJdGVtO1xuICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAkbG9nLmluZm8oJ01vZGFsIGRpc21pc3NlZCBhdDogJyArIG5ldyBEYXRlKCkpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSlcbiAgLmNvbnRyb2xsZXIoJ0RlbW9Db250cm9sbGVyJywgZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgJHNjb3BlLnJhdGluZyA9IDQyO1xuICAgICRzY29wZS5taW5SYXRpbmcgPSA0MDtcbiAgICAkc2NvcGUubWF4UmF0aW5nID0gNTA7XG59KVxuXG4gIC5jb250cm9sbGVyKCdNb2RhbEluc3RhbmNlQ3RyJywgZnVuY3Rpb24gKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIGl0ZW1zKSB7XG5cbiAgICAkc2NvcGUuaXRlbXMgPSBpdGVtcztcbiAgICAkc2NvcGUuc2VsZWN0ZWQgPSB7XG4gICAgICBpdGVtOiAkc2NvcGUuaXRlbXNbMF1cbiAgICB9O1xuXG4gICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gKCkge1xuICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UoJHNjb3BlLnNlbGVjdGVkLml0ZW0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgfTtcbiAgfSlcblxuICAuY29udHJvbGxlcigndGVzdCcsIGZ1bmN0aW9uKCRzY29wZSwgYXBpKSB7XG4gICAgYXBpLmFsbCgndXNlcnMnKS5vcHRpb25zKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcbiAgICB9KVxuICB9KVxuXG4gIC5jb250cm9sbGVyKCdoZWxsbycsIGZ1bmN0aW9uKCRzY29wZSwgYXBpLCAkcm91dGVQYXJhbXMpe1xuICAgIGFwaS5hbGwoJ2V4cHJlc3MtdGFyaWZmJykuY3VzdG9tR0VUKCcnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICRzY29wZS50YXJpZnMgPSByZXNwb25zZS5kYXRhO1xuICAgIH0pXG4gICAgJHNjb3BlLmZvcm0gPSB7fTtcbiAgICB2YXIgZ2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBhcGkub25lKCdvcmRlcl9jb250YWluZXInLCAkcm91dGVQYXJhbXMub3JkZXJDb250YWluZXJJZCkub25lKCdzY2hlZHVsZScsICRyb3V0ZVBhcmFtcy5zY2hlZHVsZUlkKS5jdXN0b21HRVQoJ2RlbGl2ZXJ5JylcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAkc2NvcGUuZGF0YSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0KCk7XG4gICAgJHNjb3BlLmFkZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgYXBpLm9uZSgnb3JkZXJfY29udGFpbmVyJywgJHJvdXRlUGFyYW1zLm9yZGVyQ29udGFpbmVySWQpLm9uZSgnc2NoZWR1bGUnLCAkcm91dGVQYXJhbXMuc2NoZWR1bGVJZClcbiAgICAgICAgLmFsbCgnZGVsaXZlcnknKS5jdXN0b21QT1NUKCRzY29wZS5mb3JtKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGFsZXJ0KCdzdWNjZXNzJyk7XG4gICAgICAgICAgZ2V0KCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gIH0pXG4iLCIndXNlIHN0cmljdCc7XG5cblxuYW5ndWxhci5tb2R1bGUoJ3ZhbGlkYXRpb24nKVxuICAuZGlyZWN0aXZlKCdnZXRGb3JtJywgZnVuY3Rpb24oYXBpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICB0ZW1wbGF0ZTogJzxwIG5nLXJlcGVhdD1cIml0ZW0gaW4gZGF0YVwiPntAaXRlbS50eXBlQH17QGl0ZW0ubGFiZWxAfTwvcD4nLFxuICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUpIHtcbiAgICAgICAgYXBpLmFsbCgnb3JkZXJfY29udGFpbmVyJykub3B0aW9ucygpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcbiAgICAgICAgICBzY29wZS5kYXRhID0gcmVzcG9uc2UuZGF0YS5hY3Rpb25zLlBPU1Q7XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfTtcbiAgfSlcblxuICAuZGlyZWN0aXZlKCdyblN0ZXBwZXInLCBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgc2NvcGU6IHt9LFxuICAgICAgcmVxdWlyZTogJ25nTW9kZWwnLFxuICAgICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGlFbGVtZW50LCBpQXR0cnMsIG5nTW9kZWxDb250cm9sbGVyKSB7XG4gICAgICAgIG5nTW9kZWxDb250cm9sbGVyLiRyZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBpRWxlbWVudC5maW5kKCdkaXYnKS50ZXh0KG5nTW9kZWxDb250cm9sbGVyLiR2aWV3VmFsdWUpO1xuICAgICAgICB9O1xuICAgICAgICBmdW5jdGlvbiB1cGRhdGVNb2RlbChvZmZzZXQpIHtcbiAgICAgICAgICBuZ01vZGVsQ29udHJvbGxlci4kc2V0Vmlld1ZhbHVlKG5nTW9kZWxDb250cm9sbGVyLiR2aWV3VmFsdWUgKyBvZmZzZXQpO1xuICAgICAgICAgIG5nTW9kZWxDb250cm9sbGVyLiRyZW5kZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBzY29wZS5kZWNyZW1lbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB1cGRhdGVNb2RlbCgtMSk7XG4gICAgICAgIH07XG4gICAgICAgIHNjb3BlLmluY3JlbWVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHVwZGF0ZU1vZGVsKCsxKTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcblxuLy9sID0ge1xuLy8gICAgXCJuYW1lXCI6IFwiT3JkZXIgQ29udGFpbmVyIExpc3RcIixcbi8vICAgIFwiZGVzY3JpcHRpb25cIjogXCJcIixcbi8vICAgIFwicmVuZGVyc1wiOiBbXG4vLyAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4vLyAgICAgICAgXCJ0ZXh0L2h0bWxcIlxuLy8gICAgXSxcbi8vICAgIFwicGFyc2VzXCI6IFtcbi8vICAgICAgICBcImFwcGxpY2F0aW9uL2pzb25cIixcbi8vICAgICAgICBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiLFxuLy8gICAgICAgIFwibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiXG4vLyAgICBdLFxuLy8gICAgXCJhY3Rpb25zXCI6IHtcbi8vICAgICAgICBcIlBPU1RcIjoge1xuLy8gICAgICAgICAgICBcImlkXCI6IHtcbi8vICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImludGVnZXJcIixcbi8vICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2UsXG4vLyAgICAgICAgICAgICAgICBcInJlYWRfb25seVwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBcIklEXCJcbi8vICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgXCJzeW5jX3N0YXR1c1wiOiB7XG4vLyAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJib29sZWFuXCIsXG4vLyAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgXCJyZWFkX29ubHlcIjogZmFsc2UsXG4vLyAgICAgICAgICAgICAgICBcImxhYmVsXCI6IFwiXFx1MDQ0MVxcdTA0NDJcXHUwNDMwXFx1MDQ0MlxcdTA0NDNcXHUwNDQxIFxcdTA0NDFcXHUwNDM4XFx1MDQzZFxcdTA0NDVcXHUwNDQwXFx1MDQzZVxcdTA0M2RcXHUwNDM4XFx1MDQzN1xcdTA0MzBcXHUwNDQ2XFx1MDQzOFxcdTA0MzhcIlxuLy8gICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICBcInN0YXR1c1wiOiB7XG4vLyAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJib29sZWFuXCIsXG4vLyAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgXCJyZWFkX29ubHlcIjogZmFsc2UsXG4vLyAgICAgICAgICAgICAgICBcImxhYmVsXCI6IFwic3RhdHVzXCJcbi8vICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgXCJjb21tZW50XCI6IHtcbi8vICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcInN0cmluZ1wiLFxuLy8gICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiBmYWxzZSxcbi8vICAgICAgICAgICAgICAgIFwicmVhZF9vbmx5XCI6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBcImNvbW1lbnRcIixcbi8vICAgICAgICAgICAgICAgIFwibWF4X2xlbmd0aFwiOiAyNTZcbi8vICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgXCJjdXN0b21lcl9kYXRlXCI6IHtcbi8vICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImRhdGV0aW1lXCIsXG4vLyAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgXCJyZWFkX29ubHlcIjogZmFsc2UsXG4vLyAgICAgICAgICAgICAgICBcImxhYmVsXCI6IFwiY3VzdG9tZXIgZGF0ZVwiXG4vLyAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgIFwibWFuYWdlcl9kYXRlXCI6IHtcbi8vICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImRhdGV0aW1lXCIsXG4vLyAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgXCJyZWFkX29ubHlcIjogZmFsc2UsXG4vLyAgICAgICAgICAgICAgICBcImxhYmVsXCI6IFwibWFuYWdlciBkYXRlXCJcbi8vICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgXCJjb21wYW55XCI6IHtcbi8vICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImZpZWxkXCIsXG4vLyAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IHRydWUsXG4vLyAgICAgICAgICAgICAgICBcInJlYWRfb25seVwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBcIlxcdTA0MWFcXHUwNDNlXFx1MDQzY1xcdTA0M2ZcXHUwNDMwXFx1MDQzZFxcdTA0MzhcXHUwNDRmXCJcbi8vICAgICAgICAgICAgfVxuLy8gICAgICAgIH1cbi8vICAgIH1cbi8vfVxuIiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgICAkdGVtcGxhdGVDYWNoZS5wdXQoJ2FjY291bnRzXFx0ZW1wbGF0ZXNcXGFjY291bnRfZXhwcmVzc190YXJpZmYuaHRtbCcsXG4gICAgICAgIFwiPGRpdiBjbGFzcz0ncm93JyBuZy1jb250cm9sbGVyPSdQcmljZUxpc3RDdHInPlxcbiAgPGRpdiBjbGFzcz1cXFwidHdlbHZlIGNvbHVtbnMgY2VudGVyZWRcXFwiPlxcbiAgICA8dGFibGU+XFxuICAgICAgPHRib2R5IG5nLXJlcGVhdD1cXFwiaXRlbSBpbiBkYXRhXFxcIj5cXG4gICAgICA8dHI+XFxuICAgICAgICA8dGQ+e0BpdGVtLm5hbWVAfTwvdGQ+XFxuICAgICAgICA8dGQ+e0BpdGVtLmluc2lkZV9ta2FkX2NvdXJpZXJfcHJpY2VAfTwvdGQ+XFxuICAgICAgICA8dGQ+e0BpdGVtLm91dHNpZGVfbWthZF9jb3VyaWVyX3ByaWNlQH08L3RkPlxcbiAgICAgICAgPHRkPntAaXRlbS5hcmVhX29uZV9wcmljZUB9PC90ZD5cXG4gICAgICAgIDx0ZD57QGl0ZW0uYXJlYV90d29fcHJpY2VAfTwvdGQ+XFxuICAgICAgICA8dGQ+e0BpdGVtLmFyZWFfdGhyZWVfcHJpY2VAfTwvdGQ+XFxuICAgICAgICA8dGQ+e0BpdGVtLmFyZWFfZm91cl9wcmljZUB9PC90ZD5cXG4gICAgICAgIDx0ZD57QGl0ZW0ud2VpZ2h0X292ZXJsaW1pdF9wcmljZUB9PC90ZD5cXG4gICAgICAgIDx0ZD57QGl0ZW0ud2FpdGluZ19wcmljZUB9PC90ZD5cXG4gICAgICA8L3RyPlxcbiAgICAgIDwvdGJvZHk+XFxuICAgIDwvdGFibGU+XFxuICA8L2Rpdj5cXG48L2Rpdj5cXG5cIik7XG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgICAkdGVtcGxhdGVDYWNoZS5wdXQoJ2FjY291bnRzXFx0ZW1wbGF0ZXNcXGFjY291bnRfb3JkZXJfY29udGFpbmVyLmh0bWwnLFxuICAgICAgICBcIjxkaXYgY2xhc3M9J3JvdycgbmctY29udHJvbGxlcj0nQWNjb3VudE9yZGVyQ29udGFpbmVyQ3RyJz5cXG4gICAgPGRpdiBjbGFzcz1cXFwidHdlbHZlIGNvbHVtbnMgY2VudGVyZWRcXFwiPlxcbiAgICAgICAgPGZpZWxkc2V0PlxcbiAgICAgICAgICAgIDxsZWdlbmQ+0JTQvtCx0LDQstGC0Ywg0JfQsNC60LDQtzwvbGVnZW5kPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxhcmdlLTYgY29sdW1uc1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWw+0JrQvtC80LzQtdC90YLQsNGA0LjQuSDQuiDQt9Cw0LrQsNC30YNcXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcXCIgbmctbW9kZWw9XFxcImZvcm0uY29tbWVudFxcXCIvPlxcbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxhcmdlLTYgY29sdW1ucyBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsPtCU0LDRgtCwINC+0LrQvtC90YfQsNC90LjRjyDQt9Cw0LrQsNC30LBcXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcImRhdGV0aW1lcGlja2VyXFxcIiBwbGFjZWhvbGRlcj1cXFwiXFxcIiBuZy1tb2RlbD1cXFwiZm9ybS5jdXN0b21lcl9kYXRlXFxcIi8+XFxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8YSBocmVmPVxcXCJcXFwiIGNsYXNzPVxcXCJidXR0b25cXFwiIHZhbHVlPVxcXCJcXFwiIG5nLWNsaWNrPVxcXCJhZGRPcmRlckNvbnRhaW5lcigpXFxcIj7Qn9GA0L7QtNC+0LvQttC40YLRjDwvYT5cXG4gICAgICAgIDwvZmllbGRzZXQ+XFxuICAgIDwvZGl2PlxcbjwvZGl2PlxcblxcbjxzY3JpcHQgdHlwZT1cXFwidGV4dC9qYXZhc2NyaXB0XFxcIj4galF1ZXJ5KCcuZGF0ZXRpbWVwaWNrZXInKS5kYXRldGltZXBpY2tlciggeyBvbkdlbmVyYXRlOmZ1bmN0aW9uKCBjdCApeyBqUXVlcnkodGhpcykuZmluZCgnLnhkc29mdF9kYXRlLnhkc29mdF93ZWVrZW5kJykgLmFkZENsYXNzKCd4ZHNvZnRfZGlzYWJsZWQnKTsgfSwgZm9ybWF0OlxcXCJkLm0uWSBIOmlcXFwiLCBsYW5nOiAncnUnLCBtaW5UaW1lOicxMDowMCcsIG1heFRpbWU6JzIxOjAwJywgdGltZXBpY2tlclNjcm9sbGJhcjonZmFsc2UnLCBkYXlPZldlZWtTdGFydDogMSB9KSA8L3NjcmlwdD5cXG5cIik7XG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgICAkdGVtcGxhdGVDYWNoZS5wdXQoJ2FjY291bnRzXFx0ZW1wbGF0ZXNcXGFjY291bnRfb3JkZXJfY3JlYXRlLmh0bWwnLFxuICAgICAgICBcIjxkaXYgY2xhc3M9J3JvdycgbmctY29udHJvbGxlcj0nQ3JlYXRlT3JkZXJzQ3RyJz5cXG4gIDxkaXYgY2xhc3M9XFxcInR3ZWx2ZSBjb2x1bW5zIGNlbnRlcmVkXFxcIj5cXG4gICAgPCEtLSDQpNC+0YDQvNCwINC+0YLQv9GA0LDQstC70LXQvdC40Y8g0LfQsNC60LDQt9CwIC0tPlxcbiAgICA8ZmllbGRzZXQ+XFxuXFxuICAgICAgPHA+0JTQsNGC0LAg0L/RgNC40LXQt9C00LA6PC9wPlxcbiAgICAgIDxpbnB1dCBjbGFzcz1cXFwiZGF0ZXRpbWVwaWNrZXJcXFwiIHR5cGU9XFxcInRleHRcXFwiIG5nLW1vZGVsPSdmb3JtLm9yZGVyX2RhdGV0aW1lJz5cXG5cXG4gICAgICA8aDI+0J7RgtC/0YDQsNCy0LvQtdC90LjQtTo8L2gyPlxcblxcbiAgICAgIDxwPtCf0LvQsNGC0LXQu9GM0YnQuNC6OjwvcD5cXG4gICAgICA8c2VsZWN0IG5nLW1vZGVsPSdmb3JtLnBheWVyJz5cXG4gICAgICAgIDxvcHRpb24gdmFsdWU9XFxcIjFcXFwiPtCe0YLQv9GA0LDQstC40YLQtdC70Yw8L29wdGlvbj5cXG4gICAgICAgIDxvcHRpb24gdmFsdWU9XFxcIjJcXFwiPtCf0L7Qu9GD0YfQsNGC0LXQu9GMPC9vcHRpb24+XFxuICAgICAgICA8b3B0aW9uIHZhbHVlPVxcXCIzXFxcIj7QotGA0LXRgtGM0LUg0LvQuNGG0L48L29wdGlvbj5cXG4gICAgICAgIDxvcHRpb24gdmFsdWU9XFxcIjRcXFwiPtCe0YLQv9GA0LDQstC40YLQtdC70YwgKNCx0LXQt9C90LDQu9C40YfQvdGL0Lkg0YDQsNGB0YfQtdGCKTwvb3B0aW9uPlxcbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cXFwiNVxcXCI+0J/QvtC70YPRh9Cw0YLQtdC70YwgKNCx0LXQt9C90LDQu9C40YfQvdGL0Lkg0YDQsNGB0YfQtdGCKTwvb3B0aW9uPlxcbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cXFwiNlxcXCI+0KLRgNC10YLRjNC1INC70LjRhtC+ICjQsdC10LfQvdCw0LvQuNGH0L3Ri9C5INGA0LDRgdGH0LXRgik8L29wdGlvbj5cXG4gICAgICA8L3NlbGVjdD5cXG5cXG4gICAgICA8cD7QptC10L3QvdC+0YHRgtGMINC+0YLQv9GA0LDQstC70LXQvdC40Y88L3A+XFxuICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIG5nLW1vZGVsPSdmb3JtLndvcnRoJz5cXG5cXG4gICAgICA8cD48c3BhbiBjbGFzcz1cXFwibWFya1xcXCI+Kio8L3NwYW4+0JLQtdGBICjQutCzKTo8L3A+XFxuICAgICAgPGlucHV0IG5nLW1vZGVsPSdmb3JtLndlaWdodCcgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcIndlaWdodFxcXCI+XFxuXFxuICAgICAgPHA+PHNwYW4gY2xhc3M9XFxcIm1hcmtcXFwiPioqPC9zcGFuPtCg0LDQt9C80LXRgNGLICjRgdC8KTo8L3A+XFxuICAgICAgPGlucHV0IG5nLW1vZGVsPSdmb3JtLmRpbWVuc2lvbl94JyB0eXBlPVxcXCJ0ZXh0XFxcIiBjbGFzcz1cXFwibGVuZ3RoXFxcIj5cXG4gICAgICA8cD7QlNC70LjQvdCwPC9wPlxcbiAgICAgIDxwPlg8L3A+XFxuICAgICAgPGlucHV0IG5nLW1vZGVsPSdmb3JtLmRpbWVuc2lvbl95JyB0eXBlPVxcXCJ0ZXh0XFxcIiBjbGFzcz1cXFwid2lkdGhcXFwiPlxcbiAgICAgIDxwPtCo0LjRgNC40L3QsDwvcD5cXG4gICAgICA8cD5YPC9wPlxcbiAgICAgIDxpbnB1dCBuZy1tb2RlbD0nZm9ybS5kaW1lbnNpb25feicgIHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJoZWlnaHRcXFwiPlxcbiAgICAgIDxwPtCS0YvRgdC+0YLQsDwvcD5cXG5cXG4gICAgICA8cD7QmtC+0LzQvNC10L3RgtCw0YDQuNC5OjwvcD5cXG4gICAgICA8aW5wdXQgbmctbW9kZWw9J2Zvcm0uY29tbWVudCcgdHlwZT1cXFwidGV4dFxcXCI+XFxuXFxuICAgICAgPHA+0KLQuNC/INC+0YLQv9GA0LDQstC70LXQvdC40Y86PC9wPlxcbiAgICAgIDxzZWxlY3QgbmctbW9kZWw9J2Zvcm0uaXNfZG9jcyc+XFxuICAgICAgICA8b3B0aW9uIHZhbHVlPSd0cnVlJyBzZWxlY3RlZD1cXFwic2VsZWN0ZWRcXFwiPtCU0L7QutGD0LzQtdC90YLRizwvb3B0aW9uPlxcbiAgICAgICAgPG9wdGlvbiB2YWx1ZT0nZmFsc2UnPtCi0L7QstCw0YDRizwvb3B0aW9uPlxcbiAgICAgIDwvc2VsZWN0PlxcblxcbiAgICAgIDxwPtCQ0LTRgNC10YEg0L7RgtC/0YDQsNCy0LjRgtC10LvRjzwvcD4gICAgXFxuICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIG5nLW1vZGVsPVxcXCJmb3JtLnNlbmRlcl9hZHJlc3NcXFwiPlxcblxcbiAgICAgIDxwPtCQ0LTRgNC10YEg0L/QvtC70YPRh9Cw0YLQtdC70Y88L3A+XFxuICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIG5nLW1vZGVsPVxcXCJmb3JtLnJlY2lwZWludF9hZHJlc3NcXFwiPlxcbiAgICAgIDxhIGhyZWY9XFxcIlxcXCIgY2xhc3M9XFxcImJ1dHRvblxcXCIgdmFsdWU9XFxcIlxcXCIgbmctY2xpY2s9XFxcInNlbmRmb3JtKClcXFwiPtCU0L7QsdCw0LLQuNGC0Ywg0LfQsNC60LDQtzwvYT5cXG4gICAgPC9maWVsZHNldD5cXG4gIDwvZGl2PlxcbjwvZGl2PlxcbjxzY3JpcHQgdHlwZT1cXFwidGV4dC9qYXZhc2NyaXB0XFxcIj4galF1ZXJ5KCcuZGF0ZXRpbWVwaWNrZXInKS5kYXRldGltZXBpY2tlciggeyBvbkdlbmVyYXRlOmZ1bmN0aW9uKCBjdCApeyBqUXVlcnkodGhpcykuZmluZCgnLnhkc29mdF9kYXRlLnhkc29mdF93ZWVrZW5kJykgLmFkZENsYXNzKCd4ZHNvZnRfZGlzYWJsZWQnKTsgfSwgZm9ybWF0OlxcXCJZLW0tZFxcXFxcXFxcVEg6aVxcXCIsIGxhbmc6ICdydScsIG1pblRpbWU6JzEwOjAwJywgbWF4VGltZTonMjE6MDAnLCB0aW1lcGlja2VyU2Nyb2xsYmFyOidmYWxzZScsIGRheU9mV2Vla1N0YXJ0OiAxIH0pIDwvc2NyaXB0PlxcblwiKTtcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJykucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnYWNjb3VudHNcXHRlbXBsYXRlc1xcYWNjb3VudF9vcmRlcl9jcmVhdGVfd2l0aF9hdHRhY2htZW50Lmh0bWwnLFxuICAgICAgICBcIjxkaXYgY2xhc3M9XFxcInJvd1xcXCIgbmctY29udHJvbGxlcj0nRmlsZVVwbG9hZEN0cic+XFxuICAgIDxpbnB1dCB0eXBlPVxcXCJmaWxlXFxcIiBuZy1tb2RlbD1cXFwiZm9ybS5maWxlXFxcIi8+PGJyLz5cXG4gICAgICAgIDxsaT5cXG4gICAgICAgICAgICA8cD7QlNCw0YLQsCDQv9GA0LjQtdC30LTQsDo8L3A+XFxuICAgICAgICAgICAgPGlucHV0IGNsYXNzPVxcXCJkYXRldGltZXBpY2tlclxcXCIgdHlwZT1cXFwidGV4dFxcXCIgbmctbW9kZWw9J2Zvcm0uZGVsaXZlcl9kYXRlX3RpbWUnPlxcbiAgICAgICAgPC9saT5cXG4gICAgICAgIDxwPntAZm9ybUB9PC9wPlxcbjwvZGl2PlxcblxcbjxzY3JpcHQgdHlwZT1cXFwidGV4dC9qYXZhc2NyaXB0XFxcIj4galF1ZXJ5KCcuZGF0ZXRpbWVwaWNrZXInKS5kYXRldGltZXBpY2tlcihcXG4gICAgICAgIHtcXG4gICAgICAgICAgICBmb3JtYXQ6XFxcIlktbS1kXFxcXFxcXFxUSDppXFxcIixcXG4gICAgICAgICAgICBsYW5nOiAncnUnLFxcbiAgICAgICAgICAgIG1pblRpbWU6JzEwOjAwJyxcXG4gICAgICAgICAgICBtYXhUaW1lOicyMTowMCcsXFxuICAgICAgICAgICAgdGltZXBpY2tlclNjcm9sbGJhcjonZmFsc2UnXFxuICAgICAgICB9KVxcbjwvc2NyaXB0PlxcblwiKTtcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJykucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnYWNjb3VudHNcXHRlbXBsYXRlc1xcYWNjb3VudF9vcmRlcl9lZGl0Lmh0bWwnLFxuICAgICAgICBcIjxkaXYgY2xhc3M9J3JvdycgbmctY29udHJvbGxlcj0nQWNjb3VudE9yZGVyRWRpdEN0cic+XFxuICAgIDxkaXYgY2xhc3M9XFxcInR3ZWx2ZSBjb2x1bW5zIGNlbnRlcmVkXFxcIj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxuICAgICAgICAgICAgPGZpZWxkc2V0PlxcbiAgICAgICAgICAgICAgICA8bGVnZW5kPtCX0LDQutCw0Lc8L2xlZ2VuZD5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtNiBjb2x1bW5zXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbD7QmtC+0LzQvNC10L3RgtCw0YDQuNC5INC6INC30LDQutCw0LfRg1xcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPntAZGF0YS5jb21tZW50QH08L3A+XFxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtNiBjb2x1bW5zIFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWw+0JTQsNGC0LAg0L7QutC+0L3Rh9Cw0L3QuNGPINC30LDQutCw0LfQsFxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPntAZGF0YS5jdXN0b21lcl9kYXRlQH08L3A+XFxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicm93XFxcIiBuZy1jb250cm9sbGVyPSdGaWxlVXBsb2FkQ3RyJz5cXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJmaWxlXFxcIiBudi1maWxlLXNlbGVjdCB1cGxvYWRlcj1cXFwidXBsb2FkZXJcXFwiLz48YnIvPlxcbiAgICAgICAgPHVsPlxcbiAgICAgICAgICAgIDxsaSBuZy1yZXBlYXQ9XFxcIml0ZW0gaW4gdXBsb2FkZXIucXVldWVcXFwiPlxcbiAgICAgICAgICAgICAgICBOYW1lOiA8c3BhbiBuZy1iaW5kPVxcXCJpdGVtLmZpbGUubmFtZVxcXCI+PC9zcGFuPjxici8+XFxuICAgICAgICAgICAgICAgIDxidXR0b24gbmctY2xpY2s9XFxcIml0ZW0udXBsb2FkKClcXFwiPnVwbG9hZDwvYnV0dG9uPlxcbiAgICAgICAgICAgIDwvbGk+XFxuICAgICAgICA8L3VsPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG5cXG5cXG4gICAgICAgICAgICAgICAgPGRpdiBuZy1jb250cm9sbGVyPVxcXCJNb2RhbERlbW9DdHJcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwiYnV0dG9uXFxcIiBuZy1jbGljaz1cXFwib3BlbigpXFxcIj5PcGVuIG1lITwvYnV0dG9uPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBuZy1zaG93PVxcXCJzZWxlY3RlZFxcXCI+U2VsZWN0aW9uIGZyb20gYSBtb2RhbDoge0Agc2VsZWN0ZWQgQH08L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPC9maWVsZHNldD5cXG4gICAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG48L2Rpdj5cIik7XG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgICAkdGVtcGxhdGVDYWNoZS5wdXQoJ2FjY291bnRzXFx0ZW1wbGF0ZXNcXGFjY291bnRfb3JkZXJfbW9kYWwuaHRtbCcsXG4gICAgICAgIFwiPGRpdiBuZy1jb250cm9sbGVyPSdDcmVhdGVPcmRlcnNDdHInPlxcbiAgICA8IS0tINCk0L7RgNC80LAg0L7RgtC/0YDQsNCy0LvQtdC90LjRjyDQt9Cw0LrQsNC30LAgLS0+XFxuICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzbWFsbC0xMiBjb2x1bW5zXFxcIj48L2Rpdj5cXG4gICAgPGZpZWxkc2V0PlxcbiAgICAgICAgPGgyPtCe0YLQv9GA0LDQstC70LXQvdC40LU6PC9oMj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic21hbGwtNCBjb2x1bW5zXFxcIj5cXG4gICAgICAgICAgICAgICAgPHA+0JTQsNGC0LAg0L/RgNC40LXQt9C00LA6PC9wPlxcbiAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XFxcImRhdGV0aW1lcGlja2VyXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBuZy1tb2RlbD0nZm9ybS5vcmRlcl9kYXRldGltZSc+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic21hbGwtNCBjb2x1bW5zXFxcIj5cXG4gICAgICAgICAgICAgICAgPHA+0J/Qu9Cw0YLQtdC70YzRidC40Lo6PC9wPlxcbiAgICAgICAgICAgICAgICA8c2VsZWN0IG5nLW1vZGVsPSdmb3JtLnBheWVyJz5cXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XFxcIjFcXFwiPtCe0YLQv9GA0LDQstC40YLQtdC70Yw8L29wdGlvbj5cXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XFxcIjJcXFwiPtCf0L7Qu9GD0YfQsNGC0LXQu9GMPC9vcHRpb24+XFxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVxcXCIzXFxcIj7QotGA0LXRgtGM0LUg0LvQuNGG0L48L29wdGlvbj5cXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XFxcIjRcXFwiPtCe0YLQv9GA0LDQstC40YLQtdC70YwgKNCx0LXQt9C90LDQu9C40YfQvdGL0Lkg0YDQsNGB0YfQtdGCKTwvb3B0aW9uPlxcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cXFwiNVxcXCI+0J/QvtC70YPRh9Cw0YLQtdC70YwgKNCx0LXQt9C90LDQu9C40YfQvdGL0Lkg0YDQsNGB0YfQtdGCKTwvb3B0aW9uPlxcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cXFwiNlxcXCI+0KLRgNC10YLRjNC1INC70LjRhtC+ICjQsdC10LfQvdCw0LvQuNGH0L3Ri9C5INGA0LDRgdGH0LXRgik8L29wdGlvbj5cXG4gICAgICAgICAgICAgICAgPC9zZWxlY3Q+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic21hbGwtNCBjb2x1bW5zXFxcIj5cXG4gICAgICAgICAgICAgICAgPHA+0KbQtdC90L3QvtGB0YLRjCDQvtGC0L/RgNCw0LLQu9C10L3QuNGPPC9wPlxcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgbmctbW9kZWw9J2Zvcm0ud29ydGgnPlxcblxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNtYWxsLTYgY29sdW1uc1xcXCI+XFxuICAgICAgICAgICAgICAgIDxwPtCi0LjQvyDQvtGC0L/RgNCw0LLQu9C10L3QuNGPOjwvcD5cXG4gICAgICAgICAgICAgICAgPHNlbGVjdCBuZy1tb2RlbD0nZm9ybS5pc19kb2NzJz5cXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9J3RydWUnIHNlbGVjdGVkPVxcXCJzZWxlY3RlZFxcXCI+0JTQvtC60YPQvNC10L3RgtGLPC9vcHRpb24+XFxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPSdmYWxzZSc+0KLQvtCy0LDRgNGLPC9vcHRpb24+XFxuICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNtYWxsLTYgY29sdW1uc1xcXCI+XFxuICAgICAgICAgICAgICAgIDxwPjxzcGFuIGNsYXNzPVxcXCJtYXJrXFxcIj4qKjwvc3Bhbj7QktC10YEgKNC60LMpOjwvcD5cXG4gICAgICAgICAgICAgICAgPGlucHV0IG5nLW1vZGVsPSdmb3JtLndlaWdodCcgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcIndlaWdodFxcXCI+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic21hbGwtNiBjb2x1bW5zXFxcIj5cXG4gICAgICAgICAgICAgICAgPHA+0JDQtNGA0LXRgSDQvtGC0L/RgNCw0LLQuNGC0LXQu9GPPC9wPlxcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgbmctbW9kZWw9XFxcImZvcm0uc2VuZGVyX2FkcmVzc1xcXCI+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic21hbGwtNiBjb2x1bW5zXFxcIj5cXG4gICAgICAgICAgICAgICAgPHA+0JDQtNGA0LXRgSDQv9C+0LvRg9GH0LDRgtC10LvRjzwvcD5cXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIG5nLW1vZGVsPVxcXCJmb3JtLnJlY2lwZWludF9hZHJlc3NcXFwiPlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNtYWxsLTEyIGNvbHVtblxcXCI+XFxuICAgICAgICAgICAgICAgIDxwPjxzcGFuIGNsYXNzPVxcXCJtYXJrXFxcIj4qKjwvc3Bhbj7QoNCw0LfQvNC10YDRiyAo0YHQvCk6PC9wPlxcblxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzbWFsbC00IGNvbHVtblxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8cD7QlNC70LjQvdCwPC9wPlxcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IG5nLW1vZGVsPSdmb3JtLmRpbWVuc2lvbl94JyB0eXBlPVxcXCJ0ZXh0XFxcIiBjbGFzcz1cXFwibGVuZ3RoXFxcIj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNtYWxsLTQgY29sdW1uXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxwPtCo0LjRgNC40L3QsDwvcD5cXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBuZy1tb2RlbD0nZm9ybS5kaW1lbnNpb25feScgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcIndpZHRoXFxcIj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNtYWxsLTQgY29sdW1uXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxwPtCS0YvRgdC+0YLQsDwvcD5cXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBuZy1tb2RlbD0nZm9ybS5kaW1lbnNpb25feicgIHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJoZWlnaHRcXFwiPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzbWFsbC02IGNvbHVtblxcXCI+PC9kaXY+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic21hbGwtNiBjb2x1bW5cXFwiPjwvZGl2PlxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNtYWxsLTYgY29sdW1uXFxcIj5cXG4gICAgICAgICAgICAgICAgPHA+0JrQvtC80LzQtdC90YLQsNGA0LjQuTo8L3A+XFxuICAgICAgICAgICAgICAgIDxpbnB1dCBuZy1tb2RlbD0nZm9ybS5jb21tZW50JyB0eXBlPVxcXCJ0ZXh0XFxcIj5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzbWFsbC02IGNvbHVtblxcXCI+XFxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XFxcIlxcXCIgY2xhc3M9XFxcImJ1dHRvblxcXCIgdmFsdWU9XFxcIlxcXCIgbmctY2xpY2s9XFxcInNlbmRmb3JtKClcXFwiPtCU0L7QsdCw0LLQuNGC0Ywg0LfQsNC60LDQtzwvYT5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDwvZGl2PlxcblxcblxcbiAgICA8L2ZpZWxkc2V0PlxcbjwvZGl2PlxcbjxidXR0b24gY2xhc3M9XFxcImJ1dHRvblxcXCIgbmctY2xpY2s9XFxcIm9rKClcXFwiPk9LPC9idXR0b24+XFxuPGEgY2xhc3M9XFxcImNsb3NlLXJldmVhbC1tb2RhbFxcXCIgbmctY2xpY2s9XFxcImNhbmNlbCgpXFxcIj4mIzIxNTs8L2E+XFxuPHNjcmlwdCB0eXBlPVxcXCJ0ZXh0L2phdmFzY3JpcHRcXFwiPiBqUXVlcnkoJy5kYXRldGltZXBpY2tlcicpLmRhdGV0aW1lcGlja2VyKCB7IG9uR2VuZXJhdGU6ZnVuY3Rpb24oIGN0ICl7IGpRdWVyeSh0aGlzKS5maW5kKCcueGRzb2Z0X2RhdGUueGRzb2Z0X3dlZWtlbmQnKSAuYWRkQ2xhc3MoJ3hkc29mdF9kaXNhYmxlZCcpOyB9LCBmb3JtYXQ6XFxcImQubS5ZIEg6aVxcXCIsIGxhbmc6ICdydScsIG1pblRpbWU6JzEwOjAwJywgbWF4VGltZTonMjE6MDAnLCB0aW1lcGlja2VyU2Nyb2xsYmFyOidmYWxzZScsIGRheU9mV2Vla1N0YXJ0OiAxIH0pIDwvc2NyaXB0PlxcblwiKTtcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJykucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnYWNjb3VudHNcXHRlbXBsYXRlc1xcYWNjb3VudF9vcmRlcnNfbGlzdC5odG1sJyxcbiAgICAgICAgXCI8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiIG5nLWNvbnRyb2xsZXI9J09yZGVyc0N0cic+XFxuICAgIDx0YWJsZT5cXG4gICAgICAgIDx0aGVhZD5cXG4gICAgICAgIDx0cj5cXG4gICAgICAgICAgICA8dGQ+0J3QvtC80LXRgCDQt9Cw0LrQsNC30LA8L3RkPlxcbiAgICAgICAgICAgIDx0ZD7QmtC+0LzQvNC10L3RgtCw0YDQuNC5PC90ZD5cXG4gICAgICAgICAgICA8dGQ+0JTQsNGC0LAg0LfQsNC60LDQt9GH0LjQutCwPC90ZD5cXG4gICAgICAgICAgICA8dGQ+0KHQvtCz0LvQsNGB0L7QstCw0L3QvdCw0Y8g0LTQsNGC0LA8L3RkPlxcbiAgICAgICAgICAgIDx0ZD7QotC10LrRg9GJ0LjQuSDRgdGC0LDRgtGD0YE8L3RkPlxcbiAgICAgICAgPC90cj5cXG4gICAgICAgIDwvdGhlYWQ+XFxuICAgICAgICA8dGJvZHk+XFxuICAgICAgICA8dHIgbmctcmVwZWF0PSdpdGVtIGluIGRhdGEnPlxcbiAgICAgICAgICAgIDx0ZD48YSBocmVmPScjL29yZGVycy97QCBpdGVtLmlkIEB9Jz48aSBjbGFzcz1cXFwiZmktbGluayBzaXplLTE4XFxcIj48L2k+PC9hPjwvdGQ+XFxuICAgICAgICAgICAgPHRkPntAIGl0ZW0uY29tbWVudCBAfTwvdGQ+XFxuICAgICAgICAgICAgPHRkPntAIGl0ZW0uY3VzdG9tZXJfZGF0ZSBAfTwvdGQ+XFxuICAgICAgICAgICAgPHRkPntAIGl0ZW0ubWFuYWdlcl9kYXRlIEB9PC90ZD5cXG4gICAgICAgICAgICA8dGQ+e0BpdGVtLnN0YXR1c0B9PC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgICA8L3Rib2R5PlxcbiAgICA8L3RhYmxlPlxcbiAgICA8YSBocmVmPVxcXCIjL29yZGVycy9jcmVhdGVcXFwiIGNsYXNzPVxcXCJidXR0b25cXFwiPtCU0L7QsdCw0LLQuNGC0Ywg0LfQsNC60LDQtzwvYT5cXG48L2Rpdj5cIik7XG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgICAkdGVtcGxhdGVDYWNoZS5wdXQoJ2FjY291bnRzXFx0ZW1wbGF0ZXNcXGFjY291bnRfcHJvZmlsZS5odG1sJyxcbiAgICAgICAgXCI8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiIG5nLWNvbnRyb2xsZXI9J1Byb2ZpbGVDdHInPlxcbiAgPGRpdiBjbGFzcz1cXFwidHdlbHZlIGNvbHVtbnNcXFwiPlxcbiAgICA8dGFibGU+XFxuICAgICAgPHRib2R5PlxcbiAgICAgIDx0cj5cXG4gICAgICAgIDx0ZD4g0K3Qu9C10LrRgtGA0L7QvdC90LDRjyDQv9C+0YfRgtCwIDwvdGQ+XFxuICAgICAgICA8dGQ+IHtAZGF0YS5lbWFpbEB9IDwvdGQ+XFxuICAgICAgPC90cj5cXG4gICAgICA8dHI+XFxuICAgICAgICA8dGQ+INCY0LzRjyA8L3RkPlxcbiAgICAgICAgPHRkPiB7QGRhdGEuZmlyc3RfbmFtZUB9IDwvdGQ+XFxuICAgICAgPC90cj5cXG4gICAgICA8dHI+XFxuICAgICAgICA8dGQ+INCk0LDQvNC40LvQuNGPIDwvdGQ+XFxuICAgICAgICA8dGQ+IHtAZGF0YS5sYXN0X25hbWVAfSA8L3RkPlxcbiAgICAgIDwvdHI+XFxuICAgICAgPHRyPlxcbiAgICAgICAgPHRkPiDQlNCw0YLQsCDRgNC10LPQuNGB0YLRgNCw0YbQuNC4IDwvdGQ+XFxuICAgICAgICA8dGQ+IHtAZGF0YS5kYXRlX2pvaW5lZEB9IDwvdGQ+XFxuICAgICAgPC90cj5cXG4gICAgICA8dHI+XFxuICAgICAgICA8dGQ+0JrQvtC80L/QsNC90LjRjzwvdGQ+XFxuICAgICAgICA8dGQ+e0Bjb21wYW55Lm5hbWVAfTwvdGQ+XFxuICAgICAgPC90cj5cXG4gICAgICA8dHI+XFxuICAgICAgICA8dGQ+0JDQtNGA0LXRgSDQutC+0LzQv9Cw0L3QuNC4OjwvdGQ+XFxuICAgICAgICA8dGQ+e0Bjb21wYW55LmFsbG9jYXRpb25AfTwvdGQ+XFxuICAgICAgPC90cj5cXG4gICAgICA8dHI+XFxuICAgICAgICA8dGQ+0KLQtdC70LXRhNC+0L0g0LrQvtC80L/QsNC90LjQuDwvdGQ+XFxuICAgICAgICA8dGQ+e0Bjb21wYW55LnBob25lQH08L3RkPlxcbiAgICAgIDwvdHI+XFxuICAgICAgPC90Ym9keT5cXG4gICAgPC90YWJsZT5cXG4gIDwvZGl2PlxcbjwvZGl2PlxcblwiKTtcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJykucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnYWRtaW5cXHRlbXBsYXRlc1xcYWRtaW5fY29tcGFuaWVzX2RldGFpbC5odG1sJyxcbiAgICAgICAgXCI8ZGl2IG5nLWNvbnRyb2xsZXI9J0NvbXBhbmllc0RldGFpbEN0cic+XFxuICAgIDxkaXYgY2xhc3M9J3JvdycgPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtNiBjb2x1bW5zXFxcIj5cXG4gICAgICAgICAgICA8dGFibGU+XFxuICAgICAgICAgICAgICAgIDxjb2xncm91cD5cXG4gICAgICAgICAgICAgICAgICAgIDxjb2wgc3Bhbj1cXFwiMVxcXCIgc3R5bGU9XFxcIndpZHRoOiAyMCU7XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxjb2wgc3Bhbj1cXFwiMVxcXCIgc3R5bGU9XFxcIndpZHRoOiA4MCU7XFxcIj5cXG4gICAgICAgICAgICAgICAgPC9jb2xncm91cD5cXG4gICAgICAgICAgICAgICAgPHRib2R5PlxcbiAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICA8dGQ+0JjQvNGPPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDx0ZD57QGRhdGEubmFtZUB9PC90ZD5cXG4gICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgPHRkPtCQ0LTRgNC10YE8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgPHRkPntAZGF0YS5hbGxvY2F0aW9uQH08L3RkPlxcbiAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgICAgICA8dGQ+0JzQtdC90LXQtNC20LXRgDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8dGQ+PGEgaHJlZj1cXFwiIy9jdXN0b21lci97QGRhdGEubWFuYWdlckB9XFxcIj57QGRhdGEubWFuYWdlcl9kZWF0aWxAfTwvYT48L3RkPlxcbiAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICA8L3Rib2R5PlxcbiAgICAgICAgICAgIDwvdGFibGU+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsYXJnZS02IGNvbHVtbnNcXFwiPlxcbiAgICAgICAgICAgIDxwPtCh0L7RgtGA0YPQtNC90LjQutC4PC9wPlxcbiAgICAgICAgICAgIDx0YWJsZT5cXG4gICAgICAgICAgICAgICAgPHRyIG5nLXJlcGVhdD1cXFwiaXRlbSBpbiB1c2Vyc1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8dGQ+PGEgbmctaHJlZj1cXFwiIy9jdXN0b21lci97QCBpdGVtLmlkIEB9XFxcIj48aSBjbGFzcz1cXFwiZmktbGluayBzaXplLTE4XFxcIj48L2k+PC9hPjwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8dGQ+e0BpdGVtLmVtYWlsQH08L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgPHRkPntAaXRlbS5maXJzdF9uYW1lQH0ge0BpdGVtLmxhc3RfbmFtZUB9PC90ZD5cXG4gICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICA8L3RhYmxlPlxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsYXJnZS02IGNvbHVtbnNcXFwiPlxcbiAgICAgICAgICAgIDxwPtCX0LDQutCw0LfRizwvcD5cXG4gICAgICAgICAgICA8dGFibGU+XFxuICAgICAgICAgICAgICAgIDx0ciBuZy1yZXBlYXQ9XFxcIml0ZW0gaW4gb3JkZXJfY29udGFpbmVyc1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8dGQ+PGEgaHJlZj1cXFwiIy9vcmRlci1jb250YWluZXIve0BpdGVtLmlkQH1cXFwiPjxpIGNsYXNzPVxcXCJmaS1saW5rIHNpemUtMThcXFwiPjwvaT48L2E+PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDx0ZD57QGl0ZW0uaWRAfTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8dGQ+e0BpdGVtLnN0YXR1c0B9PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDx0ZD57QGl0ZW0uY3VzdG9tZXJfZGF0ZUB9PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDx0ZD57QGl0ZW0ubWFuYWdlcl9kYXRlQH08L3RkPlxcbiAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgIDwvdGFibGU+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XFxuXCIpO1xufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICAgJHRlbXBsYXRlQ2FjaGUucHV0KCdhZG1pblxcdGVtcGxhdGVzXFxhZG1pbl9jb21wYW5pZXNfbGlzdC5odG1sJyxcbiAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cnIG5nLWNvbnRyb2xsZXI9J0NvbXBhbmllc0xpc3RDdHInPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJsYXJnZS0xMiBjb2x1bW5zXFxcIj5cXG4gICAgICAgIDxmb3JtIG5nLXN1Ym1pdD1cXFwiZ2V0KClcXFwiPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxhcmdlLTYgY29sdW1uc1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWw+0J/QvtC40YHQulxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwi0JLQstC10LTQuNGC0LUg0LTQsNC90L3Ri9C1XFxcIiBuZy1tb2RlbD1cXFwic2VhcmNoXFxcIi8+XFxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDwvZm9ybT5cXG4gICAgICAgICAgICA8dGFibGU+XFxuICAgICAgICAgICAgICAgIDxjb2xncm91cD5cXG4gICAgICAgICAgICAgICAgICAgIDxjb2wgc3Bhbj1cXFwiMVxcXCIgc3R5bGU9XFxcIndpZHRoOiA1JTtcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGNvbCBzcGFuPVxcXCIxXFxcIiBzdHlsZT1cXFwid2lkdGg6IDMwJTtcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGNvbCBzcGFuPVxcXCIxXFxcIiBzdHlsZT1cXFwid2lkdGg6IDMwJTtcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGNvbCBzcGFuPVxcXCIxXFxcIiBzdHlsZT1cXFwid2lkdGg6IDI1JTtcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGNvbCBzcGFuPVxcXCIxXFxcIiBzdHlsZT1cXFwid2lkdGg6IDUlO1xcXCI+XFxuICAgICAgICAgICAgICAgIDwvY29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgIDx0aGVhZD5cXG4gICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgPHRkPjwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8dGQ+0JjQvNGPPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDx0ZD7QkNC00YDQtdGBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDx0ZD7QotC10LvQtdGE0L7QvTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8dGQ+PC90ZD5cXG4gICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgPC90aGVhZD5cXG4gICAgICAgICAgICAgICAgPHRib2R5IG5nLXJlcGVhdD1cXFwiaXRlbSBpbiBkYXRhXFxcIj5cXG4gICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgPHRkPjxhIG5nLWhyZWY9XFxcIiMvY29tcGFuaWVzL3tAIGl0ZW0uaWQgQH1cXFwiPjxpIGNsYXNzPVxcXCJmaS1saW5rIHNpemUtMThcXFwiPjwvaT48L2E+PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDx0ZD57QGl0ZW0ubmFtZUB9PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDx0ZD57QGl0ZW0uYWxsb2NhdGlvbkB9PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDx0ZD57QGl0ZW0ucGhvbmVAfTwvdGQ+XFxuXFxuICAgICAgICAgICAgICAgICAgICA8dGQ+PGEgbmctY2xpY2s9XFxcImRlbGV0ZUNvbXBhbnkoaXRlbS5pZClcXFwiIGhyZWY9XFxcIlxcXCI+IDxpIGNsYXNzPVxcXCJmaS10cmFzaCBzaXplLTE4XFxcIj48L2k+PC9hPjwvdGQ+XFxuICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgIDwvdGJvZHk+XFxuICAgICAgICAgICAgPC90YWJsZT5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XFxuXCIpO1xufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICAgJHRlbXBsYXRlQ2FjaGUucHV0KCdhZG1pblxcdGVtcGxhdGVzXFxhZG1pbl9jb21wYW5pZXNfb3JkZXJfZGV0YWlsLmh0bWwnLFxuICAgICAgICBcIjxkaXYgY2xhc3M9J3JvdycgbmctY29udHJvbGxlcj0nT3JkZXJEZXRhaWxDdHInPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJsYXJnZS0xMiBjb2x1bW5zXFxcIj5cXG4gICAgICAgIDx0YWJsZT5cXG4gICAgICAgICAgICA8dHI+PHRkPklEPC90ZD48dGQ+e0BvcmRlci5pZEB9PC90ZD48L3RyPlxcbiAgICAgICAgICAgIDx0cj48dGQ+4oSWINCX0LDQutCw0LfQsDwvdGQ+PHRkPntAb3JkZXIub3JkZXJfY29udGFpbmVyQH08L3RkPjwvdHI+XFxuICAgICAgICAgICAgPHRyPjx0ZD7QmtC+0LzQvNC10L3RgtCw0YDQuNC5PC90ZD48dGQ+e0BvcmRlci5jb21tZW50QH08L3RkPjwvdHI+XFxuICAgICAgICAgICAgPHRyPjx0ZD7QodC/0L7RgdC+0LEg0L7Qv9C70LDRgtGLPC90ZD48dGQ+e0BvcmRlci5wYXllckB9PC90ZD48L3RyPlxcbiAgICAgICAgICAgIDx0cj48dGQ+0JLQtdGBPC90ZD48dGQ+e0BvcmRlci53ZWlnaHRAfTwvdGQ+PC90cj5cXG4gICAgICAgICAgICA8dHI+PHRkPtCU0LvQuNC90LA8L3RkPjx0ZD57QG9yZGVyLmRpbWVuc2lvbl94QH08L3RkPjwvdHI+XFxuXFxuICAgICAgICAgICAgPHRyPjx0ZD7QqNC40YDQuNC90LA8L3RkPjx0ZD57QG9yZGVyLmRpbWVuc2lvbl95QH08L3RkPjwvdHI+XFxuXFxuICAgICAgICAgICAgPHRyPjx0ZD7QktGL0YHQvtGC0LA8L3RkPjx0ZD57QG9yZGVyLmRpbWVuc2lvbl96QH08L3RkPjwvdHI+XFxuXFxuICAgICAgICAgICAgPHRyPjx0ZD7QkNC00YDQtdGBINC/0L7Qu9GD0YfQsNGC0LXQu9GPPC90ZD48dGQ+e0BvcmRlci5yZWNpcGVpbnRfYWRyZXNzQH08L3RkPjwvdHI+XFxuICAgICAgICAgICAgPHRyPjx0ZD7QkNC00YDQtdGBINC+0YLQv9GA0LDQstC40YLQtdC70Y88L3RkPjx0ZD57QG9yZGVyLnNlbmRlcl9hZHJlc3NAfTwvdGQ+PC90cj5cXG4gICAgICAgICAgICA8dHI+PHRkPtCi0LjQvyDQvtGC0L/RgNCw0LLQu9C10L3QuNGPPC90ZD48dGQ+e0BvcmRlci5pc19kb2NzQH08L3RkPjwvdHI+XFxuICAgICAgICAgICAgPHRyPjx0ZD7QktGA0LXQvNGPINC+0YLQv9GA0LDQstC70LXQvdC40Y88L3RkPjx0ZD57QG9yZGVyLm9yZGVyX2RhdGV0aW1lQH08L3RkPiA8L3RyPlxcbiAgICAgICAgICAgIDx0cj48dGQ+0JLRgNC10LzRjyDRgdC+0LfQtNCw0L3QuNGPINC30LDRj9Cy0LrQuDwvdGQ+PHRkPntAb3JkZXIuY3JlYXRlcl9kYXRldGltZUB9PC90ZD4gPC90cj5cXG4gICAgICAgIDwvdGFibGU+XFxuXFxuXFxuXFxuICAgIDwvZGl2PlxcbjwvZGl2PlxcblwiKTtcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJykucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnYWRtaW5cXHRlbXBsYXRlc1xcYWRtaW5fbm90aWZpY2F0aW9ucy5odG1sJyxcbiAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cnIG5nLWNvbnRyb2xsZXI9J05vdGlmaWNhdGlvbnNDdHInPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJsYXJnZS0xMiBjb2x1bW5zXFxcIj5cXG4gICAgICAgIDxkaXYgbmctcmVwZWF0PVxcXCJpdGVtIGluIGRhdGFcXFwiPlxcbiAgICAgICAgICAgIDxwPtCe0YLQstC10YHRgtCy0LXQvdC90YvQuSDQvNC10L3QtdC00LbQtdGAIDxhIGhyZWY9XFxcIiMvY3VzdG9tZXIve0BpdGVtLm1hbmFnZXJAfVxcXCI+PGkgY2xhc3M9XFxcImZpLWxpbmsgc2l6ZS0xOFxcXCI+PC9pPjwvYT48L3A+XFxuICAgICAgICAgICAgPHA+0JrQvtC80L/QsNC90LjRjyA8YSBocmVmPVxcXCIjL2NvbXBhbmllcy97QGl0ZW0uY29tcGFueUB9XFxcIj48aSBjbGFzcz1cXFwiZmktbGluayBzaXplLTE4XFxcIj48L2k+PC9hPjwvcD5cXG4gICAgICAgICAgICA8cD57QGl0ZW0udGV4dEB9PC9wPlxcbiAgICAgICAgICAgIDxwPtCS0YDQtdC80Y86IHtAaXRlbS50aW1lQH08L3A+XFxuICAgICAgICAgICAgPGEgaHJlZj1cXFwiXFxcIiAgbmctY2xpY2s9J2RlbGV0ZShpdGVtLmlkKScgY2xhc3M9XFxcImJ1dHRvbiB0aW55XFxcIj7Qo9C00LDQu9C40YLRjDwvYT5cXG4gICAgICAgICAgICA8aHIvPlxcbiAgICAgICAgPC9kaXY+XFxuICAgIDwvZGl2PlxcbjwvZGl2PlxcblwiKTtcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJykucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnYWRtaW5cXHRlbXBsYXRlc1xcYWRtaW5fb3JkZXJfY29udGFpbmVyX2RldGFpbC5odG1sJyxcbiAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cnIG5nLWNvbnRyb2xsZXI9J09yZGVyQ29udGFpbmVyQ3RyJz5cXG4gICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtMTIgY29sdW1uc1xcXCI+XFxuXFxuICAgICAgICA8ZmllbGRzZXQ+XFxuICAgICAgICAgICAgPGxlZ2VuZD7Qn9GA0L7QtdC60YI8L2xlZ2VuZD5cXG4gICAgICAgIDxkaXY+XFxuICAgICAgICAgICAge0BkYXRhLm9yZGVyQ29udGFpbmVycy5pZEB9XFxuICAgICAgICAgICAge0BkYXRhLm9yZGVyQ29udGFpbmVycy5zdGF0dXNAfVxcbiAgICAgICAgICAgIHtAZGF0YS5vcmRlckNvbnRhaW5lcnMuY3VzdG9tZXJfZGF0ZUB9XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDwvZmllbGRzZXQ+XFxuICAgICAgIDxmaWxlZHNldD5cXG4gICAgICAgICAgIDxsZWdlbmQ+0KHRgtCw0YLRg9GB0Ysg0LrQvtC90YLRgNCw0LrRgtCwPC9sZWdlbmQ+XFxuICAgICAgICAgIDxkaXYgbmctcmVwZWF0PVxcXCJpdGVtIGluIGRhdGEuc3RhdHVzXFxcIj5cXG4gICAgICAgICAgICAgIHtAaXRlbS5zdGF0dXMgfCBpbnQyc3RhdHVzIEB9IHtAaXRlbS50aW1lX2NoYW5nZUB9XFxuICAgICAgICAgIDwvZGl2PlxcblxcbiAgICAgICA8L2ZpbGVkc2V0PlxcblxcbiAgICAgICAgPGZpZWxkc2V0PlxcbiAgICAgICAgICAgIDxsZWdlbmQ+0KTQsNC50LvRiyDQv9GA0L7QtdC60YLQsDwvbGVnZW5kPlxcbiAgICAgICAgPGRpdiBuZy1yZXBlYXQ9XFxcImZpbGUgaW4gZGF0YS5maWxlc1xcXCI+XFxuICAgICAgICAgICAge0BkYXRhLmZpbGUudXNlckB9XFxuICAgICAgICAgICAge0BkYXRhLmZpbGUuaWRAfVxcbiAgICAgICAgICAgIDxhIGhyZWY9XFxcIm1lZGlhL3tAZmlsZS5maWxlQH1cXFwiPntAZmlsZS5maWxlQH08L2E+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDwvZmllbGRzZXQ+XFxuXFxuICAgICAgICA8ZmllbGRzZXQ+XFxuICAgICAgICAgICAgPGxlZ2VuZD7Ql9Cw0LrQsNC30Ys8L2xlZ2VuZD5cXG4gICAgICAgICAgICA8ZGl2IG5nLXJlcGVhdD1cXFwib3JkZXIgaW4gZGF0YS5vcmRlcnNcXFwiPlxcbiAgICAgICAgICAgICAgICA8YSBocmVmPVxcXCIjL29yZGVyLWNvbnRhaW5lci97QGRhdGEub3JkZXJDb250YWluZXJzLmlkQH0vb3JkZXJzL3tAb3JkZXIuaWRAfVxcXCI+PGkgY2xhc3M9XFxcImZpLXBhcGVyY2xpcCBzaXplLTE4XFxcIj48L2k+PC9hPlxcbiAgICAgICAgICAgICAgICB7QG9yZGVyLmlkQH1cXG4gICAgICAgICAgICAgICAge0BvcmRlci5wYXllckB9XFxuICAgICAgICAgICAgICAgIHtAb3JkZXIuY29tbWVudEB9XFxuICAgICAgICAgICAgICAgIHtAb3JkZXIud2VpZ2h0QH1cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDwvZmllbGRzZXQ+XFxuXFxuICAgICAgICA8ZmllbGRzZXQ+XFxuICAgICAgICAgICAgPGxlZ2VuZD48YSBocmVmPVxcXCIjL29yZGVyLWNvbnRhaW5lci97QGRhdGEub3JkZXJDb250YWluZXJzLmlkQH0vc2NoZWR1bGVcXFwiPtCg0LDRgdC/0LjRgdCw0L3QuNC1PC9hPjwvbGVnZW5kPlxcbiAgICAgICAgICAgIDxkaXYgbmctcmVwZWF0PVxcXCJpdGVtIGluIGRhdGEuc2NoZWR1bGVcXFwiPlxcbiAgICAgICAgICAgICAgICA8YSBocmVmPVxcXCIjL29yZGVyLWNvbnRhaW5lci97QGRhdGEub3JkZXJDb250YWluZXJzLmlkQH0vc2NoZWR1bGUve0BpdGVtLmlkQH1cXFwiPjxpIGNsYXNzPVxcXCJmaS1wYXBlcmNsaXAgc2l6ZS0xOFxcXCI+PC9pPjwvYT5cXG4gICAgICAgICAgICAgICAge0BpdGVtLmlkQH1cXG4gICAgICAgICAgICAgICAge0BpdGVtLmRhdGVAfVxcbiAgICAgICAgICAgICAgICB7QGl0ZW0uc3RhcnRfdGltZUB9XFxuICAgICAgICAgICAgICAgIHtAaXRlbS5lbmRfdGltZUB9XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2ZpZWxkc2V0PlxcblxcbiAgICA8L2Rpdj5cXG48L2Rpdj5cIik7XG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgICAkdGVtcGxhdGVDYWNoZS5wdXQoJ2FkbWluXFx0ZW1wbGF0ZXNcXGFkbWluX29yZGVyX2V4cHJlc3NfZGV0YWlsLmh0bWwnLFxuICAgICAgICBcIjxkaXYgY2xhc3M9J3JvdycgbmctY29udHJvbGxlcj0nT2RlckV4cHJlc3NEZXRhaWxDdHInPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJsYXJnZS0xMiBjb2x1bW5zXFxcIj5cXG5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XFxuXFxuXCIpO1xufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICAgJHRlbXBsYXRlQ2FjaGUucHV0KCdhZG1pblxcdGVtcGxhdGVzXFxjdXN0b21lcl9hY2NvdW50Lmh0bWwnLFxuICAgICAgICBcIjxkaXYgY2xhc3M9J3JvdycgbmctY29udHJvbGxlcj0nQ3VzdG9tZXJBY2NvdW50Q3RyJz5cXG4gICAgPGRpdiBjbGFzcz1cXFwic21hbGwtNiBjb2x1bW5zXFxcIiBuZy1zaG93PVxcXCIhZWRpdFxcXCI+XFxuICAgICAgICA8dGFibGU+XFxuICAgICAgICAgICAgPGNvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICA8Y29sIHNwYW49XFxcIjFcXFwiIHN0eWxlPVxcXCJ3aWR0aDogMjAlO1xcXCI+XFxuICAgICAgICAgICAgICAgIDxjb2wgc3Bhbj1cXFwiMVxcXCIgc3R5bGU9XFxcIndpZHRoOiA4MCU7XFxcIj5cXG4gICAgICAgICAgICA8L2NvbGdyb3VwPlxcbiAgICAgICAgICAgIDx0Ym9keT5cXG4gICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgIDx0ZD7Qn9C+0YfRgtCwPC90ZD5cXG4gICAgICAgICAgICAgICAgPHRkPntAZGF0YS5lbWFpbEB9PC90ZD5cXG4gICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgPHRkPtCU0LDRgtCwINGA0LXQs9C40YHRgtGA0LDRhtC40Lg8L3RkPlxcbiAgICAgICAgICAgICAgICA8dGQ+e0BkYXRhLmRhdGVfam9pbmVkQH08L3RkPlxcbiAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICA8dGQ+0JrQvtC90YLQsNC60YLQvdC+0LUg0LvQuNGG0L48L3RkPlxcbiAgICAgICAgICAgICAgICA8dGQ+e0BkYXRhLmxhc3RfbmFtZUB9IHtAZGF0YS5maXJzdF9uYW1lQH08L3RkPlxcbiAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICA8dGQ+0J/RgNC40LLQuNC70LXQs9C40Lgg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPPC90ZD5cXG4gICAgICAgICAgICAgICAgPHRkID48c3BhbiBuZy1yZXBlYXQ9XFxcIml0ZW0gaW4gZGF0YS5wZXJtaXNzaW9uc19uYW1lc1xcXCI+e0BpdGVtQH0gPC9zcGFuPjwvdGQ+XFxuICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICA8L3Rib2R5PlxcbiAgICAgICAgPC90YWJsZT5cXG4gICAgICAgIDxhIGhyZWY9XFxcIlxcXCIgY2xhc3M9XFxcImJ1dHRvblxcXCIgbmctY2xpY2s9XFxcInN0YXJ0RWRpdCgpXFxcIj7QoNC10LTQsNC60YLQuNGA0L7QstCw0YLRjDwvYT5cXG4gICAgPC9kaXY+XFxuICAgIDxkaXYgbmctc2hvdz0nZWRpdCc+XFxuICAgICAgICA8Zm9ybT5cXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgbmctbW9kZWw9XFxcImRhdGEuZW1haWxcXFwiLz5cXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgbmctbW9kZWw9XFxcImRhdGEubGFzdF9uYW1lXFxcIi8+XFxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIG5nLW1vZGVsPVxcXCJkYXRhLmZpcnN0X25hbWVcXFwiLz5cXG4gICAgICAgICAgICA8c2VsZWN0IG5nLW1vZGVsPVxcXCJkYXRhLnBlcm1pc3Npb25zXFxcIiBuZy1vcHRpb25zPVxcXCJwZXJtaXNzaW9uLmlkIGFzIHBlcm1pc3Npb24ucGVybWlzc2lvbiBmb3IgcGVybWlzc2lvbiBpbiBwZXJtaXNzaW9uc1xcXCIgcmVxdWlyZWQ+PC9zZWxlY3Q+XFxuICAgICAgICAgICAgPGEgY2xhc3M9XFxcImJ1dHRvblxcXCIgaHJlZj1cXFwiXFxcIiBuZy1jbGljaz1cXFwicHV0VXNlcigpXFxcIj7QodC+0YXRgNCw0L3QuNGC0Yw8L2k+PC9hPlxcbiAgICAgICAgPC9mb3JtPlxcbiAgICA8L2Rpdj5cXG48L2Rpdj5cXG48c2NyaXB0IHR5cGU9XFxcInRleHQvamF2YXNjcmlwdFxcXCI+IGpRdWVyeSgnLmRhdGV0aW1lcGlja2VyJykuZGF0ZXRpbWVwaWNrZXIoIHsgb25HZW5lcmF0ZTpmdW5jdGlvbiggY3QgKXsgalF1ZXJ5KHRoaXMpLmZpbmQoJy54ZHNvZnRfZGF0ZS54ZHNvZnRfd2Vla2VuZCcpIC5hZGRDbGFzcygneGRzb2Z0X2Rpc2FibGVkJyk7IH0sIGZvcm1hdDpcXFwiZC5tLlkgSDppXFxcIiwgbGFuZzogJ3J1JywgbWluVGltZTonMTA6MDAnLCBtYXhUaW1lOicyMTowMCcsIHRpbWVwaWNrZXJTY3JvbGxiYXI6J2ZhbHNlJywgZGF5T2ZXZWVrU3RhcnQ6IDEgfSkgPC9zY3JpcHQ+XFxuXCIpO1xufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICAgJHRlbXBsYXRlQ2FjaGUucHV0KCdhZG1pblxcdGVtcGxhdGVzXFxjdXN0b21lcnNfbGlzdC5odG1sJyxcbiAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cnIG5nLWNvbnRyb2xsZXI9J0N1c3RvbWVyc0N0cic+XFxuICAgIDxkaXYgY2xhc3M9XFxcInR3ZWx2ZSBjb2x1bW5zIGNlbnRlcmVkXFxcIj5cXG4gICAgICAgIDxmb3JtIG5nLXN1Ym1pdD1cXFwiZ2V0KClcXFwiPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxhcmdlLTYgY29sdW1uc1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWw+0J/QvtC40YHQulxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwi0JLQstC10LTQuNGC0LUg0LTQsNC90L3Ri9C1XFxcIiBuZy1tb2RlbD1cXFwic2VhcmNoXFxcIi8+XFxuICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDwvZm9ybT5cXG4gICAgICAgIDx0YWJsZT5cXG4gICAgICAgICAgICA8Y29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgIDxjb2wgc3Bhbj1cXFwiMVxcXCIgc3R5bGU9XFxcIndpZHRoOiA1JTtcXFwiPlxcbiAgICAgICAgICAgICAgICA8Y29sIHNwYW49XFxcIjFcXFwiIHN0eWxlPVxcXCJ3aWR0aDogNDUlO1xcXCI+XFxuICAgICAgICAgICAgICAgIDxjb2wgc3Bhbj1cXFwiMVxcXCIgc3R5bGU9XFxcIndpZHRoOiA0NSU7XFxcIj5cXG4gICAgICAgICAgICAgICAgPGNvbCBzcGFuPVxcXCIxXFxcIiBzdHlsZT1cXFwid2lkdGg6IDUlXFxcIj5cXG4gICAgICAgICAgICA8L2NvbGdyb3VwPlxcbiAgICAgICAgICAgIDx0aGVhZD5cXG4gICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgIDx0ZD48L3RkPlxcbiAgICAgICAgICAgICAgICA8dGQ+0JrQvtC90YLQsNC60YLQvdC+0LUg0LvQuNGG0L48L3RkPlxcbiAgICAgICAgICAgICAgICA8dGQ+0J/QvtGH0YLQsDwvdGQ+XFxuICAgICAgICAgICAgICAgIDx0ZD48L3RkPlxcbiAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgPC90aGVhZD5cXG4gICAgICAgICAgICA8dGJvZHk+XFxuICAgICAgICAgICAgPHRyIG5nLXJlcGVhdD0naXRlbSBpbiBkYXRhJz5cXG4gICAgICAgICAgICAgICAgPHRkPjxhIG5nLWhyZWY9XFxcIiMvY3VzdG9tZXIve0AgaXRlbS5pZCBAfVxcXCI+PGkgY2xhc3M9XFxcImZpLWxpbmsgc2l6ZS0xOFxcXCI+PC9pPjwvYT48L3RkPlxcbiAgICAgICAgICAgICAgICA8dGQ+e0AgaXRlbS5maXJzdF9uYW1lIEB9IHtAIGl0ZW0ubGFzdF9uYW1lIEB9PC90ZD5cXG4gICAgICAgICAgICAgICAgPHRkPiB7QGl0ZW0uZW1haWxAfSA8L3RkPlxcbiAgICAgICAgICAgICAgICA8dGQ+PGEgaHJlZj1cXFwiXFxcIiBuZy1jbGljaz1cXFwiZGVsZXRlKGl0ZW0uaWQpXFxcIj48aSBjbGFzcz1cXFwiZmktdHJhc2ggc2l6ZS0xOFxcXCI+PC9pPjwvYT48L3RkPlxcbiAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgPC90Ym9keT5cXG4gICAgICAgIDwvdGFibGU+XFxuICAgICAgICA8YSBjbGFzcz1cXFwiYnV0dG9uXFxcIiBocmVmPVxcXCIjL3JlZ2lzdHJhdGlvblxcXCI+0JTQvtCx0LDQstC40YLRjDwvYT5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XFxuXCIpO1xufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICAgJHRlbXBsYXRlQ2FjaGUucHV0KCdhZG1pblxcdGVtcGxhdGVzXFxkZWxpdmVyeS5odG1sJyxcbiAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cnIG5nLWNvbnRyb2xsZXI9J0RlbGl2ZXJ5Q3RyJz5cXG4gICAgPGRpdiBjbGFzcz1cXFwidHdlbHZlIGNvbHVtbnMgY2VudGVyZWRcXFwiPlxcbiAgICAgICAgPGZpZWxkc2V0PlxcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwi0JLQtdGBXFxcIiBuZy1tb2RlbD1cXFwiZm9ybS53ZWlnaHRcXFwiLz5cXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcItCQ0LTRgNC10YFcXFwiIG5nLW1vZGVsPVxcXCJmb3JtLmFkcmVzc1xcXCIvPlxcbiAgICAgICAgICAgIDxzZWxlY3QgbmctbW9kZWw9XFxcImZvcm0udHlwZVxcXCIgbmctb3B0aW9ucz1cXFwiaXRlbS5pZCBhcyBpdGVtLm5hbWUgZm9yIGl0ZW0gaW4gdGFyaWZzXFxcIj4gPC9zZWxlY3Q+XFxuICAgICAgICAgICAgPGEgaHJlZj1cXFwiXFxcIiBjbGFzcz1cXFwiYnV0dG9uXFxcIiB2YWx1ZT1cXFwiXFxcIiBuZy1jbGljaz1cXFwiYWRkKClcXFwiPmFkZDwvYT5cXG4gICAgICAgIDwvZmllbGRzZXQ+XFxuICAgICAgICAgICAgPHRhYmxlPlxcblxcdFxcdFxcdDx0Ym9keT5cXG5cXHRcXHRcXHRcXHQ8dHIgbmctcmVwZWF0PSdpdGVtIGluIGRhdGEnPlxcbiAgICAgICAgICAgICAgICAgICAgPHRkPntAaXRlbS5pZEB9PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDx0ZD57QGl0ZW0ud2VpZ2h0QH08L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgPHRkPntAaXRlbS5hZHJlc3NAfTwvdGQ+XFxuXFx0XFx0XFx0XFx0PC90cj5cXG5cXHRcXHRcXHQ8L3Rib2R5PlxcblxcdFxcdDwvdGFibGU+XFxuICAgIDwvZGl2PlxcbjwvZGl2PlxcblwiKTtcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJykucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnYWRtaW5cXHRlbXBsYXRlc1xcZmFzdF9vcmRlci5odG1sJyxcbiAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cnIG5nLWNvbnRyb2xsZXI9J0Zhc3RPcmRlckN0cic+XFxuICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsYXJnZS0xMiBjb2x1bW5zXFxcIj5cXG4gICAgICAgICAgICA8IS0tINCk0L7RgNC80LAg0YHQvtC30LTQsNC90LjRjyDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y8gLS0+XFxuICAgICAgICAgICAgPGZpZWxkc2V0IG5nLXNob3c9XFxcIiFmb3JtU3RhdGUucmVnaXN0cmF0aW9uSXNEb25lXFxcIj5cXG4gICAgICAgICAgICAgICAgPGxlZ2VuZD7QodC+0LfQtNCw0L3QuNC1INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjzwvbGVnZW5kPlxcblxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtNiBjb2x1bW5zXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWw+0K3Qu9C10LrRgtGA0L7QvdC90LDRjyDQv9C+0YfRgtCwXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJlbWFpbFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcXCIgbmctbW9kZWw9XFxcInVzZXIuZW1haWxcXFwiLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsYXJnZS02IGNvbHVtbnMgXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWw+0J/QsNGA0L7Qu9GMXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJwYXNzd29yZFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcXCIgbmctbW9kZWw9XFxcInVzZXIucGFzc3dvcmRcXFwiLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtNiBjb2x1bW5zXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWw+0JjQvNGPXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwiXFxcIiBuZy1tb2RlbD1cXFwidXNlci5maXJzdF9uYW1lXFxcIi8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtNiBjb2x1bW5zIGVuZFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsPtCk0LDQvNC40LvQuNGPXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBwbGFjZWhvbGRlcj1cXFwiXFxcIiBuZy1tb2RlbD1cXFwidXNlci5sYXN0X25hbWVcXFwiLz5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtNiBjb2x1bW5zIGVuZFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsPtCi0LXQu9C10YTQvtC9XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZWxcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXFwiIG5nLW1vZGVsPVxcXCJ1c2VyLnBob25lXFxcIi8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtNiBjb2x1bW5zIFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsPtCd0LDQt9Cy0LDQvdC40LUg0LrQvtC80L/QsNC90LjQuFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcXCIgbmctbW9kZWw9XFxcInVzZXIuY29tcGFueV9uYW1lXFxcIi8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cXFwiXFxcIiBjbGFzcz1cXFwiYnV0dG9uXFxcIiB2YWx1ZT1cXFwiXFxcIiBuZy1jbGljaz1cXFwiYWRkVXNlcigpXFxcIj7Ql9Cw0YDQtdCz0LjRgdGC0YDQuNGA0L7QstCw0YLRjDwvYT5cXG5cXG4gICAgICAgICAgICA8L2ZpZWxkc2V0PlxcblxcblxcbiAgICAgICAgICAgIDwhLS0g0J/QvtC60LDQt9GL0LLQsNC10Lwg0YTQvtGA0LzRgyDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y8gLS0+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwiXFxcIiBuZy1zaG93PVxcXCJmb3JtU3RhdGUucmVnaXN0cmF0aW9uSXNEb25lXFxcIj5cXG4gICAgICAgICAgICAgICAgPGZpZWxkc2V0PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsYXJnZS02IGNvbHVtbnNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWw+0JjQvNGPXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57QGZvcm1TdGF0ZS5BZGRlZFVzZXIuZmlyc3RfbmFtZUB9PC9wPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxhcmdlLTYgY29sdW1ucyBlbmRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWw+0KTQsNC80LjQu9C40Y9cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPntAZm9ybVN0YXRlLkFkZGVkVXNlci5sYXN0X25hbWVAfTwvcD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcblxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsYXJnZS02IGNvbHVtbnNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWw+0K3Qu9C10LrRgtGA0L7QvdC90LDRjyDQv9C+0YfRgtCwXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57QGZvcm1TdGF0ZS5BZGRlZFVzZXIuZW1haWxAfTwvcD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsYXJnZS02IGNvbHVtbnMgZW5kXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsPtCS0YDQtdC80Y8g0YDQtdCz0LjRgdGC0YDQsNGG0LjQuFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+e0Bmb3JtU3RhdGUuQWRkZWRVc2VyLmRhdGVfam9pbmVkQH08L3A+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9maWVsZHNldD5cXG4gICAgICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG5cXG4gICAgPCEtLSDQpNC+0YDQvNCwINC+0YLQv9GA0LDQstC70LXQvdC40Y8g0LfQsNC60LDQt9CwIC0tPlxcbiAgICA8ZmllbGRzZXQgbmctc2hvdz1cXFwiZm9ybVN0YXRlLnJlZ2lzdHJhdGlvbklzRG9uZVxcXCI+XFxuICAgICAgICA8bGVnZW5kPtCe0YLQv9GA0LDQstC70LXQvdC40LU6PC9sZWdlbmQ+XFxuICAgICAgICA8cD7QlNCw0YLQsCDQv9GA0LjQtdC30LTQsCDQutGD0YDRjNC10YDQsDo8L3A+XFxuICAgICAgICA8aW5wdXQgY2xhc3M9XFxcImRhdGV0aW1lcGlja2VyXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBuZy1tb2RlbD0nZm9ybS5vcmRlcl9kYXRldGltZSc+XFxuICAgICAgICA8cD7Qn9C70LDRgtC10LvRjNGJ0LjQujo8L3A+XFxuICAgICAgICA8c2VsZWN0IG5nLW1vZGVsPSdmb3JtLnBheWVyJz5cXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVxcXCIxXFxcIj7QntGC0L/RgNCw0LLQuNGC0LXQu9GMPC9vcHRpb24+XFxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cXFwiMlxcXCI+0J/QvtC70YPRh9Cw0YLQtdC70Yw8L29wdGlvbj5cXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVxcXCIzXFxcIj7QotGA0LXRgtGM0LUg0LvQuNGG0L48L29wdGlvbj5cXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVxcXCI0XFxcIj7QntGC0L/RgNCw0LLQuNGC0LXQu9GMICjQsdC10LfQvdCw0LvQuNGH0L3Ri9C5INGA0LDRgdGH0LXRgik8L29wdGlvbj5cXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVxcXCI1XFxcIj7Qn9C+0LvRg9GH0LDRgtC10LvRjCAo0LHQtdC30L3QsNC70LjRh9C90YvQuSDRgNCw0YHRh9C10YIpPC9vcHRpb24+XFxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cXFwiNlxcXCI+0KLRgNC10YLRjNC1INC70LjRhtC+ICjQsdC10LfQvdCw0LvQuNGH0L3Ri9C5INGA0LDRgdGH0LXRgik8L29wdGlvbj5cXG4gICAgICAgIDwvc2VsZWN0PlxcbiAgICAgICAgPHA+PHNwYW4gY2xhc3M9XFxcIm1hcmtcXFwiPioqPC9zcGFuPtCS0LXRgSAo0LrQsyk6PC9wPlxcbiAgICAgICAgPGlucHV0IG5nLW1vZGVsPSdmb3JtLndlaWdodCcgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcIndlaWdodFxcXCI+XFxuXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICAgIDxmaWVsZHNldD5cXG4gICAgICAgICAgICAgICAgPGxlZ2VuZD48cD48c3BhbiBjbGFzcz1cXFwibWFya1xcXCI+Kio8L3NwYW4+0KDQsNC30LzQtdGA0YsgKNGB0LwpOjwvcD48L2xlZ2VuZD5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtNCBjb2x1bW5zXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxwPtCU0LvQuNC90LA8L3A+XFxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgbmctbW9kZWw9J2Zvcm0uZGltZW5zaW9uX3gnIHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJsZW5ndGhcXFwiPlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtNCBjb2x1bW5zXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxwPtCo0LjRgNC40L3QsDwvcD5cXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBuZy1tb2RlbD0nZm9ybS5kaW1lbnNpb25feScgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcIndpZHRoXFxcIj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxhcmdlLTQgY29sdW1uc1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8cD7QktGL0YHQvtGC0LA8L3A+XFxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgbmctbW9kZWw9J2Zvcm0uZGltZW5zaW9uX3onICB0eXBlPVxcXCJ0ZXh0XFxcIiBjbGFzcz1cXFwiaGVpZ2h0XFxcIj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPC9maWVsZHNldD5cXG4gICAgICAgIDwvZGl2PlxcblxcblxcbiAgICAgICAgPHA+0JrQvtC80LzQtdC90YLQsNGA0LjQuTo8L3A+XFxuICAgICAgICA8aW5wdXQgbmctbW9kZWw9J2Zvcm0uY29tbWVudCcgdHlwZT1cXFwidGV4dFxcXCI+XFxuXFxuICAgICAgICA8cD7QotC40L8g0L7RgtC/0YDQsNCy0LvQtdC90LjRjzo8L3A+XFxuICAgICAgICA8c2VsZWN0IG5nLW1vZGVsPSdmb3JtLmlzX2RvY3MnPlxcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9J3RydWUnIHNlbGVjdGVkPVxcXCJzZWxlY3RlZFxcXCI+0JTQvtC60YPQvNC10L3RgtGLPC9vcHRpb24+XFxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT0nZmFsc2UnPtCi0L7QstCw0YDRizwvb3B0aW9uPlxcbiAgICAgICAgPC9zZWxlY3Q+XFxuXFxuICAgICAgICA8cD7QkNC00YDQtdGBINC+0YLQv9GA0LDQstC40YLQtdC70Y88L3A+XFxuICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgbmctbW9kZWw9XFxcImZvcm0uc2VuZGVyX2FkcmVzc1xcXCI+XFxuXFxuICAgICAgICA8cD7QkNC00YDQtdGBINC/0L7Qu9GD0YfQsNGC0LXQu9GPPC9wPlxcbiAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIG5nLW1vZGVsPVxcXCJmb3JtLnJlY2lwZWludF9hZHJlc3NcXFwiPlxcblxcbiAgICAgICAgPGEgaHJlZj1cXFwiXFxcIiBjbGFzcz1cXFwiYnV0dG9uXFxcIiB2YWx1ZT1cXFwiXFxcIiBuZy1jbGljaz1cXFwic2VuZGZvcm0oKVxcXCI+0JTQvtCx0LDQstC40YLRjCDQt9Cw0LrQsNC3PC9hPlxcbiAgICA8L2ZpZWxkc2V0PlxcbjwvZGl2PlxcblxcbjxzY3JpcHQgdHlwZT1cXFwidGV4dC9qYXZhc2NyaXB0XFxcIj4galF1ZXJ5KCcuZGF0ZXRpbWVwaWNrZXInKS5kYXRldGltZXBpY2tlciggeyBvbkdlbmVyYXRlOmZ1bmN0aW9uKCBjdCApeyBqUXVlcnkodGhpcykuZmluZCgnLnhkc29mdF9kYXRlLnhkc29mdF93ZWVrZW5kJykgLmFkZENsYXNzKCd4ZHNvZnRfZGlzYWJsZWQnKTsgfSwgZm9ybWF0OlxcXCJZLW0tZFxcXFxcXFxcVEg6aVxcXCIsIGxhbmc6ICdydScsIG1pblRpbWU6JzEwOjAwJywgbWF4VGltZTonMjE6MDAnLCB0aW1lcGlja2VyU2Nyb2xsYmFyOidmYWxzZScsIGRheU9mV2Vla1N0YXJ0OiAxIH0pIDwvc2NyaXB0PlxcblwiKTtcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJykucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnYWRtaW5cXHRlbXBsYXRlc1xcb3JkZXJzX2xpc3QuaHRtbCcsXG4gICAgICAgIFwiPGRpdiBjbGFzcz0ncm93JyBuZy1jb250cm9sbGVyPSdPcmRlcnNMaXN0Q3RyJz5cXG4gICAgPGRpdiBjbGFzcz1cXFwidHdlbHZlIGNvbHVtbnMgY2VudGVyZWRcXFwiPlxcblxcbiAgICAgICAgPHRhYmxlPlxcbiAgICAgICAgICAgIDx0aGVhZD5cXG4gICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgIDx0ZD7QktC10YE8L3RkPlxcbiAgICAgICAgICAgICAgICA8dGQ+0KjQuNGA0LjQvdCwPC90ZD5cXG4gICAgICAgICAgICAgICAgPHRkPtCS0YvRgdC+0YLQsDwvdGQ+XFxuICAgICAgICAgICAgICAgIDx0ZD7QlNC70LjQvdC90LA8L3RkPlxcbiAgICAgICAgICAgICAgICA8dGQ+0KbQtdC90L3QvtGB0YLRjDwvdGQ+XFxuICAgICAgICAgICAgICAgIDx0ZD7QmtGD0LTQsDwvdGQ+XFxuICAgICAgICAgICAgICAgIDx0ZD7QntGC0LrRg9C00LA8L3RkPlxcbiAgICAgICAgICAgICAgICA8dGQ+0JTQvtC60YPQvNC10L3RgtGLPC90ZD5cXG4gICAgICAgICAgICAgICAgPHRkPtCU0LDRgtCwINC30LDQutCw0LfQsDwvdGQ+XFxuICAgICAgICAgICAgPC90cj5cXG5cXG4gICAgICAgICAgICA8L3RoZWFkPlxcbiAgICAgICAgICAgIDx0Ym9keT5cXG4gICAgICAgICAgICA8dHIgbmctcmVwZWF0PVxcXCJpdGVtIGluIGRhdGFcXFwiPlxcbiAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICB7QGl0ZW0ud2VpZ2h0QH1cXG4gICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAge0BpdGVtLmRpbWVuc2lvbl94QH1cXG4gICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAge0BpdGVtLmRpbWVuc2lvbl95QH1cXG4gICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAge0BpdGVtLmRpbWVuc2lvbl96QH1cXG4gICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAge0BpdGVtLndvcnRoQH1cXG4gICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAge0BpdGVtLnJlY2lwZWludF9hZHJlc3NAfVxcbiAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICB7QGl0ZW0uc2VuZGVyX2FkcmVzc0B9XFxuICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgIDx0ZCBuZy1iaW5kLWh0bWw9XFxcIml0ZW0uaXNfZG9jcyB8IGJvb2wyaWNvblxcXCI+XFxuICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgIHtAaXRlbS5vcmRlcl9kYXRldGltZUB9XFxuICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICA8L3Rib2R5PlxcbiAgICAgICAgPC90YWJsZT5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XCIpO1xufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICAgJHRlbXBsYXRlQ2FjaGUucHV0KCdhZG1pblxcdGVtcGxhdGVzXFxyZWdpc3RyYXRpb24uaHRtbCcsXG4gICAgICAgIFwiPGRpdiBjbGFzcz0ncm93JyBuZy1jb250cm9sbGVyPSdSZWdpc3RyYXRpb25DdHInPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ0d2VsdmUgY29sdW1ucyBjZW50ZXJlZFxcXCI+XFxuICAgICAgICA8ZmllbGRzZXQ+XFxuXFxuICAgICAgICAgICAgPGZvcm0gbmFtZT1cXFwiZm9ybVxcXCIgbm92YWxpZGF0ZT5cXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3M9XFxcImNvbnRyb2wtbGFiZWxcXFwiIGZvcj1cXFwiZW1haWxcXFwiPtCt0LvQtdC60YLRgNC+0L3QvdCw0Y8g0L/QvtGH0YLQsDo8L2xhYmVsPlxcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJlbWFpbFxcXCIgbmFtZT1cXFwiZW1haWxcXFwiIG5nLW1vZGVsPVxcXCJmb3JtLnVzZXIuZW1haWxcXFwiIHJlcXVpcmVkIG5nLW1pbmxlbmd0aD0xIG5nLW1heGxlbmd0aD04MD5cXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3M9XFxcImNvbnRyb2wtbGFiZWxcXFwiIGZvcj1cXFwicGFzc3dvcmRcXFwiPnBhc3N3b3JkOjwvbGFiZWw+XFxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIG5hbWU9XFxcInBhc3N3b3JkXFxcIiBuZy1tb2RlbD1cXFwiZm9ybS51c2VyLnBhc3N3b3JkXFxcIiByZXF1aXJlZCBuZy1taW5sZW5ndGg9NSBuZy1tYXhsZW5ndGg9MTY+XFxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVxcXCJjb250cm9sLWxhYmVsXFxcIiBmb3I9XFxcImZpcnN0X25hbWVcXFwiPtCY0LzRjzo8L2xhYmVsPlxcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBuYW1lPVxcXCJmaXJzdF9uYW1lXFxcIiBuZy1tb2RlbD1cXFwiZm9ybS51c2VyLmZpcnN0X25hbWVcXFwiIHJlcXVpcmVkIG5nLW1pbmxlbmd0aD0zIG5nLW1heGxlbmd0aD0yNT5cXG4gICAgICAgICAgICA8bGFiZWwgY2xhc3M9XFxcImNvbnRyb2wtbGFiZWxcXFwiIGZvcj1cXFwibGFzdF9uYW1lXFxcIj7QpNCw0LzQuNC70LjRjzo8L2xhYmVsPlxcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBuYW1lPVxcXCJsYXN0X25hbWVcXFwiIG5nLW1vZGVsPVxcXCJmb3JtLnVzZXIubGFzdF9uYW1lXFxcIiByZXF1aXJlZCBuZy1taW5sZW5ndGg9NSBuZy1tYXhsZW5ndGg9MjU+XFxuXFxuXFxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVxcXCJjb250cm9sLWxhYmVsXFxcIiBmb3I9XFxcImxhc3RfbmFtZVxcXCI+0KLQtdC70LXRhNC+0L06PC9sYWJlbD5cXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgbmFtZT1cXFwibGFzdF9uYW1lXFxcIiBuZy1tb2RlbD1cXFwiZm9ybS5jb21wYW55LnBob25lXFxcIiByZXF1aXJlZCBuZy1taW5sZW5ndGg9OSBuZy1tYXhsZW5ndGg9MTU+XFxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVxcXCJjb250cm9sLWxhYmVsXFxcIiBmb3I9XFxcImxhc3RfbmFtZVxcXCI+0J3QsNC30LLQsNC90LjQtSDQutC+0LzQv9Cw0L3QuNC4OjwvbGFiZWw+XFxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIG5hbWU9XFxcImxhc3RfbmFtZVxcXCIgbmctbW9kZWw9XFxcImZvcm0uY29tcGFueS5uYW1lXFxcIiByZXF1aXJlZCBuZy1taW5sZW5ndGg9NSBuZy1tYXhsZW5ndGg9NDA+XFxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVxcXCJjb250cm9sLWxhYmVsXFxcIiBmb3I9XFxcImxhc3RfbmFtZVxcXCI+0JDQtNGA0LXRgSDQutC+0LzQv9Cw0L3QuNC4OjwvbGFiZWw+XFxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIG5hbWU9XFxcImxhc3RfbmFtZVxcXCIgbmctbW9kZWw9XFxcImZvcm0uY29tcGFueS5hbGxvY2F0aW9uXFxcIiByZXF1aXJlZCBuZy1taW5sZW5ndGg9NSBuZy1tYXhsZW5ndGg9OTA+XFxuXFxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVxcXCJjb250cm9sLWxhYmVsXFxcIiBmb3I9XFxcInBlcm1pc3Npb25zXFxcIj7Qn9GA0LjQstC40LvQtdCz0LjQuCDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y86PC9sYWJlbD5cXG4gICAgICAgICAgICA8c2VsZWN0IG5nLW1vZGVsPVxcXCJmb3JtLnVzZXIucGVybWlzc2lvbnNcXFwiIG5nLW9wdGlvbnM9XFxcInBlcm1pc3Npb24uaWQgYXMgcGVybWlzc2lvbi5wZXJtaXNzaW9uIGZvciBwZXJtaXNzaW9uIGluIHBlcm1pc3Npb25zXFxcIiByZXF1aXJlZD48L3NlbGVjdD5cXG5cXG4gICAgICAgICAgICA8YnV0dG9uIHRpdGxlPVxcXCLQlNC+0LHQsNCy0LjRgtGMINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjyDQsiDRgdC40YHRgtC10LzRgy5cXFwiIG5nLWNsaWNrPVxcXCJzaWdudXAoKVxcXCIgY2xhc3M9XFxcImJ0biBidG4tcHJpbWFyeVxcXCI+0JTQvtCx0LDQstC40YLRjDwvYnV0dG9uPlxcbiAgICAgICAgICAgIDwvZm9ybT5cXG4gICAgICAgIDwvZmllbGRzZXQ+XFxuICAgICAgICA8c3R5bGU+XFxuICAgICAgICAgICAgaW5wdXQubmctaW52YWxpZCB7XFxuICAgICAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGRhcmtyZWQ7XFxuICAgICAgICAgICAgfVxcbiAgICAgICAgICAgIGlucHV0Lm5nLXZhbGlkIHtcXG4gICAgICAgICAgICAgICAgYm9yZGVyOiAxcHggc29saWQgZ3JlZW47XFxuICAgICAgICAgICAgfVxcbiAgICAgICAgPC9zdHlsZT5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XCIpO1xufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICAgJHRlbXBsYXRlQ2FjaGUucHV0KCdhZG1pblxcdGVtcGxhdGVzXFxzY2hlZHVsZS5odG1sJyxcbiAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cnIG5nLWNvbnRyb2xsZXI9J1NjaGVkdWxlQ3RyJz5cXG4gICAgPGRpdiBjbGFzcz1cXFwidHdlbHZlIGNvbHVtbnMgY2VudGVyZWRcXFwiPlxcblxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXG4gICAgICAgICAgICA8cD7Qt9Cw0LrQsNC30Ysg0L/QviDRgNCw0YHQv9C40YHQsNC90LjRjjwvcD5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsYXJnZS00IGNvbHVtbnNcXFwiPlxcbiAgICAgICAgICAgICAgICA8bGFiZWw+0JTQsNGC0LBcXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cXFwiZGF0ZXBpY2tlclxcXCIgdHlwZT1cXFwidGV4dFxcXCIgbmctbW9kZWw9J2Zvcm0uZGF0ZSc+XFxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtMiBjb2x1bW5zXFxcIj5cXG4gICAgICAgICAgICAgICAgPGxhYmVsPtCU0L7RgdGC0LDQstC60LAg0YFcXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cXFwidGltZXBpY2tlclxcXCIgdHlwZT1cXFwidGV4dFxcXCIgbmctbW9kZWw9J2Zvcm0uc3RhcnRfdGltZSc+XFxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtMiBjb2x1bW5zXFxcIj5cXG4gICAgICAgICAgICAgICAgPGxhYmVsPtCU0L7RgdGC0LDQstC60LAg0LTQvlxcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVxcXCJ0aW1lcGlja2VyXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBuZy1tb2RlbD0nZm9ybS5lbmRfdGltZSc+XFxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtMyBsYXJnZS1vZmZzZXQtMSBjb2x1bW5zXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XFxcIlxcXCIgY2xhc3M9XFxcImJ1dHRvblxcXCIgdmFsdWU9XFxcIlxcXCIgbmctY2xpY2s9XFxcImFkZCgpXFxcIj7QtNC+0LHQsNCy0LjRgtGMINC00LXQvdGMPC9hPlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICAgIDx0YWJsZT5cXG5cXG4gICAgICAgICAgICAgICAgPGNvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICAgICAgPGNvbCBzcGFuPVxcXCIxXFxcIiBzdHlsZT1cXFwid2lkdGg6IDUlO1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8Y29sIHNwYW49XFxcIjFcXFwiIHN0eWxlPVxcXCJ3aWR0aDogMjUlO1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8Y29sIHNwYW49XFxcIjFcXFwiIHN0eWxlPVxcXCJ3aWR0aDogMzAlO1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8Y29sIHNwYW49XFxcIjFcXFwiIHN0eWxlPVxcXCJ3aWR0aDogMzAlO1xcXCI+XFxuICAgICAgICAgICAgICAgIDwvY29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgIDx0Ym9keT5cXG4gICAgICAgICAgICAgICAgPHRyIG5nLXJlcGVhdD1cXFwiaXRlbSBpbiBzaGVkdWxlXFxcIj5cXG5cXG4gICAgICAgICAgICAgICAgICAgIDx0ZD48YSBocmVmPVxcXCIjL29yZGVyLWNvbnRhaW5lci97QGl0ZW0ub3JkZXJfY29udGFpbmVyQH0vc2NoZWR1bGUve0BpdGVtLmlkQH1cXFwiPjxpIGNsYXNzPVxcXCJmaS1wYXBlcmNsaXAgc2l6ZS0xOFxcXCI+PC9pPjwvYT4gPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDx0ZD57QGl0ZW0uZGF0ZSB8IGRhdGU6J3l5eXktTU0tZGQnQH08L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgPHRkPntAaXRlbS5zdGFydF90aW1lQH08L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgPHRkPntAaXRlbS5lbmRfdGltZUB9PGEgaHJlZj1cXFwiXFxcIiBuZy1jbGljaz1cXFwiZGVsZXRlKGl0ZW0uaWQpXFxcIj4gPGkgY2xhc3M9XFxcImZpLXRyYXNoIHNpemUtMThcXFwiPjwvaT48L2E+PC90ZD5cXG5cXG4gICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgPC90Ym9keT5cXG4gICAgICAgICAgICA8L3RhYmxlPlxcbiAgICAgICAgPC9kaXY+XFxuICAgIDwvZGl2PlxcbjwvZGl2PlxcbjxzY3JpcHQgdHlwZT1cXFwidGV4dC9qYXZhc2NyaXB0XFxcIj5cXG4gICAgalF1ZXJ5KCcuZGF0ZXBpY2tlcicpLmRhdGV0aW1lcGlja2VyKFxcbiAgICAgICAgICAgIHtcXG4gICAgICAgICAgICAgICAgZm9ybWF0OlxcXCJZLW0tZFxcXCIsXFxuICAgICAgICAgICAgICAgIHRpbWVwaWNrZXI6ZmFsc2UsXFxuICAgICAgICAgICAgfSk7XFxuXFxuICAgIGpRdWVyeSgnLnRpbWVwaWNrZXInKS5kYXRldGltZXBpY2tlcih7XFxuICAgICAgICBkYXRlcGlja2VyOmZhbHNlLFxcbiAgICAgICAgZm9ybWF0OidIOmknXFxuICAgIH0pO1xcblxcbjwvc2NyaXB0PlwiKTtcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJykucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnYWRtaW5cXHRlbXBsYXRlc1xcc2NoZWR1bGVfbGlzdF9jcmVhdGUuaHRtbCcsXG4gICAgICAgIFwiPGRpdiBjbGFzcz0ncm93JyBuZy1jb250cm9sbGVyPSdDdXN0b21lcnNDdHInPlxcclxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ0d2VsdmUgY29sdW1ucyBjZW50ZXJlZFxcXCI+XFxyXFxuICAgICAgICA8cD7Qt9Cw0LrQsNC30Ysg0L/QviDRgNCw0YHQv9C40YHQsNC90LjRjjwvcD5cXHJcXG4gICAgICAgIDxzY3JpcHQgdHlwZT1cXFwidGV4dC9qYXZhc2NyaXB0XFxcIj5cXHJcXG4gICAgICAgICAgICBqUXVlcnkoJy5kYXRlcGlja2VyJykuZGF0ZXRpbWVwaWNrZXIoXFxyXFxuICAgICAgICAgICAgICAgICAgICB7XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0OlxcXCJZLW0tZFxcXCIsXFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZXBpY2tlcjpmYWxzZSxcXHJcXG4gICAgICAgICAgICAgICAgICAgIH0pO1xcclxcblxcclxcbiAgICAgICAgICAgIGpRdWVyeSgnLnRpbWVwaWNrZXInKS5kYXRldGltZXBpY2tlcih7XFxyXFxuICAgICAgICAgICAgICAgIGRhdGVwaWNrZXI6ZmFsc2UsXFxyXFxuICAgICAgICAgICAgICAgIGZvcm1hdDonSDppJ1xcclxcbiAgICAgICAgICAgIH0pO1xcclxcblxcclxcbiAgICAgICAgPC9zY3JpcHQ+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcclxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxhcmdlLTQgY29sdW1uc1xcXCI+XFxyXFxuICAgICAgICAgICAgICAgIDxsYWJlbD7QlNCw0YLQsFxcclxcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVxcXCJkYXRlcGlja2VyXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBuZy1tb2RlbD0nZm9ybS5kYXRlJz5cXHJcXG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsYXJnZS0yIGNvbHVtbnNcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWw+0JTQvtGB0YLQsNCy0LrQsCDRgVxcclxcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVxcXCJ0aW1lcGlja2VyXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBuZy1tb2RlbD0nZm9ybS5zdGFydF90aW1lJz5cXHJcXG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsYXJnZS0yIGNvbHVtbnNcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWw+0JTQvtGB0YLQsNCy0LrQsCDQtNC+XFxyXFxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XFxcInRpbWVwaWNrZXJcXFwiIHR5cGU9XFxcInRleHRcXFwiIG5nLW1vZGVsPSdmb3JtLmVuZF90aW1lJz5cXHJcXG4gICAgICAgICAgICAgICAgPC9sYWJlbD5cXHJcXG4gICAgICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsYXJnZS0zIGxhcmdlLW9mZnNldC0xIGNvbHVtbnNcXFwiPlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cXFwiXFxcIiBjbGFzcz1cXFwiYnV0dG9uXFxcIiB2YWx1ZT1cXFwiXFxcIiBuZy1jbGljaz1cXFwiYWRkKClcXFwiPtC00L7QsdCw0LLQuNGC0Ywg0LTQtdC90Yw8L2E+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8L2Rpdj5cXHJcXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxyXFxuICAgICAgICAgICAgPHRhYmxlPlxcclxcblxcclxcbiAgICAgICAgICAgIDx0Ym9keT5cXHJcXG4gICAgICAgICAgICA8dHIgbmctcmVwZWF0PVxcXCJpdGVtIGluIHNoZWR1bGVcXFwiPlxcclxcbiAgICAgICAgICAgICAgIDx0ZD48YSBuZy1ocmVmPVxcXCIjL2N1c3RvbWVycy97QGl0ZW0uY3VzdG9tZXJAfS97QGl0ZW0uaWRAfVxcXCI+KzwvYT48L3RkPlxcclxcbiAgICAgICAgICAgICAgICA8dGQ+e0BpdGVtLmRhdGUgfCBkYXRlOid5eXl5LU1NLWRkJ0B9PC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgPHRkPntAaXRlbS5zdGFydF90aW1lQH08L3RkPlxcclxcbiAgICAgICAgICAgICAgICA8dGQ+e0BpdGVtLmVuZF90aW1lQH08L3RkPlxcclxcbiAgICAgICAgICAgIDwvdHI+XFxyXFxuICAgICAgICAgICAgPC90Ym9keT5cXHJcXG4gICAgICAgICAgICA8L3RhYmxlPlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgIDwvZGl2PlxcclxcbjwvZGl2PlwiKTtcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJykucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnYXV0aFxcdGVtcGxhdGVzXFxsb2dpbi5odG1sJyxcbiAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cnPlxcclxcbjxkaXYgY2xhc3M9XFxcImZvdXIgY29sdW1ucyBjZW50ZXJlZFxcXCI+XFxyXFxuXFx0PGZvcm0+XFxyXFxuXFx0XFx0e0AgZXJyb3IgQH1cXHJcXG5cXHQ8dWwgY2xhc3M9XFxcIm5vLWJ1bGxldFxcXCI+XFxyXFxuXFx0XFx0PGxpIGNsYXNzPVxcXCJmaWVsZFxcXCI+PGxhYmVsPtCt0LvQtdC60YLRgNC+0L3QvdCw0Y8g0L/QvtGH0YLQsDwvbGFiZWw+XFxyXFxuXFx0XFx0PGxpIGNsYXNzPVxcXCJmaWVsZFxcXCI+PGlucHV0IHR5cGU9XFxcImVtYWlsXFxcIiBwbGFjZWhvbGRlcj1cXFwiRW1haWwgaW5wdXRcXFwiIGNsYXNzPVxcXCJlbWFpbCBpbnB1dFxcXCIgbmctbW9kZWw9J3VzZXJuYW1lJz48L2xpPlxcclxcblxcdFxcdDxsaSBjbGFzcz1cXFwiZmllbGRcXFwiPjxsYWJlbD7Qn9Cw0YDQvtC70Yw8L2xhYmVsPlxcclxcblxcdFxcdDxsaSBjbGFzcz1cXFwiZmllbGRcXFwiPjxpbnB1dCB0eXBlPVxcXCJwYXNzd29yZFxcXCIgcGxhY2Vob2xkZXI9XFxcIlBhc3N3b3JkIGlucHV0XFxcIiBjbGFzcz1cXFwicGFzc3dvcmQgaW5wdXRcXFwiIG5nLW1vZGVsPSdwYXNzd29yZCc+PC9saT5cXHJcXG5cXHQ8dWw+XFxyXFxuXFx0XFx0PGJyPlxcclxcblxcdFxcdDxkaXYgY2xhc3M9XFxcIm1lZGl1bSBzdWNjZXNzIGJ0blxcXCI+PGJ1dHRvbiB0eXBlPVxcXCJzdWJtaXRcXFwiPkxvZyBpbjwvYnV0dG9uPjwvZGl2PlxcclxcblxcdDwvZm9ybT5cXHJcXG48L2Rpdj5cXHJcXG48L2Rpdj5cXHJcXG5cIik7XG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgICAkdGVtcGxhdGVDYWNoZS5wdXQoJ2F1dGhcXHRlbXBsYXRlc1xccHJvZmlsZS5odG1sJyxcbiAgICAgICAgXCI8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcclxcbiAgPGRpdiBjbGFzcz1cXFwic2l4IGNvbHVtbnNcXFwiPlxcclxcbiAgXFx0PHA+XFxyXFxuICBcXHR7QHVzZXIuZW1haWxAfVxcclxcbiAgXFx0PC9wPlxcclxcbiAgXFx0PHA+XFxyXFxuICBcXHR7QHVzZXIubGFzdF9sb2dpbkB9XFxyXFxuICBcXHQ8L3A+XFxyXFxuICBcXHQ8cD5cXHJcXG4gIFxcdHtAdXNlci5maXJzdF9uYW1lQH1cXHJcXG4gIFxcdDwvcD5cXHJcXG4gIFxcdDxwPlxcclxcbiAgXFx0e0B1c2VyLmxhc3RfbmFtZUB9XFxyXFxuICBcXHQ8L3A+XFxyXFxuXFx0PC9kaXY+XFxyXFxuPC9kaXY+XCIpO1xufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICAgJHRlbXBsYXRlQ2FjaGUucHV0KCdtYWluXFx0ZW1wbGF0ZXNcXG1haW4uaHRtbCcsXG4gICAgICAgIFwiXFxuXCIpO1xufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICAgJHRlbXBsYXRlQ2FjaGUucHV0KCdtYWluXFx0ZW1wbGF0ZXNcXHByaWNlcy5odG1sJyxcbiAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cnPlxcclxcbjxkaXYgY2xhc3M9XFxcInR3ZWx2ZSBjb2x1bW5zIGNlbnRlcmVkXFxcIj5cXHJcXG48dGFibGUgYm9yZGVyPVxcXCIwXFxcIiBzdHlsZT1cXFwid2lkdGg6IDEwMCU7XFxcIj5cXHJcXG5cXHQ8dGJvZHk+XFxyXFxuXFx0XFx0PHRyIGNsYXNzPVxcXCJ0YWJsZS1oZWFkXFxcIj5cXHJcXG5cXHRcXHRcXHQ8dGQgc3R5bGU9XFxcIndpZHRoOiAzMHB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7IHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxcIj7ihJY8L3RkPlxcclxcblxcdFxcdFxcdDx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcXCI+0J7Qv9C40YHQsNC90LjQtSDQutGD0YDRjNC10YDRgdC60L7QuSDRg9GB0LvRg9Cz0Lg8L3RkPlxcclxcblxcdFxcdFxcdDx0ZCBzdHlsZT1cXFwid2lkdGg6IDExMHB4OyB0ZXh0LWFsaWduOiBjZW50ZXI7IHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxcIj7QodGC0L7QuNC80L7RgdGC0YwgKNGA0YPQsSk8L3RkPlxcclxcblxcdFxcdDwvdHI+XFxyXFxuXFx0XFx0PHRyPlxcclxcblxcdFxcdFxcdDx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcXCI+MTwvdGQ+XFxyXFxuXFx0XFx0XFx0PHRkPtCS0YvQt9C+0LIg0LrRg9GA0YzQtdGA0LAg0LIg0L/RgNC10LTQtdC70LDRhSDQnNCa0JDQlDwvdGQ+XFxyXFxuXFx0XFx0XFx0PHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXI7IHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxcIj4yMDAg0YDRg9CxPC90ZD5cXHJcXG5cXHRcXHQ8L3RyPlxcclxcblxcdFxcdDx0cj5cXHJcXG5cXHRcXHRcXHQ8dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlcjsgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXFwiPjI8L3RkPlxcclxcblxcdFxcdFxcdDx0ZD48c3BhbiBzdHlsZT1cXFwiZm9udC1zaXplOiAxM3B4OyBsaW5lLWhlaWdodDogMjBweDsgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmZmZjtcXFwiPtCS0YvQt9C+0LIg0LrRg9GA0YzQtdGA0LAg0LfQsCDQv9GA0LXQtNC10LvRiyDQnNCa0JDQlCDQtNC+IDEwINC60Lw8L3NwYW4+PC90ZD5cXHJcXG5cXHRcXHRcXHQ8dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlcjsgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXFwiPjQwMCDRgNGD0LE8L3RkPlxcclxcblxcdFxcdDwvdHI+XFxyXFxuXFx0XFx0PHRyPlxcclxcblxcdFxcdFxcdDx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcXCI+MzwvdGQ+XFxyXFxuXFx0XFx0XFx0PHRkPtCU0L7RgdGC0LDQstC60LAg0L7QtNC90L7Qs9C+INC+0YLQv9GA0LDQstC70LXQvdC40Y8g0LLQtdGB0L7QvCDQtNC+IDUwMCDQs9GALiDQsiDQvtC00LjQvSDQsNC00YDQtdGBINCyINC/0YDQtdC00LXQu9Cw0YUg0JfQvtC90YsgMSo8L3RkPlxcclxcblxcdFxcdFxcdDx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcXCI+MjAwINGA0YPQsTwvdGQ+XFxyXFxuXFx0XFx0PC90cj5cXHJcXG5cXHRcXHQ8dHI+XFxyXFxuXFx0XFx0XFx0PHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXI7IHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxcIj40PC90ZD5cXHJcXG5cXHRcXHRcXHQ8dGQ+0JTQvtGB0YLQsNCy0LrQsCDQvtC00L3QvtCz0L4g0L7RgtC/0YDQsNCy0LvQtdC90LjRjyDQstC10YHQvtC8INC00L4gNTAwINCz0YAuINCyINC+0LTQuNC9INCw0LTRgNC10YEg0LIg0L/RgNC10LTQtdC70LDRhSDQl9C+0L3RiyAyKjwvdGQ+XFxyXFxuXFx0XFx0XFx0PHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXI7IHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxcIj4yMDAg0YDRg9CxPC90ZD5cXHJcXG5cXHRcXHQ8L3RyPlxcclxcblxcdFxcdDx0cj5cXHJcXG5cXHRcXHRcXHQ8dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlcjsgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXFwiPjU8L3RkPlxcclxcblxcdFxcdFxcdDx0ZD7QlNC+0YHRgtCw0LLQutCwINC+0LTQvdC+0LPQviDQvtGC0L/RgNCw0LLQu9C10L3QuNGPINCy0LXRgdC+0Lwg0LTQviA1MDAg0LPRgC4g0LIg0L7QtNC40L0g0LDQtNGA0LXRgSDQsiDQv9GA0LXQtNC10LvQsNGFINCX0L7QvdGLIDMqPC90ZD5cXHJcXG5cXHRcXHRcXHQ8dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlcjsgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXFwiPjI1MCDRgNGD0LE8L3RkPlxcclxcblxcdFxcdDwvdHI+XFxyXFxuXFx0XFx0PHRyPlxcclxcblxcdFxcdFxcdDx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcXCI+NjwvdGQ+XFxyXFxuXFx0XFx0XFx0PHRkPtCU0L7RgdGC0LDQstC60LAg0L7QtNC90L7Qs9C+INC+0YLQv9GA0LDQstC70LXQvdC40Y8g0LLQtdGB0L7QvCDQtNC+IDUwMCDQs9GALiDQsiDQvtC00LjQvSDQsNC00YDQtdGBINCyINC/0YDQtdC00LXQu9Cw0YUg0JfQvtC90YsgNCo8L3RkPlxcclxcblxcdFxcdFxcdDx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcXCI+NzcwINGA0YPQsTwvdGQ+XFxyXFxuXFx0XFx0PC90cj5cXHJcXG5cXHRcXHQ8dHI+XFxyXFxuXFx0XFx0XFx0PHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXI7IHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxcIj43PC90ZD5cXHJcXG5cXHRcXHRcXHQ8dGQ+0J3QsNC00LHQsNCy0LrQsCDQt9CwINC60LDQttC00YvQtSDQv9C+0YHQu9C10LTRg9GO0YnQuNC1IDUwMCDQs9GALjwvdGQ+XFxyXFxuXFx0XFx0XFx0PHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXI7IHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxcIj42MCDRgNGD0LE8L3RkPlxcclxcblxcdFxcdDwvdHI+XFxyXFxuXFx0XFx0PHRyPlxcclxcblxcdFxcdFxcdDx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcXCI+ODwvdGQ+XFxyXFxuXFx0XFx0XFx0PHRkPtCe0LbQuNC00LDQvdC40LUg0LIg0L/RgNC10LTQtdC70LDRhSAxNSDQvNC40L3Rg9GCPC90ZD5cXHJcXG5cXHRcXHRcXHQ8dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlcjsgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXFwiPtCR0LXRgdC/0LvQsNGC0L3QvjwvdGQ+XFxyXFxuXFx0XFx0PC90cj5cXHJcXG5cXHRcXHQ8dHI+XFxyXFxuXFx0XFx0XFx0PHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXI7IHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxcIj45PC90ZD5cXHJcXG5cXHRcXHRcXHQ8dGQ+0J7QttC40LTQsNC90LjQtSDRgdCy0LXRgNGFIDE1INC80LjQvdGD0YI8L3RkPlxcclxcblxcdFxcdFxcdDx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcXCI+NzAg0YDRg9CxIC8g0LfQsCDQutCw0LbQtNGL0LUgMzAg0LzQuNC9PC90ZD5cXHJcXG5cXHRcXHQ8L3RyPlxcclxcblxcdDwvdGJvZHk+XFxyXFxuPC90YWJsZT5cXHJcXG48L2Rpdj5cXHJcXG48L2Rpdj5cIik7XG59XSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9