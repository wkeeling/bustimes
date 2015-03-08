bustimes.controller('SearchController', ['$scope', 'StopSearchService', SearchController]);

function SearchController($scope, StopSearchService) {
    'use strict';
    
    function stopSelected(stop) {
        console.log(stop.name);
    }
    
    StopSearchService.registerSearchListener(stopSelected);
}
