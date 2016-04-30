var	crypto = require('crypto');

module.exports.encryptData = function(str) {
	var hash = crypto.createHmac('sha256', this.salt)
                   .update(str)
                   .digest('hex');
	return hash;
};

module.exports.makeSalt = function() {
	this.salt =  Math.random() + 'jambul' + Math.random();
};

module.exports.passwordIsCorrect = function(pass) {
	return (this.hashPassword == this.encryptData(pass)) || this.hashPassword == pass;
};

module.exports.setPassword = function(password) {
      this.makeSalt();
      return this.encryptData(password);
};