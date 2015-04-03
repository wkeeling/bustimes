bustimes.service('FavouritesService', ['$q', 'StopService', 'PreferencesService', FavouritesService]);

function FavouritesService($q, StopService, PreferencesService) {
    'use strict';
    
    var DATA_SOURCE = '/api/stop',
        MAX_ALLOWED_FAVOURITES = 3,
        PREF_NAME = 'favouriteStops',
        listeners = [];
        
    function get() {
        return PreferencesService.getPreference(PREF_NAME) || [];
    }
    
    function set(favourites) {
        PreferencesService.setPreference(PREF_NAME, favourites);
        notifyListeners();
    }
    
    function notifyListeners() {
        listeners.forEach(function(listener) {
            listener(); 
        });
    }
    
    this.registerFavouritesListener = function(listener) {
        listeners.push(listener);
    };
    
    this.getFavourites = function() {
        var deferred = $q.defer(),
            favourites = get();
        if (favourites.length) {
            StopService.getStops(favourites).then(function(stops) {
                deferred.resolve(stops);
            });
        } else {
            deferred.resolve([]);
        }
        return deferred.promise;
    };
    
    this.addFavourite = function(stop) {
        var favourites = get();

        if (favourites.indexOf(stop.id) === -1) {
            if (favourites.length === MAX_ALLOWED_FAVOURITES) {
                favourites.pop();
            }
            
            favourites.unshift(stop.id);
        }        
        
        set(favourites);
    };
    
    this.removeFavourite = function(stop) {
        var favourites = get();
        
        if (favourites && favourites.length) {
            if (favourites.indexOf(stop.id) > -1) {
                favourites.splice(favourites.indexOf(stop.id), 1);
            }
        }
        
        set(favourites);
    };
    
    this.isFavourite = function(stop) {
        var favourite = false,
            favourites = get();
            
        if (favourites && favourites.length) {
            favourite = favourites.indexOf(stop.id) > -1;
        }
        
        return favourite;
    };
    
}    