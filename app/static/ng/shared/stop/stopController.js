bustimes.controller('StopController', ['$scope', '$timeout', 'StopService', 'FavouritesService', 'EtaUpdateService', StopController]);

function StopController($scope, $timeout, StopService, FavouritesService, EtaUpdateService) {
    'use strict';
    
    var NO_DATA_MESSAGE = 'Check timetables';
    
    $scope.actions = {
        toggleFavourite: function() {
            if (!FavouritesService.isFavourite($scope.stop)) {
                FavouritesService.addFavourite($scope.stop);
            } else {
                FavouritesService.removeFavourite($scope.stop);
            }
            StopService.refreshPosition();
        },
        
        isFavourite: function() {
            return $scope.stop && FavouritesService.isFavourite($scope.stop);
        }
    };
    
    $scope.eta = {
        data: [],
        updater: EtaUpdateService.getUpdater($scope.stop),
        tracker: StopService.getStopTracker($scope.stop),
        message: 'Updating...'
    };
    
    $scope.eta.updater.register(function(data) {
        $scope.eta.message = null;
        $scope.eta.data = data;
    }, function() {
        // This gets called when there's an error getting the data
        $scope.eta.message = NO_DATA_MESSAGE;
    });
    
    $scope.eta.tracker.track();
    
    $timeout(function() {
        if (!$scope.eta.data.length) {
            // If no data received within 1 minute of startup, display a message
            $scope.eta.message = NO_DATA_MESSAGE;
        }
    }, 60000);
    
    $scope.$on('$destroy', function() {
        // Make sure we unregister our updater before we're destroyed
        $scope.eta.updater.unregister(); 
        // Make sure we stop tracking the stop's distance
        $scope.eta.tracker.untrack();
    });
    
}
