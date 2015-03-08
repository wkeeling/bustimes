
bustimes.service('StopLocationService', ['$q', 'DataService', StopLocationService]);

function StopLocationService($q, DataService) {
    'use strict';
    
    var that = this;
    
    this.getStopsNearestMe = function(limit, excluding) {
        var deferred = $q.defer();
        
        if (navigator.geolocation) {
            var options = {
                timeout : 5000,
                maximumAge : 0
            }; 
            var watchId = navigator.geolocation.watchPosition(function(pos) {
                navigator.geolocation.clearWatch(watchId);
                getStopsNearest(pos, limit, excluding).then(function(stops) {
                    deferred.resolve(stops);
                });
            }, function(err) {
                console.warn('Unable to get current position: ' + err.message);
                resolveManually(limit, excluding, deferred);
            }, options);
        } else {
            console.warn('Browser does not support geolocation');
            resolveManually(limit, excluding, deferred);
        }
        
        return deferred.promise;
    }; 
    
    // Manually set location, perhaps by bringing up a map
    // Publically exposed as used elsewhere
    this.setMyLocation = function() {
        var deferred = $q.deferred();
        // ... do map thing ...
        return deferred.promise;
    };
    
    function resolveManually(limit, excluding, deferred) {
        that.setMyLocation().then(function(position) {
            getStopsNearest(position, limit, excluding).then(function(stops) {
                deferred.resolve(stops);
            });
        });
    }
    
    function getStopsNearest(pos, limit, excluding) {
        var deferred = $q.deferred;
        DataService.getStops().then(function(stops) {
            var nearestStops = [];
            // Do logic. ETADirective
            deferred.resolve(nearestStops);
        });
        return deferred.promise;
    }
}

function getNearestStop(func) {
    if (navigator.geolocation) {
        var watchId = navigator.geolocation.watchPosition(function(pos) {   
            navigator.geolocation.clearWatch(watchId);
            var lastDist = -1,
                lastStop = null;
            stops.forEach(function(stop) {
                var dist = getDistanceFromLatLonInKm(stop.latitude, stop.longitude, pos.coords.latitude, pos.coords.longitude);
                console.log(stop.name + ': ' + dist);
                if (dist < lastDist || lastDist == -1) {
                    lastDist = dist;
                    lastStop = stop;
                }
            });
            func(lastStop);
        });
    } else {
        throw 'Requires geolocation support';
    }
}

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
