bustimes.controller('NearestController', ['$scope', 'DataService', NearestController]);

function NearestController($scope, DataService) {
    'use strict';
    
    var MAX_DISTANCE = 1, // Don't display stops over 1km away
        MAX_STOPS_TO_DISPLAY = 5, // Show a maximum of 5 stops
        allStops = [],
        prevNearest = [];
    
    $scope.nearest = {
        find: function() {
            var nearest = findNearest(allStops);
            if (nearest.length === prevNearest.length && nearest.every(function(v,i) { return v === prevNearest[i];})) {
                // No change in nearest stops
                return prevNearest;
            }
            
            prevNearest = nearest;
            
            return prevNearest;
        }
    };
    
    function findNearest(stops) {
        var nearest = [];
        
        for (var i = 0, length = stops.length; i < length; i++) {
            var stop = stops[i];
            
            if (!stop.distance || stop.distance > MAX_DISTANCE || nearest.length > MAX_STOPS_TO_DISPLAY) {
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
    
    (function() {
        DataService.getStops().then(function(stops) {
            allStops = stops;
        });
    })();
    
}
