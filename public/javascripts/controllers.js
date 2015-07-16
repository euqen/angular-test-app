var controllers = angular.module('controllers', ['ngCookies', 'services']);

controllers.controller('homeController', function($scope, $cookies, $cookieStore, $state, api, posts) 
{
	$scope.cookie = $cookies.get('localCookie');
	$scope.posts = posts.data.reverse();

	$scope.login = function(name, desc)
	{
		$cookieStore.put('localCookie', name);
		$state.reload();
	}

	$scope.post = function(message)
	{
		api.post(message)
		.then(function() {
			$state.reload();
		})
		.catch(function() {
			//todo
		});
	}
});