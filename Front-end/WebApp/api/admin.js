var fs = require('fs');
var path = require('path');
var Admin = require('../db/mongoose').models.Admin;
module.exports = {
  login: login,
  newAdmin: newAdmin
};

function login(req, res, next) {
  console.log(req.body);
  Admin.findOne({email: req.body.email}, function(err, admin) {
  	console.log(admin);
    if(err) {
      console.log(err)
    } else {
      if(admin && admin.hashPassword == req.body.password) {
      	req.session.user = admin;
      	res.send({
      		status: 'ok',
      		data: admin
      	});
      } else {
      	res.send('admin not found')
      }
    }
  })
};


function newAdmin(req, res, next) {
	var admin = new Admin({
		firstName : 'Админ',
		lastName: 'Админ',
		middleName: 'Админ',
		email: 'admin2@mail.ru',
		hashPassword: '11111'
	});

	admin.save(function(data) {
		res.send(data);
		console.log(new Date());
	})
};



