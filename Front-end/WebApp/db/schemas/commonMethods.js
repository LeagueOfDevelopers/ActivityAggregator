module.exports.encryptData = function(pass) {
	var hash = crypto.createHmac('sha256', this.salt)
                   .update(pass)
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