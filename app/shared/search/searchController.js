bustimes.controller('SearchController', ['$scope', 'StopSearchService', SearchController]);

function SearchController($scope, StopSearchService) {
    'use strict';
    
    $scope.search = {
        selected: undefined,
        clear: function() {
            StopSearchService.onStopCleared(this.selected);
            this.selected = undefined;
        }
    };
    
    function stopSelected(stop) {
        $scope.search.selected = stop;
    }
    
    StopSearchService.registerSearchListener({stopSelected: stopSelected});
}
