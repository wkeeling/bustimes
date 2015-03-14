bustimes.controller('TopBarController', ['$scope', 'StopSearchService', TopBarController]);

function TopBarController($scope, StopSearchService) {
    'use strict';
    
    $scope.topbar = {
        search: {
            collapsed: true,
            selected: undefined,
            
            textEntered: function(text) {
                return StopSearchService.getMatchingStops(text);
            },
            
            onSelect: function($item, $model, $label) {
                StopSearchService.onStopSelected($item);
                this.collapsed = true;
                this.selected = undefined;
            }
        }
    };
    
    StopSearchService.registerSearchListener({stopCleared: function() {
        $scope.topbar.search.selected = '';
    }});
}
