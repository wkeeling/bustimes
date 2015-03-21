bustimes.directive('stop', function() {
    'use strict';
   
    return {
        scope: {
            stop: '=',
            options: '=?'
        },
        restrict: 'E',
        templateUrl: '/static/ng/shared/stop/stop.ngtmpl.html',
        controller: 'StopController'
    };
});
