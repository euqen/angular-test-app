var mongoose = require('../lib/mongoose');
var Schema = mongoose.Schema;

/**
 * Post Schema
 */

var Post = new Schema({
	text: String,
	author: String,
	time: Date
});


module.exports = mongoose.model('Post', Post);