
var Student = require('../db/mongoose'),
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
	var student = {};

	var achivment = {
		name: 'djwdw',
		results: 'mwdlqmd',
		organization: 'dqdw',
		type: 'dmkqmd',
		checked: 'false'
	};


  var form = new multiparty.Form();
  form.parse(req, function(err, fields) {
    console.log(fields);
    Student.findByIdAndUpdate(req.params.id, {
    	$push: {
    		achivments: {
    			name: fields.name,
				type: fields.type,
				organization: fields.organization,
				results: fields.results,
				description: fields.description,
				checked: false
    		}
    	}
    }, function(err) {
    	if(err) {
    		res.send(err);
    	} else {
    		res.send('ok')
    	}
    })
});

	function bindFiles(req, achivment) {


   
    var uploadFile = {uploadPath: '', type: '', size: 0};
    var maxSize = 2 * 1024 * 1024; //2MB
    var supportMimeTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    var errors = [];

    form.on('error', function(err){
        if(fs.existsSync(uploadFile.path)) {
            fs.unlinkSync(uploadFile.path);
            res.send('error');
        }
    });

    form.on('close', function() {
        if(errors.length == 0) {
            //res.send({status: 'ok', text: 'Success'});
        }
        else {
            if(fs.existsSync(uploadFile.path)) {
                fs.unlinkSync(uploadFile.path);
            }
            //res.send({status: 'bad', errors: errors});
        }
    });

    form.on('part', function(part) {
        uploadFile.size = part.byteCount;
        uploadFile.type = 'image/png';
        uploadFile.path = './storage/students/' + req.params.id + '/' + achivment.name + '.png';

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
        	if (!fs.existsSync('storage/students/' + req.params.id)) {
        		fs.mkdirSync('storage/students/' + req.params.id);
        	}
            var out = fs.createWriteStream(uploadFile.path);
            part.pipe(res);
        }
        else {
            //пропускаем
            //вообще здесь нужно как-то остановить загрузку и перейти к onclose
            part.resume();
        }
    });

	form.parse(req);

};

};