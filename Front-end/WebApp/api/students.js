var Student = require('../db/mongoose'),
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
    secondName: fields.secondName,
    middleName: fields.middleName,
    email: fields.email,
    hashPassword: fields.password,
    department: fields.department,
    course: fields.course,
  });
  
  student.save(function(err) {
    if(!err) {
      res.send('student added')
    } else {
      res.send(err);
    }
  })

  var jambul = new Student ({
          firstName: 'Жамбыл',
          secondName: 'Ермагамбет',
          middleName: 'sdwdwd',
          department: 'ИТАСУ',
          course: '2',
          email: 'jambul@mail.ru',
          hashPassword: 'xxxxxx',
        });


    });
    
  };

function getStudentDetail(req, res, next) {
  var data = JSON.stringify({
    data: {
            firstName: 'Жамбыл',
            lastName: 'Ермагамбет',
            department: 'ИТАСУ',
            course: '2',
            about: 'Все канавы есть шрамы ночи, что прошиты костями младенцев, зараженными спицами звездного склепа. Сернистая планета испускает благословения, мертвым известны мечты. С мясного крюка я пою песнь о жизни, облетаемой темными метеорами, принесенный в жертву во имя уничтожения человечьей семьи. Песни из воющей головы, кишащей рептильными куклами.',
            photoUri: '../img/jambul.jpg',
            achivments: [{name:'Победа в квн', id: '12', type: 'sport'}, {name:'Победаdwd в квн', id: '12', type: 'sport'}, {name:'Победаqwdq в квн', id: '12', type: 'sport'}, {name:'Побеdwdда в квн', id: '12', type: 'sport'}]
          },
    status: 200

  });
  res.end(data);
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
    res.send("avatar changed");
};