bustimes.controller('StopController', ['$scope', 'FavouritesService', StopController]);

function StopController($scope, FavouritesService) {
    'use strict';
    
    $scope.actions = {
        toggleFavourite: function() {
            if (!FavouritesService.isFavourite($scope.stop)) {
                FavouritesService.addFavourite($scope.stop);
            } else {
                FavouritesService.removeFavourite($scope.stop);
            }
        },
        
        isFavourite: function() {
            return $scope.stop && FavouritesService.isFavourite($scope.stop);
        }
    };
}
