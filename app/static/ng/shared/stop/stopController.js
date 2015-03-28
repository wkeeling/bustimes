bustimes.controller('StopController', ['$scope', '$timeout', 'StopService', 'FavouritesService', 'EtaUpdateService', StopController]);

function StopController($scope, $timeout, StopService, FavouritesService, EtaUpdateService) {
    'use strict';
    
    var ERROR_MESSAGE = 'Check timetables',
        NO_SERVICES_MESSAGE = 'Nothing due';
    
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
        tracker: StopService.getStopTracker($scope.stop),
        message: 'Updating...'
    };
    
    $scope.eta.updater.register(function(data) {
        if (!data || !data.length) {
            $scope.eta.message = NO_SERVICES_MESSAGE;
        } else {
            $scope.eta.message = null;
        }
        $scope.eta.data = data;
    }, function() {
        // This gets called when there's an error getting the data
        $scope.eta.data = null;
        $scope.eta.message = ERROR_MESSAGE;
    });
    
    $scope.eta.tracker.track();
    
    $scope.$on('$destroy', function() {
        // Make sure we unregister our updater before we're destroyed
        $scope.eta.updater.unregister(); 
        // Make sure we stop tracking the stop's distance
        $scope.eta.tracker.untrack();
    });
    
}
