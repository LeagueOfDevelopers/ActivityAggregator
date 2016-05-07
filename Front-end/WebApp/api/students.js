var Student = require('../db/mongoose').models.Student;
var fs = require("fs");
var config = require('../config').files.students;
var path = require("path");
var util = require('util');
var multiparty = require('multiparty');
var userStrategy = require('./user');
var mailer = require('./mailer');

var User = new userStrategy(Student);

module.exports = {
	isAuth: isAuth,
	login: login,
	logout: logout,
	getStudentDetail: getStudentDetail,
	getStudentsList: getStudentsList,
	getStudentsListByCategory: getStudentsListByCategory,
	getStudentsListByName: getStudentsListByName,
	addStudent: addStudent,
	changeAvatar: changeAvatar,
	updateStudentDetail: updateStudentDetail,
	updateSession: updateSession,
	getLast: getLast,
	isStudent: isStudent
};

function login(req, res, next) {

	Student.findOne({email: req.body.email}, function(err, student) {

		if(err) {

			res.send(err);

		} else if (student && student.passwordIsCorrect(req.body.password)) {

			req.session.user = student;
			res.send({
						data: student
					});

			} else {

				res.send({status: 'not found'});

			}
		 
		
	})
};

function updateSession(req, res, next) {
	if(!req.session.user) {

		res.send('logout')

	} else {

	 Student.findById({_id: req.session.user._id}, function(err, student) {

			if(err) {

				console.log(err)
			}; 

			req.session.user = student;
			res.send('session updated');
		})
	}

};

function isStudent(req, res, next) {
	if(req.session.user && req.session.user.group) {
		console.log('is student');
		next();
	} else {
		res.send('auth required')
	}
};

function isAuth(req, res, next) {
	res.send(req.session);
};

function logout(req, res, next) {
	req.session.destroy();
	console.log('session destroyed');
	res.send('session destroyed');
};

function addStudent(req, res, next) {
		var fields = req.body;
		
		var student = new Student ({
			firstName: fields.firstName,
			lastName: fields.lastName,
			middleName: fields.middleName,
			email: fields.email,
			hashPassword: fields.password,
			department: fields.department,
			course: fields.course,
			group: fields.group,
			about: fields.about,
			level: fields.level,
			registered: new Date(),
			status: 0,
			number: fields.number
		});

		student.save(function(err) {
			if(!err) {
				res.end('student added');
			} else {
				res.send(err);
			}
		})
};

function getLast(req, res, next) {
	Student.find({'achivments.checked': true}, '-hashPassword', {sort: {'achivments.$.created': 1}}).exec(function(err, data) {
		if(err) res.send(err);
		else if(data) {
			res.send(data.reverse());
		}
	})
};	
	
function getStudentDetail(req, res, next) {
		Student.findById(req.params.id,'-hashPasswod', function(err, data) {
			if(!err) {
				res.send(data)
			} else {
				res.send(err)
			}
		})
};

function getStudentsList(req, res, next) {

	Student.find('-hashPassword').limit(10).exec(function(err, data) {
				if (!err) {
						 res.send(data);
				} else {
						res.statusCode = 500;
						console.log('Internal error(%d): %s',res.statusCode,err.message);
						res.send({ error: 'Server error' });
				}
	});
};

function getStudentListLimit(req, res, next) {
	Student.find({'achivments.checked': true}).select('-hashPassword').limit(req.params.number).exec(function(err, data) {
		if(err) res.send(err);
		else if(data) {
			res.send(data);
		}
	})
};

function getStudentsListByCategory(req, res, next) {
	console.log(req.params);
	Student.find({'achivments.type' : req.params.searchParams},'-hashPassword', function (err, data) {
				if (!err) {
						 res.send(data);
				} else {
						res.statusCode = 500;
						console.log('Internal error(%d): %s',res.statusCode,err.message);
						res.send({ error: 'Server error' });
				}
		});


};

function getStudentsListByName(req, res, next) {
	var q = new RegExp(req.params.searchParams, 'i');
	Student.find({$or : [
							{'firstName' : q},
							{'lastName' : q},   
							{'department' : q},
							{'group' : q}
						]
				}).select('-hashPassword')
				  .exec(function(err, data) {
						if (!err) {
							res.send(data);
						 } else {
							 res.statusCode = 500;
							 console.log('Internal error(%d): %s',res.statusCode,err.message);
							 res.send({ error: 'Server error' });
							}
		});


};

function updateStudentDetail(req, res, next) {
	Student.findById(req.params.id, function(err, student) {
			student.about = req.body.about;
			student.save(function(data) {
			res.send('about updated');
		})
	})
};

function changeAvatar(req, res, next) {
		var savePath, fileName;
		var form = new multiparty.Form();
		var supportedTypes = config.avatar.types;

		form.on('close', function() {
			Student.findById(req.params.id, function(err, student) {
					student.photoUri = config.avatar.link + req.params.id + fileName;
					student.save(function(resp) {
					res.send(resp);
				});
			})
		});

		form.on('part', function(part) {
			console.log(part);
			if(false) {
				res.send({status: 'bad'});
			} else {
				 savePath = config.avatar.path + req.params.id;

				if(!fs.existsSync(savePath)) {

						fs.mkdir(savePath);

					};

				 fileName = '/avatar.jpg';

				 if(fs.existsSync(savePath + fileName)) {

					fs.unlinkSync(savePath + fileName);

				 };

				var out = fs.createWriteStream(savePath + fileName);
				console.log(fileName);
				part.pipe(out);
			} 
		});

		form.parse(req);	
};