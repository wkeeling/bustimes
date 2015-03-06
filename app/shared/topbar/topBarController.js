'use strict';

bustimes.controller('TopBarController', ['$scope', '$timeout', 'DataService', TopBarController]);

function TopBarController($scope, $timeout, DataService) {
    
    $scope.navbar = {
        collapsed: true,
        
        onSearchClick: function() {
            this.collapsed = !this.collapsed;
            if (!this.collapsed) {
                $timeout(function() {
                    $scope.$broadcast('searchOpened')
                });
            }
        },
        
        search: {
            selected: undefined,
            getStopNames: function(val) {
                return DataService.getStopNames().then(function(names) {
                    return names;
                });
            }
        }
        
    };
}
