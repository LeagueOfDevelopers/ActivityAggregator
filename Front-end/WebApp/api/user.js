
var UserStrategy = function(model) {

	this.model = model;
	
	this.login = function(email, pass, callback) {
		this.model.findOne({'email': email})
				  .exec(function(err, user) {
						if(err) {
						callback({error: 'login error ' + this.model})	
						console.log('login error ' + this.model + ' ' + err);
					}
						else if(user && user.passwordIsCorrect(pass)) {
							callback({user: user});
						} else {
							callback({error: 'creditionals uncorrect'})						
						}
					});
	};

	this.logout = function(callback) {
		req.session.destroy();
		callback('session destroyed');
	};

	this.do = function(callback) {
		var currentUser = req.session.user || null;
		if(currentUser) {
			callback();
		}
	};

}

