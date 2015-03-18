bustimes.service('EtaUpdateService', ['$http', '$interval', '$q', '$timeout', EtaUpdateService]);

function EtaUpdateService($http, $interval, $q, $timeout, DataService) {
    'use strict';
    
    var pollers = {};
    
    this.getUpdater = function(stop) {
        var poller = pollers[stop.qualifiedName]
        if (!poller) {
            // No active poller for this stop, so create one
            console.log('Creating new poller')
            poller = new StopPoller(stop, $q, $interval, $timeout);
            pollers[stop.qualifiedName] = poller;
        }
        
        var updater = {
            register: function(callback) {
                this.callback = callback;
                poller.addUpdater(this);
                poller.update();
            },
            unregister: function() {
                poller.removeUpdater(this);
                if (!poller.hasUpdaters()) {
                    poller.stop();
                    // If we're unregistering the last updater with the poller,
                    // then we remove the reference to the poller
                    delete pollers[stop.qualifiedName]
                }
            }
        };
        
        return updater;
    };
}

function StopPoller(stop, $q, $interval, $timeout) {
    
    if (!this instanceof StopPoller) {
        return new StopPoller(stop);
    }
        
    var POLL_INTERVAL = 5000;
    
    var stop = stop,
        updaters = [],
        canceller;
        
    this.update = function() {
        if (!canceller) {
            canceller = $interval(function() {
                doUpdate();
            }, POLL_INTERVAL);
        }
        doUpdate();
    };
    
    function doUpdate() {
        var promises = [];
        
        stop.shortcodes.forEach(function(shortcode) {
            // Simulating $http call here
            // Possibly want to stagger http calls by introducing random delay
            // or just do that on the $interval to start with - probably best
            var deferred = $q.defer();
            $timeout(function() {
                console.log('API call made to shortcode: ' + shortcode);
                deferred.resolve([{some: 'data'}, {more: 'data'}]); // Need to handle error case
            }, 200);
            promises.push(deferred.promise);
        });
        
        $q.all(promises).then(function(values) {
            // Values is a list of lists
            var allValues = [];
            values.forEach(function(vals) {
                allValues = allValues.concat(vals);
            });
            updaters.forEach(function(updater) {
                updater.callback(allValues); 
            });
        });
    }
    
    this.stop = function() {
        $interval.cancel(canceller);
        canceller = undefined;        
    };
    
    this.addUpdater = function(updater) {
        if (updaters.indexOf(updater) == -1) {
            updaters.push(updater);
        }
    }
    
    this.removeUpdater = function(updater) {
        if (updaters.indexOf(updater) > -1) {
            updaters.splice(updaters.indexOf(updater), 1);
        }
    }
    
    this.hasUpdaters = function() {
        return updaters.length > 0;
    }
        
}
