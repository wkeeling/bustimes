bustimes.controller('StopController', ['$scope', 'FavouriteService', StopController]);

function StopController($scope, FavouriteService) {
    'use strict';
    
    $scope.actions = {
        toggleFavourite: function() {
            if (!FavouriteService.isFavourite($scope.stop)) {
                FavouriteService.addFavourite($scope.stop);
            } else {
                FavouriteService.removeFavourite($scope.stop);
            }
        },
        
        isFavourite: function() {
            return $scope.stop && FavouriteService.isFavourite($scope.stop);
        }
    };
}
