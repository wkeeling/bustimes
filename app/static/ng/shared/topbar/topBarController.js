bustimes.controller('TopBarController', ['$scope', '$timeout', 'StopService', 'EtaUpdateService', TopBarController]);

function TopBarController($scope, $timeout, StopService, EtaUpdateService) {
    'use strict';
    
    $scope.topbar = {
        search: {
            collapsed: true,
            selected: undefined,
            
            textEntered: function(text) {
                return StopService.getStopsMatching(text);
            },
            
            onSelect: function($item, $model, $label) {
                StopService.onStopSelected($item);
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
    
    StopService.registerSearchListener({stopCleared: function() {
        $scope.topbar.search.selected = '';
    }});
}
