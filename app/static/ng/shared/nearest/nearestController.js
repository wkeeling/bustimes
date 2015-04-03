bustimes.controller('NearestController', ['$scope', 'StopService', 'PreferencesService', NearestController]);

function NearestController($scope, StopService, PreferencesService) {
    'use strict';
    
    $scope.nearest = {
        stops: [],
        hide: PreferencesService.getPreference('hideNearest') || false,
        toggle: function() {
            this.hide = !this.hide;
            PreferencesService.setPreference('hideNearest', this.hide);
        }
    };
    
    StopService.listenForNearestStops(function(stops) {
        var changed = false;
        if (stops.length == $scope.nearest.stops.length) {
            for (var i = 0, length = stops.length; i < length; i++) {
                if (stops[i].id != $scope.nearest.stops[i].id) {
                    changed = true;
                    break;
                }
            }
        } else {
            changed = true;
        }
        
        if (changed) {
            $scope.nearest.stops = stops;
        }
    });  
    
    // Manually set location, perhaps by bringing up a map
    // Publically exposed as used elsewhere
    $scope.setMyLocation = function() {
        var deferred = $q.deferred();
        // ... do map thing ...
        return deferred.promise;
    };    
}
