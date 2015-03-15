bustimes.controller('SearchController', ['$scope', '$timeout', 'StopSearchService', SearchController]);

function SearchController($scope, $timeout, StopSearchService) {
    'use strict';
    
    $scope.search = {
        selected: undefined,
        
        options: {
            close: function() {
                StopSearchService.onStopCleared($scope.search.selected);
                $scope.search.selected = undefined;
            }
        }
    };
    
    function stopSelected(stop) {
        $scope.search.selected = undefined;
        $timeout(function() {
            // Using a timeout with a slight delay forces the transition
            // animation to kick in for a better experience.
            $scope.search.selected = stop;
        }, 500);
    }
    
    StopSearchService.registerSearchListener({stopSelected: stopSelected});
}
