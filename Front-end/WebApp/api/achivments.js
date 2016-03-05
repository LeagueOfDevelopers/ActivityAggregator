
var Student = require('../db/mongoose').models.Student,
multiparty = require('multiparty'),
util = require('util'),
fs = require("fs");

module.exports = {
  	getAchivmentsList: getAchivmentsList,
  	getAchivmentDetail: getAchivmentDetail,
  	newAchivment: newAchivment
};

function getAchivmentsList(req, res, next) {
  res.end('getAchivmentsList' + req.params.student_id + ' ');
};

function getAchivmentDetail(req, res, next) {
  res.end('getAchivmentDetail' + ' ' + req.params.id);

};

function newAchivment(req, res, next) {
	
 
  var form = new multiparty.Form();

    var uploadFile = {uploadPath: '', type: '', size: 0},
     maxSize = 2 * 1024 * 1024,
     supportMimeTypes = ['image/jpg', 'image/jpeg', 'image/png'],
     errors = [];

    var achivment = {
        checked: false,
        files: []
    }

    form.on('error', function(err){
        if(fs.existsSync(uploadFile.path)) {
            fs.unlinkSync(uploadFile.path);
            res.send('error');
        }
    });

    form.on('close', function() {
        if(errors.length == 0) {
            console.log(achivment);
            Student.findById(req.params.id, function(err, doc) {
                console.log(doc);
                if(achivment.organization == 'МИСиС') {
                    achivment.checked = true;
                };
                doc.achivments.push(achivment);
                console.log(doc);
                doc.save(function(err) {
                    if(err) {
                        res.send(err);
                    } else {
                        res.send({status: 200});
                    }
                })
            })
        }
        else {
            if(fs.existsSync(uploadFile.path)) {
                fs.unlinkSync(uploadFile.path);
            }
            res.send({status: 'bad', errors: errors});
        }
    });

    form.on('part', function(part) {
        if(part.name == 'file') {
        uploadFile.size = part.byteCount;
        uploadFile.type = part.headers['content-type'];
        uploadFile.path = './public/storage/students/' + req.params.id + '/' + part.filename;

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
            if (!fs.existsSync('./storage/students/' + req.params.id)) {
                fs.mkdirSync('./storage/students/' + req.params.id);
            }
            var out = fs.createWriteStream(uploadFile.path);
            part.pipe(out);
            achivment.files.push(uploadFile.path);
        }
        else {
            //пропускаем
            //вообще здесь нужно как-то остановить загрузку и перейти к onclose
            part.resume();
        }
           }
    });
  form.on('field', function(name, value) {
    achivment[name] = value;
  });
  form.parse(req);
};
    
    


