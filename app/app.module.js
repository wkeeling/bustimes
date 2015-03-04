'use strict';

var bustimes = angular.module('bustimes', []);

bustimes.run(['DataService', function(DataService) {
    DataService.init();
}]);
