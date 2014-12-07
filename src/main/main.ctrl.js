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
