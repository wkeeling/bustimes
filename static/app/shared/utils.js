bustimes.directive('focusOn', function() {
    'use strict';
    return function(scope, elem, attr) {
        scope.$on(attr.focusOn, function(e) {
            elem[0].focus();
        });
    };
}); 

