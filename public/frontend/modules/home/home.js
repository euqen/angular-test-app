var app = angular.module('app');

app.config(function(NotificationProvider) {
		NotificationProvider.setOptions({
			delay: 20000,
		});
});

app.controller('homeController', function($scope, $state, posts, auth, socketio, speakUpLoggedInfo, Notification)
{
	$scope.message = {text : ''};
	$scope.speakUpLoggedManager = _.contains(speakUpLoggedInfo.roles, 'manager');
	$scope.isAuthorized = auth.isAuthorized('userAuth');

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
			$scope.message.text = '';
		})
		.catch(function(error) {
			Notification.error({message: error.errors.errorString});
		});
	};

	socketio.on('post', function(post) {
		$scope.posts.unshift(post);
	});
});