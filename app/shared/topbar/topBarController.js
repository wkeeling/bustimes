bustimes.controller('TopBarController', ['$scope', '$timeout', 'DataService', TopBarController]);

function TopBarController($scope, $timeout, DataService) {
    'use strict';
    
    $scope.navbar = {
        search: {
            selected: undefined,
            getMatchingStops: function(val) {
                val = val && val.toLowerCase() || val;
                return DataService.getStopQualifiedNames().then(function(names) {
                    var matching = [];
                    names.forEach(function(name) {
                        if (name.toLowerCase().indexOf(val) > -1) {
                            matching.push(name);
                        }
                    });
                    return matching;
                });
            }
        }
    };
}
