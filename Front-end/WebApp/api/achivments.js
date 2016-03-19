
var Student = require('../db/mongoose').models.Student,
Achivment = require('../db/mongoose').models.Achivment,
multiparty = require('multiparty'),
util = require('util'),
fs = require("fs");

module.exports = {
  	getAchivmentsList: getAchivmentsList,
  	getAchivmentDetail: getAchivmentDetail,
  	newAchivment: newAchivment,
    getAchivmentsList: getAchivmentsList
};

function getAchivmentsList(req, res, next) {
  Achivments.find(function(err, data) {
    if(err) {
        res.send(err);
    }
    res.send(data);
  })
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
        files: [],
        updated: new Date()
    }

    form.on('error', function(err){
        if(fs.existsSync(uploadFile.path)) {
            fs.unlinkSync(uploadFile.path);
            res.send('error');
        }
    });

    form.on('close', function() {
        if(errors.length == 0) {
    
         Student.findById(req.params.id, function(err, doc) {
                    if(achivment.organization == 'МИСиС') {
                        achivment.checked = true;
                    };
                    doc.achivments.push(achivment);
                    console.log(doc);
                    doc.save(function(err, data) {
                        if(err) {
                            res.send(err);
                        } else {
                            console.log({status: 200,
                                data: data});
                            res.send({status: 200,
                                data: data});
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
        if(part.filename) {
        console.log(part.filename);
        uploadFile.size = part.byteCount;
        uploadFile.type = part.headers['content-type'];
        uploadFile.path = './public/storage/students/' + req.params.id + '/' + part.filename;
        uploadFile.link = './storage/students/' + req.params.id + '/' + part.filename;

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
            if (!fs.existsSync('./public/storage/students/' + req.params.id)) {
                fs.mkdirSync('./public/storage/students/' + req.params.id);
            }
            var out = fs.createWriteStream(uploadFile.path);
            part.pipe(out);
            achivment.files.push(uploadFile.link);
        }
        else {
            //пропускаем
            //вообще здесь нужно как-то остановить загрузку и перейти к onclose
            part.resume();
        }
           }
    });
  form.on('field', function(name, value) {
    console.log(name);
    achivment[name] = value;
  });
  form.parse(req);
};
    
    


