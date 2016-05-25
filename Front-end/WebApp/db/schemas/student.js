var achivmentSchema = require('./achivment');
var mongoose = require('mongoose');
var commonMethods = require('./commonMethods.js');

var	schema = mongoose.Schema;

var student = new schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
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
	role: {
		type: Number,
		default: 0,
		required: true
	},
	hashPassword: {
		type: String,
		required: true,
		set: commonMethods.setPassword
	},
	salt: {
		type: String
	},
	number: {
		type: String,
		required: true
	},
	status: { // 1- confirmed 2 - rejected
		type: Number,
		required: true
	},
	department: {
		type: String,
		required: true
	},
	group: {
		type: String,
		required: true
	},
	level: {
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
	registered: {
		type: Date
	},
	recoveryToken: {
		type: String
	},
	emailConfirmToken: {
		type: String
	},
	achivments: [achivmentSchema],
});

student.methods.encryptData = commonMethods.encryptData;

student.methods.makeSalt = commonMethods.makeSalt;

student.methods.passwordIsCorrect = commonMethods.passwordIsCorrect;

student.methods.confirm = function() {
	this.status = 1;
};

student.methods.reject = function() {
	this.status = 2;
};

student.methods.add = function(fields, callback) {

	var newStudent = new Student ({
			firstName: fields.firstName,
			lastName: fields.lastName,
			middleName: fields.middleName,
			email: fields.email,
			hashPassword: fields.password,
			department: fields.department,
			course: fields.course,
			group: fields.group,
			about: fields.about,
			level: fields.level,
			registered: new Date(),
			status: 0,
			number: fields.number,
			emailConfirmToken: this.encryptData(fields.email)
		});

		newStudent.save(function(err) {
			if(!err) {
				callback('student added')
			} else {
				callback(err);
			}
		})
};

student.methods.createRecoveryToken = commonMethods.createRecoveryToken;
student.methods.useRecoveryToken = commonMethods.useRecoveryToken;



module.exports = student;
