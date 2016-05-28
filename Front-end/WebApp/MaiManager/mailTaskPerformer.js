
var async = require('async');
var mailer = require('./mailer');
var Student = require('./db/mongoose').models.Student;
var packageNootificationGenerator = require('./packageNotificationGenerator');
var taskChekers = require('./taskCheckers');


function performSimpleTask(task, markDone) {

		mailer.performTask(task, function(err) {
			if(!err) {
			task.done = markDone;
			task.save();
		}

		});

}



module.exports.checkSimpleTasks = checkSimpleTasks;
