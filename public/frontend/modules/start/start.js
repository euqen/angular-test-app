var app = angular.module('app');

app.controller('startMeetingController', function($scope, $state, meetings, speakUpLoggedInfo, Notification)
{
	if(!speakUpLoggedInfo) $state.go('home');

	$scope.meeting = {name: new Date(), description: ''};

	$scope.start = function(name, description)
	{
		if(!name || !description) return Notification.error('Meeting should have filled name and description fields!');

		meetings.startMeeting($scope.meeting, $scope.form)
		.then(function(result) {
			$state.go('home');
			Notification.success('Well done, bro!');
		})
		.catch(function(error) {
			Notification.error(error.errorString);
		});
	};

});