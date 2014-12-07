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
