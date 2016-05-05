var mongoose = require('mongoose');

var	schema = mongoose.Schema;

var receiver = new schema({
	id: {
		type: String,
		required: true,
		unique: true
	}, 
	email: {
		type: String,
		required: true
		unique: true
	}
});