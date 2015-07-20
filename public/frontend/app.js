var app = angular.module('app', ['ui.router','ngCookies', 'ui-notification']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode({enabled: true, requireBase: false});

    $stateProvider
    .state('home', {
        url: '/',
        templateUrl: '/public/frontend/modules/home/home.html',
        controller: 'homeController'
    });

     $urlRouterProvider.otherwise('/');

});