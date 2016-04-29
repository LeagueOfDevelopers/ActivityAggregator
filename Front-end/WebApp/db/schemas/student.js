var achivmentSchema = require('./achivment');
var commonMethods = require('./commonMethods.js');

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
	achivments: [achivmentSchema]
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

module.exports = student;
