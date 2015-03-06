'use strict';

var bustimes = angular.module('bustimes', ['ui.bootstrap', 'ui.utils']);

bustimes.run(['DataService', function(DataService) {
    DataService.init();
}]);
