var app = angular.module('app');

app.service('meetings', function(httpModel)
{
	this.startMeeting = function(meeting, form) {
		return httpModel.postForm('/api/v1/meetings/start', form, meeting);
	};

	this.getActiveMeeting = function() {
		return httpModel.get('/api/v1/meetings/active');
	};

	this.stopMeeting = function() {
		return httpModel.put('/api/v1/meetings/stop');
	};

	this.getMeetingsHistory = function() {
		return httpModel.get('/api/v1/meetings/history');
	};
});
