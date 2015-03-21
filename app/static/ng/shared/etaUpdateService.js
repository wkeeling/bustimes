bustimes.service('EtaUpdateService', ['$http', '$q', '$interval', '$timeout', EtaUpdateService]);

function EtaUpdateService($http, $q, $interval, $timeout) {
    'use strict';
    
    var pollers = {};
    
    this.getUpdater = function(stop) {
        var poller = pollers[stop.qualifiedName];
        if (!poller) {
            // No active poller for this stop, so create one
            poller = new StopPoller(stop, $http, $q, $interval, $timeout);
            pollers[stop.qualifiedName] = poller;
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
                    delete pollers[stop.qualifiedName];
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
                allPromises = allPromises.concat(poller.update());
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
        
    var POLL_URL = 'http://www.oxontime.com/Naptan.aspx?t=departure&sa=%shortcode%&format=xhtml',
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
        var promises = [];
        
        stop.shortcodes.forEach(function(shortcode) {
            // Simulating $http call here
            var deferred = $q.defer(),
                url = POLL_URL.replace('%shortcode%', shortcode);
                // url = 'http://192.168.0.2:8000/index.html';
            $timeout(function() {
                try {
                    // var iFrame = $('<iframe style="display:none"/>').attr('src', url).appendTo($('body')),
                        // records = parseEtaRecords(iFrame);
                        
                    deferred.resolve(records);
                } catch (e) {
                     deferred.reject();  
                }
                
                
                
                // $http.get(url).success(function(data) {
                    // try {
                        // var records = parseEtaRecords(data);
                        // deferred.resolve(records);
                    // } catch (e) {
                        // deferred.reject();                        
                    // }
                // }).error(function() {
                    // deferred.reject();
                // });
            }, Math.floor(Math.random() * 1000)); // Helps to prevent all the API calls from being made at exactly the same time
            promises.push(deferred.promise);
        });
        
        $q.all(promises).then(function(values) {
            // Values is a list of lists
            var allValues = [];
            values.forEach(function(vals) {
                allValues = allValues.concat(vals);
            });
            updaters.forEach(function(updater) {
                updater.successCallback(allValues); 
            });
        }, function() {
            updater.errorCallback();
        });
        
        return promises;
    }
    
    this.stop = function() {
        $interval.cancel(repeat);
        repeat = undefined;        
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
        
    function parseEtaRecords(dom) {
        var records = [];
        
        // Find the data <table> in the document
        var table = dom.find('table.selectable');
        
        table.find('tbody > tr').each(function() {
            var $this = $(this),
                cells = $this.find('td');
            
            var record = {
                service: cells[0],
                dest: cells[1],
                time: cells[2]
            };
            
            records.push(record);
        });
        
        // Need to sort the records by time (take into account DUE)
        // records.sort(function(a, b) {
            // return Integer.parseInt(a.time) 
        // });
        
        return records;
    }        
}

