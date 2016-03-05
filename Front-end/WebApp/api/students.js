var Student = require('../db/mongoose').models.Student,
studentSchema = require('../db/mongoose').schemas.student,
fs = require("fs"),
path = require("path"),
util = require('util'),
multiparty = require('multiparty');

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
  updateStudentDetail: updateStudentDetail
};

function login(req, res, next) {
  Student.findOne({email: req.body.email}, function(err, student) {
    if(err) {
      console.log(err)
    } else {
      if (student) {
      req.session.user = student;
      res.send({
                status: student.hashPassword == req.body.password ? 'ok' : 'not ok',
                data: student
              });
      } else {
        res.send("student not found")
      }
    }
  })
};

function isAuth(req, res, next) {
  console.log(req.session.user);
  res.send(req.session);
};

function logout(req, res, next) {
  req.session.destroy();
};

function addStudent(req, res, next) {

    var fields = req.body;
    console.log(fields);

    var student = new Student ({
    firstName: fields.firstName,
    lastName: fields.lastName,
    middleName: fields.middleName,
    email: fields.email,
    hashPassword: fields.password,
    department: fields.department,
    course: fields.course,
    group: fields.group,
    about: fields.about
  });

    console.log(student);
  
  student.save(function(err) {
    if(!err) {
      res.end('student added')
    } else {
      res.send(err);
    }
  })


    };
    
  

function getStudentDetail(req, res, next) {
    Student.findById(req.params.id, function(err, data) {
      if(!err) {
        res.send(data)
      } else {
        res.send(err)
      }
    })
};

function getStudentsList(req, res, next) {

  Student.find(function (err, data) {
        if (!err) {
             res.send(data);
        } else {
            res.statusCode = 500;
            console.log('Internal error(%d): %s',res.statusCode,err.message);
             res.send({ error: 'Server error' });
        }
    });
	console.log(req.params.searchParams);


};
function getStudentsListByCategory(req, res, next) {
  console.log(req.params);
  Student.find({'achivments.type' : req.params.searchParams}, function (err, data) {
        if (!err) {
             res.send(data);
        } else {
            res.statusCode = 500;
            console.log('Internal error(%d): %s',res.statusCode,err.message);
             res.send({ error: 'Server error' });
        }
    });
  console.log(req.params.searchParams);


};
function getStudentsListByName(req, res, next) {
  var q = new RegExp(req.params.searchParams, 'i');
  Student.find({$or : [
                        {'firstName' : q},
                        {'lastName' : q},   
                        {'department' : q},
                        {'group' : q}
                    ]
                },
                      function (err, data) {
                      if (!err) {
                           res.send(data);
                      } else {
                          res.statusCode = 500;
                          console.log('Internal error(%d): %s',res.statusCode,err.message);
                           res.send({ error: 'Server error' });
                      }
    });
  console.log(req.params.searchParams);


};

function updateStudentDetail(req, res, next) {
  console.log(req.params.id);
  Student.findById(req.params.id, function(err, student) {
    console.log(req.body)
    student.about = req.body.about;
    console.log(student);
    student.save(function(data) {
      res.send(data);
    })
  })
};

function changeAvatar(req, res, next) {
  
    var savePath = './public/storage/students/' + req.params.id;

        if(!fs.existsSync(savePath)) {
            fs.mkdir(savePath);
          }
          
    var file = fs.createWriteStream(savePath + '/avatar.png');
    req.pipe(file);
    Student.findById(req.params.id, function(err, data) {
      if(err) {
        res.send(err);
      } else {
        data.photoUri = savePath;
        data.save(function(result) {
          res.send('avatar changed');
        })
      }
    })
};