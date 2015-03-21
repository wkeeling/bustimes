bustimes.directive('nearest', function() {
    'use strict';
   
    return {
        scope: {
            excluded: '='
        },
        restrict: 'E',
        templateUrl: '/app/shared/nearest/nearest.ngtmpl.html',
        controller: 'NearestController'
    };
});
