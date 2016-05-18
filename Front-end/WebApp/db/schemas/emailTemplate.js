var mongoose = require('mongoose');
var jade = require('jade');
var	schema = mongoose.Schema;

var emailTemplate = new schema({
	name: {
		type: String,
		required: true,
		unique: true
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

emailTemplate.methods.generate = function(text) {
	jade.compileFile(this.htmlTemplate, text);
};

module.exports = emailTemplate;