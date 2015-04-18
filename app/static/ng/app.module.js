var bustimes = angular.module('bustimes', ['ngRoute', 'ngAnimate', 'ui.bootstrap', 'ui.utils'])

.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/buses', {
            templateUrl: '/static/ng/components/buses/buses.ngtmpl.html' 
        })
        
        .when('/share', {
            templateUrl: '/static/ng/components/share/share.ngtmpl.html' 
        })
        
        .when('/feedback', {
            templateUrl: '/static/ng/components/feedback/feedback.ngtmpl.html' 
        })
        
        .when('/about', {
            templateUrl: '/static/ng/components/about/about.ngtmpl.html' 
        })
        
        .otherwise({
            redirectTo: '/buses'
        });
    
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
});

