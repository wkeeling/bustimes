bustimes.controller('NearestController', ['$scope', 'DataService', NearestController]);

function NearestController($scope, DataService) {
    'use strict';
    
    var MAX_DISTANCE = 1, // Don't display stops over 1km away
        MAX_STOPS_TO_DISPLAY = 5, // Show a maximum of 5 stops
        LOCATION_UPDATE = 'location_update';
    
    $scope.nearest = {
        stops: [],
    };
    
    $scope.$on(LOCATION_UPDATE, function() {
        DataService.getStops().then(function(stops) {
            var nearest = findNearest(stops);
            
            if (nearest.length) {
                $scope.nearest.stops = nearest;
            }
        });
    });
    
    function findNearest(stops) {
        var nearest = [];
        
        for (var i = 0, length = stops.length; i < length; i++) {
            var stop = stops[i];
            
            if (stop.distance > MAX_DISTANCE || nearest.length > MAX_STOPS_TO_DISPLAY) {
                break;
            }
            
            if (!isExcluded(stop)) {
                nearest.push(stop);
            }
        }
        
        return nearest;
    }
    
    function isExcluded(stop) {
        var excluded = false;
        
        if ($scope.excluded) {
            $scope.excluded.forEach(function(excl) {
                if (!excluded && stop.qualifiedName == excl.qualifiedName) {
                    excluded = true;
                } 
            });
        }
        
        return excluded;
    }
    
}
