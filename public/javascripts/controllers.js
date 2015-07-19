var app = angular.module('app');

app.controller('homeController', function($scope, $cookies, $cookieStore, $state, api, posts, socketio)
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
			$scope.message = '';
			$scope.success = 'Well done!';
			delete $scope.error;
		})
		.catch(function(error) {
			$scope.error = error.data.errors[0].msg;
			delete $scope.success;
		});
	}

	socketio.on('post', function(post) {
		console.log(post);
		$scope.$apply(function() {
			$scope.posts.unshift(post);
		});
	});

});