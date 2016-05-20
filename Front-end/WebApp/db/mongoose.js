var mongoose = require('mongoose');
var	schema = mongoose.Schema;
var	config = require('../config').db;
var studentSchema = require('./schemas/student');
var adminSchema = require('./schemas/admin');
var achivmentSchema = require('./schemas/achivment');
var emailTemplateSchema = require('./schemas/emailTemplate');
var emailReceiverSchema = require('./schemas/emailReceiver');
var recivierGroupSchema = require('./schemas/receiverGroup');
var taskSchema = require('./schemas/task');

module.exports = {
	connection: createConnection(),
	models: createModels()
};

function createConnection() {

	mongoose.connect(config.string);
	var db = mongoose.connection;

	db.on('error', function (err) {
	    console.log('connection error:', err.message);
	});

	db.once('open', function callback () {
	    console.log("Connected to DB!");
	});

	return db;
};

function createModels() {

	var Admin = mongoose.model('Admin', adminSchema);
	var Achivment = mongoose.model('Achivment', achivmentSchema);
	var Student = mongoose.model('Student', studentSchema);
	var EmailTemplate = mongoose.model('EmailTemplate', emailTemplateSchema);
	var EmailReceiver = mongoose.model('EmailReceiver', emailReceiverSchema);
	var ReceiverGroup =  mongoose.model('recivierGroup', recivierGroupSchema);
	var Task = mongoose.model('Task', taskSchema);

return {
	Student: Student,
	Admin: Admin,
	Achivment: Achivment,
	EmailReceiver: EmailReceiver,
	EmailTemplate: EmailTemplate,
	ReceiverGroup: ReceiverGroup,
	Task: Task
};
};
