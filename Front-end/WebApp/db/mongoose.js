var mongoose = require('mongoose');
var config = require('../config');
var schema = mongoose.Schema;

mongoose.connect(config.mongooseString);
var db = mongoose.connection();

db.on('error', function (err) {
    console.log('connection error:', err.message);
});
db.once('open', function callback () {
    console.log("Connected to DB!");
});



var testModel = mongoose.model('test', {
	name: String,
	description: String
});

module.exports = testModel;