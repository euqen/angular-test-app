var express = require('express');
var router = express.Router();
var appAPI = require('./application');

router.get('/*', appAPI.main);

module.exports = router;