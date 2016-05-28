var fs = require('fs');
var path = require('path');
var Admin = require('../db/mongoose').models.Admin;
var Student = require('../db/mongoose').models.Student;
var mailer = require('./mailer');

module.exports = {
  login: login,
  newAdmin: newAdmin,
  getInviteCode: getInviteCode,
  registryByInvite: registryByInvite,
  getUncheckedRequests: getUncheckedRequests,
  confirmAchivment: confirmAchivment,
  unConfirmAchivment: unConfirmAchivment,
  confirmStudent: confirmStudent,
  rejectStudent: rejectStudent,
  getUncheckedStudents: getUncheckedStudents,
  isAdmin: isAdmin,
  updateSession: updateSession
};

function login(req, res, next) {

  Admin.findOne({email: req.body.email}, function(err, admin) {
    if(err) {
      res.send(err)
    } else 
      if(admin && admin.passwordIsCorrect(req.body.password)) {
      	req.session.user = admin;
      	res.send(admin);
      } else if (!admin) {
      	res.send('not found')
      }  
  });

};

function isAdmin(req, res, next) {

  if(req.session.user && req.session.user.role == 1) {
    console.log('is admin');
    next();
  } else {
    res.send('auth required')
  }

};

function updateSession(req, res, next) {
  if(!req.session.user) {

    res.send('logout')

  } else {

   Admin.findById({_id: req.session.user._id}, function(err, admin) {

      if(err) {

        console.log(err)
      }; 

      req.session.user = admin;
      res.send('session updated');
    })
  }

};

function newAdmin(req, res, next) {

	var admin = new Admin({
		firstName : 'Админ',
		lastName: 'Админ',
		middleName: 'Админ',
		email: 'adm@mail.ru',
		hashPassword: '11111',
    code: 'parent'
	});

	admin.save(function(data) {
		res.send(data);
	});

};

function getInviteCode(req, res, next) {

  Admin.findById(req.params.id, function(err, admin) {
    if(err) res.send(err);
    else if(admin) {
      var secret = req.body.secret || Math.Random();
      var code = admin.generateInviteCode(secret);
      res.send({data : code}); 
      admin.save(function(result) {
      console.log(result);
    });
  }
  })
};

function registryByInvite(req, res, next) {

  Admin.findOne({'invCodes' : req.body.code}, function(err, findedData) {
     if(findedData) {
      
      Admin.findOne({'code': req.body.code}, function(er, data) {
        if(err) res.send(err);
        else if(data) {
          res.send('0'); //code already used
        } else if(!data) {

          var admin = new Admin({
            firstName : req.body.firstName,
            lastName: req.body.lastName,
            middleName: req.body.middleName,
            email: req.body.email,
            hashPassword: req.body.password,
            code: req.body.code
          });

          admin.save(function(result) {
            res.send('2');
          })
          
        }
      })

      } else {
        res.send('1')
      }
      
    })
};

function getUncheckedRequests(req, res, next) {

  if(req.session.user && req.session.user.role) {

  Student.find({'achivments.checked': false})
         .exec(function(err, data) {
                if(err){
                  res.send(err);
                }
                res.send(data);
          });
       } else {
        res.send('admin permissions required')
       }
};

function confirmAchivment(req, res, next) {
  
  if(req.session.user && req.session.user.role) {

    Student.update({'achivments._id' : req.params.id}, ({'achivments._id' : req.params.id},
    {
      '$set' : {
        'achivments.$.checked' : true,
        'achivments.$.message' : null
      }
    }).exec(function(err, data) {

      if(err) res.send(err);
      else {
          console.log(data);
        res.send(data);
      }
     });

  } else {
    res.send('admin permissions required')
  }
};

function unConfirmAchivment(req, res, next) {
  if(req.session.user && req.session.user.role) {
   Student.update({'achivments._id' : req.params.id},
  {
    '$set' : {
      'achivments.$.checked' : false,
      'achivments.$.message' : req.body.message
    }
  }, 
   function(err, data) {

    if(err) res.send(err);
    res.send(data);
   });
 } else {
  res.send('admin permossion required')
 }
};

function confirmStudent(req, res, next) {
  Student.findById(req.params.id, function(err, student) {
    if(err) res.send(err);
    else if(student) {
      student.status = 1;
      mailer.send({receiver: student.email, subject: 'Регистрация на платформе', text: 'Ваша регистрация одобрена'}, function(err, info) {
        console.log(err);
        console.log(info);
      });
      student.save(function(data) {
        res.send('ok');
      }) } else {
        res.send('student not found');
      }
    
  })
};

function rejectStudent(req, res, next) {
   Student.findById(req.params.id, function(err, student) {
    if(err) res.send(err);
    else if(student) {
      student.status = 2;
      student.save(function(data) {
          mailer.send({receiver: student.email, subject: 'Регистрация на платформе', text: 'Вам отказано в регисстрации'}, function(err, info) {
              console.log(err);
              console.log(info);
          });
        res.send('ok');
      }) 
    } else {
        res.send('student not found');
      }
    });
    
};

function getUncheckedStudents(req, res, next) {
  Student.find({'status': 0}, '-hashPassword', function(err, data) {
    if(err) res.send(err);
    else {
      res.send(data);
    }
  })
};

