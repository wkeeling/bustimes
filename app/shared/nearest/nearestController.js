bustimes.controller('NearestController', ['$scope', 'DataService', NearestController]);

function NearestController($scope, DataService) {
    'use strict';
    
    var MAX_DISTANCE = 1, // Don't display stops over 1km away
        MAX_STOPS_TO_DISPLAY = 5; // Show a maximum of 5 stops
    
    $scope.nearest = {
        stops: [],
        
        getNearest: function() {
            var nearest = [];
            
            for (var i = 0, length = this.stops.length; i < length; i++) {
                var stop = this.stops[i];
                if (stop.distance > MAX_DISTANCE || nearest.length > MAX_STOPS_TO_DISPLAY) {
                    break;
                }
                if (!isExcluded(stop)) {
                    nearest.push(stop);
                }
            }
        }
    };
    
    function isExcluded(stop) {
        var excluded = false;
        $scope.excluded.forEach(function(excl) {
            if (!excluded && stop.qualifiedName == excl.qualifiedName) {
                excluded = true;
            } 
        });
        return excluded;
    }
    
    (function() {
        DataService.getStops().then(function(stops) {
            $scope.nearest.stops = stops;
        });
    })();
}
