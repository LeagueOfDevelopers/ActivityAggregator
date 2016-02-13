var mongoose = require('mongoose');
var config = require('../config');
var schema = mongoose.Schema;

mongoose.connect(config.mongooseString);

var student = mongoose.model('Student', {
	firstName: String,
	lastName: String,
	middleName: String,
	department: String,
	group: String,
	course: Number,
	email: String,
	password: String,
	phone: String,
	about: String,
	avatarUri: String,
	achivments: [
		{    
			 id: String,
			 name: String, 
			 type: String, 
			 organization: String,
			 results: String, 
			 description: String
		}]
})
