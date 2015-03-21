bustimes.directive('topBar', function() {
    'use strict';
   
    return {
        scope: {},
        restrict: 'E',
        templateUrl: '/static/ng/shared/topbar/topBar.ngtmpl.html',
        controller: 'TopBarController'
    };

});
