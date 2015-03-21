'use strict';

var bustimes = angular.module('bustimes', ['ngAnimate', 'ui.bootstrap', 'ui.utils']);

bustimes.run(['DataService', 'StopLocationService', function(DataService, StopLocationService) {
    DataService.init();
    StopLocationService.updateLocation();
}]);
