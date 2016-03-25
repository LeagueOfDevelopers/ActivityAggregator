
var Student = require('../db/mongoose').models.Student,
Achivment = require('../db/mongoose').models.Achivment,
config = require('../config').files.achivmentsDocs,
crypto = require('crypto'),
multiparty = require('multiparty'),
util = require('util'),
fs = require("fs");

module.exports = {
  	getAchivmentsList: getAchivmentsList,
  	getAchivmentDetail: getAchivmentDetail,
  	newAchivment: newAchivment,
    getAchivmentsList: getAchivmentsList,
    addFile: addFile
}

function getAchivmentsList(req, res, next) {
  Achivments.find(function(err, data) {
    if(err) {
        res.send(err);
    }
    res.send(data);
  })
};

function getAchivmentDetail(req, res, next) {
 Student.findOne({'achivments._id': req.params.id}, 'achivments.$', function(err, ach) {
    if(err) res.send(err);
    res.send({data: ach});
 })
};

function addFile(req, res, next) {
    var form = new multiparty.Form();
    var file = {};
    var uploadFile = {uploadPath: '', type: '', size: 0},
    maxSize = 2 * 1024 * 1024,
    supportMimeTypes = config.types,
    errors = [];

    form.on('close', function() {
        if(errors.length == 0) {
    
         res.send({fileLink: uploadFile.link})
           
        }
        else {
            if(fs.existsSync(uploadFile.path)) {
                fs.unlinkSync(uploadFile.path);
            }
            res.send({status: 'bad', errors: errors});
        }
    });

      form.on('error', function(err){
        if(fs.existsSync(uploadFile.path)) {
            fs.unlinkSync(uploadFile.path);
            res.send('error');
        }

    });

      form.on('part', function(part) {
        if(part.filename) {
        console.log(part.filename);
        uploadFile.size = part.byteCount;
        uploadFile.type = part.headers['content-type'];
        var fileNameHash = crypto.createHmac('sha256', 'ach').update(part.filename).digest('hex').slice(10);
        uploadFile.path = config.path + req.params.student_id + '/' + fileNameHash;
        uploadFile.link = config.link + req.params.student_id + '/' + fileNameHash;

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
            var studentFolder = config.path + req.params.student_id;
            if (!fs.existsSync(studentFolder)) {
                fs.mkdirSync(studentFolder);
            }
            var out = fs.createWriteStream(uploadFile.path);
            part.pipe(out);
            file = uploadFile.link;
        }
        else {
            //пропускаем
            //вообще здесь нужно как-то остановить загрузку и перейти к onclose
            part.resume();
        }
           }
    });


}

function newAchivment(req, res, next) {
	
 
  var form = new multiparty.Form();

 
    form.on('close', function() {
    
         Student.findById(req.params.id, function(err, doc) {
            console.log(err );
                    if(achivment.organization == 'МИСиС') {
                        achivment.checked = true;
                    };
                    doc.achivments.push(achivment);
                    console.log(doc);
                    doc.save(function(err, data) {
                        if(err) {
                            res.send(err);
                        } else {
                            console.log({status: ok,
                                data: data});
                            res.send({status: 'ok',
                                data: data.achivments[data.achivments.length - 1]});
                    }
                })
            })
        

    });

   
  form.on('field', function(name, value) {
    console.log(name);
    achivment[name] = value;
  });
  form.parse(req);
};
    
    


