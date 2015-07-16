var services = angular.module('services', ['app'])

services.service('api', function($http) {

	this.post = function(message, sender) {
		var model = {text: message, author: sender, time: new Date()};
		return $http.post('/api/v1/posts/', model);
	};

	this.get = function() {
		return $http.get('/api/v1/posts');
	};
});