var mongoose = require('mongoose');

/**
 * Meeting Schema
 */

var MeetingSchema = new mongoose.Schema({
	name: {
		type: String,
		default: false,
		required: true
	},
	description: {
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
	},
	active: {
		type: Boolean,
		default: false
	}
});


module.exports = MeetingSchema;