bustimes.controller('FavouritesController', ['$scope', 'FavouritesService', FavouritesController]);

function FavouritesController($scope, FavouritesService) {
    'use strict';
    
    $scope.favourite = {
        stops: []
    };
    
    (function() {
        function updateFavourites() {
            FavouritesService.getFavourites().then(function(stops) {
                $scope.favourite.stops = stops; 
            });
        }
        
        FavouritesService.registerFavouritesListener(function() {
            updateFavourites();
        });
        
        updateFavourites();
    })();
}
