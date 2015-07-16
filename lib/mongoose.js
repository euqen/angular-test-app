var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/postdatabase');

module.exports = mongoose;