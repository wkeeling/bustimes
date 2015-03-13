bustimes.directive('stop', function() {
    'use strict';
   
    return {
        scope: {
            stop: '=',
            onAdd: '&?',
            onClose: '&?'
        },
        restrict: 'E',
        templateUrl: '/app/shared/stop/stop.ngtmpl.html',
        controller: 'StopController'
    };
});
