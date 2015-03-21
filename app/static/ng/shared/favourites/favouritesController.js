bustimes.controller('FavouritesController', ['$scope', '$timeout', 'FavouritesService', FavouritesController]);

function FavouritesController($scope, $timeout, FavouritesService) {
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
        
        $timeout(function() {
            updateFavourites();
        }, 100);
    })();
}
