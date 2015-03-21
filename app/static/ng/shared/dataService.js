bustimes.service('DataService', ['$http', '$q', DataService]);

function DataService($http, $q) {
    'use strict';
    var DATA_SOURCE = '/static/ng/data/data.json',
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
            stopsByShortcode: {},
            stopsByQualifiedName: {},
            stopsByService: {},
        };
        
        data.stops.forEach(function(stop) {
            stop.services.forEach(function(service) {
                if (!processed.stopsByService[service]) {
                    processed.stopsByService[service] = [];
                } 
                processed.stopsByService[service].push(stop);
            });
            
            stop.qualifiedName = stop.name + ' - ' + stop['town/village'];
            
            processed.stopsByQualifiedName[stop.qualifiedName] = stop;
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
    
    this.getStopsByQualifiedName = function() {
        var deferred = $q.defer();
        promise = promise.then(function(data) {
            deferred.resolve(data.stopsByQualifiedName);
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
    
    this.getStopQualifiedNames = function() {
        var deferred = $q.defer();
        promise = promise.then(function(data) {
            deferred.resolve(Object.keys(data.stopsByQualifiedName).sort());
            return data;
        });
        return deferred.promise;
    };
}
    
