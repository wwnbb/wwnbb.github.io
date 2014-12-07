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
