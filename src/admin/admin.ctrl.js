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
