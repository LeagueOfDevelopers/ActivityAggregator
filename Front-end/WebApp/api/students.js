var Student = require('../db/mongoose').models.Student,
studentSchema = require('../db/mongoose').schemas.student,
 parser = require('./reqParser'),
fs = require("fs"),
path = require("path"),
util = require('util'),
multiparty = require('multiparty');

module.exports = {
	getStudentDetail: getStudentDetail,
	getStudentsList: getStudentsList,
  getStudentsListByCategory: getStudentsListByCategory,
  getStudentsListByName: getStudentsListByName,
  addStudent: addStudent,
  changeAvatar: changeAvatar,
  updateStudentDetail: updateStudentDetail
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
  Student.findOne({_id: req.params.id}, function(student) {
    var student = student;
    form = new multiparty.Form();
    form.parse(req, function(err, fields) {
      student.about = fields.about;
      student.save(function(data) {
        res.end(data);
      })
    })
  })
};

function changeAvatar(req, res, next) {
  
    var savePath = './storage/students/' + req.params.id;

        if(!fs.existsSync(savePath)) {
            fs.mkdir(savePath);
          }

    var file = fs.createWriteStream(savePath + '/avatar.png');
    req.pipe(file);
    Stude
    res.send("avatar changed");
};