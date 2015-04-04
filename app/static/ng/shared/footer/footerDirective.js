bustimes.directive('footer', function() {
    'use strict';
   
    return {
        scope: {},
        restrict: 'E',
        templateUrl: '/static/ng/shared/footer/footer.ngtmpl.html',
        controller: 'FooterController'
    };

});
