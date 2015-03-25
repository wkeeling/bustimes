bustimes.controller('FavouritesController', ['$scope', '$timeout', 'FavouritesService', FavouritesController]);

function FavouritesController($scope, $timeout, FavouritesService) {
    'use strict';
    
    $scope.favourite = {
        stops: []
    };
    
    (function() {
        FavouritesService.registerFavouritesListener(function(favourites) {
            $scope.favourite.stops = favourites;
        });
        
        $timeout(function() {
            FavouritesService.getFavourites().then(function(favourites) {
                $scope.favourite.stops = favourites; 
            });
        }, 100); // The delay allows the animations to fire
    })();
}
