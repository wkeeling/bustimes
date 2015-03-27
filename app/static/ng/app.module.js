var bustimes = angular.module('bustimes', ['ngAnimate', 'ui.bootstrap', 'ui.utils']);

bustimes.run(['StopService', function(StopService) {
    StopService.refreshPosition();
}]);
