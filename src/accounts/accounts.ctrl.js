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