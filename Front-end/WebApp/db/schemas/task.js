var mongoose = require('mongoose');
var	schema = mongoose.Schema;

var task = new schema({
	type: {
		type: String,
		required: true
	},
	receiverGroup: String,
	receiver: {
		type: String
	},
	templateName: {
		type: String,
		required: true
	},
	text: {
		type: Object,
		required: true
	},
	done: {
		type: Boolean,
		required: true,
		default: false
	}
});



module.exports = task;