
var async = require('async');
var mailer = require('./mailer');
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

function performPackageTask(err, taskArr, templateName, receiverGroup, receiverArr) {
	if(err) console.log(err);
	packageNootificationGenerator.generate(taskArr, function(packageData) {
		var task = {
			templateName: templateName,
			receiverGroup: receiverGroup,
			text: {
				data: packageData,
				count: packageData.count
			}

		}

		mailer.perform(task, function (err) {
			if(err) console.log(err)
		})
	})
}


module.exports.checkSimpleTasks = checkSimpleTasks;
module.exports.performPackageTask = performPackageTask;
