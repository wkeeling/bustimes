bustimes.service('StopService', ['$http', '$q', '$timeout', StopService]);

function StopService($http, $q, $timeout) {
    'use strict';
    
    var DATA_SOURCE = '/api/stop',
        searchListeners = [],
        positionListeners = [],
        stopTrackers = {},
        lastPosition = null,
        that = this;
    
    this.getStop = function(id) {
        var deferred = $q.defer(),
            params = {
                id: id
            };
            if (lastPosition) {
                params.position = lastPosition.coords.latitude + ',' + lastPosition.coords.longitude;
            }
        $http.get(DATA_SOURCE, {params: params}).success(function(stops) {
            if (stops.length) {
                deferred.resolve(stops[0]);
            } else {
                deferred.resolve({});
            }
        });
        return deferred.promise;
    };
    
    this.getStops = function(ids) {
        var deferred = $q.defer(),
            params = {
                id: ids.join(',')
            };
            if (lastPosition) {
                params.position = lastPosition.coords.latitude + ',' + lastPosition.coords.longitude;
            }
        $http.get(DATA_SOURCE, {params: params}).success(function(stops) {
            deferred.resolve(stops);
        });
        return deferred.promise;
    };
    
    this.listenForNearestStops = function(callback) {
        positionListeners.push({
            success: function(pos) {
                $http.get(DATA_SOURCE + '/nearest', 
                    {params: {position: pos.coords.latitude + ',' + pos.coords.longitude}}).success(function(stops) {
                    callback({
                        stops: stops
                    }); 
                });
            },
            error: function() {
                $timeout(function() {
                    callback({
                        error: true 
                    });
                });
            }
        });
    };   
    
    this.getStopsMatching = function(text) {
        var deferred = $q.defer(),
            params = {
                text: text
            };
            if (lastPosition) {
                params.position = lastPosition.coords.latitude + ',' + lastPosition.coords.longitude;
            }        
        $http.get(DATA_SOURCE + '/matching', {params: params}).success(function(stops) {
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
                        if (!trackers.length) {
                            delete stopTrackers[stop.id];
                        }
                    }
                }
            }
        };
    };
    
    this.updatePosition = function() {
        if (navigator.geolocation) {
            var options = {
                timeout : 5000,
                maximumAge : 5000
            };         
            navigator.geolocation.getCurrentPosition(function(pos) {
                doUpdatePosition(pos);
            }, function(err) {
                console.warn('Unable to get current position: ' + err.message);
                positionError();               
            }, options);
        } else {
            console.warn('Browser does not support geolocation');
            positionError();            
        }
    };
    
    function doUpdatePosition(pos) {
        if (!lastPosition || pos.coords.latitude != lastPosition.coords.latitude || pos.coords.longitude != lastPosition.coords.longitude) {
            positionListeners.forEach(function(listener) {
                listener.success(pos); 
            });
            lastPosition = pos;
        }        
    }
    
    function positionError() {
        positionListeners.forEach(function(listener) {
            if (listener.error) {
                listener.error(); 
            }
        });   
    }     
    
    (function() {
        positionListeners.push({
            success: function(pos) {
                // Add a listener to update the distance to any stops that are being tracked (displayed)
                for (var id in stopTrackers) {
                    if (stopTrackers.hasOwnProperty(id)) {
                        $http.get(DATA_SOURCE + '/distance', {params: {position: pos.coords.latitude + ',' + pos.coords.longitude, stop_id: id}}).success(function(_id) {
                            return function(resp) {
                                var trackers = stopTrackers[_id];
                                trackers.forEach(function(tracker) {
                                    tracker.stop.distance = resp.distance;
                                });
                            };
                        }(id));
                    }
                } 
            }
        });
        
        if (navigator.geolocation) {
            var options = {
                timeout : 5000,
                maximumAge : 5000
            };         
            navigator.geolocation.watchPosition(function(pos) {
                doUpdatePosition(pos);
            }, function(err) {
                console.warn('Unable to get current position: ' + err.message);
                positionError();               
            }, options);
        } else {
            console.warn('Browser does not support geolocation');
            positionError();            
        }
    })();    
}