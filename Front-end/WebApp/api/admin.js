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
  unConfirmAchivment: unConfirmAchivment
};

function login(req, res, next) {
  console.log(req.body);
  Admin.findOne({email: req.body.email}, function(err, admin) {
    if(err) {
      res.send(err)
    } else {
      if(admin && admin.passwordIsCorrect(req.body.password)) {
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

function getInviteCode(req, res, next) {
  Admin.findById(req.params.id, function(err, admin) {
    if(err) res.send(err);
    else if(admin) {
      console.log('founded');
      var code = admin.generateInviteCode(req.body.secret)
    res.send({data : code}); 
    admin.save();
  }
  })
}

function registryByInvite(req, res, next) {

Admin.findOne({'invCodes' : req.body.code}, function(err, findedData) {

  if(err) res.send(err);
  
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
        res.send(result);
      })
      
    }
  })


  
})


};

function getUncheckedRequests(req, res, next) {

  Student.find({'achivments.checked': false})
         .limit(10)
         .exec(function(err, data) {
                if(err){
                  res.send(err);
                }
                res.send(data);
          });

};



function confirmAchivment(req, res, next) {
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
};

function unConfirmAchivment(req, res, next) {
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
};

