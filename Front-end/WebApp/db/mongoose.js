var mongoose = require('mongoose');
var	schema = mongoose.Schema;
var	config = require('../config').db;
var	crypto = require('crypto');
var studentSchema = require('./schemas/student');
var adminSchema = require('./schemas/admin');
var achivmentSchema = require('./schemas/achivment');
var Admin = require('./schemas/admin');
var Achivment = require('./schemas/achivment')

mongoose.connect(config.string);
var db = mongoose.connection;

db.on('error', function (err) {
    console.log('connection error:', err.message);
});

db.once('open', function callback () {
    console.log("Connected to DB!");
});


var Admin = mongoose.model('Admin', adminSchema);
var Achivment = mongoose.model('Achivment', achivmentSchema);
var Student = mongoose.model('Student', studentSchema);

module.exports = {
	connection: db,
	models: {
		Student: Student,
		Admin: Admin,
		Achivment: Achivment
	}

}