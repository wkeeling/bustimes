bustimes.service('StopService', ['$http', '$q', StopService]);

function StopService($http, $q) {
    'use strict';
    
    var DATA_SOURCE = '/api/stop',
        searchListeners = [],
        positionListeners = [],
        stopTrackers = {},
        that = this;
    
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
    
    this.getStopTracker = function(stop) {
        return {
            track: function() {
                this.stop = stop;
                var trackers = stopTrackers[stop.id];
                if (!trackers) {
                    trackers = [];
                    stopTrackers[stop.id] = trackers;
                }
                if (trackers.indexOf(this) == -1) {
                    trackers.push(this);
                }
            },
            untrack: function() {
                var trackers = stopTrackers[stop.id];
                if (trackers && trackers.length) {
                    if (trackers.indexOf(this) > -1) {
                        trackers.splice(trackers.indexOf(this), 1);
                    }
                }
            }
        };
    };
    
    this.refreshPosition = function(onRefreshComplete) {
        if (navigator.geolocation) {
            var options = {
                timeout : 5000,
                maximumAge : 0
            };         
            navigator.geolocation.getCurrentPosition(function(pos) {
                positionListeners.forEach(function(listener) {
                    listener(pos); 
                });
                if (onRefreshComplete) {
                    onRefreshComplete();
                }
            }, function(err) {
                console.warn('Unable to get current position: ' + err.message);
            }, options);
        } else {
            console.warn('Browser does not support geolocation');
        }  
    };
    
    function updateDistance(pos) {
        for (var id in stopTrackers) {
            if (stopTrackers.hasOwnProperty(id)) {
                $http.get(DATA_SOURCE + '/distance', {params: {lat: pos.coords.latitude, lon: pos.coords.longitude, stop_id: id}}).success(function(_id) {
                    return function(resp) {
                        var trackers = stopTrackers[_id];
                        trackers.forEach(function(tracker) {
                            tracker.stop.distance = resp.distance;
                            console.log('Updating distance: ' + tracker.stop.name); 
                        });
                    };
                }(id));
            }
        }
    }    
    
    (function() {
        positionListeners.push(function(pos) {
            // Add a listener to update the distance to any stops that are being tracked (displayed)
            updateDistance(pos);    
        });
    })();    
}