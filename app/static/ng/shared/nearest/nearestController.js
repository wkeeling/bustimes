bustimes.controller('NearestController', ['$scope', 'StopService', NearestController]);

function NearestController($scope, StopService) {
    'use strict';
    
    $scope.nearest = {
        stops: []
    };
    
    StopService.listenForNearestStops(function(stops) {
        $scope.nearest.stops = stops;
    });  
    
    // Manually set location, perhaps by bringing up a map
    // Publically exposed as used elsewhere
    $scope.setMyLocation = function() {
        var deferred = $q.deferred();
        // ... do map thing ...
        return deferred.promise;
    };    
}
