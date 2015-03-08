bustimes.service('StopSearchService', ['DataService', StopSearchService]);

function StopSearchService(DataService) {
    'use strict';
    
    var searchListeners = [];
    
    this.registerSearchListener = function(listener) {
        searchListeners.push(listener);
    };
    
    this.getMatchingStops = function(val) {
        val = val && val.toLowerCase() || val;
        return DataService.getStops().then(function(stops) {
            var matching = [];
            stops.forEach(function(stop) {
                if (stop.qualifiedName().toLowerCase().indexOf(val) > -1) {
                    matching.push(stop);
                }
            });
            return matching;
        });
    };

    this.onStopSelected = function(stop) {
        searchListeners.forEach(function(listener) {
            listener(stop); 
        });
    };
}
