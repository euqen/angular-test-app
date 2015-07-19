var express = require('express');
var router = express.Router();
var postAPI = require('../actions/posts/index');

router.get('/posts', postAPI.getPosts);
router.post('/posts', postAPI.addPost);

module.exports = router;