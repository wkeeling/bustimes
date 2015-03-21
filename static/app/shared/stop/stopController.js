bustimes.controller('StopController', ['$scope', '$timeout', 'FavouritesService', 'EtaUpdateService', StopController]);

function StopController($scope, $timeout, FavouritesService, EtaUpdateService) {
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
        updater: EtaUpdateService.getUpdater($scope.stop),
        message: 'Updating...'
    };
    
    $scope.eta.updater.register(function(data) {
        $scope.eta.message = undefined;
        $scope.eta.data = data;
    }, function() {
        // This gets called when there's an error getting the data
        $scope.eta.message = 'Check timetables';
    });
    
    $timeout(function() {
        if (!$scope.eta.data.length) {
            // If no data received within 1 minute of startup, display a message
            $scope.eta.message = 'Check timetables';
        }
    }, 60000);
    
    $scope.$on('$destroy', function() {
        // Make sure we unregister our updater before we're destroyed
        $scope.eta.updater.unregister(); 
    });
}
