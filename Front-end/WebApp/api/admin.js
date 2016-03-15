var fs = require('fs');
var path = require('path');
var Admin = require('../db/mongoose').models.Admin;
var Student = require('../db/mongoose').models.Student;
module.exports = {
  login: login,
  newAdmin: newAdmin,
  getUncheckedRequests: getUncheckedRequests
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

function getUncheckedRequests(req, res, next) {
  Student.find({'achivments.unchecked': false}, function(err, data) {
    if(err){
      res.send(err);
    }
    res.send(data);
  });

};

function confirmAchivment(req, res, next) {
  Student.findOne({'achivments._id' : req.params.id}, function(err, student) {
    if(err){
      res.send(err);
    };
    
  })
};


