var fs = require('fs');
var path = require('path');
var Admin = require('../db/mongoose').models.Admin;
var Student = require('../db/mongoose').models.Student;

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
  getUncheckedStudents: getUncheckedStudents
};

function login(req, res, next) {
  Admin.findOne({email: req.body.email}, function(err, admin) {
    if(err) {
      res.send(err)
    } else 
      if(admin && admin.passwordIsCorrect(req.body.password)) {
      	req.session.user = admin;
      	res.send({admin});
      } else if (!admin) {
      	res.send('not found')
      }
    
  })
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
		console.log(new Date());
	})
};

function getInviteCode(req, res, next) {
  Admin.findById(req.params.id, function(err, admin) {
    if(err) res.send(err);
    else if(admin) {
      var secret = req.body.secret || Math.Random();
      var code = admin.generateInviteCode(secret);
      res.send({data : code}); 
      admin.save(function(result) {
      res.send(result);
    });
  }
  })
}

function registryByInvite(req, res, next) {

Admin.findOne({'invCodes' : req.body.code}, function(err, findedData) {
   if(findedData) {
    console.log(findedData);
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
        res.send('admin permossion required')
       }
};



function confirmAchivment(req, res, next) {

  if(req.session.user && req.session.user.role) {
  Student.update({'achivments._id' : req.params.id},
  {
    '$set' : {
      'achivments.$.checked' : true,
      'achivments.$.message' : null
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
      student.save(function(data) {
        res.send('ok')
      }) } else {
        res.send('student not found');
      }
    
  })
}

function rejectStudent(req, res, next) {
   Student.findById(req.params.id, function(err, student) {
    if(err) res.send(err);
    else if(student) {
      student.status = 2;
      student.save(function(data) {
        res.send('ok')
      }) } else {
        res.send('student not found');
      }
    })
    
}

function getUncheckedStudents(req, res, next) {
  Student.find({'status': 0}, '-hashPassword', function(err, data) {
    if(err) res.send(err);
    else {
      res.send(data);
    }
  })
}