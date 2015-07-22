var app = angular.module('app', ['ui.router','ngCookies', 'ui-notification']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode({enabled: true, requireBase: false});

    $stateProvider
    .state('home', {
        url: '/',
        templateUrl: '/public/frontend/modules/home/home.html',
        controller: 'homeController',
        resolve: {
            speakUpLoggedInfo: function(auth, httpModel) {
                if(auth.isAuthorized('userInfo')) {
                    
                    return userData = JSON.parse(auth.getUserData('userInfo'));
                   //return httpModel.get('http://localhost:8080/login/by-token/' + userDate.accessToken);
                }
                return false;
            }
        }
    })
    .state('start', {
        url: '/start',
        templateUrl: '/public/frontend/modules/start/start.html',
        controller: 'startMeetingController',
        resolve: {
            speakUpLoggedInfo: function(auth, httpModel, $state) {
                if(auth.isAuthorized('userInfo')) {
                    return userData = JSON.parse(auth.getUserData('userInfo'));
                }
                return;
            }
        }
    });

     $urlRouterProvider.otherwise('/');

});