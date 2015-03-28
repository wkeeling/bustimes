bustimes.service('EtaUpdateService', ['$http', '$q', '$interval', '$timeout', EtaUpdateService]);

function EtaUpdateService($http, $q, $interval, $timeout) {
    'use strict';
    
    var pollers = {};
    
    this.getUpdater = function(stop) {
        var poller = pollers[stop.id];
        if (!poller) {
            // No active poller for this stop, so create one
            poller = new StopPoller(stop, $http, $q, $interval, $timeout);
            pollers[stop.id] = poller;
        }
        
        var updater = {
            register: function(successCallback, errorCallback) {
                this.successCallback = successCallback;
                this.errorCallback = errorCallback;
                poller.addUpdater(this);
                poller.update();
            },
            unregister: function() {
                poller.removeUpdater(this);
                if (!poller.hasUpdaters()) {
                    // If we're unregistering the last updater with the poller,
                    // then we stop the poller and remove the reference to it.
                    poller.stop();
                    delete pollers[stop.id];
                }
            }
        };
        
        return updater;
    };
    
    this.update = function(onUpdateComplete) {
        var allPromises = [];

        for (var stopName in pollers) {
            if (pollers.hasOwnProperty(stopName)) {
                var poller = pollers[stopName];
                allPromises.push(poller.update());
            }
        }
        
        $q.all(allPromises).then(function() {
            onUpdateComplete(); 
        }, function() {
            onUpdateComplete();
        });

    };
}

function StopPoller(stop, $http, $q, $interval, $timeout) {
    
    if (!this instanceof StopPoller) {
        return new StopPoller(stop);
    }
        
    var POLL_URL = '/api/eta',
        POLL_INTERVAL = 30000;
    
    var updaters = [],
        repeat;
        
    this.update = function() {
        if (!repeat) {
            repeat = $interval(function() {
                doUpdate();
            }, POLL_INTERVAL);
        }
        return doUpdate();
    };
    
    function doUpdate() {
        var deferred = $q.defer();
        
        $timeout(function() {
            console.log('Mock get eta update');
            deferred.resolve();
        }, 1000);
        
        // $http.get(POLL_URL, {params: {shortcodes: stop.shortcodes.join(',')}}).success(function(etas) {
            // updaters.forEach(function(updater) {
                // updater.successCallback(etas); 
                // deferred.resolve();
            // });
        // }).error(function() {
            // updaters.forEach(function(updater) {
                // updater.errorCallback(); 
                // deferred.reject();
            // });
        // });
        
        return deferred.promise;
    }
    
    this.stop = function() {
        $interval.cancel(repeat);
        repeat = null;        
    };
    
    this.addUpdater = function(updater) {
        if (updaters.indexOf(updater) == -1) {
            updaters.push(updater);
        }
    };
    
    this.removeUpdater = function(updater) {
        if (updaters.indexOf(updater) > -1) {
            updaters.splice(updaters.indexOf(updater), 1);
        }
    };
    
    this.hasUpdaters = function() {
        return updaters.length > 0;
    };
}

