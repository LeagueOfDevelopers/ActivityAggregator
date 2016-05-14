var mongoose = require('mongoose');
var	schema = mongoose.Schema;

var task = new schema({
	type: {
		type: String,
		required: true
	},
	receiversGroup: [String],
	receiver: {
		type: String
	},
	templateName: {
		type: String,
		required: true
	},
	text: {
		type: String,
		required: true
	},
	done: {
		type: Boolean,
		required: true
	}
});



module.exports = task;