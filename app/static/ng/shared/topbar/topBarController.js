bustimes.controller('TopBarController', ['$scope', '$q', '$timeout', 'StopService', 'EtaUpdateService', TopBarController]);

function TopBarController($scope, $q, $timeout, StopService, EtaUpdateService) {
    'use strict';
    
    $scope.topbar = {
        search: {
            collapsed: true,
            selected: null,
            
            textEntered: function(text) {
                return StopService.getStopsMatching(text);
            },
            
            onSelect: function($item, $model, $label) {
                StopService.onStopSelected($item);
                this.collapsed = true;
                this.selected = null;
            }
        },
        refresh: {
            refreshing: false,
            onClick: function() {
                this.refreshing = true;
                var that = this;
                    
                $timeout(function() {
                    var promises = [],
                        updateDeferred = $q.defer(),
                        refreshDeferred = $q.defer();
                        
		            promises.push(updateDeferred.promise);
                    promises.push(refreshDeferred.promise);                    
                    
                    EtaUpdateService.update(function() {
                        updateDeferred.resolve();
                    });
                    
                    StopService.refreshPosition(function() {
                        refreshDeferred.resolve();
                    });
                    
                    $q.all(promises).then(function() {
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
