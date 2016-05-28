var Task = require('../db/mongoose').models.Task;
var mailer = require('./mailer');
var Student = require('./db/mongoose').models.Student;


function generate(taskArr, callback) {

    var packageData = [];

    taskArr.forEach(function(task) {
        packageData.push(task.text)
    });

    callback(packageData);
}


module.exports.generate = generate;