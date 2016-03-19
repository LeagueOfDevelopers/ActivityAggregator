var Student = require('../db/mongoose').models.Student,
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
    } else if (student && student.hashPassword == req.body.password) {
      req.session.user = student;
      res.send({
                status: student.hashPassword == req.body.password ? 'ok' : 'not ok',
                data: student
              });
      } else {
        res.send("student not found")
      }
     
    
  })
};

function isAuth(req, res, next) {
  console.log(req.session.user);
  res.send(req.session);
};

function logout(req, res, next) {
  req.session.destroy();
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
    registered: new Date()
  });

    
  
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


};

function updateStudentDetail(req, res, next) {
  Student.findById(req.params.id, function(err, student) {
    student.about = req.body.about;
    student.save(function(data) {
      res.send(data);
    })
  })
};

function changeAvatar(req, res, next) {
    console.log(req.body);
    var savePath, filePath;
    var form = new multiparty.Form();
    var supportedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    form.on('close', function() {

      Student.findById(req.params.id, function(err, student) {
        console.log(filePath);
        student.photoUri = './storage/students/' + req.params.id + filePath;
        student.save(function(resp) {
          res.send(resp);
        });
      })
    })
    form.on('part', function(part) {
      if(false) {
        res.send('unsopported format');
      } else {
         savePath = './public/storage/students/' + req.params.id;
        if(!fs.existsSync(savePath)) {
            fs.mkdir(savePath);
          };
         filePath = '/avatar.jpg';
         if(fs.existsSync(savePath + filePath)) {
        fs.unlinkSync(savePath + filePath);
       }
        var out = fs.createWriteStream(savePath + filePath);
        console.log(filePath);
        part.pipe(out);
      } 
    })
    form.parse(req);

    
};