var Task = require('../db/mongoose').models.Task;
var async = require('async');
var mailer = require('./mailer');

function checkTasks() {
	Task.find({"done": false}, function(err, data) {
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
	if(task.type == 'mail') {
		mailer.perform(task, function() {
			task.done = true;
			task.save();
		});
	}
};