var app = angular.module('app', ['ui.router','ngCookies', 'ui-notification']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode({enabled: true, requireBase: false});

    $stateProvider
    .state('home', {
        url: '/',
        templateUrl: '/public/frontend/modules/home/home.html',
        controller: 'homeController',
        resolve: {
            speakUpLoggedInfo: function(auth) {
                if(auth.isAuthorized('userInfo')) {
                    return JSON.parse(auth.getUserData('userInfo'));
                }
                return false;
            }
        }
    });

     $urlRouterProvider.otherwise('/');

});