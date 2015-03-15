bustimes.directive('stop', function() {
    'use strict';
   
    return {
        scope: {
            stop: '=',
            options: '=?'
        },
        restrict: 'E',
        templateUrl: '/app/shared/stop/stop.ngtmpl.html',
        controller: 'StopController'
    };
});
