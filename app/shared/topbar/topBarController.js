bustimes.controller('TopBarController', ['$scope', 'StopSearchService', TopBarController]);

function TopBarController($scope, StopSearchService) {
    'use strict';
    
    $scope.navbar = {
        search: {
            selected: undefined,
            
            textEntered: function(text) {
                return StopSearchService.getMatchingStops(text);
            },
            
            onSelect: function($item, $model, $label) {
                StopSearchService.onStopSelected($item);
            }
        }
    };
}
