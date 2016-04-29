var commonMethods = require('./commonMethods.js');

var admin = new schema({
	role: {
		type: Number,
		default: 1,
		required: true
	},
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
	code: {
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
	salt: {
		type: String
	},
	hashPassword: {
		type: String,
		required: true,
		set: setPassword
	}

});

admin.methods.encryptData = commonMethods.encryptData;

admin.methods.makeSalt = commonMethods.makeSalt;

admin.methods.passwordIsCorrect = commonMethods.passwordIsCorrect;

admin.methods.generateInviteCode = function(guestWord) {
	var inviteCode = this.encryptData(guestWord);
	this.invCodes.push(inviteCode);
	return inviteCode;
};

module.exports = admin;