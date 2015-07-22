var express = require('express');
var router = express.Router();
var postAPI = require('../actions/posts/index');
var meetings = require('../actions/meetings/index');

router.get('/posts', postAPI.getPosts);
router.post('/posts', postAPI.addPost);

router.get('/meetings/active', meetings.getActiveMeeting);
router.post('/meetings/start', meetings.startMeeting);
router.get('/meetings/history', meetings.getMeetingHistory);
router.put('/meetings/stop', meetings.stopMeeting);

module.exports = router;