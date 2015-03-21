bustimes.directive('search', function() {
    'use strict';
   
    return {
        scope: {},
        restrict: 'E',
        templateUrl: '/app/shared/search/search.ngtmpl.html',
        controller: 'SearchController'
    };
});
