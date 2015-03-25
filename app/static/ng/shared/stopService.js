bustimes.service('StopService', ['$http', '$q', StopService]);

function StopService($http, $q) {
    'use strict';
    
    var DATA_SOURCE = '/api/stop',
        searchListeners = [],
        positionListeners = [];
    
    this.getStop = function(id) {
        var deferred = $q.defer();
        $http.get(DATA_SOURCE, {params: {id: id}}).success(function(stops) {
            if (stops.length) {
                deferred.resolve(stops[0]);
            } else {
                deferred.resolve({});
            }
        });
        return deferred.promise;
    };
    
    this.getStops = function(ids) {
        var deferred = $q.defer();
        $http.get(DATA_SOURCE, {params: {id: ids.join(',')}}).success(function(stops) {
            deferred.resolve(stops);
        });
        return deferred.promise;
    };
    
    this.listenForNearestStops = function(callback) {
        positionListeners.push(function(pos) {
            $http.get(DATA_SOURCE + '/nearest', 
                {params: {lat: pos.coords.latitude, lon: pos.coords.longitude}}).success(function(stops) {
                callback(stops); 
            });
        });
    };   
    
    (function() {
        if (navigator.geolocation) {
            var options = {
                timeout : 5000,
                maximumAge : 0
            };         
            navigator.geolocation.watchPosition(function(pos) {
                positionListeners.forEach(function(listener) {
                    listener(pos); 
                });
            }, function(err) {
                console.warn('Unable to get current position: ' + err.message);
            }, options);
        } else {
            console.warn('Browser does not support geolocation');
        }  
    })();
    
    this.getStopsMatching = function(text) {
        var deferred = $q.defer();
        $http.get(DATA_SOURCE + '/matching', {params: {text: text}}).success(function(stops) {
            deferred.resolve(stops);
        });
        return deferred.promise;
    };
    
    this.registerSearchListener = function(listener) {
        searchListeners.push(listener);
    };

    this.onStopSelected = function(stop) {
        searchListeners.forEach(function(listener) {
            if (listener.stopSelected) {
                listener.stopSelected(stop);
            }
        });
    };
    
    this.onStopCleared = function(stop) {
        searchListeners.forEach(function(listener) {
            if (listener.stopCleared) {
                listener.stopCleared(stop);
            }
        });
    };    
}