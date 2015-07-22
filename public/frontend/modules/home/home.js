var app = angular.module('app');

app.config(function(NotificationProvider) {
		NotificationProvider.setOptions({
			delay: 20000,
		});
});

app.controller('homeController', function($scope, $state, posts, meetings, auth, socketio, speakUpLoggedInfo, Notification)
{
	$scope.message = {text : ''};
	$scope.meeting = {name : '', description: '', error: ''};
	$scope.history = {items : [], error: ''};

	$scope.speakUpLoggedManager = _.contains(speakUpLoggedInfo.roles, 'manager');
	$scope.isAuthorized = auth.isAuthorized('userAuth');

	if($scope.isAuthorized) {
		var userData = auth.getUserData('userAuth');
		userData = JSON.parse(userData);
		$scope.name = userData.name;
	}

	meetings.getActiveMeeting()
	.then(function(meeting) {
		if (meeting) return $scope.meeting.name = meeting.name;
		$scope.meeting.error = 'There is no active meeting yet!';
	});

	meetings.getMeetingsHistory()
	.then(function(history) {
		if (history.length) return $scope.history.items = history;
		$scope.history.error = 'There is no meetings in history yet!';
	});

	$scope.stop = function()
	{
		Notification.clearAll();

		meetings.stopMeeting()
		.then(function() {
			$scope.meeting.name = '';
			$scope.meeting.error = 'There is no active meeting yet!';
			Notification.success('Meeting successfully stopped!');
		})
		.catch(function(error) {
			Notification.error('Oops! Somthing wrong!'); // TODO
		});
	};

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