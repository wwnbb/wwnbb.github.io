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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS5qcyIsImFjY291bnRzXFxtb2R1bGUuanMiLCJhZG1pblxcbW9kdWxlLmpzIiwiYXV0aFxcbW9kdWxlLmpzIiwibWFpblxcbW9kdWxlLmpzIiwidmFsaWRhdGlvblxcbW9kdWxlLmpzIiwiY29uZmlnLmpzIiwicm91dGVzLmpzIiwic2VydmljZXMuanMiLCJhY2NvdW50c1xcYWNjb3VudHMuY3RybC5qcyIsImFkbWluXFxhZG1pbi5jdHJsLmpzIiwiYWRtaW5cXGFkbWluLmZsdHIuanMiLCJhdXRoXFxhdXRoLmN0cmwuanMiLCJhdXRoXFxhdXRoLmRyY3QuanMiLCJhdXRoXFxhdXRoLnNydmMuanMiLCJtYWluXFxtYWluLmN0cmwuanMiLCJ2YWxpZGF0aW9uXFx2YWxpZGF0aW9uLmRyY3QuanMiLCJ0ZW1wbGF0ZV9jYWNoZVxcYWNjb3VudHNcXHRlbXBsYXRlc1xcYWNjb3VudF9leHByZXNzX3RhcmlmZi5odG1sLmpzIiwidGVtcGxhdGVfY2FjaGVcXGFjY291bnRzXFx0ZW1wbGF0ZXNcXGFjY291bnRfb3JkZXJfY29udGFpbmVyLmh0bWwuanMiLCJ0ZW1wbGF0ZV9jYWNoZVxcYWNjb3VudHNcXHRlbXBsYXRlc1xcYWNjb3VudF9vcmRlcl9jcmVhdGUuaHRtbC5qcyIsInRlbXBsYXRlX2NhY2hlXFxhY2NvdW50c1xcdGVtcGxhdGVzXFxhY2NvdW50X29yZGVyX2NyZWF0ZV93aXRoX2F0dGFjaG1lbnQuaHRtbC5qcyIsInRlbXBsYXRlX2NhY2hlXFxhY2NvdW50c1xcdGVtcGxhdGVzXFxhY2NvdW50X29yZGVyX2VkaXQuaHRtbC5qcyIsInRlbXBsYXRlX2NhY2hlXFxhY2NvdW50c1xcdGVtcGxhdGVzXFxhY2NvdW50X29yZGVyX21vZGFsLmh0bWwuanMiLCJ0ZW1wbGF0ZV9jYWNoZVxcYWNjb3VudHNcXHRlbXBsYXRlc1xcYWNjb3VudF9vcmRlcnNfbGlzdC5odG1sLmpzIiwidGVtcGxhdGVfY2FjaGVcXGFjY291bnRzXFx0ZW1wbGF0ZXNcXGFjY291bnRfcHJvZmlsZS5odG1sLmpzIiwidGVtcGxhdGVfY2FjaGVcXGFkbWluXFx0ZW1wbGF0ZXNcXGFkbWluX2NvbXBhbmllc19kZXRhaWwuaHRtbC5qcyIsInRlbXBsYXRlX2NhY2hlXFxhZG1pblxcdGVtcGxhdGVzXFxhZG1pbl9jb21wYW5pZXNfbGlzdC5odG1sLmpzIiwidGVtcGxhdGVfY2FjaGVcXGFkbWluXFx0ZW1wbGF0ZXNcXGFkbWluX2NvbXBhbmllc19vcmRlcl9kZXRhaWwuaHRtbC5qcyIsInRlbXBsYXRlX2NhY2hlXFxhZG1pblxcdGVtcGxhdGVzXFxhZG1pbl9ub3RpZmljYXRpb25zLmh0bWwuanMiLCJ0ZW1wbGF0ZV9jYWNoZVxcYWRtaW5cXHRlbXBsYXRlc1xcYWRtaW5fb3JkZXJfY29udGFpbmVyX2RldGFpbC5odG1sLmpzIiwidGVtcGxhdGVfY2FjaGVcXGFkbWluXFx0ZW1wbGF0ZXNcXGFkbWluX29yZGVyX2V4cHJlc3NfZGV0YWlsLmh0bWwuanMiLCJ0ZW1wbGF0ZV9jYWNoZVxcYWRtaW5cXHRlbXBsYXRlc1xcY3VzdG9tZXJfYWNjb3VudC5odG1sLmpzIiwidGVtcGxhdGVfY2FjaGVcXGFkbWluXFx0ZW1wbGF0ZXNcXGN1c3RvbWVyc19saXN0Lmh0bWwuanMiLCJ0ZW1wbGF0ZV9jYWNoZVxcYWRtaW5cXHRlbXBsYXRlc1xcZGVsaXZlcnkuaHRtbC5qcyIsInRlbXBsYXRlX2NhY2hlXFxhZG1pblxcdGVtcGxhdGVzXFxmYXN0X29yZGVyLmh0bWwuanMiLCJ0ZW1wbGF0ZV9jYWNoZVxcYWRtaW5cXHRlbXBsYXRlc1xcb3JkZXJzX2xpc3QuaHRtbC5qcyIsInRlbXBsYXRlX2NhY2hlXFxhZG1pblxcdGVtcGxhdGVzXFxyZWdpc3RyYXRpb24uaHRtbC5qcyIsInRlbXBsYXRlX2NhY2hlXFxhZG1pblxcdGVtcGxhdGVzXFxzY2hlZHVsZS5odG1sLmpzIiwidGVtcGxhdGVfY2FjaGVcXGFkbWluXFx0ZW1wbGF0ZXNcXHNjaGVkdWxlX2xpc3RfY3JlYXRlLmh0bWwuanMiLCJ0ZW1wbGF0ZV9jYWNoZVxcYXV0aFxcdGVtcGxhdGVzXFxsb2dpbi5odG1sLmpzIiwidGVtcGxhdGVfY2FjaGVcXGF1dGhcXHRlbXBsYXRlc1xccHJvZmlsZS5odG1sLmpzIiwidGVtcGxhdGVfY2FjaGVcXG1haW5cXHRlbXBsYXRlc1xcbWFpbi5odG1sLmpzIiwidGVtcGxhdGVfY2FjaGVcXG1haW5cXHRlbXBsYXRlc1xccHJpY2VzLmh0bWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkdBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FDSEE7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbXG4gICduZ1JvdXRlJyxcbiAgJ25nU2FuaXRpemUnLFxuICAnbmdDb29raWVzJyxcbiAgJ3Jlc3Rhbmd1bGFyJyxcbiAgJ0xvY2FsU3RvcmFnZU1vZHVsZScsXG4gICdtbS5mb3VuZGF0aW9uJyxcbiAgJ2FuZ3VsYXJGaWxlVXBsb2FkJyxcblxuICAnbWFpbicsXG4gICdhY2NvdW50cycsXG4gICdhZG1pbicsXG4gICdhdXRoJyxcbiAgJ3ZhbGlkYXRpb24nXG5dKTtcblxuIiwiYW5ndWxhci5tb2R1bGUoJ2FjY291bnRzJywgWyAncmVzdGFuZ3VsYXInLCBdKTsiLCJ2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FkbWluJywgW1xuICAnbmdDb29raWVzJyxcbiAgJ3Jlc3Rhbmd1bGFyJyxcbiAgJ0xvY2FsU3RvcmFnZU1vZHVsZScsXG4gICdhdXRoJ1xuXSk7IiwidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhdXRoJywgW1xuICAnbmdDb29raWVzJyxcbiAgJ3Jlc3Rhbmd1bGFyJyxcbiAgJ0xvY2FsU3RvcmFnZU1vZHVsZScsXG4gICdodHRwLWF1dGgtaW50ZXJjZXB0b3InXG5dKTsiLCJ2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ21haW4nLCBbXG4gICduZ0Nvb2tpZXMnLFxuICAncmVzdGFuZ3VsYXInLFxuICAnTG9jYWxTdG9yYWdlTW9kdWxlJyxcbiAgJ2FuZ3VsYXJGaWxlVXBsb2FkJ1xuXSk7IiwidmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCd2YWxpZGF0aW9uJywgW1xuICAncmVzdGFuZ3VsYXInLFxuICAnTG9jYWxTdG9yYWdlTW9kdWxlJyxcbl0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKVxuXG4uY29uZmlnKGZ1bmN0aW9uKCRpbnRlcnBvbGF0ZVByb3ZpZGVyKSB7XG4gICRpbnRlcnBvbGF0ZVByb3ZpZGVyLnN0YXJ0U3ltYm9sKCd7QCcpO1xuICAgICRpbnRlcnBvbGF0ZVByb3ZpZGVyLmVuZFN5bWJvbCgnQH0nKTtcbn0pXG5cbi5jb25maWcoWydSZXN0YW5ndWxhclByb3ZpZGVyJywgZnVuY3Rpb24gKFJlc3Rhbmd1bGFyUHJvdmlkZXIpIHtcbiAgUmVzdGFuZ3VsYXJQcm92aWRlci5zZXRGdWxsUmVzcG9uc2UodHJ1ZSk7XG4gIFJlc3Rhbmd1bGFyUHJvdmlkZXIuc2V0QmFzZVVybCgnYXBpJyk7XG4gIFJlc3Rhbmd1bGFyUHJvdmlkZXIuc2V0UmVxdWVzdFN1ZmZpeCgnLycpO1xufV0pXG5cbi5jb25maWcoWyckaHR0cFByb3ZpZGVyJywgZnVuY3Rpb24oJGh0dHBQcm92aWRlcikge1xuICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdhdXRoSW50ZXJjZXB0b3InKTtcblxuICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLnhzcmZDb29raWVOYW1lID0gJ2NzcmZ0b2tlbic7XG4gICRodHRwUHJvdmlkZXIuZGVmYXVsdHMueHNyZkhlYWRlck5hbWUgPSAnWC1DU1JGVG9rZW4nO1xufV0pO1xuXG5qUXVlcnkoJy5kYXRldGltZXBpY2tlcicpLmRhdGV0aW1lcGlja2VyKHtcbiAgb25HZW5lcmF0ZTpcbiAgZnVuY3Rpb24oIGN0ICkge1xuICAgIGpRdWVyeSh0aGlzKS5maW5kKCcueGRzb2Z0X2RhdGUueGRzb2Z0X3dlZWtlbmQnKS5hZGRDbGFzcygneGRzb2Z0X2Rpc2FibGVkJyk7IFxuICB9LFxuICBmb3JtYXQ6XCJZLW0tZFxcXFxUSDppXCIsXG4gIGxhbmc6ICdydScsXG4gIG1pblRpbWU6JzEwOjAwJyxcbiAgbWF4VGltZTonMjE6MDAnLFxuICB0aW1lcGlja2VyU2Nyb2xsYmFyOidmYWxzZScsXG4gIGRheU9mV2Vla1N0YXJ0OiAxXG59KTtcbiIsIlwidXNlIHN0aWN0XCJcblxuYW5ndWxhci5tb2R1bGUoJ2FwcCcpXG4gIC5jb25maWcoWyckcm91dGVQcm92aWRlcicsIGZ1bmN0aW9uKCRyb3V0ZVByb3ZpZGVyKSB7XG4gICAgJHJvdXRlUHJvdmlkZXJcblxuICAgICAgLndoZW4oJy8nLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc3RhdGljL3NyYy9tYWluL3RlbXBsYXRlcy9tYWluLmh0bWwnXG4gICAgICB9KVxuXG4gICAgICAvLyBBZG1pbmlzdHJhdGlvbiBzaWRlIG9mIHNpdGVcbiAgICAgIC53aGVuKCcvcmVnaXN0cmF0aW9uJywgIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzdGF0aWMvc3JjL2FkbWluL3RlbXBsYXRlcy9yZWdpc3RyYXRpb24uaHRtbCcsXG4gICAgICAgIHBlcm1pc3Npb246ICdzdGFmZidcbiAgICAgIH0pXG5cbiAgICAgIC53aGVuKCcvbm90aWZpY2F0aW9ucycsICB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc3RhdGljL3NyYy9hZG1pbi90ZW1wbGF0ZXMvYWRtaW5fbm90aWZpY2F0aW9ucy5odG1sJyxcbiAgICAgICAgcGVybWlzc2lvbjogJ3N0YWZmJ1xuICAgICAgfSlcblxuICAgICAgLndoZW4oJy9vcmRlci1jb250YWluZXIvOm9yZGVyQ29udGFpbmVySWQnLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc3RhdGljL3NyYy9hZG1pbi90ZW1wbGF0ZXMvYWRtaW5fb3JkZXJfY29udGFpbmVyX2RldGFpbC5odG1sJyxcbiAgICAgICAgcGVybWlzc2lvbjogJ3N0YWZmJ1xuICAgICAgfSlcblxuICAgICAgLndoZW4oJy9vcmRlci1jb250YWluZXIvOm9yZGVyQ29udGFpbmVySWQvc2NoZWR1bGUnLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc3RhdGljL3NyYy9hZG1pbi90ZW1wbGF0ZXMvc2NoZWR1bGUuaHRtbCcsXG4gICAgICAgIHBlcm1pc3Npb246ICdzdGFmZidcbiAgICAgIH0pXG5cbiAgICAgIC53aGVuKCcvb3JkZXItY29udGFpbmVyLzpvcmRlckNvbnRhaW5lcklkL3NjaGVkdWxlLzpzY2hlZHVsZUlkJywgIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzdGF0aWMvc3JjL2FkbWluL3RlbXBsYXRlcy9kZWxpdmVyeS5odG1sJyxcbiAgICAgICAgcGVybWlzc2lvbjogJ3N0YWZmJ1xuICAgICAgfSlcblxuICAgICAgLndoZW4oJy9vcmRlci1jb250YWluZXIvOm9yZGVyQ29udGFpbmVySWQvb3JkZXJzLzpvcmRlcklkJywgIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzdGF0aWMvc3JjL2FkbWluL3RlbXBsYXRlcy9hZG1pbl9jb21wYW5pZXNfb3JkZXJfZGV0YWlsLmh0bWwnLFxuICAgICAgICBwZXJtaXNzaW9uOiAnc3RhZmYnXG4gICAgICB9KVxuXG4gICAgICAud2hlbignL2N1c3RvbWVycycsICB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc3RhdGljL3NyYy9hZG1pbi90ZW1wbGF0ZXMvY3VzdG9tZXJzX2xpc3QuaHRtbCcsXG4gICAgICAgIHBlcm1pc3Npb246ICdzdGFmZidcbiAgICAgIH0pXG5cbiAgICAgIC53aGVuKCcvY3VzdG9tZXIvOmN1c3RvbWVySWQnLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc3RhdGljL3NyYy9hZG1pbi90ZW1wbGF0ZXMvY3VzdG9tZXJfYWNjb3VudC5odG1sJyxcbiAgICAgICAgcGVybWlzc2lvbjogJ3N0YWZmJ1xuICAgICAgfSlcblxuICAgICAgLndoZW4oJy9jb21wYW5pZXMnLCAge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3N0YXRpYy9zcmMvYWRtaW4vdGVtcGxhdGVzL2FkbWluX2NvbXBhbmllc19saXN0Lmh0bWwnLFxuICAgICAgICBwZXJtaXNzaW9uOiAnc3RhZmYnXG4gICAgICB9KVxuXG4gICAgICAud2hlbignL2NvbXBhbmllcy9hZGQnLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc3RhdGljL3NyYy9hZG1pbi90ZW1wbGF0ZXMvYWRtaW5fY29tcGFuaWVzX2FkZC5odG1sJyxcbiAgICAgICAgcGVybWlzc2lvbjogJ3N0YWZmJ1xuICAgICAgfSlcblxuICAgICAgLndoZW4oJy9jb21wYW5pZXMvOmNvbXBhbnlJZCcsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzdGF0aWMvc3JjL2FkbWluL3RlbXBsYXRlcy9hZG1pbl9jb21wYW5pZXNfZGV0YWlsLmh0bWwnLFxuICAgICAgICBwZXJtaXNzaW9uOiAnc3RhZmYnXG4gICAgICB9KVxuXG4gICAgICAud2hlbignL2Zhc3Qtb3JkZXInLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc3RhdGljL3NyYy9hZG1pbi90ZW1wbGF0ZXMvZmFzdF9vcmRlci5odG1sJyxcbiAgICAgICAgcGVybWlzc2lvbjogJ3N0YWZmJ1xuICAgICAgfSlcblxuICAgICAgLy8gVXNlcnMgc2lkZSBvZiB3ZWJzaXRlXG4gICAgICAud2hlbignL2V4cHJlc3MtdGFyaWZmJywge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3N0YXRpYy9zcmMvYWNjb3VudHMvdGVtcGxhdGVzL2FjY291bnRfZXhwcmVzc190YXJpZmYuaHRtbCcsXG4gICAgICAgIHBlcm1pc3Npb246ICdjdXN0b21lcidcbiAgICAgIH0pXG5cbiAgICAgIC53aGVuKCcvb3JkZXJzJywge1xuICAgICAgICB0ZW1wbGF0ZVVybDogJ3N0YXRpYy9zcmMvYWNjb3VudHMvdGVtcGxhdGVzL2FjY291bnRfb3JkZXJzX2xpc3QuaHRtbCcsXG4gICAgICAgIHBlcm1pc3Npb246ICdjdXN0b21lcidcbiAgICAgIH0pXG5cbiAgICAgIC53aGVuKCcvb3JkZXJzL2NyZWF0ZScsIHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzdGF0aWMvc3JjL2FjY291bnRzL3RlbXBsYXRlcy9hY2NvdW50X29yZGVyX2NvbnRhaW5lci5odG1sJyxcbiAgICAgICAgcGVybWlzc2lvbjogJ2N1c3RvbWVyJ1xuICAgICAgfSlcblxuICAgICAgLndoZW4oJy9vcmRlcnMvOm9yZGVySWQnLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc3RhdGljL3NyYy9hY2NvdW50cy90ZW1wbGF0ZXMvYWNjb3VudF9vcmRlcl9lZGl0Lmh0bWwnLFxuICAgICAgICBwZXJtaXNzaW9uOiAnY3VzdG9tZXInXG4gICAgICB9KVxuXG4gICAgICAud2hlbignL3Byb2ZpbGUnLCB7XG4gICAgICAgIHRlbXBsYXRlVXJsOiAnc3RhdGljL3NyYy9hY2NvdW50cy90ZW1wbGF0ZXMvYWNjb3VudF9wcm9maWxlLmh0bWwnLFxuICAgICAgICBwZXJtaXNzaW9uOiAnY3VzdG9tZXInXG4gICAgICB9KVxuXG4gICAgICAub3RoZXJ3aXNlKHtyZWRpcmVjdFRvOiAnLyd9KTtcbiAgfV0pXG5cbiAgLmNvbnRyb2xsZXIoJ0FwcEN0cicsIGZ1bmN0aW9uICgkc2NvcGUsICRsb2NhdGlvbiwgcGVybWlzc2lvbnMsIGFwaSwgVXNlcikge1xuICAgICRzY29wZS4kb24oJyRyb3V0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKHNjb3BlLCBuZXh0KSB7XG4gICAgICBhcGkuYWxsKCdwcm9maWxlJykuY3VzdG9tR0VUKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICBwZXJtaXNzaW9ucy5zZXRQZXJtaXNzaW9ucyhyZXNwb25zZS5kYXRhLnBlcm1pc3Npb25zX25hbWVzKVxuICAgICAgICB2YXIgcGVybWlzc2lvbiA9IG5leHQuJCRyb3V0ZS5wZXJtaXNzaW9uO1xuICAgICAgICBpZihfLmlzU3RyaW5nKHBlcm1pc3Npb24pICYmICFwZXJtaXNzaW9ucy5oYXNQZXJtaXNzaW9uKHBlcm1pc3Npb24pKSB7XG4gICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJyMnKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGVybWlzc2lvbnMuaGFzUGVybWlzc2lvbignc3RhZmYnKSkge1xuICAgICAgICAgIFVzZXIuZ2V0QXN5bmMoKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBhcGkuYWxsKCdub3RpZmljYXRpb25zJykuY3VzdG9tR0VUKCcnLCB7b3JkZXJpbmc6ICctdGltZScsIGNoZWNrZWQ6ICdGYWxzZScsIG1hbmFnZXI6IFVzZXIuZ2V0KCkuaWR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICRzY29wZS5ub3RpZnkgPSByZXNwb25zZS5kYXRhLmxlbmd0aDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9KTtcbiAgfSlcblxuIiwiXCJ1c2Ugc3RpY3RcIlxuXG5hbmd1bGFyLm1vZHVsZSgnYXBwJylcbiAgLmZhY3RvcnkoJ2FwaScsIGZ1bmN0aW9uKFJlc3Rhbmd1bGFyKSB7XG4gICAgcmV0dXJuIFJlc3Rhbmd1bGFyLndpdGhDb25maWcoZnVuY3Rpb24oUmVzdGFuZ3VsYXJDb25maWd1cmVyKSB7XG4gICAgICBSZXN0YW5ndWxhckNvbmZpZ3VyZXIuc2V0RnVsbFJlc3BvbnNlKHRydWUpO1xuICAgICAgUmVzdGFuZ3VsYXJDb25maWd1cmVyLnNldEJhc2VVcmwoJ2FwaScpO1xuICAgIH0pO1xuICB9KVxuXG4gIC5mYWN0b3J5KCdQYXBhJywgWyckd2luZG93JyxcbiAgICBmdW5jdGlvbigkd2luZG93KSB7XG4gICAgICByZXR1cm4gJHdpbmRvdy5QYXBhO1xuICAgIH1cbiAgXSk7XG4iLCIndXNlIHN0cmljdCdcblxuYW5ndWxhci5tb2R1bGUoJ2FjY291bnRzJylcblxuXG4gIC5jb250cm9sbGVyKCdPcmRlcnNDdHInLCBmdW5jdGlvbigkc2NvcGUsIGFwaSwgVXNlcikge1xuICAgIFVzZXIuZ2V0QXN5bmMoKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgYXBpLmFsbCgnb3JkZXJfY29udGFpbmVyJykuY3VzdG9tR0VUKCcnLCB7Y29tcGFueTogVXNlci5nZXQoKS5jb21wYW55fSkudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAkc2NvcGUuZGF0YSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSlcblxuXG4gIC5jb250cm9sbGVyKCdDcmVhdGVPcmRlcnNDdHInLCBmdW5jdGlvbigkc2NvcGUsIGFwaSwgJHJvdXRlUGFyYW1zKSB7XG4gICAgJHNjb3BlLnNlbmRmb3JtID0gZnVuY3Rpb24oKSB7XG4gICAgICBhcGkub25lKCdvcmRlcl9jb250YWluZXInLCAkcm91dGVQYXJhbXMub3JkZXJJZCkuYWxsKCdvcmRlcnMnKS5jdXN0b21QT1NUKCRzY29wZS5mb3JtKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBhbGVydCgn0JfQsNC60LDQtyDQtNC+0LHQsNCy0LvQtdC9Jyk7XG4gICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgYWxlcnQoJ2Vycm9yJyk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9KVxuXG5cbiAgLmNvbnRyb2xsZXIoJ1ByaWNlTGlzdEN0cicsIGZ1bmN0aW9uKCRzY29wZSwgYXBpKSB7XG4gICAgYXBpLmFsbCgnZXhwcmVzcy10YXJpZmYvJykuY3VzdG9tR0VUKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAkc2NvcGUuZGF0YSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgfSk7XG4gIH0pXG5cblxuICAuY29udHJvbGxlcignUHJvZmlsZUN0cicsIGZ1bmN0aW9uKCRzY29wZSwgYXBpKSB7XG4gICAgYXBpLmFsbCgncHJvZmlsZS8nKS5jdXN0b21HRVQoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICRzY29wZS5kYXRhID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIGFwaS5hbGwoJ2NvbXBhbmllcycpLmN1c3RvbUdFVCgkc2NvcGUuZGF0YS5jb21wYW55KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7JHNjb3BlLmNvbXBhbnk9cmVzcG9uc2UuZGF0YX0pXG4gICAgfSk7XG4gIH0pXG5cblxuICAuY29udHJvbGxlcignRmlsZVVwbG9hZEN0cicsIGZ1bmN0aW9uKCRzY29wZSwgYXBpLCBGaWxlVXBsb2FkZXIsIGxvY2FsU3RvcmFnZVNlcnZpY2UsICRyb3V0ZVBhcmFtcykge1xuICAgICRzY29wZS5wb3N0SXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgICBmb3JtRGF0YS5hcHBlbmQoJ2ZpbGUnLCAkc2NvcGUuZmlsZSlcbiAgICAgIGZvcm1EYXRhLmFwcGVuZCgnbmFtZScsICRzY29wZS5maWxlLm5hbWUpXG4gICAgfVxuICAgICRzY29wZS51cGxvYWRlciA9IG5ldyBGaWxlVXBsb2FkZXIoXG4gICAgICB7XG4gICAgICAgIHVybDonL2FwaS9vcmRlcl9jb250YWluZXIvJysgJHJvdXRlUGFyYW1zLm9yZGVySWQgKycvZmlsZXVwbG9hZC8nLFxuICAgICAgICBmb3JtRGF0YTogW3tkYXRhOiAnc29tZWRhdGEnfSwkc2NvcGUuZm9ybV0sXG4gICAgICAgIHJlbW92ZUFmdGVyVXBsb2FkOiB0cnVlLFxuICAgICAgICBoZWFkZXJzOiB7QXV0aG9yaXphdGlvbjogbG9jYWxTdG9yYWdlU2VydmljZS5nZXQoJ3Rva2VuJyl9LFxuICAgICAgICBtZXRob2Q6ICdQT1NUJ1xuICAgICAgfSk7XG4gIH0pXG5cblxuICAuY29udHJvbGxlcignQWNjb3VudE9yZGVyQ29udGFpbmVyQ3RyJywgZnVuY3Rpb24oJHNjb3BlLCBhcGksICRsb2NhdGlvbikge1xuICAgICRzY29wZS5hZGRPcmRlckNvbnRhaW5lciA9IGZ1bmN0aW9uKCkge1xuICAgICAgYXBpLmFsbCgnb3JkZXJfY29udGFpbmVyJykuY3VzdG9tUE9TVCgkc2NvcGUuZm9ybSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG5cbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy9vcmRlcnMvJyArIHJlc3BvbnNlLmRhdGEuaWQpXG4gICAgICB9LCBmdW5jdGlvbigpIHthbGVydCgnZXJyb3InKTt9KTtcbiAgICB9XG4gIH0pXG5cblxuICAuY29udHJvbGxlcignQWNjb3VudE9yZGVyRWRpdEN0cicsIGZ1bmN0aW9uKCRzY29wZSwgYXBpLCAkcm91dGVQYXJhbXMpIHtcbiAgICBhcGkuYWxsKCdvcmRlcl9jb250YWluZXInKS5jdXN0b21HRVQoJHJvdXRlUGFyYW1zLm9yZGVySWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5kYXRhID0gcmVzcG9uc2UuZGF0YTtcbiAgICB9KVxuICB9KVxuXG5cbiAgLmNvbnRyb2xsZXIoJ01vZGFsRGVtb0N0cicsIGZ1bmN0aW9uICgkc2NvcGUsICRtb2RhbCwgJGxvZykge1xuXG4gICAgJHNjb3BlLml0ZW1zID0gWydpdGVtMScsICdpdGVtMicsICdpdGVtMyddO1xuXG4gICAgJHNjb3BlLm9wZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdzdGF0aWMvc3JjL2FjY291bnRzL3RlbXBsYXRlcy9hY2NvdW50X29yZGVyX21vZGFsLmh0bWwnLFxuICAgICAgICBjb250cm9sbGVyOiAnTW9kYWxJbnN0YW5jZUN0cicsXG4gICAgICAgIHJlc29sdmU6IHtcbiAgICAgICAgICBpdGVtczogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICRzY29wZS5pdGVtcztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKGZ1bmN0aW9uIChzZWxlY3RlZEl0ZW0pIHtcbiAgICAgICAgJHNjb3BlLnNlbGVjdGVkID0gc2VsZWN0ZWRJdGVtO1xuICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAkbG9nLmluZm8oJ01vZGFsIGRpc21pc3NlZCBhdDogJyArIG5ldyBEYXRlKCkpO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSlcblxuXG4gIC5jb250cm9sbGVyKCdNb2RhbEluc3RhbmNlQ3RyJywgZnVuY3Rpb24gKCRzY29wZSwgJG1vZGFsSW5zdGFuY2UsIGl0ZW1zKSB7XG5cbiAgICAkc2NvcGUuaXRlbXMgPSBpdGVtcztcbiAgICAkc2NvcGUuc2VsZWN0ZWQgPSB7XG4gICAgICBpdGVtOiAkc2NvcGUuaXRlbXNbMF1cbiAgICB9O1xuXG4gICAgJHNjb3BlLm9rID0gZnVuY3Rpb24gKCkge1xuICAgICAgJG1vZGFsSW5zdGFuY2UuY2xvc2UoJHNjb3BlLnNlbGVjdGVkLml0ZW0pO1xuICAgIH07XG5cbiAgICAkc2NvcGUuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgJG1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2FuY2VsJyk7XG4gICAgfTtcbiAgfSkiLCIndXNlIHN0cmljdCdcblxuYW5ndWxhci5tb2R1bGUoJ2FkbWluJylcblxuXG4gIC5jb250cm9sbGVyKCdEZWxpdmVyeUN0cicsIGZ1bmN0aW9uKCRzY29wZSwgYXBpLCAkcm91dGVQYXJhbXMpe1xuICAgIGFwaS5hbGwoJ2V4cHJlc3MtdGFyaWZmJykuY3VzdG9tR0VUKCcnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICRzY29wZS50YXJpZnMgPSByZXNwb25zZS5kYXRhO1xuICAgIH0pXG4gICAgJHNjb3BlLmZvcm0gPSB7fTtcbiAgICB2YXIgZ2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBhcGkub25lKCdvcmRlcl9jb250YWluZXInLCAkcm91dGVQYXJhbXMub3JkZXJDb250YWluZXJJZCkub25lKCdzY2hlZHVsZScsICRyb3V0ZVBhcmFtcy5zY2hlZHVsZUlkKS5jdXN0b21HRVQoJ2RlbGl2ZXJ5JylcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAkc2NvcGUuZGF0YSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0KCk7XG4gICAgJHNjb3BlLmFkZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgYXBpLm9uZSgnb3JkZXJfY29udGFpbmVyJywgJHJvdXRlUGFyYW1zLm9yZGVyQ29udGFpbmVySWQpLm9uZSgnc2NoZWR1bGUnLCAkcm91dGVQYXJhbXMuc2NoZWR1bGVJZClcbiAgICAgICAgLmFsbCgnZGVsaXZlcnknKS5jdXN0b21QT1NUKCRzY29wZS5mb3JtKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICBhbGVydCgnc3VjY2VzcycpO1xuICAgICAgICBnZXQoKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pXG5cblxuICAuY29udHJvbGxlcignQ3VzdG9tZXJzQ3RyJywgZnVuY3Rpb24oJHNjb3BlLCBhcGksICRsb2NhdGlvbikge1xuICAgIHZhciBnZXQgPSBmdW5jdGlvbihzZWFyY2hfcGFyYW1zLCBwZXJtaXNzaW9uc19saXN0KSB7XG4gICAgICBhcGkuYWxsKCd1c2VycycpLmN1c3RvbUdFVCgnJywge1xuICAgICAgICBwZXJtaXNzaW9uc19fcGVybWlzc2lvbjogcGVybWlzc2lvbnNfbGlzdCxcbiAgICAgICAgb3JkZXJpbmc6ICdpZCcsIHNlYXJjaDogc2VhcmNoX3BhcmFtc30pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAkc2NvcGUuZGF0YSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAkc2NvcGUuZGVsZXRlID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgIGFwaS5hbGwoJ3VzZXJzJykuY3VzdG9tREVMRVRFKGlkKS50aGVuKGZ1bmN0aW9uKCl7Z2V0KCRzY29wZS5zZWFyY2gpfSlcbiAgICB9XG4gICAgZ2V0KCk7XG4gICAgJHNjb3BlLmdldCA9IGZ1bmN0aW9uKCl7Z2V0KCRzY29wZS5zZWFyY2gpfTtcbiAgICAkc2NvcGUuc2hvd0NsaWVudCA9IGZ1bmN0aW9uKCkge1xuICAgICAgJGxvY2F0aW9uLnBhdGgoJyMvY3VzdG9tZXJzJyk7XG4gICAgfTtcbiAgfSlcblxuXG4gIC5jb250cm9sbGVyKCdTY2hlZHVsZUN0cicsIGZ1bmN0aW9uKCRzY29wZSwgYXBpLCAkcm91dGVQYXJhbXMpIHtcbiAgICAkc2NvcGUuZm9ybSA9IHt9O1xuICAgIHZhciBnZXRTaGVkdWxlID0gZnVuY3Rpb24oKXtcbiAgICAgIGFwaS5vbmUoJ29yZGVyX2NvbnRhaW5lcicsICRyb3V0ZVBhcmFtcy5vcmRlckNvbnRhaW5lcklkKS5hbGwoJ3NjaGVkdWxlJykuY3VzdG9tR0VUKCcnLCB7b3JkZXJpbmc6ICdkYXRlJ30pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAkc2NvcGUuc2hlZHVsZSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0U2hlZHVsZSgpO1xuICAgICRzY29wZS5hZGQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGFwaS5vbmUoJ29yZGVyX2NvbnRhaW5lcicsICRyb3V0ZVBhcmFtcy5vcmRlckNvbnRhaW5lcklkKS5hbGwoJ3NjaGVkdWxlJykuY3VzdG9tUE9TVCgkc2NvcGUuZm9ybSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgYWxlcnQoJ3N1Y2Nlc3MnKTtcbiAgICAgICAgZ2V0U2hlZHVsZSgpO1xuICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgYWxlcnQoJ2Vycm9yJyk7XG4gICAgICB9KTtcbiAgICB9O1xuICAgICRzY29wZS5kZWxldGUgPSBmdW5jdGlvbihpZCkge1xuICAgICAgYXBpLm9uZSgnb3JkZXJfY29udGFpbmVyJywgJHJvdXRlUGFyYW1zLm9yZGVyQ29udGFpbmVySWQpLmFsbCgnc2NoZWR1bGUnKS5jdXN0b21ERUxFVEUoaWQpLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIGdldFNoZWR1bGUoKTtcbiAgICAgIH0pXG4gICAgfVxuICB9KVxuXG5cbiAgLmNvbnRyb2xsZXIoJ1JlZ2lzdHJhdGlvbkN0cicsIGZ1bmN0aW9uKCRzY29wZSwgYXBpKXtcbiAgICAkc2NvcGUuZm9ybSA9IHt9O1xuXG4gICAgdmFyIGFkZEN1c3RvbWVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICRzY29wZS5mb3JtLnVzZXIucGVybWlzc2lvbnMgPSBbMixdXG4gICAgICAgIGFwaS5hbGwoJ3Npbmd1cCcpLmN1c3RvbVBPU1QoJHNjb3BlLmZvcm0udXNlcikudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAgIGFsZXJ0KCdzdWNjZXNzJyk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgYWxlcnQoJ2Vycm9yJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgJHNjb3BlLnNpZ251cCA9IGZ1bmN0aW9uKCkge1xuICAgICAgYWRkQ3VzdG9tZXIoKTtcbiAgICB9O1xuXG4gIH0pXG5cblxuICAuY29udHJvbGxlcignQ3VzdG9tZXJBY2NvdW50Q3RyJywgZnVuY3Rpb24oJHNjb3BlLCBhcGksICRyb3V0ZVBhcmFtcyl7XG4gICAgJHNjb3BlLmVkaXQgPSBmYWxzZTtcbiAgICAkc2NvcGUuc3RhcnRFZGl0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAkc2NvcGUuZWRpdCA9IHRydWU7XG4gICAgfTtcbiAgICB2YXIgZ2V0VXNlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgYXBpLmFsbCgndXNlcnMnKS5jdXN0b21HRVQoJHJvdXRlUGFyYW1zLmN1c3RvbWVySWQpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAkc2NvcGUuZGF0YSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICB9KTtcbiAgICB9XG4gICAgZ2V0VXNlcigpO1xuICAgIGFwaS5hbGwoJ3Blcm1pc3Npb25zJykuY3VzdG9tR0VUKCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAkc2NvcGUucGVybWlzc2lvbnMgPSByZXNwb25zZS5kYXRhO1xuICAgIH0pO1xuICAgIGFwaS5hbGwoJ2NvbXBhbmllcycpLmN1c3RvbUdFVCgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5jb21wYW5pZXMgPSByZXNwb25zZS5kYXRhO1xuICAgIH0pXG4gICAgJHNjb3BlLnB1dFVzZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgIGZvcm0gPSB7XG4gICAgICAgIFwiY29tcGFueVwiOiAkc2NvcGUuZGF0YS5jb21wYW55LFxuICAgICAgICBcImRhdGVfam9pbmVkXCI6ICRzY29wZS5kYXRhLmRhdGVfam9pbmVkLFxuICAgICAgICBcImVtYWlsXCI6ICRzY29wZS5kYXRhLmVtYWlsLFxuICAgICAgICBcImZpcnN0X25hbWVcIjogJHNjb3BlLmRhdGEuZmlyc3RfbmFtZSxcbiAgICAgICAgXCJsYXN0X25hbWVcIjogJHNjb3BlLmRhdGEubGFzdF9uYW1lLFxuICAgICAgICBcInBlcm1pc3Npb25zXCI6IFskc2NvcGUuZGF0YS5wZXJtaXNzaW9ucyxdLFxuICAgICAgICBcImlkXCI6ICRzY29wZS5kYXRhLmlkXG4gICAgICB9XG4gICAgICBhcGkuYWxsKCd1c2VycycpLmN1c3RvbVBVVChmb3JtLCAkcm91dGVQYXJhbXMuY3VzdG9tZXJJZCkudGhlbihmdW5jdGlvbigpe1xuICAgICAgICAkc2NvcGUuZWRpdCA9IGZhbHNlO1xuICAgICAgICBnZXRVc2VyKCk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9KVxuXG5cbiAgLmNvbnRyb2xsZXIoJ09yZGVyc0xpc3RDdHInLCBmdW5jdGlvbigkc2NvcGUsIGFwaSwgJHJvdXRlUGFyYW1zKSB7XG4gICAgYXBpLmFsbCgnb3JkZXJzLWxpc3QnKS5jdXN0b21HRVQoJycsIHtvd25lcl9faWQ6ICRyb3V0ZVBhcmFtcy5jdXN0b21lcklkfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICRzY29wZS5kYXRhID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIH0pXG4gIH0pXG5cblxuICAuY29udHJvbGxlcignRmFzdE9yZGVyQ3RyJywgZnVuY3Rpb24oJHNjb3BlLCBhcGkpIHtcbiAgICAkc2NvcGUuZm9ybVN0YXRlID0ge1xuICAgICAgQWRkZWRVc2VyOiB7fSxcbiAgICAgIHJlZ2lzdHJhdGlvbklzRG9uZTogZmFsc2UsXG4gICAgfTtcbiAgICAkc2NvcGUuYWRkVXNlciA9IGZ1bmN0aW9uKCl7XG4gICAgICAkc2NvcGUudXNlci5wZXJtc3Npb25zID0gWzFdO1xuICAgICAgYXBpLmFsbCgnc2luZ3VwJykuY3VzdG9tUE9TVCgkc2NvcGUudXNlcilcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICRzY29wZS5mb3JtU3RhdGUucmVnaXN0cmF0aW9uSXNEb25lID0gdHJ1ZTtcbiAgICAgICAgICAkc2NvcGUuZm9ybVN0YXRlLkFkZGVkVXNlciA9IHJlc3BvbnNlLmRhdGFcbiAgICAgICAgICBhbGVydCgnc3VjY2VzcycpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5mb3JtU3RhdGUsIHJlc3BvbnNlKTtcbiAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICBhbGVydCgnZXJyb3InKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgICRzY29wZS5zZW5kZm9ybSA9IGZ1bmN0aW9uKCkge1xuICAgICAgYXBpLmFsbCgnb3JkZXJzLycpLmN1c3RvbVBPU1QoJHNjb3BlLmZvcm0pLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgIGFsZXJ0KCfQl9Cw0LrQsNC3INC00L7QsdCw0LLQu9C10L0nKTtcbiAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICBhbGVydCgnZXJyb3InKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pXG5cblxuICAuY29udHJvbGxlcignQ29tcGFuaWVzTGlzdEN0cicsIGZ1bmN0aW9uKCRzY29wZSwgYXBpLCBVc2VyKSB7XG4gICAgVXNlci51cGRhdGVVc2VyKCk7XG4gICAgdmFyIGdldENvbXBhbnkgPSBmdW5jdGlvbihwYXJhbXMpIHtcbiAgICAgIGFwaS5hbGwoJ2NvbXBhbmllcycpLmN1c3RvbUdFVCgnJywge3NlYXJjaDogcGFyYW1zfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICRzY29wZS5kYXRhID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgIH0pO1xuICAgIH07XG4gICAgZ2V0Q29tcGFueSgpO1xuICAgICRzY29wZS5kZWxldGVDb21wYW55ID0gZnVuY3Rpb24oaWQpIHtcbiAgICAgIGFwaS5hbGwoJ2NvbXBhbmllcycpLmN1c3RvbURFTEVURShpZCkudGhlbihmdW5jdGlvbigpe2dldENvbXBhbnkoKTt9KVxuICAgIH1cbiAgICAkc2NvcGUuZ2V0ID0gZnVuY3Rpb24oaXRlbSkge2dldENvbXBhbnkoaXRlbSl9O1xuICB9KVxuXG5cbiAgLmNvbnRyb2xsZXIoJ0NvbXBhbmllc0RldGFpbEN0cicsIGZ1bmN0aW9uKCRzY29wZSwgYXBpLCAkcm91dGVQYXJhbXMpIHtcbiAgICBhcGkuYWxsKCdjb21wYW5pZXMnKS5jdXN0b21HRVQoJHJvdXRlUGFyYW1zLmNvbXBhbnlJZCkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAkc2NvcGUuZGF0YSA9IHJlc3BvbnNlLmRhdGFcbiAgICB9KTtcbiAgICBhcGkuYWxsKCdvcmRlcl9jb250YWluZXInKS5jdXN0b21HRVQoJycsIHtcbiAgICAgIGNvbXBhbnk6JHJvdXRlUGFyYW1zLmNvbXBhbnlJZH0pLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgJHNjb3BlLm9yZGVyX2NvbnRhaW5lcnMgPSByZXNwb25zZS5kYXRhO1xuICAgICAgfSk7XG4gICAgYXBpLmFsbCgndXNlcnMnKS5jdXN0b21HRVQoJycsIHtjb21wYW55OiAkcm91dGVQYXJhbXMuY29tcGFueUlkfSkudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAkc2NvcGUudXNlcnMgPSByZXNwb25zZS5kYXRhXG4gICAgfSlcblxuICB9KVxuXG5cbiAgLmNvbnRyb2xsZXIoJ0NvbXBhbmllc0FkZEN0cicsIGZ1bmN0aW9uKCRzY29wZSwgYXBpKSB7XG4gICAgJHNjb3BlLmFkZENvbXBhbnkgPSBmdW5jdGlvbigpIHtcbiAgICAgIGFwaS5hbGwoJ2NvbXBhbmllcycpLmN1c3RvbVBPU1QoJHNjb3BlLmZvcm0pLnRoZW4oZnVuY3Rpb24oKXtcbiAgICAgICAgYWxlcnQoJ3N1Y2Nlc3MnKTtcbiAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICBhbGVydCgnZXJyb3InKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSlcblxuICAuY29udHJvbGxlcignT3JkZXJDb250YWluZXJDdHInLCBmdW5jdGlvbigkc2NvcGUsIGFwaSwgJHJvdXRlUGFyYW1zKSB7XG4gICAgJHNjb3BlLmRhdGEgPSB7fVxuICAgIHZhciBvcmRlckNvbnRhaW5lciA9IGFwaS5vbmUoJ29yZGVyX2NvbnRhaW5lcicsICRyb3V0ZVBhcmFtcy5vcmRlckNvbnRhaW5lcklkKTtcbiAgICBvcmRlckNvbnRhaW5lci5jdXN0b21HRVQoJycpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5kYXRhLm9yZGVyQ29udGFpbmVycyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgfSk7XG4gICAgb3JkZXJDb250YWluZXIuYWxsKCdmaWxldXBsb2FkJykuY3VzdG9tR0VUKCcnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUuZGF0YS5maWxlcyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgfSk7XG4gICAgb3JkZXJDb250YWluZXIuYWxsKCdvcmRlcnMnKS5jdXN0b21HRVQoJycpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICRzY29wZS5kYXRhLm9yZGVycyA9IHJlc3BvbnNlLmRhdGE7XG4gICAgfSk7XG4gICAgb3JkZXJDb250YWluZXIuYWxsKCdzY2hlZHVsZScpLmN1c3RvbUdFVCgnJykudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgJHNjb3BlLmRhdGEuc2NoZWR1bGUgPSByZXNwb25zZS5kYXRhO1xuICAgIH0pO1xuICAgIG9yZGVyQ29udGFpbmVyLmFsbCgnc3RhdHVzJykuY3VzdG9tR0VUKCcnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAkc2NvcGUuZGF0YS5zdGF0dXMgPSByZXNwb25zZS5kYXRhXG4gICAgfSlcbiAgfSlcblxuXG4gIC5jb250cm9sbGVyKCdOb3RpZmljYXRpb25zQ3RyJywgZnVuY3Rpb24oJHNjb3BlLCBhcGksIFVzZXIpIHtcbiAgICB2YXIgZ2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICBhcGkuYWxsKCdub3RpZmljYXRpb25zJykuY3VzdG9tR0VUKCcnLCB7b3JkZXJpbmc6ICctdGltZScsIGNoZWNrZWQ6ICdGYWxzZScsIG1hbmFnZXI6IFVzZXIuZ2V0KCkuaWR9KS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgJHNjb3BlLmRhdGEgPSByZXNwb25zZS5kYXRhO1xuICAgICAgfSk7XG4gICAgICAkc2NvcGUuaGVsbG8gPSAoJ2hlbGxvIHRoZXJlJyk7XG4gICAgfTtcbiAgICBVc2VyLmdldEFzeW5jKCkudGhlbihmdW5jdGlvbigpe1xuICAgICAgZ2V0KCk7XG4gICAgfSk7XG4gICAgJHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICBhcGkuYWxsKCdub3RpZmljYXRpb25zJykuY3VzdG9tREVMRVRFKGlkKS50aGVuKGZ1bmN0aW9uKCl7XG4gICAgICBnZXQoKTt9KVxuICAgIH1cbiAgfSlcblxuXG4gIC5jb250cm9sbGVyKCdPcmRlckRldGFpbEN0cicsIGZ1bmN0aW9uKCRzY29wZSwgYXBpLCAkcm91dGVQYXJhbXMpIHtcbiAgICBhcGkub25lKCdvcmRlcl9jb250YWluZXInLCAkcm91dGVQYXJhbXMub3JkZXJDb250YWluZXJJZCkub25lKCdvcmRlcnMnLCAkcm91dGVQYXJhbXMub3JkZXJJZCkuY3VzdG9tR0VUKCcnKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICRzY29wZS5vcmRlciA9IHJlc3BvbnNlLmRhdGFcbiAgICAgIH0pXG4gIH0pXG4iLCIndXNlIHN0cmljdCdcblxuYW5ndWxhci5tb2R1bGUoJ2FkbWluJylcblxuXG4gIC5maWx0ZXIoJ2Jvb2wyaWNvbicsIGZ1bmN0aW9uICgpIHtcbiAgICAvLyBmdW5jdGlvbiB0aGF0J3MgaW52b2tlZCBlYWNoIHRpbWUgQW5ndWxhciBydW5zICRkaWdlc3QoKVxuICAgIC8vIHBhc3MgaW4gYGl0ZW1gIHdoaWNoIGlzIHRoZSBzaW5nbGUgT2JqZWN0IHdlJ2xsIG1hbmlwdWxhdGVcbiAgICByZXR1cm4gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIGlmIChpdGVtID09IHRydWUpIHtcbiAgICAgICAgaXRlbSA9ICc8aSBjbGFzcz1cImZpLXBsdXMgc2l6ZS0xOCBncmVlblwiPjwvaT4nXG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgaXRlbSA9ICc8aSBjbGFzcz1cImZpLW1pbnVzIHNpemUtMTggcmVkXCI+PC9pPidcbiAgICAgIH1cbiAgICAgIC8vIHJldHVybiB0aGUgY3VycmVudCBgaXRlbWAsIGJ1dCBjYWxsIGB0b1VwcGVyQ2FzZSgpYCBvbiBpdFxuICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfTtcbiAgfSlcbiAgLmZpbHRlcignaW50MnN0YXR1cycsIGZ1bmN0aW9uKCkge1xuICByZXR1cm4gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICBpZiAoaXRlbSA9PSAnMScpIHtcbiAgICAgIGl0ZW0gPSAn0J3QtdGB0L7Qs9C70LDRgdC+0LLQsNC9JztcbiAgICB9IGVsc2UgaWYgKGl0ZW0gPT09ICcyJykge1xuICAgICAgaXRlbSA9ICfQodC+0LPQu9Cw0YHQvtCy0LDQvSc7XG4gICAgfSBlbHNlIGlmIChpdGVtID09PSAnMycpIHtcbiAgICAgIGl0ZW0gPSAn0J7QttC40LTQsNC10YIg0J/QvtGB0YLQsNCy0LrQuCc7XG4gICAgfSBlbHNlIGlmIChpdGVtID09PSAnNCcpIHtcbiAgICAgIGl0ZW0gPSAn0J7QsdGA0LDQsdC+0YLQutCwJztcbiAgICB9IGVsc2UgaWYgKGl0ZW0gPT09ICc1Jykge1xuICAgICAgaXRlbSA9ICfQlNC+0YHRgtCw0LLQutCwJztcbiAgICB9IGVsc2UgaWYgKGl0ZW0gPT09ICc2Jykge1xuICAgICAgaXRlbSA9ICfQlNC+0YHRgtCw0LLQu9C10L3Qvic7XG4gICAgfVxuICAgIHJldHVybiBpdGVtXG4gIH07XG59KTtcbiIsIid1c2Ugc3RyaWN0J1xyXG5cclxuYW5ndWxhci5tb2R1bGUoJ2F1dGgnKVxyXG4gIC5jb250cm9sbGVyKCdBdXRoZW50aWNhdGlvbkN0cicsIGZ1bmN0aW9uKCRzY29wZSwgVXNlcikge1xyXG4gICAgJHNjb3BlLmxvZ291dCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICBVc2VyLnJlc2V0VXNlcigpO1xyXG4gICAgfTtcclxuICB9KTsiLCIndXNlIHN0cmljdCc7XG5cblxuYW5ndWxhci5tb2R1bGUoJ2F1dGgnKVxuXG4gIC5kaXJlY3RpdmUoJ2F1dGhBcHBsaWNhdGlvbicsIGZ1bmN0aW9uKCRodHRwLCBsb2NhbFN0b3JhZ2VTZXJ2aWNlLCBVc2VyKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnQScsXG4gICAgICBzY29wZTogZmFsc2UsXG4gICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW0sIGF0dHJzKSB7XG5cbiAgICAgICAgdmFyIG1haW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5cIik7XG4gICAgICAgIHZhciBsb2dpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibG9naW4taG9sZGVyXCIpO1xuXG4gICAgICAgIHZhciBhcHBseUxvZ2luID0gZnVuY3Rpb24oZ29vZCkge1xuICAgICAgICAgIGlmIChnb29kKSB7XG4gICAgICAgICAgICBtYWluLnN0eWxlLmRpc3BsYXkgPSBcImJsb2NrXCI7XG4gICAgICAgICAgICBsb2dpbi5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1haW4uc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xuICAgICAgICAgICAgbG9naW4uc3R5bGUuZGlzcGxheSA9IFwiYmxvY2tcIjtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCd0b2tlbicpKSB7XG4gICAgICAgICAgYXBwbHlMb2dpbih0cnVlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNjb3BlLiRvbignZXZlbnQ6YXV0aC1sb2dpblJlcXVpcmVkJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIGFwcGx5TG9naW4oZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBzY29wZS4kb24oJ2V2ZW50OmF1dGgtbG9naW5Db25maXJtZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgYXBwbHlMb2dpbih0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfTtcbiAgfSlcblxuXG4gIC5kaXJlY3RpdmUoJ2hhc1Blcm1pc3Npb24nLCBmdW5jdGlvbihwZXJtaXNzaW9ucykge1xuICAgIHJldHVybiB7XG4gICAgICBzY29wZTogZmFsc2UsXG4gICAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgaWYoIV8uaXNTdHJpbmcoYXR0cnMuaGFzUGVybWlzc2lvbikpe1xuICAgICAgICAgIHRocm93IFwiaGFzUGVybWlzc2lvbiB2YWx1ZSBtdXN0IGJlIGEgc3RyaW5nXCI7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdmFsdWUgPSBhdHRycy5oYXNQZXJtaXNzaW9uLnRyaW0oKTtcbiAgICAgICAgdmFyIG5vdFBlcm1pc3Npb25GbGFnID0gdmFsdWVbMF0gPT09ICchJztcbiAgICAgICAgaWYobm90UGVybWlzc2lvbkZsYWcpIHtcbiAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnNsaWNlKDEpLnRyaW0oKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHRvZ2dsZVZpc2liaWxpdHlCYXNlZE9uUGVybWlzc2lvbigpIHtcbiAgICAgICAgICB2YXIgaGFzUGVybWlzc2lvbiA9IHBlcm1pc3Npb25zLmhhc1Blcm1pc3Npb24odmFsdWUpO1xuXG4gICAgICAgICAgaWYoaGFzUGVybWlzc2lvbiAmJiAhbm90UGVybWlzc2lvbkZsYWcgfHwgIWhhc1Blcm1pc3Npb24gJiYgbm90UGVybWlzc2lvbkZsYWcpIHtcbiAgICAgICAgICAgIGVsZW1lbnQuc2hvdygpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGVsZW1lbnQuaGlkZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0b2dnbGVWaXNpYmlsaXR5QmFzZWRPblBlcm1pc3Npb24oKTtcbiAgICAgICAgc2NvcGUuJG9uKCdwZXJtaXNzaW9uc0NoYW5nZWQnLCB0b2dnbGVWaXNpYmlsaXR5QmFzZWRPblBlcm1pc3Npb24pO1xuICAgICAgfVxuICAgIH07XG4gIH0pXG5cblxuICAuZGlyZWN0aXZlKCdsb2dpbicsIGZ1bmN0aW9uKCRodHRwLCBhcGksIGxvY2FsU3RvcmFnZVNlcnZpY2UsIGF1dGhTZXJ2aWNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHJlc3RyaWN0OiAnRScsXG4gICAgICBzY29wZTogZmFsc2UsXG4gICAgICB0cmFuc2NsdWRlOiBmYWxzZSxcbiAgICAgIHRlbXBsYXRlVXJsOiAnc3RhdGljL3NyYy9hdXRoL3RlbXBsYXRlcy9sb2dpbi5odG1sJyxcbiAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtLCBhdHRycykge1xuXG4gICAgICAgIGVsZW0uYmluZCgnc3VibWl0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5yZW1vdmUoJ3Rva2VuJyk7XG5cbiAgICAgICAgICB2YXIgdXNlckRhdGEgPSB7XG4gICAgICAgICAgICBcInVzZXJuYW1lXCI6IHNjb3BlLnVzZXJuYW1lLFxuICAgICAgICAgICAgXCJwYXNzd29yZFwiOiBzY29wZS5wYXNzd29yZFxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBhcGkuYWxsKCdhcGktdG9rZW4tYXV0aC8nKS5jdXN0b21QT1NUKHVzZXJEYXRhKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0KCd0b2tlbicsICdUb2tlbiAnICsgcmVzcG9uc2UuZGF0YS50b2tlbik7XG4gICAgICAgICAgICBhdXRoU2VydmljZS5sb2dpbkNvbmZpcm1lZCgpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgIHNjb3BlLnN0YXR1cyA9IHJlcztcbiAgICAgICAgICAgIGFsZXJ0KCfQndC10L/RgNCw0LLQuNC70YzQvdGL0Lkg0LvQvtCz0Lgg0LjQu9C4INC/0LDRgNC+0LvRjCcpO1xuICAgICAgICAgICAgc2NvcGUuZXJyb3IgPSAn0J3QtdC/0YDQsNCy0LjQu9GM0L3Ri9C5INC70L7Qs9C40L0g0LjQu9C4INC/0LDRgNC+0LvRjCc7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5hbmd1bGFyLm1vZHVsZSgnYXV0aCcpXG5cbiAgLmZhY3RvcnkoJ2F1dGhJbnRlcmNlcHRvcicsIGZ1bmN0aW9uKGxvY2FsU3RvcmFnZVNlcnZpY2UpIHtcbiAgICAvLyDQn9GA0L7QstC10YDRj9C10Lwg0LvQvtC60LDQu9GM0L3QvtC1INGF0YDQsNC90LjQu9C40YnQtSDQvdCwINC90LDQu9C40YfQuNC1INGC0L7QutCwINC/0YDQuCDQutCw0LbQtNC+0Lwg0LfQsNC/0YDQvtGB0LUuXG4gICAgcmV0dXJuIHtcbiAgICAgIHJlcXVlc3Q6IGZ1bmN0aW9uKGNvbmZpZykge1xuICAgICAgICB2YXIgdG9rZW4gPSBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldCgndG9rZW4nKTtcbiAgICAgICAgY29uZmlnLmhlYWRlcnMgPSBjb25maWcuaGVhZGVycyB8fCB7fTtcbiAgICAgICAgaWYgKHRva2VuKSB7XG4gICAgICAgICAgY29uZmlnLmhlYWRlcnMuQXV0aG9yaXphdGlvbiA9IHRva2VuO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb25maWc7XG4gICAgICB9XG4gICAgfTtcbiAgfSlcblxuICAuZmFjdG9yeSgncGVybWlzc2lvbnMnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSkge1xuICAgIHJldHVybiB7XG4gICAgICBzZXRQZXJtaXNzaW9uczogZnVuY3Rpb24ocGVybWlzc2lvbnMpIHtcbiAgICAgICAgJHJvb3RTY29wZS5wZXJtaXNzaW9uTGlzdCA9IHBlcm1pc3Npb25zO1xuICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3Blcm1pc3Npb25zQ2hhbmdlZCcpO1xuICAgICAgfSxcbiAgICAgIGhhc1Blcm1pc3Npb246IGZ1bmN0aW9uIChwZXJtaXNzaW9uKSB7XG4gICAgICAgIHBlcm1pc3Npb24gPSBwZXJtaXNzaW9uLnRyaW0oKTtcbiAgICAgICAgcmV0dXJuIF8uc29tZSgkcm9vdFNjb3BlLnBlcm1pc3Npb25MaXN0LCBmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgaWYoXy5pc1N0cmluZyhpdGVtKSl7XG4gICAgICAgICAgICByZXR1cm4gaXRlbS50cmltKCkgPT09IHBlcm1pc3Npb247XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gcGVybWlzc2lvbkxpc3Q7XG4gICAgICB9XG4gICAgfTtcbiAgfSlcblxuICAuZmFjdG9yeSgnVXNlcicsIGZ1bmN0aW9uKCRyb290U2NvcGUsIHBlcm1pc3Npb25zLCAkd2luZG93LCBhcGksIGxvY2FsU3RvcmFnZVNlcnZpY2UpIHtcbiAgICB2YXIgdXNlclByb2ZpbGU7XG5cbiAgICB2YXIgc2VydmljZSA9IHtcbiAgICAgIHVwZGF0ZVVzZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICBhcGkuYWxsKCdwcm9maWxlLycpLmN1c3RvbUdFVCgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICB1c2VyUHJvZmlsZSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgcGVybWlzc2lvbnMuc2V0UGVybWlzc2lvbnModXNlclByb2ZpbGUucGVybWlzc2lvbnNfbmFtZXMpO1xuICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnZXZlbnQ6dXNlci1wcm9maWxlVXBkYXRlZCcpO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG5cbiAgICAgIHJlc2V0VXNlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHVzZXJQcm9maWxlID0gbnVsbDtcbiAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZS5yZW1vdmUoJ3Rva2VuJyk7XG4gICAgICAgICR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICB9LFxuXG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdXNlclByb2ZpbGU7XG4gICAgICB9LFxuXG4gICAgICBnZXRBc3luYzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBhcGkuYWxsKCdwcm9maWxlLycpLmN1c3RvbUdFVCgpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICB1c2VyUHJvZmlsZSA9IHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgcGVybWlzc2lvbnMuc2V0UGVybWlzc2lvbnModXNlclByb2ZpbGUucGVybWlzc2lvbnNfbmFtZXMpO1xuICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnZXZlbnQ6dXNlci1wcm9maWxlVXBkYXRlZCcpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBzZXJ2aWNlO1xuICAgICRyb290U2NvcGUuJG9uKCdldmVudDphdXRoLWxvZ2luY29uZmlybWVkJywgc2VydmljZS51cGRhdGVVc2VyKCkpO1xuICB9KTtcbiIsIid1c2Ugc3RyaWN0J1xuXG5hbmd1bGFyLm1vZHVsZSgnbWFpbicpXG5cbiAgLmNvbnRyb2xsZXIoJ2RlbW8nLCBmdW5jdGlvbigkc2NvcGUsIEZpbGVVcGxvYWRlciwgbG9jYWxTdG9yYWdlU2VydmljZSkge1xuICAgICRzY29wZS51cGxvYWRlciA9IG5ldyBGaWxlVXBsb2FkZXIoe3VybDonYXBpL2ZpbGV1cGxvYWQvJywgaGVhZGVyczoge0F1dGhvcml6YXRpb246IGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KCd0b2tlbicpfSwgbWV0aG9kOiAnUE9TVCcgfSk7XG4gIH0pXG5cbiAgLmNvbnRyb2xsZXIoJ01vZGFsRGVtb0N0cicsIGZ1bmN0aW9uICgkc2NvcGUsICRtb2RhbCwgJGxvZykge1xuXG4gICAgJHNjb3BlLml0ZW1zID0gWydpdGVtMScsICdpdGVtMicsICdpdGVtMyddO1xuXG4gICAgJHNjb3BlLm9wZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcbiAgICAgICAgdGVtcGxhdGVVcmw6ICdteU1vZGFsQ29udGVudC5odG1sJyxcbiAgICAgICAgY29udHJvbGxlcjogJ01vZGFsSW5zdGFuY2VDdHInLFxuICAgICAgICByZXNvbHZlOiB7XG4gICAgICAgICAgaXRlbXM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiAkc2NvcGUuaXRlbXM7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihmdW5jdGlvbiAoc2VsZWN0ZWRJdGVtKSB7XG4gICAgICAgICRzY29wZS5zZWxlY3RlZCA9IHNlbGVjdGVkSXRlbTtcbiAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJGxvZy5pbmZvKCdNb2RhbCBkaXNtaXNzZWQgYXQ6ICcgKyBuZXcgRGF0ZSgpKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH0pXG4gIC5jb250cm9sbGVyKCdEZW1vQ29udHJvbGxlcicsIGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICRzY29wZS5yYXRpbmcgPSA0MjtcbiAgICAkc2NvcGUubWluUmF0aW5nID0gNDA7XG4gICAgJHNjb3BlLm1heFJhdGluZyA9IDUwO1xufSlcblxuICAuY29udHJvbGxlcignTW9kYWxJbnN0YW5jZUN0cicsIGZ1bmN0aW9uICgkc2NvcGUsICRtb2RhbEluc3RhbmNlLCBpdGVtcykge1xuXG4gICAgJHNjb3BlLml0ZW1zID0gaXRlbXM7XG4gICAgJHNjb3BlLnNlbGVjdGVkID0ge1xuICAgICAgaXRlbTogJHNjb3BlLml0ZW1zWzBdXG4gICAgfTtcblxuICAgICRzY29wZS5vayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRtb2RhbEluc3RhbmNlLmNsb3NlKCRzY29wZS5zZWxlY3RlZC5pdGVtKTtcbiAgICB9O1xuXG4gICAgJHNjb3BlLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICRtb2RhbEluc3RhbmNlLmRpc21pc3MoJ2NhbmNlbCcpO1xuICAgIH07XG4gIH0pXG5cbiAgLmNvbnRyb2xsZXIoJ3Rlc3QnLCBmdW5jdGlvbigkc2NvcGUsIGFwaSkge1xuICAgIGFwaS5hbGwoJ3VzZXJzJykub3B0aW9ucygpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXG4gICAgfSlcbiAgfSlcblxuICAuY29udHJvbGxlcignaGVsbG8nLCBmdW5jdGlvbigkc2NvcGUsIGFwaSwgJHJvdXRlUGFyYW1zKXtcbiAgICBhcGkuYWxsKCdleHByZXNzLXRhcmlmZicpLmN1c3RvbUdFVCgnJykudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAkc2NvcGUudGFyaWZzID0gcmVzcG9uc2UuZGF0YTtcbiAgICB9KVxuICAgICRzY29wZS5mb3JtID0ge307XG4gICAgdmFyIGdldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgYXBpLm9uZSgnb3JkZXJfY29udGFpbmVyJywgJHJvdXRlUGFyYW1zLm9yZGVyQ29udGFpbmVySWQpLm9uZSgnc2NoZWR1bGUnLCAkcm91dGVQYXJhbXMuc2NoZWR1bGVJZCkuY3VzdG9tR0VUKCdkZWxpdmVyeScpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgJHNjb3BlLmRhdGEgPSByZXNwb25zZS5kYXRhO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIGdldCgpO1xuICAgICRzY29wZS5hZGQgPSBmdW5jdGlvbigpIHtcbiAgICAgIGFwaS5vbmUoJ29yZGVyX2NvbnRhaW5lcicsICRyb3V0ZVBhcmFtcy5vcmRlckNvbnRhaW5lcklkKS5vbmUoJ3NjaGVkdWxlJywgJHJvdXRlUGFyYW1zLnNjaGVkdWxlSWQpXG4gICAgICAgIC5hbGwoJ2RlbGl2ZXJ5JykuY3VzdG9tUE9TVCgkc2NvcGUuZm9ybSkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICBhbGVydCgnc3VjY2VzcycpO1xuICAgICAgICAgIGdldCgpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICB9KVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5cbmFuZ3VsYXIubW9kdWxlKCd2YWxpZGF0aW9uJylcbiAgLmRpcmVjdGl2ZSgnZ2V0Rm9ybScsIGZ1bmN0aW9uKGFwaSkge1xuICAgIHJldHVybiB7XG4gICAgICByZXN0cmljdDogJ0UnLFxuICAgICAgdGVtcGxhdGU6ICc8cCBuZy1yZXBlYXQ9XCJpdGVtIGluIGRhdGFcIj57QGl0ZW0udHlwZUB9e0BpdGVtLmxhYmVsQH08L3A+JyxcbiAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlKSB7XG4gICAgICAgIGFwaS5hbGwoJ29yZGVyX2NvbnRhaW5lcicpLm9wdGlvbnMoKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpXG4gICAgICAgICAgc2NvcGUuZGF0YSA9IHJlc3BvbnNlLmRhdGEuYWN0aW9ucy5QT1NUO1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH07XG4gIH0pXG5cbiAgLmRpcmVjdGl2ZSgncm5TdGVwcGVyJywgZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHNjb3BlOiB7fSxcbiAgICAgIHJlcXVpcmU6ICduZ01vZGVsJyxcbiAgICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBpRWxlbWVudCwgaUF0dHJzLCBuZ01vZGVsQ29udHJvbGxlcikge1xuICAgICAgICBuZ01vZGVsQ29udHJvbGxlci4kcmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgaUVsZW1lbnQuZmluZCgnZGl2JykudGV4dChuZ01vZGVsQ29udHJvbGxlci4kdmlld1ZhbHVlKTtcbiAgICAgICAgfTtcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlTW9kZWwob2Zmc2V0KSB7XG4gICAgICAgICAgbmdNb2RlbENvbnRyb2xsZXIuJHNldFZpZXdWYWx1ZShuZ01vZGVsQ29udHJvbGxlci4kdmlld1ZhbHVlICsgb2Zmc2V0KTtcbiAgICAgICAgICBuZ01vZGVsQ29udHJvbGxlci4kcmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgc2NvcGUuZGVjcmVtZW50ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdXBkYXRlTW9kZWwoLTEpO1xuICAgICAgICB9O1xuICAgICAgICBzY29wZS5pbmNyZW1lbnQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICB1cGRhdGVNb2RlbCgrMSk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfTtcbiAgfSk7XG5cbi8vbCA9IHtcbi8vICAgIFwibmFtZVwiOiBcIk9yZGVyIENvbnRhaW5lciBMaXN0XCIsXG4vLyAgICBcImRlc2NyaXB0aW9uXCI6IFwiXCIsXG4vLyAgICBcInJlbmRlcnNcIjogW1xuLy8gICAgICAgIFwiYXBwbGljYXRpb24vanNvblwiLFxuLy8gICAgICAgIFwidGV4dC9odG1sXCJcbi8vICAgIF0sXG4vLyAgICBcInBhcnNlc1wiOiBbXG4vLyAgICAgICAgXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4vLyAgICAgICAgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIixcbi8vICAgICAgICBcIm11bHRpcGFydC9mb3JtLWRhdGFcIlxuLy8gICAgXSxcbi8vICAgIFwiYWN0aW9uc1wiOiB7XG4vLyAgICAgICAgXCJQT1NUXCI6IHtcbi8vICAgICAgICAgICAgXCJpZFwiOiB7XG4vLyAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJpbnRlZ2VyXCIsXG4vLyAgICAgICAgICAgICAgICBcInJlcXVpcmVkXCI6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgXCJyZWFkX29ubHlcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgIFwibGFiZWxcIjogXCJJRFwiXG4vLyAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgIFwic3luY19zdGF0dXNcIjoge1xuLy8gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYm9vbGVhblwiLFxuLy8gICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiBmYWxzZSxcbi8vICAgICAgICAgICAgICAgIFwicmVhZF9vbmx5XCI6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBcIlxcdTA0NDFcXHUwNDQyXFx1MDQzMFxcdTA0NDJcXHUwNDQzXFx1MDQ0MSBcXHUwNDQxXFx1MDQzOFxcdTA0M2RcXHUwNDQ1XFx1MDQ0MFxcdTA0M2VcXHUwNDNkXFx1MDQzOFxcdTA0MzdcXHUwNDMwXFx1MDQ0NlxcdTA0MzhcXHUwNDM4XCJcbi8vICAgICAgICAgICAgfSxcbi8vICAgICAgICAgICAgXCJzdGF0dXNcIjoge1xuLy8gICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiYm9vbGVhblwiLFxuLy8gICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiBmYWxzZSxcbi8vICAgICAgICAgICAgICAgIFwicmVhZF9vbmx5XCI6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBcInN0YXR1c1wiXG4vLyAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgIFwiY29tbWVudFwiOiB7XG4vLyAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJzdHJpbmdcIixcbi8vICAgICAgICAgICAgICAgIFwicmVxdWlyZWRcIjogZmFsc2UsXG4vLyAgICAgICAgICAgICAgICBcInJlYWRfb25seVwiOiBmYWxzZSxcbi8vICAgICAgICAgICAgICAgIFwibGFiZWxcIjogXCJjb21tZW50XCIsXG4vLyAgICAgICAgICAgICAgICBcIm1heF9sZW5ndGhcIjogMjU2XG4vLyAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgIFwiY3VzdG9tZXJfZGF0ZVwiOiB7XG4vLyAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJkYXRldGltZVwiLFxuLy8gICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiBmYWxzZSxcbi8vICAgICAgICAgICAgICAgIFwicmVhZF9vbmx5XCI6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBcImN1c3RvbWVyIGRhdGVcIlxuLy8gICAgICAgICAgICB9LFxuLy8gICAgICAgICAgICBcIm1hbmFnZXJfZGF0ZVwiOiB7XG4vLyAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJkYXRldGltZVwiLFxuLy8gICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiBmYWxzZSxcbi8vICAgICAgICAgICAgICAgIFwicmVhZF9vbmx5XCI6IGZhbHNlLFxuLy8gICAgICAgICAgICAgICAgXCJsYWJlbFwiOiBcIm1hbmFnZXIgZGF0ZVwiXG4vLyAgICAgICAgICAgIH0sXG4vLyAgICAgICAgICAgIFwiY29tcGFueVwiOiB7XG4vLyAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJmaWVsZFwiLFxuLy8gICAgICAgICAgICAgICAgXCJyZXF1aXJlZFwiOiB0cnVlLFxuLy8gICAgICAgICAgICAgICAgXCJyZWFkX29ubHlcIjogdHJ1ZSxcbi8vICAgICAgICAgICAgICAgIFwibGFiZWxcIjogXCJcXHUwNDFhXFx1MDQzZVxcdTA0M2NcXHUwNDNmXFx1MDQzMFxcdTA0M2RcXHUwNDM4XFx1MDQ0ZlwiXG4vLyAgICAgICAgICAgIH1cbi8vICAgICAgICB9XG4vLyAgICB9XG4vL31cbiIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICAgJHRlbXBsYXRlQ2FjaGUucHV0KCdhY2NvdW50c1xcdGVtcGxhdGVzXFxhY2NvdW50X2V4cHJlc3NfdGFyaWZmLmh0bWwnLFxuICAgICAgICBcIjxkaXYgY2xhc3M9J3JvdycgbmctY29udHJvbGxlcj0nUHJpY2VMaXN0Q3RyJz5cXG4gIDxkaXYgY2xhc3M9XFxcInR3ZWx2ZSBjb2x1bW5zIGNlbnRlcmVkXFxcIj5cXG4gICAgPHRhYmxlPlxcbiAgICAgIDx0Ym9keSBuZy1yZXBlYXQ9XFxcIml0ZW0gaW4gZGF0YVxcXCI+XFxuICAgICAgPHRyPlxcbiAgICAgICAgPHRkPntAaXRlbS5uYW1lQH08L3RkPlxcbiAgICAgICAgPHRkPntAaXRlbS5pbnNpZGVfbWthZF9jb3VyaWVyX3ByaWNlQH08L3RkPlxcbiAgICAgICAgPHRkPntAaXRlbS5vdXRzaWRlX21rYWRfY291cmllcl9wcmljZUB9PC90ZD5cXG4gICAgICAgIDx0ZD57QGl0ZW0uYXJlYV9vbmVfcHJpY2VAfTwvdGQ+XFxuICAgICAgICA8dGQ+e0BpdGVtLmFyZWFfdHdvX3ByaWNlQH08L3RkPlxcbiAgICAgICAgPHRkPntAaXRlbS5hcmVhX3RocmVlX3ByaWNlQH08L3RkPlxcbiAgICAgICAgPHRkPntAaXRlbS5hcmVhX2ZvdXJfcHJpY2VAfTwvdGQ+XFxuICAgICAgICA8dGQ+e0BpdGVtLndlaWdodF9vdmVybGltaXRfcHJpY2VAfTwvdGQ+XFxuICAgICAgICA8dGQ+e0BpdGVtLndhaXRpbmdfcHJpY2VAfTwvdGQ+XFxuICAgICAgPC90cj5cXG4gICAgICA8L3Rib2R5PlxcbiAgICA8L3RhYmxlPlxcbiAgPC9kaXY+XFxuPC9kaXY+XFxuXCIpO1xufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICAgJHRlbXBsYXRlQ2FjaGUucHV0KCdhY2NvdW50c1xcdGVtcGxhdGVzXFxhY2NvdW50X29yZGVyX2NvbnRhaW5lci5odG1sJyxcbiAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cnIG5nLWNvbnRyb2xsZXI9J0FjY291bnRPcmRlckNvbnRhaW5lckN0cic+XFxuICAgIDxkaXYgY2xhc3M9XFxcInR3ZWx2ZSBjb2x1bW5zIGNlbnRlcmVkXFxcIj5cXG4gICAgICAgIDxmaWVsZHNldD5cXG4gICAgICAgICAgICA8bGVnZW5kPtCU0L7QsdCw0LLRgtGMINCX0LDQutCw0Lc8L2xlZ2VuZD5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsYXJnZS02IGNvbHVtbnNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsPtCa0L7QvNC80LXQvdGC0LDRgNC40Lkg0Log0LfQsNC60LDQt9GDXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXFwiIG5nLW1vZGVsPVxcXCJmb3JtLmNvbW1lbnRcXFwiLz5cXG4gICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsYXJnZS02IGNvbHVtbnMgXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxsYWJlbD7QlNCw0YLQsCDQvtC60L7QvdGH0LDQvdC40Y8g0LfQsNC60LDQt9CwXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJkYXRldGltZXBpY2tlclxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcXCIgbmctbW9kZWw9XFxcImZvcm0uY3VzdG9tZXJfZGF0ZVxcXCIvPlxcbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPGEgaHJlZj1cXFwiXFxcIiBjbGFzcz1cXFwiYnV0dG9uXFxcIiB2YWx1ZT1cXFwiXFxcIiBuZy1jbGljaz1cXFwiYWRkT3JkZXJDb250YWluZXIoKVxcXCI+0J/RgNC+0LTQvtC70LbQuNGC0Yw8L2E+XFxuICAgICAgICA8L2ZpZWxkc2V0PlxcbiAgICA8L2Rpdj5cXG48L2Rpdj5cXG5cXG48c2NyaXB0IHR5cGU9XFxcInRleHQvamF2YXNjcmlwdFxcXCI+IGpRdWVyeSgnLmRhdGV0aW1lcGlja2VyJykuZGF0ZXRpbWVwaWNrZXIoIHsgb25HZW5lcmF0ZTpmdW5jdGlvbiggY3QgKXsgalF1ZXJ5KHRoaXMpLmZpbmQoJy54ZHNvZnRfZGF0ZS54ZHNvZnRfd2Vla2VuZCcpIC5hZGRDbGFzcygneGRzb2Z0X2Rpc2FibGVkJyk7IH0sIGZvcm1hdDpcXFwiZC5tLlkgSDppXFxcIiwgbGFuZzogJ3J1JywgbWluVGltZTonMTA6MDAnLCBtYXhUaW1lOicyMTowMCcsIHRpbWVwaWNrZXJTY3JvbGxiYXI6J2ZhbHNlJywgZGF5T2ZXZWVrU3RhcnQ6IDEgfSkgPC9zY3JpcHQ+XFxuXCIpO1xufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICAgJHRlbXBsYXRlQ2FjaGUucHV0KCdhY2NvdW50c1xcdGVtcGxhdGVzXFxhY2NvdW50X29yZGVyX2NyZWF0ZS5odG1sJyxcbiAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cnIG5nLWNvbnRyb2xsZXI9J0NyZWF0ZU9yZGVyc0N0cic+XFxuICA8ZGl2IGNsYXNzPVxcXCJ0d2VsdmUgY29sdW1ucyBjZW50ZXJlZFxcXCI+XFxuICAgIDwhLS0g0KTQvtGA0LzQsCDQvtGC0L/RgNCw0LLQu9C10L3QuNGPINC30LDQutCw0LfQsCAtLT5cXG4gICAgPGZpZWxkc2V0PlxcblxcbiAgICAgIDxwPtCU0LDRgtCwINC/0YDQuNC10LfQtNCwOjwvcD5cXG4gICAgICA8aW5wdXQgY2xhc3M9XFxcImRhdGV0aW1lcGlja2VyXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBuZy1tb2RlbD0nZm9ybS5vcmRlcl9kYXRldGltZSc+XFxuXFxuICAgICAgPGgyPtCe0YLQv9GA0LDQstC70LXQvdC40LU6PC9oMj5cXG5cXG4gICAgICA8cD7Qn9C70LDRgtC10LvRjNGJ0LjQujo8L3A+XFxuICAgICAgPHNlbGVjdCBuZy1tb2RlbD0nZm9ybS5wYXllcic+XFxuICAgICAgICA8b3B0aW9uIHZhbHVlPVxcXCIxXFxcIj7QntGC0L/RgNCw0LLQuNGC0LXQu9GMPC9vcHRpb24+XFxuICAgICAgICA8b3B0aW9uIHZhbHVlPVxcXCIyXFxcIj7Qn9C+0LvRg9GH0LDRgtC10LvRjDwvb3B0aW9uPlxcbiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cXFwiM1xcXCI+0KLRgNC10YLRjNC1INC70LjRhtC+PC9vcHRpb24+XFxuICAgICAgICA8b3B0aW9uIHZhbHVlPVxcXCI0XFxcIj7QntGC0L/RgNCw0LLQuNGC0LXQu9GMICjQsdC10LfQvdCw0LvQuNGH0L3Ri9C5INGA0LDRgdGH0LXRgik8L29wdGlvbj5cXG4gICAgICAgIDxvcHRpb24gdmFsdWU9XFxcIjVcXFwiPtCf0L7Qu9GD0YfQsNGC0LXQu9GMICjQsdC10LfQvdCw0LvQuNGH0L3Ri9C5INGA0LDRgdGH0LXRgik8L29wdGlvbj5cXG4gICAgICAgIDxvcHRpb24gdmFsdWU9XFxcIjZcXFwiPtCi0YDQtdGC0YzQtSDQu9C40YbQviAo0LHQtdC30L3QsNC70LjRh9C90YvQuSDRgNCw0YHRh9C10YIpPC9vcHRpb24+XFxuICAgICAgPC9zZWxlY3Q+XFxuXFxuICAgICAgPHA+0KbQtdC90L3QvtGB0YLRjCDQvtGC0L/RgNCw0LLQu9C10L3QuNGPPC9wPlxcbiAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBuZy1tb2RlbD0nZm9ybS53b3J0aCc+XFxuXFxuICAgICAgPHA+PHNwYW4gY2xhc3M9XFxcIm1hcmtcXFwiPioqPC9zcGFuPtCS0LXRgSAo0LrQsyk6PC9wPlxcbiAgICAgIDxpbnB1dCBuZy1tb2RlbD0nZm9ybS53ZWlnaHQnIHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJ3ZWlnaHRcXFwiPlxcblxcbiAgICAgIDxwPjxzcGFuIGNsYXNzPVxcXCJtYXJrXFxcIj4qKjwvc3Bhbj7QoNCw0LfQvNC10YDRiyAo0YHQvCk6PC9wPlxcbiAgICAgIDxpbnB1dCBuZy1tb2RlbD0nZm9ybS5kaW1lbnNpb25feCcgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcImxlbmd0aFxcXCI+XFxuICAgICAgPHA+0JTQu9C40L3QsDwvcD5cXG4gICAgICA8cD5YPC9wPlxcbiAgICAgIDxpbnB1dCBuZy1tb2RlbD0nZm9ybS5kaW1lbnNpb25feScgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcIndpZHRoXFxcIj5cXG4gICAgICA8cD7QqNC40YDQuNC90LA8L3A+XFxuICAgICAgPHA+WDwvcD5cXG4gICAgICA8aW5wdXQgbmctbW9kZWw9J2Zvcm0uZGltZW5zaW9uX3onICB0eXBlPVxcXCJ0ZXh0XFxcIiBjbGFzcz1cXFwiaGVpZ2h0XFxcIj5cXG4gICAgICA8cD7QktGL0YHQvtGC0LA8L3A+XFxuXFxuICAgICAgPHA+0JrQvtC80LzQtdC90YLQsNGA0LjQuTo8L3A+XFxuICAgICAgPGlucHV0IG5nLW1vZGVsPSdmb3JtLmNvbW1lbnQnIHR5cGU9XFxcInRleHRcXFwiPlxcblxcbiAgICAgIDxwPtCi0LjQvyDQvtGC0L/RgNCw0LLQu9C10L3QuNGPOjwvcD5cXG4gICAgICA8c2VsZWN0IG5nLW1vZGVsPSdmb3JtLmlzX2RvY3MnPlxcbiAgICAgICAgPG9wdGlvbiB2YWx1ZT0ndHJ1ZScgc2VsZWN0ZWQ9XFxcInNlbGVjdGVkXFxcIj7QlNC+0LrRg9C80LXQvdGC0Ys8L29wdGlvbj5cXG4gICAgICAgIDxvcHRpb24gdmFsdWU9J2ZhbHNlJz7QotC+0LLQsNGA0Ys8L29wdGlvbj5cXG4gICAgICA8L3NlbGVjdD5cXG5cXG4gICAgICA8cD7QkNC00YDQtdGBINC+0YLQv9GA0LDQstC40YLQtdC70Y88L3A+ICAgIFxcbiAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBuZy1tb2RlbD1cXFwiZm9ybS5zZW5kZXJfYWRyZXNzXFxcIj5cXG5cXG4gICAgICA8cD7QkNC00YDQtdGBINC/0L7Qu9GD0YfQsNGC0LXQu9GPPC9wPlxcbiAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBuZy1tb2RlbD1cXFwiZm9ybS5yZWNpcGVpbnRfYWRyZXNzXFxcIj5cXG4gICAgICA8YSBocmVmPVxcXCJcXFwiIGNsYXNzPVxcXCJidXR0b25cXFwiIHZhbHVlPVxcXCJcXFwiIG5nLWNsaWNrPVxcXCJzZW5kZm9ybSgpXFxcIj7QlNC+0LHQsNCy0LjRgtGMINC30LDQutCw0Lc8L2E+XFxuICAgIDwvZmllbGRzZXQ+XFxuICA8L2Rpdj5cXG48L2Rpdj5cXG48c2NyaXB0IHR5cGU9XFxcInRleHQvamF2YXNjcmlwdFxcXCI+IGpRdWVyeSgnLmRhdGV0aW1lcGlja2VyJykuZGF0ZXRpbWVwaWNrZXIoIHsgb25HZW5lcmF0ZTpmdW5jdGlvbiggY3QgKXsgalF1ZXJ5KHRoaXMpLmZpbmQoJy54ZHNvZnRfZGF0ZS54ZHNvZnRfd2Vla2VuZCcpIC5hZGRDbGFzcygneGRzb2Z0X2Rpc2FibGVkJyk7IH0sIGZvcm1hdDpcXFwiWS1tLWRcXFxcXFxcXFRIOmlcXFwiLCBsYW5nOiAncnUnLCBtaW5UaW1lOicxMDowMCcsIG1heFRpbWU6JzIxOjAwJywgdGltZXBpY2tlclNjcm9sbGJhcjonZmFsc2UnLCBkYXlPZldlZWtTdGFydDogMSB9KSA8L3NjcmlwdD5cXG5cIik7XG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgICAkdGVtcGxhdGVDYWNoZS5wdXQoJ2FjY291bnRzXFx0ZW1wbGF0ZXNcXGFjY291bnRfb3JkZXJfY3JlYXRlX3dpdGhfYXR0YWNobWVudC5odG1sJyxcbiAgICAgICAgXCI8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiIG5nLWNvbnRyb2xsZXI9J0ZpbGVVcGxvYWRDdHInPlxcbiAgICA8aW5wdXQgdHlwZT1cXFwiZmlsZVxcXCIgbmctbW9kZWw9XFxcImZvcm0uZmlsZVxcXCIvPjxici8+XFxuICAgICAgICA8bGk+XFxuICAgICAgICAgICAgPHA+0JTQsNGC0LAg0L/RgNC40LXQt9C00LA6PC9wPlxcbiAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cXFwiZGF0ZXRpbWVwaWNrZXJcXFwiIHR5cGU9XFxcInRleHRcXFwiIG5nLW1vZGVsPSdmb3JtLmRlbGl2ZXJfZGF0ZV90aW1lJz5cXG4gICAgICAgIDwvbGk+XFxuICAgICAgICA8cD57QGZvcm1AfTwvcD5cXG48L2Rpdj5cXG5cXG48c2NyaXB0IHR5cGU9XFxcInRleHQvamF2YXNjcmlwdFxcXCI+IGpRdWVyeSgnLmRhdGV0aW1lcGlja2VyJykuZGF0ZXRpbWVwaWNrZXIoXFxuICAgICAgICB7XFxuICAgICAgICAgICAgZm9ybWF0OlxcXCJZLW0tZFxcXFxcXFxcVEg6aVxcXCIsXFxuICAgICAgICAgICAgbGFuZzogJ3J1JyxcXG4gICAgICAgICAgICBtaW5UaW1lOicxMDowMCcsXFxuICAgICAgICAgICAgbWF4VGltZTonMjE6MDAnLFxcbiAgICAgICAgICAgIHRpbWVwaWNrZXJTY3JvbGxiYXI6J2ZhbHNlJ1xcbiAgICAgICAgfSlcXG48L3NjcmlwdD5cXG5cIik7XG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgICAkdGVtcGxhdGVDYWNoZS5wdXQoJ2FjY291bnRzXFx0ZW1wbGF0ZXNcXGFjY291bnRfb3JkZXJfZWRpdC5odG1sJyxcbiAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cnIG5nLWNvbnRyb2xsZXI9J0FjY291bnRPcmRlckVkaXRDdHInPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ0d2VsdmUgY29sdW1ucyBjZW50ZXJlZFxcXCI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICAgIDxmaWVsZHNldD5cXG4gICAgICAgICAgICAgICAgPGxlZ2VuZD7Ql9Cw0LrQsNC3PC9sZWdlbmQ+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxhcmdlLTYgY29sdW1uc1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8bGFiZWw+0JrQvtC80LzQtdC90YLQsNGA0LjQuSDQuiDQt9Cw0LrQsNC30YNcXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD57QGRhdGEuY29tbWVudEB9PC9wPlxcbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxhcmdlLTYgY29sdW1ucyBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsPtCU0LDRgtCwINC+0LrQvtC90YfQsNC90LjRjyDQt9Cw0LrQsNC30LBcXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD57QGRhdGEuY3VzdG9tZXJfZGF0ZUB9PC9wPlxcbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuXFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCIgbmctY29udHJvbGxlcj0nRmlsZVVwbG9hZEN0cic+XFxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwiZmlsZVxcXCIgbnYtZmlsZS1zZWxlY3QgdXBsb2FkZXI9XFxcInVwbG9hZGVyXFxcIi8+PGJyLz5cXG4gICAgICAgIDx1bD5cXG4gICAgICAgICAgICA8bGkgbmctcmVwZWF0PVxcXCJpdGVtIGluIHVwbG9hZGVyLnF1ZXVlXFxcIj5cXG4gICAgICAgICAgICAgICAgTmFtZTogPHNwYW4gbmctYmluZD1cXFwiaXRlbS5maWxlLm5hbWVcXFwiPjwvc3Bhbj48YnIvPlxcbiAgICAgICAgICAgICAgICA8YnV0dG9uIG5nLWNsaWNrPVxcXCJpdGVtLnVwbG9hZCgpXFxcIj51cGxvYWQ8L2J1dHRvbj5cXG4gICAgICAgICAgICA8L2xpPlxcbiAgICAgICAgPC91bD5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuXFxuXFxuICAgICAgICAgICAgICAgIDxkaXYgbmctY29udHJvbGxlcj1cXFwiTW9kYWxEZW1vQ3RyXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XFxcImJ1dHRvblxcXCIgbmctY2xpY2s9XFxcIm9wZW4oKVxcXCI+T3BlbiBtZSE8L2J1dHRvbj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgbmctc2hvdz1cXFwic2VsZWN0ZWRcXFwiPlNlbGVjdGlvbiBmcm9tIGEgbW9kYWw6IHtAIHNlbGVjdGVkIEB9PC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XCIpO1xufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICAgJHRlbXBsYXRlQ2FjaGUucHV0KCdhY2NvdW50c1xcdGVtcGxhdGVzXFxhY2NvdW50X29yZGVyX21vZGFsLmh0bWwnLFxuICAgICAgICBcIjxkaXYgbmctY29udHJvbGxlcj0nQ3JlYXRlT3JkZXJzQ3RyJz5cXG4gICAgPCEtLSDQpNC+0YDQvNCwINC+0YLQv9GA0LDQstC70LXQvdC40Y8g0LfQsNC60LDQt9CwIC0tPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwic21hbGwtMTIgY29sdW1uc1xcXCI+PC9kaXY+XFxuICAgIDxmaWVsZHNldD5cXG4gICAgICAgIDxoMj7QntGC0L/RgNCw0LLQu9C10L3QuNC1OjwvaDI+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNtYWxsLTQgY29sdW1uc1xcXCI+XFxuICAgICAgICAgICAgICAgIDxwPtCU0LDRgtCwINC/0YDQuNC10LfQtNCwOjwvcD5cXG4gICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVxcXCJkYXRldGltZXBpY2tlclxcXCIgdHlwZT1cXFwidGV4dFxcXCIgbmctbW9kZWw9J2Zvcm0ub3JkZXJfZGF0ZXRpbWUnPlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNtYWxsLTQgY29sdW1uc1xcXCI+XFxuICAgICAgICAgICAgICAgIDxwPtCf0LvQsNGC0LXQu9GM0YnQuNC6OjwvcD5cXG4gICAgICAgICAgICAgICAgPHNlbGVjdCBuZy1tb2RlbD0nZm9ybS5wYXllcic+XFxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVxcXCIxXFxcIj7QntGC0L/RgNCw0LLQuNGC0LXQu9GMPC9vcHRpb24+XFxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVxcXCIyXFxcIj7Qn9C+0LvRg9GH0LDRgtC10LvRjDwvb3B0aW9uPlxcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cXFwiM1xcXCI+0KLRgNC10YLRjNC1INC70LjRhtC+PC9vcHRpb24+XFxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVxcXCI0XFxcIj7QntGC0L/RgNCw0LLQuNGC0LXQu9GMICjQsdC10LfQvdCw0LvQuNGH0L3Ri9C5INGA0LDRgdGH0LXRgik8L29wdGlvbj5cXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XFxcIjVcXFwiPtCf0L7Qu9GD0YfQsNGC0LXQu9GMICjQsdC10LfQvdCw0LvQuNGH0L3Ri9C5INGA0LDRgdGH0LXRgik8L29wdGlvbj5cXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XFxcIjZcXFwiPtCi0YDQtdGC0YzQtSDQu9C40YbQviAo0LHQtdC30L3QsNC70LjRh9C90YvQuSDRgNCw0YHRh9C10YIpPC9vcHRpb24+XFxuICAgICAgICAgICAgICAgIDwvc2VsZWN0PlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNtYWxsLTQgY29sdW1uc1xcXCI+XFxuICAgICAgICAgICAgICAgIDxwPtCm0LXQvdC90L7RgdGC0Ywg0L7RgtC/0YDQsNCy0LvQtdC90LjRjzwvcD5cXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIG5nLW1vZGVsPSdmb3JtLndvcnRoJz5cXG5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzbWFsbC02IGNvbHVtbnNcXFwiPlxcbiAgICAgICAgICAgICAgICA8cD7QotC40L8g0L7RgtC/0YDQsNCy0LvQtdC90LjRjzo8L3A+XFxuICAgICAgICAgICAgICAgIDxzZWxlY3QgbmctbW9kZWw9J2Zvcm0uaXNfZG9jcyc+XFxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPSd0cnVlJyBzZWxlY3RlZD1cXFwic2VsZWN0ZWRcXFwiPtCU0L7QutGD0LzQtdC90YLRizwvb3B0aW9uPlxcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT0nZmFsc2UnPtCi0L7QstCw0YDRizwvb3B0aW9uPlxcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzbWFsbC02IGNvbHVtbnNcXFwiPlxcbiAgICAgICAgICAgICAgICA8cD48c3BhbiBjbGFzcz1cXFwibWFya1xcXCI+Kio8L3NwYW4+0JLQtdGBICjQutCzKTo8L3A+XFxuICAgICAgICAgICAgICAgIDxpbnB1dCBuZy1tb2RlbD0nZm9ybS53ZWlnaHQnIHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJ3ZWlnaHRcXFwiPlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNtYWxsLTYgY29sdW1uc1xcXCI+XFxuICAgICAgICAgICAgICAgIDxwPtCQ0LTRgNC10YEg0L7RgtC/0YDQsNCy0LjRgtC10LvRjzwvcD5cXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIG5nLW1vZGVsPVxcXCJmb3JtLnNlbmRlcl9hZHJlc3NcXFwiPlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNtYWxsLTYgY29sdW1uc1xcXCI+XFxuICAgICAgICAgICAgICAgIDxwPtCQ0LTRgNC10YEg0L/QvtC70YPRh9Cw0YLQtdC70Y88L3A+XFxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBuZy1tb2RlbD1cXFwiZm9ybS5yZWNpcGVpbnRfYWRyZXNzXFxcIj5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzbWFsbC0xMiBjb2x1bW5cXFwiPlxcbiAgICAgICAgICAgICAgICA8cD48c3BhbiBjbGFzcz1cXFwibWFya1xcXCI+Kio8L3NwYW4+0KDQsNC30LzQtdGA0YsgKNGB0LwpOjwvcD5cXG5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic21hbGwtNCBjb2x1bW5cXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPHA+0JTQu9C40L3QsDwvcD5cXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBuZy1tb2RlbD0nZm9ybS5kaW1lbnNpb25feCcgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcImxlbmd0aFxcXCI+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzbWFsbC00IGNvbHVtblxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8cD7QqNC40YDQuNC90LA8L3A+XFxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgbmctbW9kZWw9J2Zvcm0uZGltZW5zaW9uX3knIHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJ3aWR0aFxcXCI+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzbWFsbC00IGNvbHVtblxcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8cD7QktGL0YHQvtGC0LA8L3A+XFxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgbmctbW9kZWw9J2Zvcm0uZGltZW5zaW9uX3onICB0eXBlPVxcXCJ0ZXh0XFxcIiBjbGFzcz1cXFwiaGVpZ2h0XFxcIj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic21hbGwtNiBjb2x1bW5cXFwiPjwvZGl2PlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInNtYWxsLTYgY29sdW1uXFxcIj48L2Rpdj5cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJzbWFsbC02IGNvbHVtblxcXCI+XFxuICAgICAgICAgICAgICAgIDxwPtCa0L7QvNC80LXQvdGC0LDRgNC40Lk6PC9wPlxcbiAgICAgICAgICAgICAgICA8aW5wdXQgbmctbW9kZWw9J2Zvcm0uY29tbWVudCcgdHlwZT1cXFwidGV4dFxcXCI+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwic21hbGwtNiBjb2x1bW5cXFwiPlxcbiAgICAgICAgICAgICAgICA8YSBocmVmPVxcXCJcXFwiIGNsYXNzPVxcXCJidXR0b25cXFwiIHZhbHVlPVxcXCJcXFwiIG5nLWNsaWNrPVxcXCJzZW5kZm9ybSgpXFxcIj7QlNC+0LHQsNCy0LjRgtGMINC30LDQutCw0Lc8L2E+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2Rpdj5cXG5cXG5cXG4gICAgPC9maWVsZHNldD5cXG48L2Rpdj5cXG48YnV0dG9uIGNsYXNzPVxcXCJidXR0b25cXFwiIG5nLWNsaWNrPVxcXCJvaygpXFxcIj5PSzwvYnV0dG9uPlxcbjxhIGNsYXNzPVxcXCJjbG9zZS1yZXZlYWwtbW9kYWxcXFwiIG5nLWNsaWNrPVxcXCJjYW5jZWwoKVxcXCI+JiMyMTU7PC9hPlxcbjxzY3JpcHQgdHlwZT1cXFwidGV4dC9qYXZhc2NyaXB0XFxcIj4galF1ZXJ5KCcuZGF0ZXRpbWVwaWNrZXInKS5kYXRldGltZXBpY2tlciggeyBvbkdlbmVyYXRlOmZ1bmN0aW9uKCBjdCApeyBqUXVlcnkodGhpcykuZmluZCgnLnhkc29mdF9kYXRlLnhkc29mdF93ZWVrZW5kJykgLmFkZENsYXNzKCd4ZHNvZnRfZGlzYWJsZWQnKTsgfSwgZm9ybWF0OlxcXCJkLm0uWSBIOmlcXFwiLCBsYW5nOiAncnUnLCBtaW5UaW1lOicxMDowMCcsIG1heFRpbWU6JzIxOjAwJywgdGltZXBpY2tlclNjcm9sbGJhcjonZmFsc2UnLCBkYXlPZldlZWtTdGFydDogMSB9KSA8L3NjcmlwdD5cXG5cIik7XG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgICAkdGVtcGxhdGVDYWNoZS5wdXQoJ2FjY291bnRzXFx0ZW1wbGF0ZXNcXGFjY291bnRfb3JkZXJzX2xpc3QuaHRtbCcsXG4gICAgICAgIFwiPGRpdiBjbGFzcz1cXFwicm93XFxcIiBuZy1jb250cm9sbGVyPSdPcmRlcnNDdHInPlxcbiAgICA8dGFibGU+XFxuICAgICAgICA8dGhlYWQ+XFxuICAgICAgICA8dHI+XFxuICAgICAgICAgICAgPHRkPtCd0L7QvNC10YAg0LfQsNC60LDQt9CwPC90ZD5cXG4gICAgICAgICAgICA8dGQ+0JrQvtC80LzQtdC90YLQsNGA0LjQuTwvdGQ+XFxuICAgICAgICAgICAgPHRkPtCU0LDRgtCwINC30LDQutCw0LfRh9C40LrQsDwvdGQ+XFxuICAgICAgICAgICAgPHRkPtCh0L7Qs9C70LDRgdC+0LLQsNC90L3QsNGPINC00LDRgtCwPC90ZD5cXG4gICAgICAgICAgICA8dGQ+0KLQtdC60YPRidC40Lkg0YHRgtCw0YLRg9GBPC90ZD5cXG4gICAgICAgIDwvdHI+XFxuICAgICAgICA8L3RoZWFkPlxcbiAgICAgICAgPHRib2R5PlxcbiAgICAgICAgPHRyIG5nLXJlcGVhdD0naXRlbSBpbiBkYXRhJz5cXG4gICAgICAgICAgICA8dGQ+PGEgaHJlZj0nIy9vcmRlcnMve0AgaXRlbS5pZCBAfSc+PGkgY2xhc3M9XFxcImZpLWxpbmsgc2l6ZS0xOFxcXCI+PC9pPjwvYT48L3RkPlxcbiAgICAgICAgICAgIDx0ZD57QCBpdGVtLmNvbW1lbnQgQH08L3RkPlxcbiAgICAgICAgICAgIDx0ZD57QCBpdGVtLmN1c3RvbWVyX2RhdGUgQH08L3RkPlxcbiAgICAgICAgICAgIDx0ZD57QCBpdGVtLm1hbmFnZXJfZGF0ZSBAfTwvdGQ+XFxuICAgICAgICAgICAgPHRkPntAaXRlbS5zdGF0dXNAfTwvdGQ+XFxuICAgICAgICA8L3RyPlxcbiAgICAgICAgPC90Ym9keT5cXG4gICAgPC90YWJsZT5cXG4gICAgPGEgaHJlZj1cXFwiIy9vcmRlcnMvY3JlYXRlXFxcIiBjbGFzcz1cXFwiYnV0dG9uXFxcIj7QlNC+0LHQsNCy0LjRgtGMINC30LDQutCw0Lc8L2E+XFxuPC9kaXY+XCIpO1xufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICAgJHRlbXBsYXRlQ2FjaGUucHV0KCdhY2NvdW50c1xcdGVtcGxhdGVzXFxhY2NvdW50X3Byb2ZpbGUuaHRtbCcsXG4gICAgICAgIFwiPGRpdiBjbGFzcz1cXFwicm93XFxcIiBuZy1jb250cm9sbGVyPSdQcm9maWxlQ3RyJz5cXG4gIDxkaXYgY2xhc3M9XFxcInR3ZWx2ZSBjb2x1bW5zXFxcIj5cXG4gICAgPHRhYmxlPlxcbiAgICAgIDx0Ym9keT5cXG4gICAgICA8dHI+XFxuICAgICAgICA8dGQ+INCt0LvQtdC60YLRgNC+0L3QvdCw0Y8g0L/QvtGH0YLQsCA8L3RkPlxcbiAgICAgICAgPHRkPiB7QGRhdGEuZW1haWxAfSA8L3RkPlxcbiAgICAgIDwvdHI+XFxuICAgICAgPHRyPlxcbiAgICAgICAgPHRkPiDQmNC80Y8gPC90ZD5cXG4gICAgICAgIDx0ZD4ge0BkYXRhLmZpcnN0X25hbWVAfSA8L3RkPlxcbiAgICAgIDwvdHI+XFxuICAgICAgPHRyPlxcbiAgICAgICAgPHRkPiDQpNCw0LzQuNC70LjRjyA8L3RkPlxcbiAgICAgICAgPHRkPiB7QGRhdGEubGFzdF9uYW1lQH0gPC90ZD5cXG4gICAgICA8L3RyPlxcbiAgICAgIDx0cj5cXG4gICAgICAgIDx0ZD4g0JTQsNGC0LAg0YDQtdCz0LjRgdGC0YDQsNGG0LjQuCA8L3RkPlxcbiAgICAgICAgPHRkPiB7QGRhdGEuZGF0ZV9qb2luZWRAfSA8L3RkPlxcbiAgICAgIDwvdHI+XFxuICAgICAgPHRyPlxcbiAgICAgICAgPHRkPtCa0L7QvNC/0LDQvdC40Y88L3RkPlxcbiAgICAgICAgPHRkPntAY29tcGFueS5uYW1lQH08L3RkPlxcbiAgICAgIDwvdHI+XFxuICAgICAgPHRyPlxcbiAgICAgICAgPHRkPtCQ0LTRgNC10YEg0LrQvtC80L/QsNC90LjQuDo8L3RkPlxcbiAgICAgICAgPHRkPntAY29tcGFueS5hbGxvY2F0aW9uQH08L3RkPlxcbiAgICAgIDwvdHI+XFxuICAgICAgPHRyPlxcbiAgICAgICAgPHRkPtCi0LXQu9C10YTQvtC9INC60L7QvNC/0LDQvdC40Lg8L3RkPlxcbiAgICAgICAgPHRkPntAY29tcGFueS5waG9uZUB9PC90ZD5cXG4gICAgICA8L3RyPlxcbiAgICAgIDwvdGJvZHk+XFxuICAgIDwvdGFibGU+XFxuICA8L2Rpdj5cXG48L2Rpdj5cXG5cIik7XG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgICAkdGVtcGxhdGVDYWNoZS5wdXQoJ2FkbWluXFx0ZW1wbGF0ZXNcXGFkbWluX2NvbXBhbmllc19kZXRhaWwuaHRtbCcsXG4gICAgICAgIFwiPGRpdiBuZy1jb250cm9sbGVyPSdDb21wYW5pZXNEZXRhaWxDdHInPlxcbiAgICA8ZGl2IGNsYXNzPSdyb3cnID5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcImxhcmdlLTYgY29sdW1uc1xcXCI+XFxuICAgICAgICAgICAgPHRhYmxlPlxcbiAgICAgICAgICAgICAgICA8Y29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICA8Y29sIHNwYW49XFxcIjFcXFwiIHN0eWxlPVxcXCJ3aWR0aDogMjAlO1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8Y29sIHNwYW49XFxcIjFcXFwiIHN0eWxlPVxcXCJ3aWR0aDogODAlO1xcXCI+XFxuICAgICAgICAgICAgICAgIDwvY29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgIDx0Ym9keT5cXG4gICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgPHRkPtCY0LzRjzwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8dGQ+e0BkYXRhLm5hbWVAfTwvdGQ+XFxuICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgIDx0ZD7QkNC00YDQtdGBPC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDx0ZD57QGRhdGEuYWxsb2NhdGlvbkB9PC90ZD5cXG4gICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICAgICAgPHRkPtCc0LXQvdC10LTQttC10YA8L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgPHRkPjxhIGhyZWY9XFxcIiMvY3VzdG9tZXIve0BkYXRhLm1hbmFnZXJAfVxcXCI+e0BkYXRhLm1hbmFnZXJfZGVhdGlsQH08L2E+PC90ZD5cXG4gICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICAgICAgPC90Ym9keT5cXG4gICAgICAgICAgICA8L3RhYmxlPlxcbiAgICAgICAgPC9kaXY+XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtNiBjb2x1bW5zXFxcIj5cXG4gICAgICAgICAgICA8cD7QodC+0YLRgNGD0LTQvdC40LrQuDwvcD5cXG4gICAgICAgICAgICA8dGFibGU+XFxuICAgICAgICAgICAgICAgIDx0ciBuZy1yZXBlYXQ9XFxcIml0ZW0gaW4gdXNlcnNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPHRkPjxhIG5nLWhyZWY9XFxcIiMvY3VzdG9tZXIve0AgaXRlbS5pZCBAfVxcXCI+PGkgY2xhc3M9XFxcImZpLWxpbmsgc2l6ZS0xOFxcXCI+PC9pPjwvYT48L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgPHRkPntAaXRlbS5lbWFpbEB9PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDx0ZD57QGl0ZW0uZmlyc3RfbmFtZUB9IHtAaXRlbS5sYXN0X25hbWVAfTwvdGQ+XFxuICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgPC90YWJsZT5cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtNiBjb2x1bW5zXFxcIj5cXG4gICAgICAgICAgICA8cD7Ql9Cw0LrQsNC30Ys8L3A+XFxuICAgICAgICAgICAgPHRhYmxlPlxcbiAgICAgICAgICAgICAgICA8dHIgbmctcmVwZWF0PVxcXCJpdGVtIGluIG9yZGVyX2NvbnRhaW5lcnNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPHRkPjxhIGhyZWY9XFxcIiMvb3JkZXItY29udGFpbmVyL3tAaXRlbS5pZEB9XFxcIj48aSBjbGFzcz1cXFwiZmktbGluayBzaXplLTE4XFxcIj48L2k+PC9hPjwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8dGQ+e0BpdGVtLmlkQH08L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgPHRkPntAaXRlbS5zdGF0dXNAfTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8dGQ+e0BpdGVtLmN1c3RvbWVyX2RhdGVAfTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8dGQ+e0BpdGVtLm1hbmFnZXJfZGF0ZUB9PC90ZD5cXG4gICAgICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICA8L3RhYmxlPlxcbiAgICAgICAgPC9kaXY+XFxuICAgIDwvZGl2PlxcbjwvZGl2PlxcblwiKTtcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJykucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnYWRtaW5cXHRlbXBsYXRlc1xcYWRtaW5fY29tcGFuaWVzX2xpc3QuaHRtbCcsXG4gICAgICAgIFwiPGRpdiBjbGFzcz0ncm93JyBuZy1jb250cm9sbGVyPSdDb21wYW5pZXNMaXN0Q3RyJz5cXG4gICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtMTIgY29sdW1uc1xcXCI+XFxuICAgICAgICA8Zm9ybSBuZy1zdWJtaXQ9XFxcImdldCgpXFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsYXJnZS02IGNvbHVtbnNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsPtCf0L7QuNGB0LpcXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcItCS0LLQtdC00LjRgtC1INC00LDQvdC90YvQtVxcXCIgbmctbW9kZWw9XFxcInNlYXJjaFxcXCIvPlxcbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2Zvcm0+XFxuICAgICAgICAgICAgPHRhYmxlPlxcbiAgICAgICAgICAgICAgICA8Y29sZ3JvdXA+XFxuICAgICAgICAgICAgICAgICAgICA8Y29sIHNwYW49XFxcIjFcXFwiIHN0eWxlPVxcXCJ3aWR0aDogNSU7XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxjb2wgc3Bhbj1cXFwiMVxcXCIgc3R5bGU9XFxcIndpZHRoOiAzMCU7XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxjb2wgc3Bhbj1cXFwiMVxcXCIgc3R5bGU9XFxcIndpZHRoOiAzMCU7XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxjb2wgc3Bhbj1cXFwiMVxcXCIgc3R5bGU9XFxcIndpZHRoOiAyNSU7XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxjb2wgc3Bhbj1cXFwiMVxcXCIgc3R5bGU9XFxcIndpZHRoOiA1JTtcXFwiPlxcbiAgICAgICAgICAgICAgICA8L2NvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICA8dGhlYWQ+XFxuICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgIDx0ZD48L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgPHRkPtCY0LzRjzwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8dGQ+0JDQtNGA0LXRgTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8dGQ+0KLQtdC70LXRhNC+0L08L3RkPlxcbiAgICAgICAgICAgICAgICAgICAgPHRkPjwvdGQ+XFxuICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgIDwvdGhlYWQ+XFxuICAgICAgICAgICAgICAgIDx0Ym9keSBuZy1yZXBlYXQ9XFxcIml0ZW0gaW4gZGF0YVxcXCI+XFxuICAgICAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgICAgIDx0ZD48YSBuZy1ocmVmPVxcXCIjL2NvbXBhbmllcy97QCBpdGVtLmlkIEB9XFxcIj48aSBjbGFzcz1cXFwiZmktbGluayBzaXplLTE4XFxcIj48L2k+PC9hPjwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8dGQ+e0BpdGVtLm5hbWVAfTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8dGQ+e0BpdGVtLmFsbG9jYXRpb25AfTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8dGQ+e0BpdGVtLnBob25lQH08L3RkPlxcblxcbiAgICAgICAgICAgICAgICAgICAgPHRkPjxhIG5nLWNsaWNrPVxcXCJkZWxldGVDb21wYW55KGl0ZW0uaWQpXFxcIiBocmVmPVxcXCJcXFwiPiA8aSBjbGFzcz1cXFwiZmktdHJhc2ggc2l6ZS0xOFxcXCI+PC9pPjwvYT48L3RkPlxcbiAgICAgICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgICAgICA8L3Rib2R5PlxcbiAgICAgICAgICAgIDwvdGFibGU+XFxuICAgIDwvZGl2PlxcbjwvZGl2PlxcblwiKTtcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJykucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnYWRtaW5cXHRlbXBsYXRlc1xcYWRtaW5fY29tcGFuaWVzX29yZGVyX2RldGFpbC5odG1sJyxcbiAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cnIG5nLWNvbnRyb2xsZXI9J09yZGVyRGV0YWlsQ3RyJz5cXG4gICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtMTIgY29sdW1uc1xcXCI+XFxuICAgICAgICA8dGFibGU+XFxuICAgICAgICAgICAgPHRyPjx0ZD5JRDwvdGQ+PHRkPntAb3JkZXIuaWRAfTwvdGQ+PC90cj5cXG4gICAgICAgICAgICA8dHI+PHRkPuKEliDQl9Cw0LrQsNC30LA8L3RkPjx0ZD57QG9yZGVyLm9yZGVyX2NvbnRhaW5lckB9PC90ZD48L3RyPlxcbiAgICAgICAgICAgIDx0cj48dGQ+0JrQvtC80LzQtdC90YLQsNGA0LjQuTwvdGQ+PHRkPntAb3JkZXIuY29tbWVudEB9PC90ZD48L3RyPlxcbiAgICAgICAgICAgIDx0cj48dGQ+0KHQv9C+0YHQvtCxINC+0L/Qu9Cw0YLRizwvdGQ+PHRkPntAb3JkZXIucGF5ZXJAfTwvdGQ+PC90cj5cXG4gICAgICAgICAgICA8dHI+PHRkPtCS0LXRgTwvdGQ+PHRkPntAb3JkZXIud2VpZ2h0QH08L3RkPjwvdHI+XFxuICAgICAgICAgICAgPHRyPjx0ZD7QlNC70LjQvdCwPC90ZD48dGQ+e0BvcmRlci5kaW1lbnNpb25feEB9PC90ZD48L3RyPlxcblxcbiAgICAgICAgICAgIDx0cj48dGQ+0KjQuNGA0LjQvdCwPC90ZD48dGQ+e0BvcmRlci5kaW1lbnNpb25feUB9PC90ZD48L3RyPlxcblxcbiAgICAgICAgICAgIDx0cj48dGQ+0JLRi9GB0L7RgtCwPC90ZD48dGQ+e0BvcmRlci5kaW1lbnNpb25fekB9PC90ZD48L3RyPlxcblxcbiAgICAgICAgICAgIDx0cj48dGQ+0JDQtNGA0LXRgSDQv9C+0LvRg9GH0LDRgtC10LvRjzwvdGQ+PHRkPntAb3JkZXIucmVjaXBlaW50X2FkcmVzc0B9PC90ZD48L3RyPlxcbiAgICAgICAgICAgIDx0cj48dGQ+0JDQtNGA0LXRgSDQvtGC0L/RgNCw0LLQuNGC0LXQu9GPPC90ZD48dGQ+e0BvcmRlci5zZW5kZXJfYWRyZXNzQH08L3RkPjwvdHI+XFxuICAgICAgICAgICAgPHRyPjx0ZD7QotC40L8g0L7RgtC/0YDQsNCy0LvQtdC90LjRjzwvdGQ+PHRkPntAb3JkZXIuaXNfZG9jc0B9PC90ZD48L3RyPlxcbiAgICAgICAgICAgIDx0cj48dGQ+0JLRgNC10LzRjyDQvtGC0L/RgNCw0LLQu9C10L3QuNGPPC90ZD48dGQ+e0BvcmRlci5vcmRlcl9kYXRldGltZUB9PC90ZD4gPC90cj5cXG4gICAgICAgICAgICA8dHI+PHRkPtCS0YDQtdC80Y8g0YHQvtC30LTQsNC90LjRjyDQt9Cw0Y/QstC60Lg8L3RkPjx0ZD57QG9yZGVyLmNyZWF0ZXJfZGF0ZXRpbWVAfTwvdGQ+IDwvdHI+XFxuICAgICAgICA8L3RhYmxlPlxcblxcblxcblxcbiAgICA8L2Rpdj5cXG48L2Rpdj5cXG5cIik7XG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgICAkdGVtcGxhdGVDYWNoZS5wdXQoJ2FkbWluXFx0ZW1wbGF0ZXNcXGFkbWluX25vdGlmaWNhdGlvbnMuaHRtbCcsXG4gICAgICAgIFwiPGRpdiBjbGFzcz0ncm93JyBuZy1jb250cm9sbGVyPSdOb3RpZmljYXRpb25zQ3RyJz5cXG4gICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtMTIgY29sdW1uc1xcXCI+XFxuICAgICAgICA8ZGl2IG5nLXJlcGVhdD1cXFwiaXRlbSBpbiBkYXRhXFxcIj5cXG4gICAgICAgICAgICA8cD7QntGC0LLQtdGB0YLQstC10L3QvdGL0Lkg0LzQtdC90LXQtNC20LXRgCA8YSBocmVmPVxcXCIjL2N1c3RvbWVyL3tAaXRlbS5tYW5hZ2VyQH1cXFwiPjxpIGNsYXNzPVxcXCJmaS1saW5rIHNpemUtMThcXFwiPjwvaT48L2E+PC9wPlxcbiAgICAgICAgICAgIDxwPtCa0L7QvNC/0LDQvdC40Y8gPGEgaHJlZj1cXFwiIy9jb21wYW5pZXMve0BpdGVtLmNvbXBhbnlAfVxcXCI+PGkgY2xhc3M9XFxcImZpLWxpbmsgc2l6ZS0xOFxcXCI+PC9pPjwvYT48L3A+XFxuICAgICAgICAgICAgPHA+e0BpdGVtLnRleHRAfTwvcD5cXG4gICAgICAgICAgICA8cD7QktGA0LXQvNGPOiB7QGl0ZW0udGltZUB9PC9wPlxcbiAgICAgICAgICAgIDxhIGhyZWY9XFxcIlxcXCIgIG5nLWNsaWNrPSdkZWxldGUoaXRlbS5pZCknIGNsYXNzPVxcXCJidXR0b24gdGlueVxcXCI+0KPQtNCw0LvQuNGC0Yw8L2E+XFxuICAgICAgICAgICAgPGhyLz5cXG4gICAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG48L2Rpdj5cXG5cIik7XG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgICAkdGVtcGxhdGVDYWNoZS5wdXQoJ2FkbWluXFx0ZW1wbGF0ZXNcXGFkbWluX29yZGVyX2NvbnRhaW5lcl9kZXRhaWwuaHRtbCcsXG4gICAgICAgIFwiPGRpdiBjbGFzcz0ncm93JyBuZy1jb250cm9sbGVyPSdPcmRlckNvbnRhaW5lckN0cic+XFxuICAgIDxkaXYgY2xhc3M9XFxcImxhcmdlLTEyIGNvbHVtbnNcXFwiPlxcblxcbiAgICAgICAgPGZpZWxkc2V0PlxcbiAgICAgICAgICAgIDxsZWdlbmQ+0J/RgNC+0LXQutGCPC9sZWdlbmQ+XFxuICAgICAgICA8ZGl2PlxcbiAgICAgICAgICAgIHtAZGF0YS5vcmRlckNvbnRhaW5lcnMuaWRAfVxcbiAgICAgICAgICAgIHtAZGF0YS5vcmRlckNvbnRhaW5lcnMuc3RhdHVzQH1cXG4gICAgICAgICAgICB7QGRhdGEub3JkZXJDb250YWluZXJzLmN1c3RvbWVyX2RhdGVAfVxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2ZpZWxkc2V0PlxcbiAgICAgICA8ZmlsZWRzZXQ+XFxuICAgICAgICAgICA8bGVnZW5kPtCh0YLQsNGC0YPRgdGLINC60L7QvdGC0YDQsNC60YLQsDwvbGVnZW5kPlxcbiAgICAgICAgICA8ZGl2IG5nLXJlcGVhdD1cXFwiaXRlbSBpbiBkYXRhLnN0YXR1c1xcXCI+XFxuICAgICAgICAgICAgICB7QGl0ZW0uc3RhdHVzIHwgaW50MnN0YXR1cyBAfSB7QGl0ZW0udGltZV9jaGFuZ2VAfVxcbiAgICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgPC9maWxlZHNldD5cXG5cXG4gICAgICAgIDxmaWVsZHNldD5cXG4gICAgICAgICAgICA8bGVnZW5kPtCk0LDQudC70Ysg0L/RgNC+0LXQutGC0LA8L2xlZ2VuZD5cXG4gICAgICAgIDxkaXYgbmctcmVwZWF0PVxcXCJmaWxlIGluIGRhdGEuZmlsZXNcXFwiPlxcbiAgICAgICAgICAgIHtAZGF0YS5maWxlLnVzZXJAfVxcbiAgICAgICAgICAgIHtAZGF0YS5maWxlLmlkQH1cXG4gICAgICAgICAgICA8YSBocmVmPVxcXCJtZWRpYS97QGZpbGUuZmlsZUB9XFxcIj57QGZpbGUuZmlsZUB9PC9hPlxcbiAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2ZpZWxkc2V0PlxcblxcbiAgICAgICAgPGZpZWxkc2V0PlxcbiAgICAgICAgICAgIDxsZWdlbmQ+0JfQsNC60LDQt9GLPC9sZWdlbmQ+XFxuICAgICAgICAgICAgPGRpdiBuZy1yZXBlYXQ9XFxcIm9yZGVyIGluIGRhdGEub3JkZXJzXFxcIj5cXG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cXFwiIy9vcmRlci1jb250YWluZXIve0BkYXRhLm9yZGVyQ29udGFpbmVycy5pZEB9L29yZGVycy97QG9yZGVyLmlkQH1cXFwiPjxpIGNsYXNzPVxcXCJmaS1wYXBlcmNsaXAgc2l6ZS0xOFxcXCI+PC9pPjwvYT5cXG4gICAgICAgICAgICAgICAge0BvcmRlci5pZEB9XFxuICAgICAgICAgICAgICAgIHtAb3JkZXIucGF5ZXJAfVxcbiAgICAgICAgICAgICAgICB7QG9yZGVyLmNvbW1lbnRAfVxcbiAgICAgICAgICAgICAgICB7QG9yZGVyLndlaWdodEB9XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2ZpZWxkc2V0PlxcblxcbiAgICAgICAgPGZpZWxkc2V0PlxcbiAgICAgICAgICAgIDxsZWdlbmQ+PGEgaHJlZj1cXFwiIy9vcmRlci1jb250YWluZXIve0BkYXRhLm9yZGVyQ29udGFpbmVycy5pZEB9L3NjaGVkdWxlXFxcIj7QoNCw0YHQv9C40YHQsNC90LjQtTwvYT48L2xlZ2VuZD5cXG4gICAgICAgICAgICA8ZGl2IG5nLXJlcGVhdD1cXFwiaXRlbSBpbiBkYXRhLnNjaGVkdWxlXFxcIj5cXG4gICAgICAgICAgICAgICAgPGEgaHJlZj1cXFwiIy9vcmRlci1jb250YWluZXIve0BkYXRhLm9yZGVyQ29udGFpbmVycy5pZEB9L3NjaGVkdWxlL3tAaXRlbS5pZEB9XFxcIj48aSBjbGFzcz1cXFwiZmktcGFwZXJjbGlwIHNpemUtMThcXFwiPjwvaT48L2E+XFxuICAgICAgICAgICAgICAgIHtAaXRlbS5pZEB9XFxuICAgICAgICAgICAgICAgIHtAaXRlbS5kYXRlQH1cXG4gICAgICAgICAgICAgICAge0BpdGVtLnN0YXJ0X3RpbWVAfVxcbiAgICAgICAgICAgICAgICB7QGl0ZW0uZW5kX3RpbWVAfVxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgPC9maWVsZHNldD5cXG5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XCIpO1xufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICAgJHRlbXBsYXRlQ2FjaGUucHV0KCdhZG1pblxcdGVtcGxhdGVzXFxhZG1pbl9vcmRlcl9leHByZXNzX2RldGFpbC5odG1sJyxcbiAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cnIG5nLWNvbnRyb2xsZXI9J09kZXJFeHByZXNzRGV0YWlsQ3RyJz5cXG4gICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtMTIgY29sdW1uc1xcXCI+XFxuXFxuICAgIDwvZGl2PlxcbjwvZGl2PlxcblxcblwiKTtcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJykucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnYWRtaW5cXHRlbXBsYXRlc1xcY3VzdG9tZXJfYWNjb3VudC5odG1sJyxcbiAgICAgICAgXCI8ZGl2IGNsYXNzPSdyb3cnIG5nLWNvbnRyb2xsZXI9J0N1c3RvbWVyQWNjb3VudEN0cic+XFxuICAgIDxkaXYgY2xhc3M9XFxcInNtYWxsLTYgY29sdW1uc1xcXCIgbmctc2hvdz1cXFwiIWVkaXRcXFwiPlxcbiAgICAgICAgPHRhYmxlPlxcbiAgICAgICAgICAgIDxjb2xncm91cD5cXG4gICAgICAgICAgICAgICAgPGNvbCBzcGFuPVxcXCIxXFxcIiBzdHlsZT1cXFwid2lkdGg6IDIwJTtcXFwiPlxcbiAgICAgICAgICAgICAgICA8Y29sIHNwYW49XFxcIjFcXFwiIHN0eWxlPVxcXCJ3aWR0aDogODAlO1xcXCI+XFxuICAgICAgICAgICAgPC9jb2xncm91cD5cXG4gICAgICAgICAgICA8dGJvZHk+XFxuICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICA8dGQ+0J/QvtGH0YLQsDwvdGQ+XFxuICAgICAgICAgICAgICAgIDx0ZD57QGRhdGEuZW1haWxAfTwvdGQ+XFxuICAgICAgICAgICAgPC90cj5cXG4gICAgICAgICAgICA8dHI+XFxuICAgICAgICAgICAgICAgIDx0ZD7QlNCw0YLQsCDRgNC10LPQuNGB0YLRgNCw0YbQuNC4PC90ZD5cXG4gICAgICAgICAgICAgICAgPHRkPntAZGF0YS5kYXRlX2pvaW5lZEB9PC90ZD5cXG4gICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgPHRkPtCa0L7QvdGC0LDQutGC0L3QvtC1INC70LjRhtC+PC90ZD5cXG4gICAgICAgICAgICAgICAgPHRkPntAZGF0YS5sYXN0X25hbWVAfSB7QGRhdGEuZmlyc3RfbmFtZUB9PC90ZD5cXG4gICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgIDx0cj5cXG4gICAgICAgICAgICAgICAgPHRkPtCf0YDQuNCy0LjQu9C10LPQuNC4INC/0L7Qu9GM0LfQvtCy0LDRgtC10LvRjzwvdGQ+XFxuICAgICAgICAgICAgICAgIDx0ZCA+PHNwYW4gbmctcmVwZWF0PVxcXCJpdGVtIGluIGRhdGEucGVybWlzc2lvbnNfbmFtZXNcXFwiPntAaXRlbUB9IDwvc3Bhbj48L3RkPlxcbiAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgPC90Ym9keT5cXG4gICAgICAgIDwvdGFibGU+XFxuICAgICAgICA8YSBocmVmPVxcXCJcXFwiIGNsYXNzPVxcXCJidXR0b25cXFwiIG5nLWNsaWNrPVxcXCJzdGFydEVkaXQoKVxcXCI+0KDQtdC00LDQutGC0LjRgNC+0LLQsNGC0Yw8L2E+XFxuICAgIDwvZGl2PlxcbiAgICA8ZGl2IG5nLXNob3c9J2VkaXQnPlxcbiAgICAgICAgPGZvcm0+XFxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIG5nLW1vZGVsPVxcXCJkYXRhLmVtYWlsXFxcIi8+XFxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIG5nLW1vZGVsPVxcXCJkYXRhLmxhc3RfbmFtZVxcXCIvPlxcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBuZy1tb2RlbD1cXFwiZGF0YS5maXJzdF9uYW1lXFxcIi8+XFxuICAgICAgICAgICAgPHNlbGVjdCBuZy1tb2RlbD1cXFwiZGF0YS5wZXJtaXNzaW9uc1xcXCIgbmctb3B0aW9ucz1cXFwicGVybWlzc2lvbi5pZCBhcyBwZXJtaXNzaW9uLnBlcm1pc3Npb24gZm9yIHBlcm1pc3Npb24gaW4gcGVybWlzc2lvbnNcXFwiIHJlcXVpcmVkPjwvc2VsZWN0PlxcbiAgICAgICAgICAgIDxhIGNsYXNzPVxcXCJidXR0b25cXFwiIGhyZWY9XFxcIlxcXCIgbmctY2xpY2s9XFxcInB1dFVzZXIoKVxcXCI+0KHQvtGF0YDQsNC90LjRgtGMPC9pPjwvYT5cXG4gICAgICAgIDwvZm9ybT5cXG4gICAgPC9kaXY+XFxuPC9kaXY+XFxuPHNjcmlwdCB0eXBlPVxcXCJ0ZXh0L2phdmFzY3JpcHRcXFwiPiBqUXVlcnkoJy5kYXRldGltZXBpY2tlcicpLmRhdGV0aW1lcGlja2VyKCB7IG9uR2VuZXJhdGU6ZnVuY3Rpb24oIGN0ICl7IGpRdWVyeSh0aGlzKS5maW5kKCcueGRzb2Z0X2RhdGUueGRzb2Z0X3dlZWtlbmQnKSAuYWRkQ2xhc3MoJ3hkc29mdF9kaXNhYmxlZCcpOyB9LCBmb3JtYXQ6XFxcImQubS5ZIEg6aVxcXCIsIGxhbmc6ICdydScsIG1pblRpbWU6JzEwOjAwJywgbWF4VGltZTonMjE6MDAnLCB0aW1lcGlja2VyU2Nyb2xsYmFyOidmYWxzZScsIGRheU9mV2Vla1N0YXJ0OiAxIH0pIDwvc2NyaXB0PlxcblwiKTtcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJykucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnYWRtaW5cXHRlbXBsYXRlc1xcY3VzdG9tZXJzX2xpc3QuaHRtbCcsXG4gICAgICAgIFwiPGRpdiBjbGFzcz0ncm93JyBuZy1jb250cm9sbGVyPSdDdXN0b21lcnNDdHInPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJ0d2VsdmUgY29sdW1ucyBjZW50ZXJlZFxcXCI+XFxuICAgICAgICA8Zm9ybSBuZy1zdWJtaXQ9XFxcImdldCgpXFxcIj5cXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsYXJnZS02IGNvbHVtbnNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGxhYmVsPtCf0L7QuNGB0LpcXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcItCS0LLQtdC00LjRgtC1INC00LDQvdC90YvQtVxcXCIgbmctbW9kZWw9XFxcInNlYXJjaFxcXCIvPlxcbiAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICA8L2Zvcm0+XFxuICAgICAgICA8dGFibGU+XFxuICAgICAgICAgICAgPGNvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICA8Y29sIHNwYW49XFxcIjFcXFwiIHN0eWxlPVxcXCJ3aWR0aDogNSU7XFxcIj5cXG4gICAgICAgICAgICAgICAgPGNvbCBzcGFuPVxcXCIxXFxcIiBzdHlsZT1cXFwid2lkdGg6IDQ1JTtcXFwiPlxcbiAgICAgICAgICAgICAgICA8Y29sIHNwYW49XFxcIjFcXFwiIHN0eWxlPVxcXCJ3aWR0aDogNDUlO1xcXCI+XFxuICAgICAgICAgICAgICAgIDxjb2wgc3Bhbj1cXFwiMVxcXCIgc3R5bGU9XFxcIndpZHRoOiA1JVxcXCI+XFxuICAgICAgICAgICAgPC9jb2xncm91cD5cXG4gICAgICAgICAgICA8dGhlYWQ+XFxuICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICA8dGQ+PC90ZD5cXG4gICAgICAgICAgICAgICAgPHRkPtCa0L7QvdGC0LDQutGC0L3QvtC1INC70LjRhtC+PC90ZD5cXG4gICAgICAgICAgICAgICAgPHRkPtCf0L7Rh9GC0LA8L3RkPlxcbiAgICAgICAgICAgICAgICA8dGQ+PC90ZD5cXG4gICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgIDwvdGhlYWQ+XFxuICAgICAgICAgICAgPHRib2R5PlxcbiAgICAgICAgICAgIDx0ciBuZy1yZXBlYXQ9J2l0ZW0gaW4gZGF0YSc+XFxuICAgICAgICAgICAgICAgIDx0ZD48YSBuZy1ocmVmPVxcXCIjL2N1c3RvbWVyL3tAIGl0ZW0uaWQgQH1cXFwiPjxpIGNsYXNzPVxcXCJmaS1saW5rIHNpemUtMThcXFwiPjwvaT48L2E+PC90ZD5cXG4gICAgICAgICAgICAgICAgPHRkPntAIGl0ZW0uZmlyc3RfbmFtZSBAfSB7QCBpdGVtLmxhc3RfbmFtZSBAfTwvdGQ+XFxuICAgICAgICAgICAgICAgIDx0ZD4ge0BpdGVtLmVtYWlsQH0gPC90ZD5cXG4gICAgICAgICAgICAgICAgPHRkPjxhIGhyZWY9XFxcIlxcXCIgbmctY2xpY2s9XFxcImRlbGV0ZShpdGVtLmlkKVxcXCI+PGkgY2xhc3M9XFxcImZpLXRyYXNoIHNpemUtMThcXFwiPjwvaT48L2E+PC90ZD5cXG4gICAgICAgICAgICA8L3RyPlxcbiAgICAgICAgICAgIDwvdGJvZHk+XFxuICAgICAgICA8L3RhYmxlPlxcbiAgICAgICAgPGEgY2xhc3M9XFxcImJ1dHRvblxcXCIgaHJlZj1cXFwiIy9yZWdpc3RyYXRpb25cXFwiPtCU0L7QsdCw0LLQuNGC0Yw8L2E+XFxuICAgIDwvZGl2PlxcbjwvZGl2PlxcblwiKTtcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJykucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnYWRtaW5cXHRlbXBsYXRlc1xcZGVsaXZlcnkuaHRtbCcsXG4gICAgICAgIFwiPGRpdiBjbGFzcz0ncm93JyBuZy1jb250cm9sbGVyPSdEZWxpdmVyeUN0cic+XFxuICAgIDxkaXYgY2xhc3M9XFxcInR3ZWx2ZSBjb2x1bW5zIGNlbnRlcmVkXFxcIj5cXG4gICAgICAgIDxmaWVsZHNldD5cXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcItCS0LXRgVxcXCIgbmctbW9kZWw9XFxcImZvcm0ud2VpZ2h0XFxcIi8+XFxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCLQkNC00YDQtdGBXFxcIiBuZy1tb2RlbD1cXFwiZm9ybS5hZHJlc3NcXFwiLz5cXG4gICAgICAgICAgICA8c2VsZWN0IG5nLW1vZGVsPVxcXCJmb3JtLnR5cGVcXFwiIG5nLW9wdGlvbnM9XFxcIml0ZW0uaWQgYXMgaXRlbS5uYW1lIGZvciBpdGVtIGluIHRhcmlmc1xcXCI+IDwvc2VsZWN0PlxcbiAgICAgICAgICAgIDxhIGhyZWY9XFxcIlxcXCIgY2xhc3M9XFxcImJ1dHRvblxcXCIgdmFsdWU9XFxcIlxcXCIgbmctY2xpY2s9XFxcImFkZCgpXFxcIj5hZGQ8L2E+XFxuICAgICAgICA8L2ZpZWxkc2V0PlxcbiAgICAgICAgICAgIDx0YWJsZT5cXG5cXHRcXHRcXHQ8dGJvZHk+XFxuXFx0XFx0XFx0XFx0PHRyIG5nLXJlcGVhdD0naXRlbSBpbiBkYXRhJz5cXG4gICAgICAgICAgICAgICAgICAgIDx0ZD57QGl0ZW0uaWRAfTwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8dGQ+e0BpdGVtLndlaWdodEB9PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDx0ZD57QGl0ZW0uYWRyZXNzQH08L3RkPlxcblxcdFxcdFxcdFxcdDwvdHI+XFxuXFx0XFx0XFx0PC90Ym9keT5cXG5cXHRcXHQ8L3RhYmxlPlxcbiAgICA8L2Rpdj5cXG48L2Rpdj5cXG5cIik7XG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgICAkdGVtcGxhdGVDYWNoZS5wdXQoJ2FkbWluXFx0ZW1wbGF0ZXNcXGZhc3Rfb3JkZXIuaHRtbCcsXG4gICAgICAgIFwiPGRpdiBjbGFzcz0ncm93JyBuZy1jb250cm9sbGVyPSdGYXN0T3JkZXJDdHInPlxcbiAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtMTIgY29sdW1uc1xcXCI+XFxuICAgICAgICAgICAgPCEtLSDQpNC+0YDQvNCwINGB0L7Qt9C00LDQvdC40Y8g0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPIC0tPlxcbiAgICAgICAgICAgIDxmaWVsZHNldCBuZy1zaG93PVxcXCIhZm9ybVN0YXRlLnJlZ2lzdHJhdGlvbklzRG9uZVxcXCI+XFxuICAgICAgICAgICAgICAgIDxsZWdlbmQ+0KHQvtC30LTQsNC90LjQtSDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y88L2xlZ2VuZD5cXG5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxhcmdlLTYgY29sdW1uc1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsPtCt0LvQtdC60YLRgNC+0L3QvdCw0Y8g0L/QvtGH0YLQsFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwiZW1haWxcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXFwiIG5nLW1vZGVsPVxcXCJ1c2VyLmVtYWlsXFxcIi8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtNiBjb2x1bW5zIFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsPtCf0LDRgNC+0LvRjFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwicGFzc3dvcmRcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXFwiIG5nLW1vZGVsPVxcXCJ1c2VyLnBhc3N3b3JkXFxcIi8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxhcmdlLTYgY29sdW1uc1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsPtCY0LzRj1xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcXCIgbmctbW9kZWw9XFxcInVzZXIuZmlyc3RfbmFtZVxcXCIvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxhcmdlLTYgY29sdW1ucyBlbmRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbD7QpNCw0LzQuNC70LjRj1xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgcGxhY2Vob2xkZXI9XFxcIlxcXCIgbmctbW9kZWw9XFxcInVzZXIubGFzdF9uYW1lXFxcIi8+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxhcmdlLTYgY29sdW1ucyBlbmRcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbD7QotC10LvQtdGE0L7QvVxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGVsXFxcIiBwbGFjZWhvbGRlcj1cXFwiXFxcIiBuZy1tb2RlbD1cXFwidXNlci5waG9uZVxcXCIvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxhcmdlLTYgY29sdW1ucyBcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbD7QndCw0LfQstCw0L3QuNC1INC60L7QvNC/0LDQvdC40LhcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIHBsYWNlaG9sZGVyPVxcXCJcXFwiIG5nLW1vZGVsPVxcXCJ1c2VyLmNvbXBhbnlfbmFtZVxcXCIvPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuXFxuICAgICAgICAgICAgICAgIDxhIGhyZWY9XFxcIlxcXCIgY2xhc3M9XFxcImJ1dHRvblxcXCIgdmFsdWU9XFxcIlxcXCIgbmctY2xpY2s9XFxcImFkZFVzZXIoKVxcXCI+0JfQsNGA0LXQs9C40YHRgtGA0LjRgNC+0LLQsNGC0Yw8L2E+XFxuXFxuICAgICAgICAgICAgPC9maWVsZHNldD5cXG5cXG5cXG4gICAgICAgICAgICA8IS0tINCf0L7QutCw0LfRi9Cy0LDQtdC8INGE0L7RgNC80YMg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPIC0tPlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcIlxcXCIgbmctc2hvdz1cXFwiZm9ybVN0YXRlLnJlZ2lzdHJhdGlvbklzRG9uZVxcXCI+XFxuICAgICAgICAgICAgICAgIDxmaWVsZHNldD5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtNiBjb2x1bW5zXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsPtCY0LzRj1xcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+e0Bmb3JtU3RhdGUuQWRkZWRVc2VyLmZpcnN0X25hbWVAfTwvcD5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9sYWJlbD5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsYXJnZS02IGNvbHVtbnMgZW5kXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsPtCk0LDQvNC40LvQuNGPXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8cD57QGZvcm1TdGF0ZS5BZGRlZFVzZXIubGFzdF9uYW1lQH08L3A+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cXG5cXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtNiBjb2x1bW5zXFxcIj5cXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsPtCt0LvQtdC60YLRgNC+0L3QvdCw0Y8g0L/QvtGH0YLQsFxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHA+e0Bmb3JtU3RhdGUuQWRkZWRVc2VyLmVtYWlsQH08L3A+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvbGFiZWw+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtNiBjb2x1bW5zIGVuZFxcXCI+XFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbD7QktGA0LXQvNGPINGA0LXQs9C40YHRgtGA0LDRhtC40LhcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxwPntAZm9ybVN0YXRlLkFkZGVkVXNlci5kYXRlX2pvaW5lZEB9PC9wPlxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDwvZmllbGRzZXQ+XFxuICAgICAgICAgICAgPC9kaXY+XFxuXFxuICAgICAgICA8L2Rpdj5cXG4gICAgPC9kaXY+XFxuXFxuICAgIDwhLS0g0KTQvtGA0LzQsCDQvtGC0L/RgNCw0LLQu9C10L3QuNGPINC30LDQutCw0LfQsCAtLT5cXG4gICAgPGZpZWxkc2V0IG5nLXNob3c9XFxcImZvcm1TdGF0ZS5yZWdpc3RyYXRpb25Jc0RvbmVcXFwiPlxcbiAgICAgICAgPGxlZ2VuZD7QntGC0L/RgNCw0LLQu9C10L3QuNC1OjwvbGVnZW5kPlxcbiAgICAgICAgPHA+0JTQsNGC0LAg0L/RgNC40LXQt9C00LAg0LrRg9GA0YzQtdGA0LA6PC9wPlxcbiAgICAgICAgPGlucHV0IGNsYXNzPVxcXCJkYXRldGltZXBpY2tlclxcXCIgdHlwZT1cXFwidGV4dFxcXCIgbmctbW9kZWw9J2Zvcm0ub3JkZXJfZGF0ZXRpbWUnPlxcbiAgICAgICAgPHA+0J/Qu9Cw0YLQtdC70YzRidC40Lo6PC9wPlxcbiAgICAgICAgPHNlbGVjdCBuZy1tb2RlbD0nZm9ybS5wYXllcic+XFxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cXFwiMVxcXCI+0J7RgtC/0YDQsNCy0LjRgtC10LvRjDwvb3B0aW9uPlxcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XFxcIjJcXFwiPtCf0L7Qu9GD0YfQsNGC0LXQu9GMPC9vcHRpb24+XFxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cXFwiM1xcXCI+0KLRgNC10YLRjNC1INC70LjRhtC+PC9vcHRpb24+XFxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cXFwiNFxcXCI+0J7RgtC/0YDQsNCy0LjRgtC10LvRjCAo0LHQtdC30L3QsNC70LjRh9C90YvQuSDRgNCw0YHRh9C10YIpPC9vcHRpb24+XFxuICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cXFwiNVxcXCI+0J/QvtC70YPRh9Cw0YLQtdC70YwgKNCx0LXQt9C90LDQu9C40YfQvdGL0Lkg0YDQsNGB0YfQtdGCKTwvb3B0aW9uPlxcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XFxcIjZcXFwiPtCi0YDQtdGC0YzQtSDQu9C40YbQviAo0LHQtdC30L3QsNC70LjRh9C90YvQuSDRgNCw0YHRh9C10YIpPC9vcHRpb24+XFxuICAgICAgICA8L3NlbGVjdD5cXG4gICAgICAgIDxwPjxzcGFuIGNsYXNzPVxcXCJtYXJrXFxcIj4qKjwvc3Bhbj7QktC10YEgKNC60LMpOjwvcD5cXG4gICAgICAgIDxpbnB1dCBuZy1tb2RlbD0nZm9ybS53ZWlnaHQnIHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJ3ZWlnaHRcXFwiPlxcblxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXG4gICAgICAgICAgICA8ZmllbGRzZXQ+XFxuICAgICAgICAgICAgICAgIDxsZWdlbmQ+PHA+PHNwYW4gY2xhc3M9XFxcIm1hcmtcXFwiPioqPC9zcGFuPtCg0LDQt9C80LXRgNGLICjRgdC8KTo8L3A+PC9sZWdlbmQ+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxhcmdlLTQgY29sdW1uc1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8cD7QlNC70LjQvdCwPC9wPlxcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IG5nLW1vZGVsPSdmb3JtLmRpbWVuc2lvbl94JyB0eXBlPVxcXCJ0ZXh0XFxcIiBjbGFzcz1cXFwibGVuZ3RoXFxcIj5cXG4gICAgICAgICAgICAgICAgPC9kaXY+XFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxhcmdlLTQgY29sdW1uc1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8cD7QqNC40YDQuNC90LA8L3A+XFxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgbmctbW9kZWw9J2Zvcm0uZGltZW5zaW9uX3knIHR5cGU9XFxcInRleHRcXFwiIGNsYXNzPVxcXCJ3aWR0aFxcXCI+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsYXJnZS00IGNvbHVtbnNcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPHA+0JLRi9GB0L7RgtCwPC9wPlxcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IG5nLW1vZGVsPSdmb3JtLmRpbWVuc2lvbl96JyAgdHlwZT1cXFwidGV4dFxcXCIgY2xhc3M9XFxcImhlaWdodFxcXCI+XFxuICAgICAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XFxuICAgICAgICA8L2Rpdj5cXG5cXG5cXG4gICAgICAgIDxwPtCa0L7QvNC80LXQvdGC0LDRgNC40Lk6PC9wPlxcbiAgICAgICAgPGlucHV0IG5nLW1vZGVsPSdmb3JtLmNvbW1lbnQnIHR5cGU9XFxcInRleHRcXFwiPlxcblxcbiAgICAgICAgPHA+0KLQuNC/INC+0YLQv9GA0LDQstC70LXQvdC40Y86PC9wPlxcbiAgICAgICAgPHNlbGVjdCBuZy1tb2RlbD0nZm9ybS5pc19kb2NzJz5cXG4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPSd0cnVlJyBzZWxlY3RlZD1cXFwic2VsZWN0ZWRcXFwiPtCU0L7QutGD0LzQtdC90YLRizwvb3B0aW9uPlxcbiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9J2ZhbHNlJz7QotC+0LLQsNGA0Ys8L29wdGlvbj5cXG4gICAgICAgIDwvc2VsZWN0PlxcblxcbiAgICAgICAgPHA+0JDQtNGA0LXRgSDQvtGC0L/RgNCw0LLQuNGC0LXQu9GPPC9wPlxcbiAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIG5nLW1vZGVsPVxcXCJmb3JtLnNlbmRlcl9hZHJlc3NcXFwiPlxcblxcbiAgICAgICAgPHA+0JDQtNGA0LXRgSDQv9C+0LvRg9GH0LDRgtC10LvRjzwvcD5cXG4gICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBuZy1tb2RlbD1cXFwiZm9ybS5yZWNpcGVpbnRfYWRyZXNzXFxcIj5cXG5cXG4gICAgICAgIDxhIGhyZWY9XFxcIlxcXCIgY2xhc3M9XFxcImJ1dHRvblxcXCIgdmFsdWU9XFxcIlxcXCIgbmctY2xpY2s9XFxcInNlbmRmb3JtKClcXFwiPtCU0L7QsdCw0LLQuNGC0Ywg0LfQsNC60LDQtzwvYT5cXG4gICAgPC9maWVsZHNldD5cXG48L2Rpdj5cXG5cXG48c2NyaXB0IHR5cGU9XFxcInRleHQvamF2YXNjcmlwdFxcXCI+IGpRdWVyeSgnLmRhdGV0aW1lcGlja2VyJykuZGF0ZXRpbWVwaWNrZXIoIHsgb25HZW5lcmF0ZTpmdW5jdGlvbiggY3QgKXsgalF1ZXJ5KHRoaXMpLmZpbmQoJy54ZHNvZnRfZGF0ZS54ZHNvZnRfd2Vla2VuZCcpIC5hZGRDbGFzcygneGRzb2Z0X2Rpc2FibGVkJyk7IH0sIGZvcm1hdDpcXFwiWS1tLWRcXFxcXFxcXFRIOmlcXFwiLCBsYW5nOiAncnUnLCBtaW5UaW1lOicxMDowMCcsIG1heFRpbWU6JzIxOjAwJywgdGltZXBpY2tlclNjcm9sbGJhcjonZmFsc2UnLCBkYXlPZldlZWtTdGFydDogMSB9KSA8L3NjcmlwdD5cXG5cIik7XG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgICAkdGVtcGxhdGVDYWNoZS5wdXQoJ2FkbWluXFx0ZW1wbGF0ZXNcXG9yZGVyc19saXN0Lmh0bWwnLFxuICAgICAgICBcIjxkaXYgY2xhc3M9J3JvdycgbmctY29udHJvbGxlcj0nT3JkZXJzTGlzdEN0cic+XFxuICAgIDxkaXYgY2xhc3M9XFxcInR3ZWx2ZSBjb2x1bW5zIGNlbnRlcmVkXFxcIj5cXG5cXG4gICAgICAgIDx0YWJsZT5cXG4gICAgICAgICAgICA8dGhlYWQ+XFxuICAgICAgICAgICAgPHRyPlxcbiAgICAgICAgICAgICAgICA8dGQ+0JLQtdGBPC90ZD5cXG4gICAgICAgICAgICAgICAgPHRkPtCo0LjRgNC40L3QsDwvdGQ+XFxuICAgICAgICAgICAgICAgIDx0ZD7QktGL0YHQvtGC0LA8L3RkPlxcbiAgICAgICAgICAgICAgICA8dGQ+0JTQu9C40L3QvdCwPC90ZD5cXG4gICAgICAgICAgICAgICAgPHRkPtCm0LXQvdC90L7RgdGC0Yw8L3RkPlxcbiAgICAgICAgICAgICAgICA8dGQ+0JrRg9C00LA8L3RkPlxcbiAgICAgICAgICAgICAgICA8dGQ+0J7RgtC60YPQtNCwPC90ZD5cXG4gICAgICAgICAgICAgICAgPHRkPtCU0L7QutGD0LzQtdC90YLRizwvdGQ+XFxuICAgICAgICAgICAgICAgIDx0ZD7QlNCw0YLQsCDQt9Cw0LrQsNC30LA8L3RkPlxcbiAgICAgICAgICAgIDwvdHI+XFxuXFxuICAgICAgICAgICAgPC90aGVhZD5cXG4gICAgICAgICAgICA8dGJvZHk+XFxuICAgICAgICAgICAgPHRyIG5nLXJlcGVhdD1cXFwiaXRlbSBpbiBkYXRhXFxcIj5cXG4gICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAge0BpdGVtLndlaWdodEB9XFxuICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgIHtAaXRlbS5kaW1lbnNpb25feEB9XFxuICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgIHtAaXRlbS5kaW1lbnNpb25feUB9XFxuICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgIHtAaXRlbS5kaW1lbnNpb25fekB9XFxuICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgIHtAaXRlbS53b3J0aEB9XFxuICAgICAgICAgICAgICAgIDwvdGQ+XFxuICAgICAgICAgICAgICAgIDx0ZD5cXG4gICAgICAgICAgICAgICAgICAgIHtAaXRlbS5yZWNpcGVpbnRfYWRyZXNzQH1cXG4gICAgICAgICAgICAgICAgPC90ZD5cXG4gICAgICAgICAgICAgICAgPHRkPlxcbiAgICAgICAgICAgICAgICAgICAge0BpdGVtLnNlbmRlcl9hZHJlc3NAfVxcbiAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICA8dGQgbmctYmluZC1odG1sPVxcXCJpdGVtLmlzX2RvY3MgfCBib29sMmljb25cXFwiPlxcbiAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgICAgICA8dGQ+XFxuICAgICAgICAgICAgICAgICAgICB7QGl0ZW0ub3JkZXJfZGF0ZXRpbWVAfVxcbiAgICAgICAgICAgICAgICA8L3RkPlxcbiAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgPC90Ym9keT5cXG4gICAgICAgIDwvdGFibGU+XFxuICAgIDwvZGl2PlxcbjwvZGl2PlwiKTtcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJykucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnYWRtaW5cXHRlbXBsYXRlc1xccmVnaXN0cmF0aW9uLmh0bWwnLFxuICAgICAgICBcIjxkaXYgY2xhc3M9J3JvdycgbmctY29udHJvbGxlcj0nUmVnaXN0cmF0aW9uQ3RyJz5cXG4gICAgPGRpdiBjbGFzcz1cXFwidHdlbHZlIGNvbHVtbnMgY2VudGVyZWRcXFwiPlxcbiAgICAgICAgPGZpZWxkc2V0PlxcblxcbiAgICAgICAgICAgIDxmb3JtIG5hbWU9XFxcImZvcm1cXFwiIG5vdmFsaWRhdGU+XFxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVxcXCJjb250cm9sLWxhYmVsXFxcIiBmb3I9XFxcImVtYWlsXFxcIj7QrdC70LXQutGC0YDQvtC90L3QsNGPINC/0L7Rh9GC0LA6PC9sYWJlbD5cXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwiZW1haWxcXFwiIG5hbWU9XFxcImVtYWlsXFxcIiBuZy1tb2RlbD1cXFwiZm9ybS51c2VyLmVtYWlsXFxcIiByZXF1aXJlZCBuZy1taW5sZW5ndGg9MSBuZy1tYXhsZW5ndGg9ODA+XFxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVxcXCJjb250cm9sLWxhYmVsXFxcIiBmb3I9XFxcInBhc3N3b3JkXFxcIj5wYXNzd29yZDo8L2xhYmVsPlxcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBuYW1lPVxcXCJwYXNzd29yZFxcXCIgbmctbW9kZWw9XFxcImZvcm0udXNlci5wYXNzd29yZFxcXCIgcmVxdWlyZWQgbmctbWlubGVuZ3RoPTUgbmctbWF4bGVuZ3RoPTE2PlxcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cXFwiY29udHJvbC1sYWJlbFxcXCIgZm9yPVxcXCJmaXJzdF9uYW1lXFxcIj7QmNC80Y86PC9sYWJlbD5cXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgbmFtZT1cXFwiZmlyc3RfbmFtZVxcXCIgbmctbW9kZWw9XFxcImZvcm0udXNlci5maXJzdF9uYW1lXFxcIiByZXF1aXJlZCBuZy1taW5sZW5ndGg9MyBuZy1tYXhsZW5ndGg9MjU+XFxuICAgICAgICAgICAgPGxhYmVsIGNsYXNzPVxcXCJjb250cm9sLWxhYmVsXFxcIiBmb3I9XFxcImxhc3RfbmFtZVxcXCI+0KTQsNC80LjQu9C40Y86PC9sYWJlbD5cXG4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cXFwidGV4dFxcXCIgbmFtZT1cXFwibGFzdF9uYW1lXFxcIiBuZy1tb2RlbD1cXFwiZm9ybS51c2VyLmxhc3RfbmFtZVxcXCIgcmVxdWlyZWQgbmctbWlubGVuZ3RoPTUgbmctbWF4bGVuZ3RoPTI1PlxcblxcblxcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cXFwiY29udHJvbC1sYWJlbFxcXCIgZm9yPVxcXCJsYXN0X25hbWVcXFwiPtCi0LXQu9C10YTQvtC9OjwvbGFiZWw+XFxuICAgICAgICAgICAgPGlucHV0IHR5cGU9XFxcInRleHRcXFwiIG5hbWU9XFxcImxhc3RfbmFtZVxcXCIgbmctbW9kZWw9XFxcImZvcm0uY29tcGFueS5waG9uZVxcXCIgcmVxdWlyZWQgbmctbWlubGVuZ3RoPTkgbmctbWF4bGVuZ3RoPTE1PlxcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cXFwiY29udHJvbC1sYWJlbFxcXCIgZm9yPVxcXCJsYXN0X25hbWVcXFwiPtCd0LDQt9Cy0LDQvdC40LUg0LrQvtC80L/QsNC90LjQuDo8L2xhYmVsPlxcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBuYW1lPVxcXCJsYXN0X25hbWVcXFwiIG5nLW1vZGVsPVxcXCJmb3JtLmNvbXBhbnkubmFtZVxcXCIgcmVxdWlyZWQgbmctbWlubGVuZ3RoPTUgbmctbWF4bGVuZ3RoPTQwPlxcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cXFwiY29udHJvbC1sYWJlbFxcXCIgZm9yPVxcXCJsYXN0X25hbWVcXFwiPtCQ0LTRgNC10YEg0LrQvtC80L/QsNC90LjQuDo8L2xhYmVsPlxcbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVxcXCJ0ZXh0XFxcIiBuYW1lPVxcXCJsYXN0X25hbWVcXFwiIG5nLW1vZGVsPVxcXCJmb3JtLmNvbXBhbnkuYWxsb2NhdGlvblxcXCIgcmVxdWlyZWQgbmctbWlubGVuZ3RoPTUgbmctbWF4bGVuZ3RoPTkwPlxcblxcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cXFwiY29udHJvbC1sYWJlbFxcXCIgZm9yPVxcXCJwZXJtaXNzaW9uc1xcXCI+0J/RgNC40LLQuNC70LXQs9C40Lgg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9GPOjwvbGFiZWw+XFxuICAgICAgICAgICAgPHNlbGVjdCBuZy1tb2RlbD1cXFwiZm9ybS51c2VyLnBlcm1pc3Npb25zXFxcIiBuZy1vcHRpb25zPVxcXCJwZXJtaXNzaW9uLmlkIGFzIHBlcm1pc3Npb24ucGVybWlzc2lvbiBmb3IgcGVybWlzc2lvbiBpbiBwZXJtaXNzaW9uc1xcXCIgcmVxdWlyZWQ+PC9zZWxlY3Q+XFxuXFxuICAgICAgICAgICAgPGJ1dHRvbiB0aXRsZT1cXFwi0JTQvtCx0LDQstC40YLRjCDQv9C+0LvRjNC30L7QstCw0YLQtdC70Y8g0LIg0YHQuNGB0YLQtdC80YMuXFxcIiBuZy1jbGljaz1cXFwic2lnbnVwKClcXFwiIGNsYXNzPVxcXCJidG4gYnRuLXByaW1hcnlcXFwiPtCU0L7QsdCw0LLQuNGC0Yw8L2J1dHRvbj5cXG4gICAgICAgICAgICA8L2Zvcm0+XFxuICAgICAgICA8L2ZpZWxkc2V0PlxcbiAgICAgICAgPHN0eWxlPlxcbiAgICAgICAgICAgIGlucHV0Lm5nLWludmFsaWQge1xcbiAgICAgICAgICAgICAgICBib3JkZXI6IDFweCBzb2xpZCBkYXJrcmVkO1xcbiAgICAgICAgICAgIH1cXG4gICAgICAgICAgICBpbnB1dC5uZy12YWxpZCB7XFxuICAgICAgICAgICAgICAgIGJvcmRlcjogMXB4IHNvbGlkIGdyZWVuO1xcbiAgICAgICAgICAgIH1cXG4gICAgICAgIDwvc3R5bGU+XFxuICAgIDwvZGl2PlxcbjwvZGl2PlwiKTtcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJykucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnYWRtaW5cXHRlbXBsYXRlc1xcc2NoZWR1bGUuaHRtbCcsXG4gICAgICAgIFwiPGRpdiBjbGFzcz0ncm93JyBuZy1jb250cm9sbGVyPSdTY2hlZHVsZUN0cic+XFxuICAgIDxkaXYgY2xhc3M9XFxcInR3ZWx2ZSBjb2x1bW5zIGNlbnRlcmVkXFxcIj5cXG5cXG4gICAgICAgIDxkaXYgY2xhc3M9XFxcInJvd1xcXCI+XFxuICAgICAgICAgICAgPHA+0LfQsNC60LDQt9GLINC/0L4g0YDQsNGB0L/QuNGB0LDQvdC40Y48L3A+XFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtNCBjb2x1bW5zXFxcIj5cXG4gICAgICAgICAgICAgICAgPGxhYmVsPtCU0LDRgtCwXFxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XFxcImRhdGVwaWNrZXJcXFwiIHR5cGU9XFxcInRleHRcXFwiIG5nLW1vZGVsPSdmb3JtLmRhdGUnPlxcbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxhcmdlLTIgY29sdW1uc1xcXCI+XFxuICAgICAgICAgICAgICAgIDxsYWJlbD7QlNC+0YHRgtCw0LLQutCwINGBXFxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XFxcInRpbWVwaWNrZXJcXFwiIHR5cGU9XFxcInRleHRcXFwiIG5nLW1vZGVsPSdmb3JtLnN0YXJ0X3RpbWUnPlxcbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxhcmdlLTIgY29sdW1uc1xcXCI+XFxuICAgICAgICAgICAgICAgIDxsYWJlbD7QlNC+0YHRgtCw0LLQutCwINC00L5cXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cXFwidGltZXBpY2tlclxcXCIgdHlwZT1cXFwidGV4dFxcXCIgbmctbW9kZWw9J2Zvcm0uZW5kX3RpbWUnPlxcbiAgICAgICAgICAgICAgICA8L2xhYmVsPlxcbiAgICAgICAgICAgIDwvZGl2PlxcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XFxcImxhcmdlLTMgbGFyZ2Utb2Zmc2V0LTEgY29sdW1uc1xcXCI+XFxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVxcXCJcXFwiIGNsYXNzPVxcXCJidXR0b25cXFwiIHZhbHVlPVxcXCJcXFwiIG5nLWNsaWNrPVxcXCJhZGQoKVxcXCI+0LTQvtCx0LDQstC40YLRjCDQtNC10L3RjDwvYT5cXG4gICAgICAgICAgICA8L2Rpdj5cXG4gICAgICAgIDwvZGl2PlxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXG4gICAgICAgICAgICA8dGFibGU+XFxuXFxuICAgICAgICAgICAgICAgIDxjb2xncm91cD5cXG4gICAgICAgICAgICAgICAgICAgIDxjb2wgc3Bhbj1cXFwiMVxcXCIgc3R5bGU9XFxcIndpZHRoOiA1JTtcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGNvbCBzcGFuPVxcXCIxXFxcIiBzdHlsZT1cXFwid2lkdGg6IDI1JTtcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGNvbCBzcGFuPVxcXCIxXFxcIiBzdHlsZT1cXFwid2lkdGg6IDMwJTtcXFwiPlxcbiAgICAgICAgICAgICAgICAgICAgPGNvbCBzcGFuPVxcXCIxXFxcIiBzdHlsZT1cXFwid2lkdGg6IDMwJTtcXFwiPlxcbiAgICAgICAgICAgICAgICA8L2NvbGdyb3VwPlxcbiAgICAgICAgICAgICAgICA8dGJvZHk+XFxuICAgICAgICAgICAgICAgIDx0ciBuZy1yZXBlYXQ9XFxcIml0ZW0gaW4gc2hlZHVsZVxcXCI+XFxuXFxuICAgICAgICAgICAgICAgICAgICA8dGQ+PGEgaHJlZj1cXFwiIy9vcmRlci1jb250YWluZXIve0BpdGVtLm9yZGVyX2NvbnRhaW5lckB9L3NjaGVkdWxlL3tAaXRlbS5pZEB9XFxcIj48aSBjbGFzcz1cXFwiZmktcGFwZXJjbGlwIHNpemUtMThcXFwiPjwvaT48L2E+IDwvdGQ+XFxuICAgICAgICAgICAgICAgICAgICA8dGQ+e0BpdGVtLmRhdGUgfCBkYXRlOid5eXl5LU1NLWRkJ0B9PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDx0ZD57QGl0ZW0uc3RhcnRfdGltZUB9PC90ZD5cXG4gICAgICAgICAgICAgICAgICAgIDx0ZD57QGl0ZW0uZW5kX3RpbWVAfTxhIGhyZWY9XFxcIlxcXCIgbmctY2xpY2s9XFxcImRlbGV0ZShpdGVtLmlkKVxcXCI+IDxpIGNsYXNzPVxcXCJmaS10cmFzaCBzaXplLTE4XFxcIj48L2k+PC9hPjwvdGQ+XFxuXFxuICAgICAgICAgICAgICAgIDwvdHI+XFxuICAgICAgICAgICAgICAgIDwvdGJvZHk+XFxuICAgICAgICAgICAgPC90YWJsZT5cXG4gICAgICAgIDwvZGl2PlxcbiAgICA8L2Rpdj5cXG48L2Rpdj5cXG48c2NyaXB0IHR5cGU9XFxcInRleHQvamF2YXNjcmlwdFxcXCI+XFxuICAgIGpRdWVyeSgnLmRhdGVwaWNrZXInKS5kYXRldGltZXBpY2tlcihcXG4gICAgICAgICAgICB7XFxuICAgICAgICAgICAgICAgIGZvcm1hdDpcXFwiWS1tLWRcXFwiLFxcbiAgICAgICAgICAgICAgICB0aW1lcGlja2VyOmZhbHNlLFxcbiAgICAgICAgICAgIH0pO1xcblxcbiAgICBqUXVlcnkoJy50aW1lcGlja2VyJykuZGF0ZXRpbWVwaWNrZXIoe1xcbiAgICAgICAgZGF0ZXBpY2tlcjpmYWxzZSxcXG4gICAgICAgIGZvcm1hdDonSDppJ1xcbiAgICB9KTtcXG5cXG48L3NjcmlwdD5cIik7XG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgICAkdGVtcGxhdGVDYWNoZS5wdXQoJ2FkbWluXFx0ZW1wbGF0ZXNcXHNjaGVkdWxlX2xpc3RfY3JlYXRlLmh0bWwnLFxuICAgICAgICBcIjxkaXYgY2xhc3M9J3JvdycgbmctY29udHJvbGxlcj0nQ3VzdG9tZXJzQ3RyJz5cXHJcXG4gICAgPGRpdiBjbGFzcz1cXFwidHdlbHZlIGNvbHVtbnMgY2VudGVyZWRcXFwiPlxcclxcbiAgICAgICAgPHA+0LfQsNC60LDQt9GLINC/0L4g0YDQsNGB0L/QuNGB0LDQvdC40Y48L3A+XFxyXFxuICAgICAgICA8c2NyaXB0IHR5cGU9XFxcInRleHQvamF2YXNjcmlwdFxcXCI+XFxyXFxuICAgICAgICAgICAgalF1ZXJ5KCcuZGF0ZXBpY2tlcicpLmRhdGV0aW1lcGlja2VyKFxcclxcbiAgICAgICAgICAgICAgICAgICAge1xcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDpcXFwiWS1tLWRcXFwiLFxcclxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVwaWNrZXI6ZmFsc2UsXFxyXFxuICAgICAgICAgICAgICAgICAgICB9KTtcXHJcXG5cXHJcXG4gICAgICAgICAgICBqUXVlcnkoJy50aW1lcGlja2VyJykuZGF0ZXRpbWVwaWNrZXIoe1xcclxcbiAgICAgICAgICAgICAgICBkYXRlcGlja2VyOmZhbHNlLFxcclxcbiAgICAgICAgICAgICAgICBmb3JtYXQ6J0g6aSdcXHJcXG4gICAgICAgICAgICB9KTtcXHJcXG5cXHJcXG4gICAgICAgIDwvc2NyaXB0PlxcclxcbiAgICAgICAgPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXHJcXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVxcXCJsYXJnZS00IGNvbHVtbnNcXFwiPlxcclxcbiAgICAgICAgICAgICAgICA8bGFiZWw+0JTQsNGC0LBcXHJcXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cXFwiZGF0ZXBpY2tlclxcXCIgdHlwZT1cXFwidGV4dFxcXCIgbmctbW9kZWw9J2Zvcm0uZGF0ZSc+XFxyXFxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtMiBjb2x1bW5zXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsPtCU0L7RgdGC0LDQstC60LAg0YFcXHJcXG4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCBjbGFzcz1cXFwidGltZXBpY2tlclxcXCIgdHlwZT1cXFwidGV4dFxcXCIgbmctbW9kZWw9J2Zvcm0uc3RhcnRfdGltZSc+XFxyXFxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtMiBjb2x1bW5zXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgPGxhYmVsPtCU0L7RgdGC0LDQstC60LAg0LTQvlxcclxcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVxcXCJ0aW1lcGlja2VyXFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiBuZy1tb2RlbD0nZm9ybS5lbmRfdGltZSc+XFxyXFxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XFxyXFxuICAgICAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cXFwibGFyZ2UtMyBsYXJnZS1vZmZzZXQtMSBjb2x1bW5zXFxcIj5cXHJcXG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XFxcIlxcXCIgY2xhc3M9XFxcImJ1dHRvblxcXCIgdmFsdWU9XFxcIlxcXCIgbmctY2xpY2s9XFxcImFkZCgpXFxcIj7QtNC+0LHQsNCy0LjRgtGMINC00LXQvdGMPC9hPlxcclxcbiAgICAgICAgICAgIDwvZGl2PlxcclxcbiAgICAgICAgPC9kaXY+XFxyXFxuICAgICAgICA8ZGl2IGNsYXNzPVxcXCJyb3dcXFwiPlxcclxcbiAgICAgICAgICAgIDx0YWJsZT5cXHJcXG5cXHJcXG4gICAgICAgICAgICA8dGJvZHk+XFxyXFxuICAgICAgICAgICAgPHRyIG5nLXJlcGVhdD1cXFwiaXRlbSBpbiBzaGVkdWxlXFxcIj5cXHJcXG4gICAgICAgICAgICAgICA8dGQ+PGEgbmctaHJlZj1cXFwiIy9jdXN0b21lcnMve0BpdGVtLmN1c3RvbWVyQH0ve0BpdGVtLmlkQH1cXFwiPis8L2E+PC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgPHRkPntAaXRlbS5kYXRlIHwgZGF0ZToneXl5eS1NTS1kZCdAfTwvdGQ+XFxyXFxuICAgICAgICAgICAgICAgIDx0ZD57QGl0ZW0uc3RhcnRfdGltZUB9PC90ZD5cXHJcXG4gICAgICAgICAgICAgICAgPHRkPntAaXRlbS5lbmRfdGltZUB9PC90ZD5cXHJcXG4gICAgICAgICAgICA8L3RyPlxcclxcbiAgICAgICAgICAgIDwvdGJvZHk+XFxyXFxuICAgICAgICAgICAgPC90YWJsZT5cXHJcXG4gICAgICAgIDwvZGl2PlxcclxcbiAgICA8L2Rpdj5cXHJcXG48L2Rpdj5cIik7XG59XSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FwcCcpLnJ1bihbJyR0ZW1wbGF0ZUNhY2hlJywgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHtcbiAgICAkdGVtcGxhdGVDYWNoZS5wdXQoJ2F1dGhcXHRlbXBsYXRlc1xcbG9naW4uaHRtbCcsXG4gICAgICAgIFwiPGRpdiBjbGFzcz0ncm93Jz5cXHJcXG48ZGl2IGNsYXNzPVxcXCJmb3VyIGNvbHVtbnMgY2VudGVyZWRcXFwiPlxcclxcblxcdDxmb3JtPlxcclxcblxcdFxcdHtAIGVycm9yIEB9XFxyXFxuXFx0PHVsIGNsYXNzPVxcXCJuby1idWxsZXRcXFwiPlxcclxcblxcdFxcdDxsaSBjbGFzcz1cXFwiZmllbGRcXFwiPjxsYWJlbD7QrdC70LXQutGC0YDQvtC90L3QsNGPINC/0L7Rh9GC0LA8L2xhYmVsPlxcclxcblxcdFxcdDxsaSBjbGFzcz1cXFwiZmllbGRcXFwiPjxpbnB1dCB0eXBlPVxcXCJlbWFpbFxcXCIgcGxhY2Vob2xkZXI9XFxcIkVtYWlsIGlucHV0XFxcIiBjbGFzcz1cXFwiZW1haWwgaW5wdXRcXFwiIG5nLW1vZGVsPSd1c2VybmFtZSc+PC9saT5cXHJcXG5cXHRcXHQ8bGkgY2xhc3M9XFxcImZpZWxkXFxcIj48bGFiZWw+0J/QsNGA0L7Qu9GMPC9sYWJlbD5cXHJcXG5cXHRcXHQ8bGkgY2xhc3M9XFxcImZpZWxkXFxcIj48aW5wdXQgdHlwZT1cXFwicGFzc3dvcmRcXFwiIHBsYWNlaG9sZGVyPVxcXCJQYXNzd29yZCBpbnB1dFxcXCIgY2xhc3M9XFxcInBhc3N3b3JkIGlucHV0XFxcIiBuZy1tb2RlbD0ncGFzc3dvcmQnPjwvbGk+XFxyXFxuXFx0PHVsPlxcclxcblxcdFxcdDxicj5cXHJcXG5cXHRcXHQ8ZGl2IGNsYXNzPVxcXCJtZWRpdW0gc3VjY2VzcyBidG5cXFwiPjxidXR0b24gdHlwZT1cXFwic3VibWl0XFxcIj5Mb2cgaW48L2J1dHRvbj48L2Rpdj5cXHJcXG5cXHQ8L2Zvcm0+XFxyXFxuPC9kaXY+XFxyXFxuPC9kaXY+XFxyXFxuXCIpO1xufV0pOyIsImFuZ3VsYXIubW9kdWxlKCdhcHAnKS5ydW4oWyckdGVtcGxhdGVDYWNoZScsIGZ1bmN0aW9uKCR0ZW1wbGF0ZUNhY2hlKSB7XG4gICAgJHRlbXBsYXRlQ2FjaGUucHV0KCdhdXRoXFx0ZW1wbGF0ZXNcXHByb2ZpbGUuaHRtbCcsXG4gICAgICAgIFwiPGRpdiBjbGFzcz1cXFwicm93XFxcIj5cXHJcXG4gIDxkaXYgY2xhc3M9XFxcInNpeCBjb2x1bW5zXFxcIj5cXHJcXG4gIFxcdDxwPlxcclxcbiAgXFx0e0B1c2VyLmVtYWlsQH1cXHJcXG4gIFxcdDwvcD5cXHJcXG4gIFxcdDxwPlxcclxcbiAgXFx0e0B1c2VyLmxhc3RfbG9naW5AfVxcclxcbiAgXFx0PC9wPlxcclxcbiAgXFx0PHA+XFxyXFxuICBcXHR7QHVzZXIuZmlyc3RfbmFtZUB9XFxyXFxuICBcXHQ8L3A+XFxyXFxuICBcXHQ8cD5cXHJcXG4gIFxcdHtAdXNlci5sYXN0X25hbWVAfVxcclxcbiAgXFx0PC9wPlxcclxcblxcdDwvZGl2PlxcclxcbjwvZGl2PlwiKTtcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJykucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnbWFpblxcdGVtcGxhdGVzXFxtYWluLmh0bWwnLFxuICAgICAgICBcIlxcblwiKTtcbn1dKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXBwJykucnVuKFsnJHRlbXBsYXRlQ2FjaGUnLCBmdW5jdGlvbigkdGVtcGxhdGVDYWNoZSkge1xuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dCgnbWFpblxcdGVtcGxhdGVzXFxwcmljZXMuaHRtbCcsXG4gICAgICAgIFwiPGRpdiBjbGFzcz0ncm93Jz5cXHJcXG48ZGl2IGNsYXNzPVxcXCJ0d2VsdmUgY29sdW1ucyBjZW50ZXJlZFxcXCI+XFxyXFxuPHRhYmxlIGJvcmRlcj1cXFwiMFxcXCIgc3R5bGU9XFxcIndpZHRoOiAxMDAlO1xcXCI+XFxyXFxuXFx0PHRib2R5PlxcclxcblxcdFxcdDx0ciBjbGFzcz1cXFwidGFibGUtaGVhZFxcXCI+XFxyXFxuXFx0XFx0XFx0PHRkIHN0eWxlPVxcXCJ3aWR0aDogMzBweDsgdGV4dC1hbGlnbjogY2VudGVyOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcXCI+4oSWPC90ZD5cXHJcXG5cXHRcXHRcXHQ8dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlcjsgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXFwiPtCe0L/QuNGB0LDQvdC40LUg0LrRg9GA0YzQtdGA0YHQutC+0Lkg0YPRgdC70YPQs9C4PC90ZD5cXHJcXG5cXHRcXHRcXHQ8dGQgc3R5bGU9XFxcIndpZHRoOiAxMTBweDsgdGV4dC1hbGlnbjogY2VudGVyOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcXCI+0KHRgtC+0LjQvNC+0YHRgtGMICjRgNGD0LEpPC90ZD5cXHJcXG5cXHRcXHQ8L3RyPlxcclxcblxcdFxcdDx0cj5cXHJcXG5cXHRcXHRcXHQ8dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlcjsgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXFwiPjE8L3RkPlxcclxcblxcdFxcdFxcdDx0ZD7QktGL0LfQvtCyINC60YPRgNGM0LXRgNCwINCyINC/0YDQtdC00LXQu9Cw0YUg0JzQmtCQ0JQ8L3RkPlxcclxcblxcdFxcdFxcdDx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcXCI+MjAwINGA0YPQsTwvdGQ+XFxyXFxuXFx0XFx0PC90cj5cXHJcXG5cXHRcXHQ8dHI+XFxyXFxuXFx0XFx0XFx0PHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXI7IHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxcIj4yPC90ZD5cXHJcXG5cXHRcXHRcXHQ8dGQ+PHNwYW4gc3R5bGU9XFxcImZvbnQtc2l6ZTogMTNweDsgbGluZS1oZWlnaHQ6IDIwcHg7IGJhY2tncm91bmQtY29sb3I6ICNmZmZmZmY7XFxcIj7QktGL0LfQvtCyINC60YPRgNGM0LXRgNCwINC30LAg0L/RgNC10LTQtdC70Ysg0JzQmtCQ0JQg0LTQviAxMCDQutC8PC9zcGFuPjwvdGQ+XFxyXFxuXFx0XFx0XFx0PHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXI7IHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxcIj40MDAg0YDRg9CxPC90ZD5cXHJcXG5cXHRcXHQ8L3RyPlxcclxcblxcdFxcdDx0cj5cXHJcXG5cXHRcXHRcXHQ8dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlcjsgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXFwiPjM8L3RkPlxcclxcblxcdFxcdFxcdDx0ZD7QlNC+0YHRgtCw0LLQutCwINC+0LTQvdC+0LPQviDQvtGC0L/RgNCw0LLQu9C10L3QuNGPINCy0LXRgdC+0Lwg0LTQviA1MDAg0LPRgC4g0LIg0L7QtNC40L0g0LDQtNGA0LXRgSDQsiDQv9GA0LXQtNC10LvQsNGFINCX0L7QvdGLIDEqPC90ZD5cXHJcXG5cXHRcXHRcXHQ8dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlcjsgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXFwiPjIwMCDRgNGD0LE8L3RkPlxcclxcblxcdFxcdDwvdHI+XFxyXFxuXFx0XFx0PHRyPlxcclxcblxcdFxcdFxcdDx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcXCI+NDwvdGQ+XFxyXFxuXFx0XFx0XFx0PHRkPtCU0L7RgdGC0LDQstC60LAg0L7QtNC90L7Qs9C+INC+0YLQv9GA0LDQstC70LXQvdC40Y8g0LLQtdGB0L7QvCDQtNC+IDUwMCDQs9GALiDQsiDQvtC00LjQvSDQsNC00YDQtdGBINCyINC/0YDQtdC00LXQu9Cw0YUg0JfQvtC90YsgMio8L3RkPlxcclxcblxcdFxcdFxcdDx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcXCI+MjAwINGA0YPQsTwvdGQ+XFxyXFxuXFx0XFx0PC90cj5cXHJcXG5cXHRcXHQ8dHI+XFxyXFxuXFx0XFx0XFx0PHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXI7IHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxcIj41PC90ZD5cXHJcXG5cXHRcXHRcXHQ8dGQ+0JTQvtGB0YLQsNCy0LrQsCDQvtC00L3QvtCz0L4g0L7RgtC/0YDQsNCy0LvQtdC90LjRjyDQstC10YHQvtC8INC00L4gNTAwINCz0YAuINCyINC+0LTQuNC9INCw0LTRgNC10YEg0LIg0L/RgNC10LTQtdC70LDRhSDQl9C+0L3RiyAzKjwvdGQ+XFxyXFxuXFx0XFx0XFx0PHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXI7IHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxcIj4yNTAg0YDRg9CxPC90ZD5cXHJcXG5cXHRcXHQ8L3RyPlxcclxcblxcdFxcdDx0cj5cXHJcXG5cXHRcXHRcXHQ8dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlcjsgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXFwiPjY8L3RkPlxcclxcblxcdFxcdFxcdDx0ZD7QlNC+0YHRgtCw0LLQutCwINC+0LTQvdC+0LPQviDQvtGC0L/RgNCw0LLQu9C10L3QuNGPINCy0LXRgdC+0Lwg0LTQviA1MDAg0LPRgC4g0LIg0L7QtNC40L0g0LDQtNGA0LXRgSDQsiDQv9GA0LXQtNC10LvQsNGFINCX0L7QvdGLIDQqPC90ZD5cXHJcXG5cXHRcXHRcXHQ8dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlcjsgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXFwiPjc3MCDRgNGD0LE8L3RkPlxcclxcblxcdFxcdDwvdHI+XFxyXFxuXFx0XFx0PHRyPlxcclxcblxcdFxcdFxcdDx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcXCI+NzwvdGQ+XFxyXFxuXFx0XFx0XFx0PHRkPtCd0LDQtNCx0LDQstC60LAg0LfQsCDQutCw0LbQtNGL0LUg0L/QvtGB0LvQtdC00YPRjtGJ0LjQtSA1MDAg0LPRgC48L3RkPlxcclxcblxcdFxcdFxcdDx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcXCI+NjAg0YDRg9CxPC90ZD5cXHJcXG5cXHRcXHQ8L3RyPlxcclxcblxcdFxcdDx0cj5cXHJcXG5cXHRcXHRcXHQ8dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlcjsgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXFwiPjg8L3RkPlxcclxcblxcdFxcdFxcdDx0ZD7QntC20LjQtNCw0L3QuNC1INCyINC/0YDQtdC00LXQu9Cw0YUgMTUg0LzQuNC90YPRgjwvdGQ+XFxyXFxuXFx0XFx0XFx0PHRkIHN0eWxlPVxcXCJ0ZXh0LWFsaWduOiBjZW50ZXI7IHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxcIj7QkdC10YHQv9C70LDRgtC90L48L3RkPlxcclxcblxcdFxcdDwvdHI+XFxyXFxuXFx0XFx0PHRyPlxcclxcblxcdFxcdFxcdDx0ZCBzdHlsZT1cXFwidGV4dC1hbGlnbjogY2VudGVyOyB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcXCI+OTwvdGQ+XFxyXFxuXFx0XFx0XFx0PHRkPtCe0LbQuNC00LDQvdC40LUg0YHQstC10YDRhSAxNSDQvNC40L3Rg9GCPC90ZD5cXHJcXG5cXHRcXHRcXHQ8dGQgc3R5bGU9XFxcInRleHQtYWxpZ246IGNlbnRlcjsgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXFwiPjcwINGA0YPQsSAvINC30LAg0LrQsNC20LTRi9C1IDMwINC80LjQvTwvdGQ+XFxyXFxuXFx0XFx0PC90cj5cXHJcXG5cXHQ8L3Rib2R5PlxcclxcbjwvdGFibGU+XFxyXFxuPC9kaXY+XFxyXFxuPC9kaXY+XCIpO1xufV0pOyJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==