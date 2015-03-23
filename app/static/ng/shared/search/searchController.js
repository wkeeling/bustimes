bustimes.controller('SearchController', ['$scope', '$timeout', 'StopService', SearchController]);

function SearchController($scope, $timeout, StopService) {
    'use strict';
    
    $scope.search = {
        selected: undefined,
        
        options: {
            close: function() {
                StopService.onStopCleared($scope.search.selected);
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
        }, 300);
    }
    
    StopService.registerSearchListener({stopSelected: stopSelected});
}
