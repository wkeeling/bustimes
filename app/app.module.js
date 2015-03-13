'use strict';

var bustimes = angular.module('bustimes', ['ui.bootstrap', 'ui.utils']);

bustimes.run(['DataService', 'StopLocationService', function(DataService, StopLocationService) {
    DataService.init();
    StopLocationService.updateLocation();
}]);
