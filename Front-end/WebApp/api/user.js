
var UserStrategy = function(model, checkAuthPolicy) {

	this.model = model;

	this.isAuth = checkAuthPolicy;
	
	this.login = function(email, pass, callback) {
		this.model.findOne({'email': email})
				  .exec(function(err, user) {
						if(err) {

							callback({error: 'login error ' + this.model});

					 	} else if(user && user.passwordIsCorrect(pass)) {

							callback({user: user});

						} else {

							callback({error: 'bad creditionals'})	

						}
					});
	};

	this.logout = function(callback) {
		req.session.destroy();
		callback('session destroyed');
	};

	this.current = function(callback) {
		callback(req.session.user || null);
	};

	this.update = function(callback) {
		var curUser = this.current();

		if(curUser) {

			 this.model.findById({_id: curUser._id}, function(err, updatedUser) {

				if(err) res.send(err);
				else if(updatedUser) {

					req.session.user = updatedUser;
					callback('session updated');

				} else {

					callback('user not found by current session');

				}
			})
		}
	};

	this.changePassword = function(newPass) {

		this.model.hashPassword = newPass;
	};

	this.checkAuth = function(callback) {
		if(this.isAuth) callback()
		else callback('identificate error')
	};

	return this;
};

module.exports = UserStrategy;