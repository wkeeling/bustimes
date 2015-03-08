bustimes.controller('TopBarController', ['$scope', '$timeout', 'DataService', TopBarController]);

function TopBarController($scope, $timeout, DataService) {
    'use strict';
    
    $scope.navbar = {
        search: {
            selected: undefined,
            getMatchingStops: function(val) {
                val = val && val.toLowerCase() || val;
                return DataService.getStops().then(function(stops) {
                    var matching = [];
                    stops.forEach(function(stop) {
                        if (stop.qualifiedName().toLowerCase().indexOf(val) > -1) {
                            matching.push(stop);
                        }
                    });
                    return matching;
                });
            }
        }
    };
}
