bustimes.directive('search', function() {
    'use strict';
   
    return {
        scope: {},
        restrict: 'E',
        templateUrl: '/static/ng/shared/search/search.ngtmpl.html',
        controller: 'SearchController'
    };
});
