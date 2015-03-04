'use strict';

bustimes.service('DataService', ['$http', '$q', DataService]);

function DataService($http, $q) {
    var DATA_SOURCE = '/app/data/data.json',
        promise = null,
        that = this;
   
    this.init = function() {
        var deferred = $q.defer();
        promise = deferred.promise;
        $http.get(DATA_SOURCE).success(function(data) {
            deferred.resolve(processData(data));
        });    
    };
    
    function processData(data) {
        var processed = {
            stops: data.stops,
            services: data.services,
            operators: data.operators,
            stopsByService: {}
        };
        
        data.stops.forEach(function(stop) {
            stop.services.forEach(function(service) {
                if (!processed.stopsByService[service]) {
                    processed.stopsByService[service] = [];
                } 
                processed.stopsByService[service].push(stop);
            });
        });
        
        return processed;
    }
    
    this.getStops = function() {
        var deferred = $q.defer();
        promise = promise.then(function(data) {
            deferred.resolve(data.stops);
            return data;
        });
        return deferred.promise;
    };
    
    this.getStopsForService = function(service) {
        var deferred = $q.defer();
        promise = promise.then(function(data) {
            var stops = data.stopsByService[service] || [];
            deferred.resolve(stops);
            return data;
        });
        return deferred.promise;
    };
}
    
