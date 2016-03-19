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
    if(err) {
      res.send(err)
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
		email: 'admin3@mail.ru',
		hashPassword: '11111'
	});


	admin.save(function(data) {
		res.send(data);
		console.log(new Date());
	})
};

function registerByInvite(req, res, next) {

  var admin = new Admin({
    firstName : req.body.firstName,
    lastName: req.body.lastName,
    middleName: req.body.middleName
    email: req.body.email,
    hashPassword: req.body.password
  });


  admin.save(function(data) {
    res.send(data);
    console.log(new Date());
  })
};

function getUncheckedRequests(req, res, next) {
  console.log('hey');
  Student.find({'achivments.checked': false}, function(err, data) {
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

function unConfirmAchivment(req, res, next) {
  Student.findOne({'achivments._id' : req.params.id}, function(err, student) {

  })
};

