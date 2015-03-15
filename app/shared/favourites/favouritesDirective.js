bustimes.directive('favourites', function() {
    'use strict';
   
    return {
        scope: {},
        restrict: 'E',
        templateUrl: '/app/shared/favourites/favourites.ngtmpl.html',
        controller: 'FavouritesController'
    };
});
