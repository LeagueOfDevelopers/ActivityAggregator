var mongoose = require('mongoose');
var receiverSchema = require('emailReceiver.js');
var	schema = mongoose.Schema;

var group = new schema({
	name: {
		type: String,
		required: true
	},
	receivers: [receiverSchema]
})

module.exports = group;
