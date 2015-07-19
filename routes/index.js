var express = require('express');
var router = express.Router();
var app = require('../actions/application/index');

router.get('/*', app.main);

module.exports = router;