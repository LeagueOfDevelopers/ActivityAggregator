
var mailer = require('./mailer');
var packageDataGenerator = require('./packageDataGenerator');


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
	else {

		packageDataGenerator.generate(taskArr, function (packageData) {
			var task = {
				templateName: templateName,
				receiverGroup: receiverGroup,
				text: {
					data: packageData,
					count: packageData.length
				}

			};

			mailer.performTask(task, function (err) {
				if (err) console.log(err)
			})
		})
	}
}

module.exports.performSimpleTask = performSimpleTask;
module.exports.performPackageTask = performPackageTask;
