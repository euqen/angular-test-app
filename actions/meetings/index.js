var startMeetingContract = require('./contracts/startMeeting');
var meetingService = require('../../shared/services/meeting');
var ErrorResponse = require('./../../shared/infrastructure/errorResponse');

module.exports.startMeeting = function(request, response)
{
	startMeetingContract.validate(request)
	.then(function(contract) {
		if(contract.errorResponse.hasErrors()) {
			return response.status(400).send(contract.errorResponse);
		}

		meetingService.getActiveMeeting()
		.then(function(meeting) {
			if(meeting) {
				var error = new ErrorResponse([{param: 'name', msg: 'There is active meeting!', code: 400}]);
				return response.status(400).send(error);
			}

			meetingService.startMeeting(contract.data)
			.then(function(meeting) {
				return response.status(200).send();
			})
			.catch(function(error) {
				return response.status(400).send(error);
			})
			.done();
		})
		.catch(function(error) {
			return response.status(400).send(error);
		})
		.done();
	})
	.done();
};

module.exports.getActiveMeeting = function(request, response)
{
	meetingService.getActiveMeeting()
	.then(function(meeting) {
		return response.status(200).send(meeting);
	})
	.catch(function(error) {
		return response.status(400).send(error);
	})
	.done();
};

module.exports.stopMeeting = function(request, response)
{
	meetingService.getActiveMeeting()
	.then(function(meeting) {
		if(meeting) {
			meetingService.stopMeeting()
			.then(function(meeting) {
				return response.status(200).send(meeting);
			})
			.catch(function() {
				return response.status(400).send(error);
			});
		}
		else {
			var error = new ErrorResponse([{param: 'name', msg: 'There is no active meeting!', code: 400}]);
			return response.status(400).send(error);
		}
	})
	.catch(function(error) {
		return response.status(400).send(error);
	})
	.done();
};

module.exports.getMeetingHistory = function(request, response)
{
	meetingService.getMeetingHistory()
	.then(function(meetings) {
		return response.status(200).send(meetings);
	})
	.catch(function(error) {
		return response.status(400).send(error);
	})
	.done();
};