var 
  Student = require('../db/mongoose').models.Student,
  fs = require("fs"),
  config = require('../config').files.students,
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
  updateStudentDetail: updateStudentDetail,
  updateSession: updateSession
};

function login(req, res, next) {

  Student.findOne({email: req.body.email}, function(err, student) {

    if(err) {

      console.log(err)

    } else if (student && student.passwordIsCorrect(req.body.password)) {

      req.session.user = student;
      res.send({
                data: student
              });

      } else {

        res.send("student not found or password uncorrect")

      }
     
    
  })
};

function updateSession(req, res, next) {
 Student.findOne({_id: req.session.user._id}, function(err, student) {
    if(err) {
      console.log(err)
    } 
    req.session.user = student;
    console.log(req.session.user);
    res.send('session updated');
  })


};

function isAuth(req, res, next) {
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
    Student.findById(req.params.id,'-hashedPasswod', function(err, data) {
      if(!err) {
        res.send(data)
      } else {
        res.send(err)
      }
    })
};

function getStudentsList(req, res, next) {

  Student.find('-hashedPassword', function (err, data) {
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
  Student.find({'achivments.type' : req.params.searchParams},'-hashedPassword', function (err, data) {
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
                '-hashedPassword',
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
      res.send('about updated');
    })
  })
};

function changeAvatar(req, res, next) {
    var savePath, filePath;
    var form = new multiparty.Form();
    var supportedTypes = config.avatar.types;
    form.on('close', function() {

      Student.findById(req.params.id, function(err, student) {
        console.log(filePath);
        student.photoUri = config.avatar.link + req.params.id + filePath;
        student.save(function(resp) {
          res.send(resp);
        });
      })
    })
    form.on('part', function(part) {
      if(false) {
        res.send('unsopported format');
      } else {
         savePath = config.avatar.path + req.params.id;
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