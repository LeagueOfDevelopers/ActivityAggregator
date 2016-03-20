var mongoose = require('mongoose');
var schema = mongoose.Schema;
var crypto = require('crypto');

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
	level: {
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
	},
	updated: {
		type: Date,
		default: Date.now
	},
	message: {
		type: String
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
		required: true,
		set: setPassword
	},
	salt: {
		type: String
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
	achivments: [achivment]

});

student.methods.encryptPass = function(pass) {
	return crypto.createHmac('sha256', this.salt)
                   .update(pass)
                   .digest('hex');

};

student.methods.makeSalt = function() {
	this.salt =  Math.random() + 'jambul' + Math.random();

};

student.methods.passwordIsCorrect = function(pass) {
	return this.hashPassword == this.encryptPass(pass);

};




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

});

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
	invCodes: [{type: String}],
	middleName: {
		type: String,
		required: true
	},
	registered: {
		type: Date,
		default: Date.now
	},
	actions: [action],
	salt: {
		type: String
	},
	hashPassword: {
		type: String,
		required: true,
		set: setPassword
	}

});

admin.methods.encryptData = function(data) {
	return crypto.createHmac('sha256', this.salt).update(data).digest('hex');

};

admin.methods.makeSalt = function() {
	this.salt =  Math.random() + 'jambul' + Math.random();

};

admin.methods.passwordIsCorrect = function(pass) {
	return this.hashPassword == this.encryptData(pass);

};


admin.methods.generateInviteCode = function(guestWord) {
	var inviteCode = this.ecryptData(guestWord);
	this.invCodes.push(inviteCode);
	return this.ecryptData(guestWord);
};

 function setPassword(password) {
      this.salt = this.makeSalt();
      this.hashedPassword = this.encryptData(password);
    }

var Admin = mongoose.model('Admin', admin);

var Achivment = mongoose.model('Achivment', achivment);
var Student = mongoose.model('Student', student);

module.exports = {
	connection: db,
	models: {
		Student: Student,
		Admin: Admin,
		Achivment: Achivment
	}

}