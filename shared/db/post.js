var mongoose = require('mongoose');

/**
 * Post Schema
 */

var PostScheme = new mongoose.Schema({
	text: {
		type: String,
		default: false,
		required: true
	},
	author: {
		type: String,
		defalut: false,
		trim: true,
		required: true
	},
	time: {
		type: Date,
		default: new Date()
	},
	location: {
		type: String,
		default: false,
		required: true
	}
});


module.exports = PostScheme;