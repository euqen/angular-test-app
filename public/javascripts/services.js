var services = angular.module('services', ['app'])

services.service('api', function($http, $cookieStore) {

	this.post = function(message) {
		var model = {text: message, author: $cookieStore.get('localCookie'), time: new Date()};
		return $http.post('/api/v1/posts/', model);
	};

	this.get = function() {
		return $http.get('/api/v1/posts');
	};
});