bustimes.directive('topBar', function() {
    'use strict';
   
    return {
        scope: {},
        restrict: 'E',
        templateUrl: '/app/shared/topbar/topBar.ngtmpl.html',
        controller: 'TopBarController'
    };

});
