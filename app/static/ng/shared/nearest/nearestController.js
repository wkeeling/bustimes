bustimes.controller('NearestController', ['$scope', 'StopService', 'PreferencesService', NearestController]);

function NearestController($scope, StopService, PreferencesService) {
    'use strict';
    
    var PREF_NAME = 'hideNearest';
    
    $scope.nearest = {
        stops: null,
        error: null,
        hide: PreferencesService.getPreference(PREF_NAME) || false,
        toggle: function() {
            this.hide = !this.hide;
            PreferencesService.setPreference(PREF_NAME, this.hide);
        }
    };
    
    StopService.listenForNearestStops(function(resp) {
        if (resp.stops) {
            var stops = resp.stops,
                changed = false;
            $scope.nearest.error = null;
                
            if ($scope.nearest.stops && stops.length == $scope.nearest.stops.length) {
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
        } else if (resp.error) {
            $scope.nearest.stops = [];
            $scope.nearest.error = true;
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
