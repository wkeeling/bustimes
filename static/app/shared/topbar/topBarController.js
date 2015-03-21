bustimes.controller('TopBarController', ['$scope', '$timeout', 'StopSearchService', 'EtaUpdateService', TopBarController]);

function TopBarController($scope, $timeout, StopSearchService, EtaUpdateService) {
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
        },
        refresh: {
            refreshing: false,
            onClick: function() {
                this.refreshing = true;
                var that = this;
                $timeout(function() {
                    EtaUpdateService.update(function() {
                        that.refreshing = false; 
                    });
                }, 1000);
            },
        }
    };
    
    StopSearchService.registerSearchListener({stopCleared: function() {
        $scope.topbar.search.selected = '';
    }});
}
