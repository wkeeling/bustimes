'use strict';

bustimes.directive('topBar', function() {
   
    return {
        scope: {},
        restrict: 'E',
        templateUrl: '/app/shared/topbar/topBar.ngtmpl.html',
        controller: 'TopBarController'
    };

});
