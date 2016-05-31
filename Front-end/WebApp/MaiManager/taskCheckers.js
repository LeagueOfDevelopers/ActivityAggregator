var Task = require('../db/mongoose').models.Task;
var async = require('async');
var mailer = require('./mailer');
var Student = require('./db/mongoose').models.Student;


module.exports = {
    checkSimpleTasks : checkSimpleTasks,
    checkPackageTasks: checkPackageTasks
};


function checkSimpleTasks(callback) {
    Task.find({"done": false, type: 'simple'}, function(err, data) {
        if(err) console.log(err);
        else if(data) {

            data.forEach(function(item) {
                callback(item);
            })
        } else {
            callback("No new tasks");
        }
    })
}

function checkPackageTasks(templateName, groupName, receiversArr, callback) {
    Task.find({"type": 'package',
                'templateName' : templateName,
                'done' : false,
                'ReceiverGroup': group},
        function (err, taskArr) {
            if(err) callback(err);
            else if(taskArr) {

                callback(null, taskArr, groupName, receiversArr);
                    
                } else {
                callback("No new tasks");
            }
            })
}

