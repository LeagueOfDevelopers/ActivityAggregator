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
  addStudent: addStudent,
  changeAvatar: changeAvatar
};



function addStudent(req, res, next) {

  form = new multiparty.Form();

  form.parse(req, function(err, fields) {

    console.log(fields);
    var student = new Student ({
    firstName: fields.firstName,
    lastName: fields.lastName,
    middleName: fields.middleName,
    email: fields.email,
    hashPassword: fields.password,
    department: fields.department,
    course: fields.course,
    group: fields.group
  });
  
  student.save(function(err) {
    if(!err) {
      res.send('student added')
    } else {
      res.send(err);
    }
  })


    });
    
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

	var data = JSON.stringify([
        {
          firstName: 'Жамбыл',
          lastName: 'Ермагамбет',
          middleName: 'sdwdwd',
          department: 'ИТАСУ',
          course: '2',
          email: 'jambul@mail.ru',
          hashPassword: 'xxxxxx',
        },

        {
          firstName: 'Жамбыл',
          lastName: 'Ермагамбет',
          department: 'ИТАСУ',
          course: '2',
          achivments: [{name:'Победа в квн', id: '12', type: 'science'}, 
          {name:'Победаdwd в квн', id: '12', type: 'science'}, 
          {name:'Победаqwdq в квн', id: '12', type: 'science'}, 
          {name:'Побеdwdда в квн', id: '12', type: 'science'}]
        },
        {
          firstName: 'Жамбыл',
          lastName: 'Ермагамбет',
          department: 'ИТАСУ',
          course: '2',
          achivments: [{name:'Победа в квн', id: '12', type: 'science'}, 
          {name:'Победаdwd в квн', id: '12', type: 'science'}, 
          {name:'Победаqwdq в квн', id: '12', type: 'science'}, 
          {name:'Побеdwdда в квн', id: '12', type: 'science'}]
        },
        {
          firstName: 'Жамбыл',
          lastName: 'Ермагамбет',
          department: 'ИТАСУ',
          course: '2',
          achivments: [{name:'Победа в квн', id: '12', type: 'science'}, 
          {name:'Победаdwd в квн', id: '12', type: 'science'}, 
          {name:'Победаqwdq в квн', id: '12', type: 'science'}, 
          {name:'Побеdwdда в квн', id: '12', type: 'science'}]
        },
        {
          firstName: 'Жамбыл',
          lastName: 'Ермагамбет',
          department: 'ИТАСУ',
          course: '2',
          achivments: [{name:'Победа в квн', id: '12', type: 'science'}, 
          {name:'Победаdwd в квн', id: '12', type: 'science'}, 
          {name:'Победаqwdq в квн', id: '12', type: 'science'}, 
          {name:'Побеdwdда в квн', id: '12', type: 'science'}]
        },
        ]);


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