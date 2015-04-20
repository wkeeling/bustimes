bustimes.controller('StopController', ['$scope', '$timeout', 'StopService', 'FavouritesService', 'PreferencesService', 'EtaUpdateService', StopController]);

function StopController($scope, $timeout, StopService, FavouritesService, PreferencesService, EtaUpdateService) {
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
        },
    };
    
    $scope.eta = {
        data: [],
        filters: [],
        updater: EtaUpdateService.getUpdater($scope.stop),
        tracker: StopService.getStopTracker($scope.stop),
        message: 'Updating...',
        
        serviceList: function() {
            var list = [];
            if (this.data && this.data.length) {
                this.data.forEach(function(eta) {
                    var displayName = eta.service + ' ' + eta.dest;
                    if (list.indexOf(displayName) === -1) {
                        list.push(displayName);
                    } 
                });
                list.sort();
            }
            return list;
        },
        
        onServiceFilterClick: function(name, event) {
            if (this.filters.indexOf(name) === -1) {
                this.filters.push(name);
            } else if (this.filters.indexOf(name) > -1) {
                this.filters.splice(this.filters.indexOf(name), 1);
            }
        },
        
        shouldDisplay: function(name) {
            if (typeof name === 'object') {
                name = name.service + ' ' + name.dest;
            }
            return !this.filters.length || this.filters.indexOf(name) > -1;
        }
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
