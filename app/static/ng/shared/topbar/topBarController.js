bustimes.controller('TopBarController', ['$scope', '$q', '$timeout', '$location', 'StopService', 'EtaUpdateService', TopBarController]);

function TopBarController($scope, $q, $timeout, $location, StopService, EtaUpdateService) {
    'use strict';
    
    $scope.topbar = {
        menu: {
            collapsed: true,
            
            onClick: function() {
                this.collapsed = !this.collapsed;
                if (!this.collapsed) {
                    $timeout(function() {
                        $('#search').focus();
                    });
                } else {
                    this.search.selected = null;
                }
            },
            
            search: {
                selected: null,
                
                textEntered: function(text) {
                    return StopService.getStopsMatching(text);
                },
                
                onSelect: function($item, $model, $label) {
                    StopService.onStopSelected($item);
                    $scope.topbar.menu.collapsed = true;
                    this.selected = null;
                }
            },
            
            button: {
                onClick: function(name) {
                    $scope.topbar.menu.collapsed = true;
                    $location.path('/' + name);
                }
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
        },
        
        home: function() {
            $scope.topbar.menu.collapsed = true;
            $location.path('/buses');
            $timeout(function() {
                StopService.updateLastPosition();
            });
        }        
    };
    
    StopService.registerSearchListener({stopCleared: function() {
        $scope.topbar.menu.search.selected = '';
    }});
}
