var mongoose = require('mongoose');
var config = require('../config');
var schema = mongoose.Schema;

mongoose.connect(config.mongooseString);
var db = mongoose.connection;

db.on('error', function (err) {
    console.log('connection error:', err.message);
});
db.once('open', function callback () {
    console.log("Connected to DB!");
});



var achivment = new schema({
	name: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	},
	organization: {
		type: String,
		required: true
	},
	results: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	photos: [{type: String}],
	checked: {
		type: Boolean,
	}
});

var student = new schema({
	firstName: {
		type: String,
		required: true
	},
	secondName: {
		type: String,
		required: true
	},
	middleName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true,
		unique: true
	},
	hashPassword: {
		type: String,
		required: true
	},
	department: {
		type: String,
		required: true
	},
	course: {
		type: String,
		required: true
	},
	about: {
		type: String,
	},
	photoUri: {
		type: String
	},
	achivments: [achivment]

});

var Student = mongoose.model('Student', student)

module.exports = Student;