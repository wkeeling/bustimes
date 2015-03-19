bustimes.controller('StopController', ['$scope', 'FavouritesService', 'EtaUpdateService', StopController]);

function StopController($scope, FavouritesService, EtaUpdateService) {
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
    
    $scope.eta = {
        data: [],
        updater: undefined  
    };
    
    $scope.eta.updater = EtaUpdateService.getUpdater($scope.stop);
    $scope.eta.updater.register(function(data) {
        $scope.eta.data = data;
    }, function() {
        // TODO: This gets called when there's been an error calling the API
    });
    
    $scope.$on('$destroy', function() {
        // Make sure we unregister our updater before we're destroyed
        $scope.eta.updater.unregister(); 
    });
}
