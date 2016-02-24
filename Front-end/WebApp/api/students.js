var students = require('../db/mongoose'),
fs = require("fs"),
path = require("path"),
util = require('util'),
multiparty = require('multiparty');

module.exports = {
	getStudentDetail: getStudentDetail,
	getStudentsList: getStudentsList,
  testDB: testDB,
  changeAvatar: changeAvatar
};



function testDB(req, res, next) {
    test.find(function (err, data) {
        if (!err) {
             console.log(data);
        } else {
            res.statusCode = 500;
            console.log('Internal error(%d): %s',res.statusCode,err.message);
             res.send({ error: 'Server error' });
        }
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
	console.log(req.params.searchParams);
	var data = JSON.stringify([
        {
          firstName: 'Жамбыл',
          lastName: 'Ермагамбет',
          department: 'ИТАСУ',
          course: '2',
          achivments: [
          {name:'Победа в квн', id: '12', type: 'science'}, 
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

	res.end(data);

};

function newStudent(req, res, next) {

  var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      res.write('received upload:\n\n');
      res.end(util.inspect({fields: fields, files: files}));
    });

    var uploadFile = {uploadPath: '', type: '', size: 0};
    var maxSize = 2 * 1024 * 1024; //2MB
    var supportMimeTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    var errors = [];

    form.on('error', function(err){
        if(fs.existsSync(uploadFile.path)) {
            fs.unlinkSync(uploadFile.path);
            console.log('error');
        }
    });

    form.on('close', function() {
        if(errors.length == 0) {
            res.send({status: 'ok', text: 'Success'});
        }
        else {
            if(fs.existsSync(uploadFile.path)) {
                fs.unlinkSync(uploadFile.path);
            }
            res.send({status: 'bad', errors: errors});
        }
    });

    form.on('part', function(part) {
        //читаем его размер в байтах
        uploadFile.size = part.byteCount;
        //читаем его тип
        uploadFile.type = part.headers['content-type'];
        //путь для сохранения файла
        uploadFile.path = part.filename;
        console.log(uploadFile.path);

        //проверяем размер файла, он не должен быть больше максимального размера
        if(uploadFile.size > maxSize) {
            errors.push('File size is ' + uploadFile.size + '. Limit is' + (maxSize / 1024 / 1024) + 'MB.');
        }

        //проверяем является ли тип поддерживаемым
        if(supportMimeTypes.indexOf(uploadFile.type) == -1) {
            errors.push('Unsupported mimetype ' + uploadFile.type);
        }

        //если нет ошибок то создаем поток для записи файла
        if(errors.length == 0) {
            var out = fs.createWriteStream(uploadFile.path);
            part.pipe(out);
        }
        else {
            //пропускаем
            //вообще здесь нужно как-то остановить загрузку и перейти к onclose
            part.resume();
        }
    });

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