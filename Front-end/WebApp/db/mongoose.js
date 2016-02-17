var mongoose = require('mongoose');
var config = require('../config');
var schema = mongoose.Schema;

mongoose.connect(config.mongooseString);
var db = mongoose.connection();

db.on('error', function (err) {
    console.log('connection error:', err.message);
});
db.once('open', function callback () {
    console.log("Connected to DB!");
});

var achivment = new schema({  
	 owner: {
		type: String,
		required: true
	},
	 id: {
		type: String,
		required: true
	},
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
	 description: String
});

var student = new schema({
	email: {
		type: String,
		required: true
	},
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
	department: {
		type: String,
		required: true
	},
	course: {
		type: Number,
		required: true
	},
	group: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	phone: {
		type: String,
		required: false
	},
	about: {
		type: String,
		required: false
	},
	avatarUri: {
		type: String,
		required: false
	},
	achivments: [Achivment]
});

var testModel = mongoose.model('test', {
	name: String,
	description: String
})

module.exports = testModel