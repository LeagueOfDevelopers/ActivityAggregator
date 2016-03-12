var mongoose = require('mongoose');
var schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/aggregator');
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
	owner_id: {
		type: String,
		required: true
	},
	organization: {
		type: String,
		required: true
	},
	result: {
		type: String,
		required: true
	},
	description: {
		type: String
	},
	photos: [{type: String}],
	files: [{type: String, required: true}],
	checked: {
		type: Boolean,
		required: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

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
	hashPassword: {
		type: String,
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
		type: Date,
		default: Date.now
	},
	achivments: [achivment]

});

var action = new schema({
	date: {
		type: Date,
		default: Date.now,
		required: true
	},
	action: {
		type: String,
		required: true,
	},
	target: {
		type: String,
		require: true
	}

})

var admin = new schema({
	email: {
		type: String,
		required: true,
		unique: true
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
	registered: {
		type: Date,
		default: Date.now
	},
	actions: [action],
	hashPassword: {
		type: String,
		required: true
	}

});
var Admin = mongoose.model('Admin', admin);

var Student = mongoose.model('Student', student);

module.exports = {
	connection: db,
	models: {
		Student: Student,
		Admin: Admin
	},
	schemas: {
		student: student,
		achivment: achivment
	}

}