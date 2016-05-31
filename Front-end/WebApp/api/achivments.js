
var Student = require('../db/mongoose').models.Student,
Achivment = require('../db/mongoose').models.Achivment,
config = require('../config').files.achivmentsDocs,
crypto = require('crypto'),
multiparty = require('multiparty'),
util = require('util'),
fs = require("fs");
var Task = require('../db/mongoose').models.Task;

module.exports = {
  	getAchivmentsList: getAchivmentsList,
  	getAchivmentDetail: getAchivmentDetail,
  	newAchivment: newAchivment,
    addFile: addFile
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

 Student.findOne({'achivments._id': req.params.ach_id}, 'firstName lastName achivments.$', function(err, data) {
    if(err) res.send(err);
    if (data) {
        res.send({achivment: data.achivments[0], owner: data});
        console.log(data);   
    } else {
        res.send('no data');
    }
 })
};

function addFile(req, res, next) {
    var form = new multiparty.Form();
    var uploadFile = {uploadPath: '', type: '', size: 0},
    maxSize = config.maxSize,
    supportMimeTypes = config.types,
    errors = [];


      form.on('error', function(err){

        if(fs.existsSync(uploadFile.path)) {

            fs.unlinkSync(uploadFile.path);
            errors.push(err);
        }

    });

      form.on('part', function(part) {

        if(part.filename) {

            uploadFile.size = part.byteCount;
            uploadFile.type = part.headers['content-type'];
            var fileNameHash = crypto.createHmac('sha256', 'ach')
                                     .update(part.filename)
                                     .digest('hex')
                                     .slice(0, 10) + '.' + uploadFile.type.split('/')[1];
            uploadFile.path = config.path + req.params.id + '/' + fileNameHash;
            uploadFile.link = config.link + req.params.id + '/' + fileNameHash;

            if(uploadFile.size > maxSize) {
                errors.push('File size is ' + uploadFile.size + '. Limit is' + (maxSize / 1024 / 1024) + 'MB.');
            };

            if(errors.length == 0) {
                var studentFolder = config.path + req.params.id;

                if (!fs.existsSync(studentFolder)) {
                    fs.mkdirSync(studentFolder);
                };

                if(fs.existsSync(uploadFile.path)) {
                    fs.unlinkSync(uploadFile.path);
                };

                var outStream = fs.createWriteStream(uploadFile.path);
                part.pipe(outStream);
            }
                else {
                    part.resume();
                }
           };
    });

    form.on('close', function() {

        if(errors.length == 0) {
    
         res.send({fileLink: uploadFile.link})
           
        }
        else {
            res.send({status: 'bad', errors: errors});
        }
    });

    form.parse(req);
};

function newAchivment(req, res, next) {
    
  var achivment = {
        checked: false,
        updated: new Date()
    };

 var fields = req.body;

 Object.getOwnPropertyNames(fields).forEach(function(key) {
    achivment[key] = fields[key];
 });

 Student.findById(req.params.id, function(err, doc) {
    if(err) res.send(err);
    doc.achivments.push(achivment);
    doc.save(function(err, result) {
        if(err) {
            res.send(err);
        } else {

            var task = new Task({
                type: 'package',
                templateName: 'newAchivment',
                text: result,
                receiverGroup: 'admins'
            });
            task.save();

        res.send({status: 'ok',
        data: data.achivments[data.achivments.length - 1]});
    }
})

 }) 
};
    
    


