var mongoose = require('mongoose');
var receiverSchema = require('./emailReceiver');
var	schema = mongoose.Schema;

var group = new schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	receivers: [receiverSchema]
})

module.exports = group;
