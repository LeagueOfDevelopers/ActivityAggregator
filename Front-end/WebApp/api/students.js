var Student = require('../db/mongoose').models.Student;
var fs = require("fs");
var config = require('../config').files.students;
var path = require("path");
var util = require('util');
var multiparty = require('multiparty');
var userStrategy = require('./user');
var mailer = require('./mailer');
var Task = require('../db/mongoose').models.Task;

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
	isStudent: isStudent,
    generateRecoveryToken: generateRecoveryToken,
    recovery: recovery,
    changePassword: changePassword,
    checkRecoveryToken: checkRecoveryToken
};

function login(req, res, next) {

	Student.findOne({email: req.body.email}, function(err, student) {

		if(err) {

			res.send(err);

		} else if (student && student.passwordIsCorrect(req.body.password) && student.status == 1) {

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
				res.send({text: 'student added', code: 2});
			} else {
				res.send({err: err, code: 3});
                var task = new Task({
                    type: 'package',
                    templateName: 'newStudent',
                    text: fields,
                    receiverGroup: 'admins'
                });
                task.save();

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

	Student.find({"status": 1}).select('-hashPassword').limit(10).exec(function(err, data) {
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
}

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


}

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


}

function updateStudentDetail(req, res, next) {
	var updatetingParam = 'about';
	Student.findById(req.params.id, function(err, student) {
			student[updatetingParam] = req.body.about;
			student.save(function(data) {
			res.send('about updated');
		})
	})
}

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
				
				part.pipe(out);
			} 
		});

		form.parse(req);	
}

function changePassword(req, res, next) {
	if(req.session.user) {
	if(req.body.newPass) {
		Student.findById(req.params.id, function(err, student) {
			if(err) res.send(err);
			else if(student) {
				student.hashPassword = req.body.newPass;
				student.save(function(data) {
					res.send(data);
				})
			}
		})
	} else {
		res.send('request body parse error');
	}
}

}

function generateRecoveryToken(req, res, next) {

	Student.findOne({"email": req.body.email}, function(err, student) {
		if(err) res.send(err);
		else if(student) {
				var recoveryToken = student.createRecoveryToken();
				var email = student.email;
				student.save(function(data) {
					console.log(data);
					mailer.send({
						receiver: email,
						subject: 'Восстановление пароля',
						text: 'Ваш код восстановления' + recoveryToken
					}, function (data) {
						console.log(data);
                        res.send({text: 'token getted', recoveryToken: recoveryToken});
                    });
				})
			

		} else {
			res.send('student not found');
		}

	})
}

function checkRecoveryToken(req, res, next) {
    Student.findOne({"email": req.body.email}, function(err, student) {
        if(err) res.send(err);
        else if(student) {
            if(student.recoveryToken == req.body.token) {
                res.send({text: 'ok', code: 2});
            } else {
                res.send({text: 'token is not currect', code: 1});
            }
        } else {
            res.send({text: 'student not found', code: 0});
        }
    })
}

function recovery(req, res, next) {

	Student.findOne({"email": req.body.email}, function(err, student) {
		if(err) res.send({err: err, code: 3});
		else if(student) {
			if(student.recoveryToken == req.body.token) {
                student.useRecoveryToken();
				student.hashPassword = req.body.newPass;
				student.save(function(data) {
					console.log(data);
					res.send({text: 'ok', id: student._id, code: 2});
				});
			} else {
				res.send({text: 'recovery token is not correct', code: 1});
			}
		} else {
			res.send({text: 'student not found', code: 0});
		}
	})

}