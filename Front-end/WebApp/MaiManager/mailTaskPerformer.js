var Task = require('../db/mongoose').models.Task;
var async = require('async');
var mailer = require('./mailer');
var Student = require('./db/mongoose').models.Student;

function checkTasks() {
	Task.find({"done": false, type: 'simple'}, function(err, data) {
		if(err) console.log(err);
		else if(data) {

		data.forEach(function(item) {
			perform(item);
		})
		} else {
			console.log("No new tasks");
		}
	})
};

function perform(task) {

		mailer.perform(task, function(err) {
			if(!err) {
			task.done = true;
			task.save();
		}

		});

};

module.exports.checkTasks = checkTasks;
