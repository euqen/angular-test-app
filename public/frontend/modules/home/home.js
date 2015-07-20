var app = angular.module('app');

app.controller('homeController', function($scope, $state, posts, auth, socketio, Notification)
{
	$scope.isAuthorized = auth.isAuthorized('userAuth');
	$scope.message = '1234';
	if($scope.isAuthorized) {
		var userData = auth.getUserData('userAuth');
		userData = JSON.parse(userData);
		$scope.name = userData.name;
	}

	posts.getPosts()
	.then(function(postsData) {
		$scope.posts = postsData.reverse();
	});

	$scope.login = function(name, location)
	{
		if(!name || !location) return Notification.warning('Ooops! All fields are required!');
		auth.authorize('userAuth', {name: name, location: location});
		$scope.isAuthorized = true;
		Notification.success('You logged successfully');
	}

	$scope.insert = function(text, form)
	{
		if (!$scope.isAuthorized) throw new Error('Trying to insert new post, being unauthorized!');

		var post = {text: text, author: $scope.name, location: userData.location};

		Notification.clearAll();

		posts.insertPost(post, form)
		.then(function() {
			Notification.success('Well done, bro!');
			$scope.message = '';
			console.log($scope);
		})
		.catch(function(error) {
			Notification.error({message: error.errors.errorString});
		});
	};

	socketio.on('post', function(post) {
		//$scope.$apply(function() {
		$scope.posts.unshift(post);
		//});
	});
});