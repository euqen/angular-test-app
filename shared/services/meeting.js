var db = require('./../db'),
    BaseViewService = require('./baseViewService');

var meetingService = new BaseViewService(db.Meeting);

meetingService.getById = function(id) {
  return meetingService.findOne({_id: id});
};

meetingService.getActiveMeeting = function() {
  return meetingService.findOne({active: true});
};

meetingService.getByAuthor = function(author) {
  return meetingService.find({author: author});
};

meetingService.getMeetingHistory = function() {
  return meetingService.find({active: false});
};

meetingService.startMeeting = function(meeting) {
  return meetingService.create(meeting);
};

meetingService.stopMeeting = function() {
  return meetingService.update({active: true}, function(doc) {
  	doc.active = false;
  });
};

module.exports = meetingService;

