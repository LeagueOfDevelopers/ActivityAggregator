var mongoose = require('mongoose');

var	schema = mongoose.Schema;

var emailTemplate = new schema({
	name: {
		type: String,
		required: true
	},
	subject: {
		type: String,
		requird: true
	},
	text: {
		type: String,
		required: true
	},
	htmlTemplate: {
		type: String, 
	}
});

module.exports = emailTemplate;