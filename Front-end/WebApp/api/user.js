
var UserStrategy = function(model) {

	this.model = models[model];
	

	this.login = function(email, pass, callback) {
		this.model.findOne({'email': email})
					.exec(function(err, user) {
						if(err) {
						callback({error: 'login abort'})	
						console.log('login error ' + this.model + ' ' + err);
					}
						else if(data && data.passwordIsCorrect(pass)) {
							callback({user: user});
						} else {
							callback({error: 'creditionals uncorrect'})						
						}
					});
	}



	function registry(fields) {

	}

}


var registryStrategy = {
	Admin: function(fields) {

	}
}


var modelCreateStrategy = {
	Admin: adminCreate,
	Student: studentCreate
}


function adminCreate(form) {
		return new Admin({
        firstName : form.firstName,
        lastName: form.lastName,
        middleName: form.middleName,
        email: form.email,
        hashPassword: form.password,
        code: form.code
      });
}



function registryAdmin(form) {
	Admin.findOne({'invCodes' : form.code}, function(err, findedData) {
   if(findedData) {
  Admin.findOne({'code': form.code}, function(er, data) {
    if(err) res.send(err);
    else if(data) {
      res.send('0'); //code already used
    } else if(!data) {

      var admin = this.create(form);

      admin.save(function(result) {
        res.send('2');
      })
      
    }
  })

} else {
  res.send('1')
}
  
})
}

