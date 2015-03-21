bustimes.directive('nearest', function() {
    'use strict';
   
    return {
        scope: {
            excluded: '='
        },
        restrict: 'E',
        templateUrl: '/static/ng/shared/nearest/nearest.ngtmpl.html',
        controller: 'NearestController'
    };
});
