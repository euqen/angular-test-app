var app = angular.module('app', ['ui.router', 'controllers', 'filters']);

app.config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode({enabled: true, requireBase: false});

    /* Add New States Above */
    $stateProvider
    .state('home', {
        url: '/',
        templateUrl: '/public/views/home.html',
        controller: 'homeController',
        resolve: {
        	posts: function(api) {
        		return api.get();
        	}
        }
    });

     $urlRouterProvider.otherwise('/');

});