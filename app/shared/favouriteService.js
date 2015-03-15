bustimes.service('FavouriteService', ['$q', 'DataService', FavouriteService]);

function FavouriteService($q, DataService) {
    'use strict';
    
    var MAX_ALLOWED_FAVOURITES = 3,
        STORAGE_KEY = 'favouriteStops';
        
    function getFavourites() {
        var favourites = window.localStorage.getItem(STORAGE_KEY);
        if (favourites) {
            favourites = JSON.parse(favourites);
        } else {
            favourites = [];
        }
        return favourites;
    }
    
    function setFavourites(favourites) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    }
    
    this.getFavourites = function() {
        var deferred = $q.defer();
            favourites = getFavourites(); 
        
        DataService.getStopsByQualifiedName().then(function(stops) {
            var favouriteStops = [];
            if (favourites && favourites.length) {
                favourites.forEach(function(qName) {
                    favouriteStops.push(stops[qName]); 
                });
            }
            deferred.resolve(favouriteStops);
        });
        
        return deferred.promise;
    };
    
    this.addFavourite = function(stop) {
        var favourites = getFavourites();

        if (favourites.indexOf(stop.qualifiedName) === -1) {
            if (favourites.length === MAX_ALLOWED_FAVOURITES) {
                favourites.pop();
            }
            
            favourites.unshift(stop.qualifiedName);
        }        
        
        setFavourites(favourites);
    };
    
    this.removeFavourite = function(stop) {
        var favourites = getFavourites();
        
        if (favourites && favourites.length) {
            if (favourites.indexOf(stop.qualifiedName) > -1) {
                favourites.splice(favourites.indexOf(stop.qualifiedName), 1);
            }
        }
        setFavourites(favourites);
    };
    
    this.isFavourite = function(stop) {
        var favourite = false,
            favourites = getFavourites();
        if (favourites && favourites.length) {
            favourite = favourites.indexOf(stop.qualifiedName) > -1;
        }
        return favourite;
    };
}

// Imitation of window.localStorage for older browsers.
// Copied from https://developer.mozilla.org/en/docs/Web/Guide/API/DOM/Storage#localStorage
if (!window.localStorage) {
  Object.defineProperty(window, "localStorage", new (function () {
    var aKeys = [], oStorage = {};
    Object.defineProperty(oStorage, "getItem", {
      value: function (sKey) { return sKey ? this[sKey] : null; },
      writable: false,
      configurable: false,
      enumerable: false
    });
    Object.defineProperty(oStorage, "key", {
      value: function (nKeyId) { return aKeys[nKeyId]; },
      writable: false,
      configurable: false,
      enumerable: false
    });
    Object.defineProperty(oStorage, "setItem", {
      value: function (sKey, sValue) {
        if(!sKey) { return; }
        document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
      },
      writable: false,
      configurable: false,
      enumerable: false
    });
    Object.defineProperty(oStorage, "length", {
      get: function () { return aKeys.length; },
      configurable: false,
      enumerable: false
    });
    Object.defineProperty(oStorage, "removeItem", {
      value: function (sKey) {
        if(!sKey) { return; }
        document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
      },
      writable: false,
      configurable: false,
      enumerable: false
    });
    this.get = function () {
      var iThisIndx;
      for (var sKey in oStorage) {
        iThisIndx = aKeys.indexOf(sKey);
        if (iThisIndx === -1) { oStorage.setItem(sKey, oStorage[sKey]); }
        else { aKeys.splice(iThisIndx, 1); }
        delete oStorage[sKey];
      }
      for (aKeys; aKeys.length > 0; aKeys.splice(0, 1)) { oStorage.removeItem(aKeys[0]); }
      for (var aCouple, iKey, nIdx = 0, aCouples = document.cookie.split(/\s*;\s*/); nIdx < aCouples.length; nIdx++) {
        aCouple = aCouples[nIdx].split(/\s*=\s*/);
        if (aCouple.length > 1) {
          oStorage[iKey = unescape(aCouple[0])] = unescape(aCouple[1]);
          aKeys.push(iKey);
        }
      }
      return oStorage;
    };
    this.configurable = false;
    this.enumerable = true;
  })());
}    