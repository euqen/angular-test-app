var express = require('express');
var router = express.Router();
var postAPI = require('./posts');

router.get('/', postAPI.getPosts);
router.post('/', postAPI.addPost);

module.exports = router;