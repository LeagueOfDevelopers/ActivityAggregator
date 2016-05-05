var mongoose = require('mongoose');

var	schema = mongoose.Schema;

var emailTemplate = new schema({
	templateName: {
		type: String,
		required: true
	},
	subject: {
		type: String,
		requird: true
	},
	title: {
		type: String, 
		required: true
	},
	text: {
		type: String,
		required: true
	},
	htmlTemplate: {
		type: String, 
		required: true
	}
});