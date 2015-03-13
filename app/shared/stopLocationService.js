bustimes.service('StopLocationService', ['$rootScope', '$q', 'DataService', StopLocationService]);

function StopLocationService($rootScope, $q, DataService) {
    'use strict';
    
    var LOCATION_UPDATE = 'location_update',
        that = this;
    
    this.updateLocation = function() {
        if (navigator.geolocation) {
            var options = {
                timeout : 5000,
                maximumAge : 0
            };         
            var watchId = navigator.geolocation.watchPosition(function(pos) {
                DataService.getStops().then(function(stops) {
                    stops.forEach(function(stop) {
                        var dist = getDistanceFromLatLonInKm(stop.position.latitude, stop.position.longitude, 
                                                             pos.coords.latitude, pos.coords.longitude);
                        stop.distance = dist;
                    });
                    stops.sort(function(stop1, stop2) {
                        return stop1.distance - stop2.distance;
                    });
                    
                    $rootScope.$broadcast(LOCATION_UPDATE);
                });                
            }, function(err) {
                console.warn('Unable to get current position: ' + err.message);
            }, options);
        } else {
            console.warn('Browser does not support geolocation');
        }            
    };
    
    // Manually set location, perhaps by bringing up a map
    // Publically exposed as used elsewhere
    this.setMyLocation = function() {
        var deferred = $q.deferred();
        // ... do map thing ...
        return deferred.promise;
    };
    
    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        var R = 6371;
        // Radius of the earth in km
        var dLat = deg2rad(lat2 - lat1);
        // deg2rad below
        var dLon = deg2rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        // Distance in km
        return d;
    }
    
    function deg2rad(deg) {
        return deg * (Math.PI / 180);
    }
    
}

