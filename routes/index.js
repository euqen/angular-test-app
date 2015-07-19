
var express = require('express');
var router = express.Router();
var postAPI = require('../actions/posts/index');
var appAPI = require('../actions/application/index');


module.exports = function(app) 
{
	app.get('/posts', postAPI);
};
