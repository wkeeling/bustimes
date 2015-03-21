bustimes.directive('favourites', function() {
    'use strict';
   
    return {
        scope: {},
        restrict: 'E',
        templateUrl: '/static/ng/shared/favourites/favourites.ngtmpl.html',
        controller: 'FavouritesController'
    };
});
